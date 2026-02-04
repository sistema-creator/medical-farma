import { supabase } from './supabase'
import { notificarEstadoPedido } from './n8n'

export interface Despacho {
    id: string
    pedido_id: string
    usuario_despacho_id: string
    num_guia: string
    transportista: string
    fecha_retiro: string
    fecha_entrega_estimada: string
    recibido_por: string
    estado_despacho: 'preparacion' | 'listo' | 'despachado' | 'entregado' | 'error'
    comprobante_url: string
    notas: string
    created_at: string
}

export async function obtenerMetricasLogistica() {
    try {
        const { data: pedidos, error } = await supabase
            .from('pedidos')
            .select('estado_pedido, id')
            .in('estado_pedido', ['confirmado', 'en_preparacion', 'despachado'])

        if (error) throw error

        const stats = {
            enPreparacion: pedidos.filter((p: any) => p.estado_pedido === 'confirmado' || p.estado_pedido === 'en_preparacion').length,
            listosParaDespacho: 0, // Esto vendrá de la tabla despachos
            enRuta: pedidos.filter((p: any) => p.estado_pedido === 'despachado').length,
            entregadosHoy: 0
        }

        // Obtener info de despachos
        const { data: despachos, error: errorDespachos } = await supabase
            .from('despachos')
            .select('estado_despacho, created_at')

        if (!errorDespachos) {
            stats.listosParaDespacho = despachos.filter((d: any) => d.estado_despacho === 'listo').length
            const hoy = new Date().toISOString().split('T')[0]
            stats.entregadosHoy = despachos.filter((d: any) => d.estado_despacho === 'entregado' && d.created_at.startsWith(hoy)).length
        }

        return { success: true, data: stats }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function obtenerDespachosActivos() {
    try {
        const { data, error } = await supabase
            .from('despachos')
            .select(`
                *,
                pedidos:pedido_id (
                    numero_pedido,
                    total,
                    direcciones:direccion_entrega,
                    usuarios:cliente_id (nombre_completo, email, whatsapp)
                )
            `)
            .order('created_at', { ascending: false })

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Actualiza el estado de un despacho y maneja la lógica de cierre/facturación
 */
export async function actualizarEstadoDespacho(id: string, datos: Partial<Despacho>) {
    try {
        // 1. Actualizar el despacho
        const { data: despacho, error: errorDespacho } = await supabase
            .from('despachos')
            .update({
                ...datos,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select(`
                *,
                pedidos:pedido_id (
                    usuarios:cliente_id (email)
                )
            `)
            .single()

        if (errorDespacho) throw errorDespacho

        // 2. Si el estado es 'entregado', actualizar el pedido y setear el deadline de facturación
        if (datos.estado_despacho === 'entregado') {
            const now = new Date()
            const deadline = new Date(now.getTime() + (2 * 60 * 60 * 1000)).toISOString() // +2 horas

            await supabase
                .from('pedidos')
                .update({
                    estado_pedido: 'entregado',
                    fecha_entrega_real: now.toISOString(),
                    comentarios: `DEADLINE_FACTURACION: ${deadline}`
                })
                .eq('id', despacho.pedido_id)

            // 3. Notificar a n8n (Avisar a Facturación e iniciar conteo)
            const emailCliente = (despacho.pedidos as any)?.usuarios?.email || ''
            await notificarEstadoPedido(despacho.pedido_id, 'entregado', emailCliente)
        }

        return { success: true, data: despacho }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function subirComprobanteDespacho(file: File, despachoId: string) {
    try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${despachoId}_${Date.now()}.${fileExt}`
        const filePath = `comprobantes_despacho/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('documentos')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('documentos')
            .getPublicUrl(filePath)

        // Actualizar el despacho con la URL
        await supabase
            .from('despachos')
            .update({ comprobante_url: publicUrl })
            .eq('id', despachoId)

        return { success: true, url: publicUrl }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

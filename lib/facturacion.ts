import { supabase } from './supabase'

export interface FacturacionMetricas {
    pendientesFacturar: number
    vencidos: number
    cobrosHoy: number
    totalMes: number
}

export async function obtenerMetricasFacturacion() {
    try {
        const { data: pedidos, error } = await supabase
            .from('pedidos')
            .select('id, estado_pedido, comentarios, total')
            .in('estado_pedido', ['entregado', 'facturado'])

        if (error) throw error

        const ahora = new Date()
        const stats = {
            pendientesFacturar: 0,
            vencidos: 0,
            cobrosHoy: 0,
            totalMes: 0
        }

        pedidos.forEach((p: any) => {
            if (p.estado_pedido === 'entregado') {
                stats.pendientesFacturar++

                // Verificar si está vencido (más de 2hs post-entrega)
                if (p.comentarios?.includes('DEADLINE_FACTURACION:')) {
                    const deadlineStr = p.comentarios.split('DEADLINE_FACTURACION: ')[1]?.split('\n')[0]
                    if (deadlineStr) {
                        const deadline = new Date(deadlineStr)
                        if (deadline < ahora) {
                            stats.vencidos++
                        }
                    }
                }
            }
            // Aquí iría la lógica de cobros hoy si tuviéramos tabla de cobros
            // Por ahora usamos montos de facturados este mes como placeholder
            if (p.estado_pedido === 'facturado') {
                stats.totalMes += p.total || 0
            }
        })

        return { success: true, data: stats }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function obtenerPedidosParaFacturar() {
    try {
        const { data, error } = await supabase
            .from('pedidos')
            .select(`
                *,
                usuarios:cliente_id (nombre_completo, email),
                despachos:pedidos_id_fkey (*)
            `)
            .eq('estado_pedido', 'entregado')
            .order('updated_at', { ascending: true })

        if (error) throw error

        // Procesar deadlines para facilitar al frontend
        const procesados = data.map((p: any) => {
            let deadline = null
            if (p.comentarios?.includes('DEADLINE_FACTURACION:')) {
                const deadlineStr = p.comentarios.split('DEADLINE_FACTURACION: ')[1]?.split('\n')[0]
                deadline = deadlineStr ? new Date(deadlineStr).toISOString() : null
            }
            return { ...p, deadline_facturacion: deadline }
        })

        return { success: true, data: procesados }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function marcarComoFacturado(pedidoId: string, nroFactura: string) {
    try {
        const ahora = new Date().toISOString()

        // Intentamos actualizar campos específicos
        const { data, error } = await supabase
            .from('pedidos')
            .update({
                estado_pedido: 'facturado',
                nro_factura: nroFactura,
                fecha_facturacion: ahora,
                // Si la facturación ocurre, limpiamos cualquier alerta de auditoría
                alerta_auditoria: false
            } as any)
            .eq('id', pedidoId)
            .select()

        // Si falla por falta de columnas, usamos el fallback de comentarios
        if (error && error.message.includes('column')) {
            const { data: currentPedido } = await supabase
                .from('pedidos')
                .select('comentarios')
                .eq('id', pedidoId)
                .single()

            const nuevosComentarios = `${currentPedido?.comentarios || ''}\n[FACTURA_INFO: Nro=${nroFactura}, Fecha=${ahora}]`

            await supabase
                .from('pedidos')
                .update({
                    estado_pedido: 'facturado',
                    comentarios: nuevosComentarios
                })
                .eq('id', pedidoId)
        } else if (error) {
            throw error
        }

        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Procesa pedidos vencidos y los marca para Auditoría
 */
export async function procesarAlertasAuditoria() {
    try {
        const { data: pendientes } = await obtenerPedidosParaFacturar()
        if (!pendientes) return

        const ahora = new Date()
        const IDsVencidos = pendientes
            .filter((p: any) => {
                if (!p.deadline_facturacion) return false
                return new Date(p.deadline_facturacion) < ahora
            })
            .map((p: any) => p.id)

        if (IDsVencidos.length > 0) {
            await supabase
                .from('pedidos')
                .update({ alerta_auditoria: true } as any)
                .in('id', IDsVencidos)
        }

        return { success: true, count: IDsVencidos.length }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

import { supabase } from './supabase'

export interface Comision {
    id: string
    pedido_id: string
    vendedor_id: string
    monto: number
    porcentaje: number
    estado_comision: 'pendiente' | 'liquidado' | 'cancelado'
    created_at: string
}

export async function obtenerMetricasVentas(vendedorId?: string) {
    try {
        let query = supabase.from('pedidos').select('total, estado_pago')
        if (vendedorId) {
            query = query.eq('vendedor_id', vendedorId)
        }

        const { data: pedidos, error: errorPedidos } = await query
        if (errorPedidos) throw errorPedidos

        let comisionQuery = supabase.from('comisiones').select('monto, estado_comision')
        if (vendedorId) {
            comisionQuery = comisionQuery.eq('vendedor_id', vendedorId)
        }
        const { data: comisiones, error: errorComisiones } = await comisionQuery
        if (errorComisiones) throw errorComisiones

        const totalVentas = pedidos.reduce((acc: number, p: any) => acc + (Number(p.total) || 0), 0)
        const totalComisionesPendientes = comisiones
            .filter((c: any) => c.estado_comision === 'pendiente')
            .reduce((acc: number, c: any) => acc + (Number(c.monto) || 0), 0)

        return {
            success: true,
            data: {
                totalVentas,
                cantidadPedidos: pedidos.length,
                comisionesPendientes: totalComisionesPendientes
            }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function obtenerPedidosVendedor(vendedorId?: string) {
    try {
        let query = supabase
            .from('pedidos')
            .select(`
                *,
                usuarios:cliente_id (nombre_completo, email)
            `)
            .order('created_at', { ascending: false })

        if (vendedorId) {
            query = query.eq('vendedor_id', vendedorId)
        }

        const { data, error } = await query
        if (error) throw error

        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function obtenerComisionesVendedor(vendedorId?: string) {
    try {
        let query = supabase
            .from('comisiones')
            .select(`
                *,
                pedidos:pedido_id (numero_pedido, total)
            `)
            .order('created_at', { ascending: false })

        if (vendedorId) {
            query = query.eq('vendedor_id', vendedorId)
        }

        const { data, error } = await query
        if (error) throw error

        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

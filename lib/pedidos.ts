
import { supabase } from './supabase'

export interface Pedido {
    id: string
    numero_pedido: string
    cliente_id: string
    productos: any[]
    subtotal: number
    descuento: number
    total: number
    estado_pedido: 'cotizacion' | 'confirmado' | 'en_preparacion' | 'despachado' | 'entregado' | 'cancelado'
    estado_pago: 'pendiente' | 'parcial' | 'pagado'
    created_at: string
}

/**
 * Genera un número de pedido único (ej: PED-1001)
 */
/**
 * Genera un número de pedido único usando una función de base de datos
 * para evitar colisiones y condiciones de carrera.
 */
async function generarNumeroPedido() {
    const { data, error } = await supabase.rpc('obtener_siguiente_numero_pedido')

    if (error) {
        console.error('Error generando número de pedido:', error)
        // Fallback en caso de emergencia (aunque no ideal para prod)
        return `PED-ERR-${Date.now().toString().slice(-4)}`
    }

    return data as string
}

/**
 * Crea un nuevo pedido en la base de datos
 */
export async function crearPedido(datos: {
    cliente_id: string
    productos: any[]
    subtotal: number
    total: number
}) {
    try {
        const numero_pedido = await generarNumeroPedido()

        const pedidoNuevo = {
            numero_pedido,
            cliente_id: datos.cliente_id,
            productos: datos.productos,
            subtotal: datos.subtotal,
            descuento: 0,
            total: datos.total,
            estado_pedido: 'confirmado', // Asumimos confirmado al enviar
            estado_pago: 'pendiente',
            created_at: new Date().toISOString()
        }

        const { data, error } = await supabase
            .from('pedidos')
            .insert(pedidoNuevo)
            .select()
            .single()

        if (error) throw error

        return { success: true, data: data as Pedido }

    } catch (error: any) {
        console.error('Error creando pedido:', error)
        return { success: false, error: error.message }
    }
}

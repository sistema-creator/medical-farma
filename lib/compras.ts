import { supabase } from './supabase'
import { Producto } from './productos'
import { Proveedor } from './proveedores'

export interface GerenciaMetricas {
    valorTotalInventario: number
    productosStockBajo: number
    ordenesCompraPendientes: number
    proveedoresActivos: number
}

/**
 * Obtiene métricas generales para el dashboard de Gerencia
 */
export async function obtenerMetricasGerencia() {
    try {
        const { data: productos, error: errorProds } = await supabase
            .from('productos')
            .select('stock_actual, precio_unitario, stock_minimo')

        if (errorProds) throw errorProds

        const { data: proveedores, error: errorProv } = await supabase
            .from('proveedores')
            .select('id')
            .eq('estado', 'activo')

        if (errorProv) throw errorProv

        // Simulación de órdenes de compra (hasta que exista la tabla)
        // Por ahora, asumimos que no hay órdenes pendientes o usamos un placeholder
        const ordenesPendientes = 0

        const valorTotal = productos.reduce((acc: number, p: any) => acc + (p.stock_actual * p.precio_unitario), 0)
        const stockBajo = productos.filter((p: any) => p.stock_actual < p.stock_minimo).length

        return {
            success: true,
            data: {
                valorTotalInventario: valorTotal,
                productosStockBajo: stockBajo,
                ordenesCompraPendientes: ordenesPendientes,
                proveedoresActivos: proveedores.length
            } as GerenciaMetricas
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Obtiene productos que requieren reposición inmediata
 */
export async function obtenerProductosParaReponer() {
    try {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .order('stock_actual', { ascending: true })

        if (error) throw error

        const reponer = (data as Producto[]).filter(p => p.stock_actual < p.stock_minimo)
        return { success: true, data: reponer }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Registra una nueva orden de compra (Placeholder funcional)
 * Nota: En el futuro esto persistirá en una tabla 'ordenes_compra'
 */
export async function registrarOrdenCompra(order: any) {
    try {
        // Por ahora, guardamos un log en comentarios del sistema o similar
        // o simplemente retornamos éxito para el MVP si el usuario no tiene la tabla
        console.log('Registrando Orden de Compra:', order)
        return { success: true, message: 'Orden registrada simuladamente (Se requiere tabla ordenes_compra para persistencia real)' }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

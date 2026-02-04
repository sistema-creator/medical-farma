import { supabase } from './supabase'

export interface Producto {
    id: string
    nombre: string
    marcas: string[] | null
    descripcion_tecnica: string | null
    medidas: string | null
    stock_actual: number
    stock_minimo: number
    precio_unitario: number
    precio_lote: number | null
    categoria: string | null
    ubicacion_almacen: string | null
    imagen_url: string | null
    estado: 'activo' | 'inactivo'
    created_at: string
    updated_at: string
    // Nuevos campos para gestión de stock
    imagenes_ilustrativas: string[]
    documentos_pdf: string[]
    enlaces_relacionados: string[]
    sectores: string[]
    precio_compra: number
    impuesto_21: number
    impuesto_extra_1: number
    impuesto_extra_2: number
    impuesto_extra_3: number
    precio_venta_final: number
}

/**
 * Obtener todos los productos con filtros opcionales
 */
export async function obtenerProductos(filtros?: {
    busqueda?: string
    categoria?: string
    estado?: 'activo' | 'inactivo'
    stockBajo?: boolean
}) {
    try {
        let query = supabase
            .from('productos')
            .select('*')
            .order('nombre', { ascending: true })

        // Aplicar filtros
        if (filtros?.busqueda) {
            query = query.or(`nombre.ilike.%${filtros.busqueda}%,descripcion_tecnica.ilike.%${filtros.busqueda}%`)
        }

        if (filtros?.categoria) {
            query = query.eq('categoria', filtros.categoria)
        }

        if (filtros?.estado) {
            query = query.eq('estado', filtros.estado)
        }

        // Nota: Filtrado de stock bajo se hace en memoria temporalmente
        // por limitación de comparación de columnas en cliente JS

        const { data, error } = await query

        if (error) throw error

        let productos = data as Producto[]

        if (filtros?.stockBajo) {
            productos = productos.filter(p => p.stock_actual < p.stock_minimo)
        }

        return { success: true, data: productos }
    } catch (error: any) {
        return { success: false, error: error.message, data: [] }
    }
}

/**
 * Obtener un producto por ID
 */
export async function obtenerProductoPorId(id: string) {
    try {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return { success: true, data: data as Producto }
    } catch (error: any) {
        return { success: false, error: error.message, data: null }
    }
}

/**
 * Crear nuevo producto
 */
export async function crearProducto(producto: Omit<Producto, 'id' | 'created_at' | 'updated_at'>) {
    try {
        const { data, error } = await supabase
            .from('productos')
            .insert(producto)
            .select()
            .single()

        if (error) throw error
        return { success: true, data: data as Producto }
    } catch (error: any) {
        return { success: false, error: error.message, data: null }
    }
}

/**
 * Actualizar producto existente
 */
export async function actualizarProducto(id: string, producto: Partial<Producto>) {
    try {
        const { data, error } = await supabase
            .from('productos')
            .update(producto)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return { success: true, data: data as Producto }
    } catch (error: any) {
        return { success: false, error: error.message, data: null }
    }
}

/**
 * Eliminar producto (cambiar estado a inactivo)
 */
export async function eliminarProducto(id: string) {
    try {
        const { data, error } = await supabase
            .from('productos')
            .update({ estado: 'inactivo' })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return { success: true, data: data as Producto }
    } catch (error: any) {
        return { success: false, error: error.message, data: null }
    }
}

/**
 * Actualizar stock de un producto
 */
export async function actualizarStock(id: string, cantidad: number, operacion: 'sumar' | 'restar' | 'establecer') {
    try {
        // Primero obtener el stock actual
        const { data: producto, error: errorGet } = await supabase
            .from('productos')
            .select('stock_actual')
            .eq('id', id)
            .single()

        if (errorGet) throw errorGet

        let nuevoStock = cantidad
        if (operacion === 'sumar') {
            nuevoStock = producto.stock_actual + cantidad
        } else if (operacion === 'restar') {
            nuevoStock = Math.max(0, producto.stock_actual - cantidad)
        }

        const { data, error } = await supabase
            .from('productos')
            .update({ stock_actual: nuevoStock })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return { success: true, data: data as Producto }
    } catch (error: any) {
        return { success: false, error: error.message, data: null }
    }
}

/**
 * Obtener productos con stock bajo
 */
export async function obtenerProductosStockBajo() {
    try {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .eq('estado', 'activo')
            .order('stock_actual', { ascending: true })

        if (error) throw error

        // Filtrado en memoria por limitación de cliente JS
        const productosBajoStock = (data as Producto[]).filter(p => p.stock_actual < p.stock_minimo)

        return { success: true, data: productosBajoStock }
    } catch (error: any) {
        return { success: false, error: error.message, data: [] }
    }
}

/**
 * Obtener categorías únicas
 */
export async function obtenerCategorias() {
    try {
        const { data, error } = await supabase
            .from('productos')
            .select('categoria')
            .not('categoria', 'is', null)
            .order('categoria')

        if (error) throw error

        // Extraer categorías únicas
        const categorias = [...new Set(data.map((p: any) => p.categoria).filter(Boolean))]
        return { success: true, data: categorias }
    } catch (error: any) {
        return { success: false, error: error.message, data: [] }
    }
}

/**
 * Subir imagen de producto
 */
export async function subirImagenProducto(file: File, productoId: string) {
    try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${productoId}-${Date.now()}.${fileExt}`
        const filePath = `productos/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('imagenes')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('imagenes')
            .getPublicUrl(filePath)

        return { success: true, url: publicUrl }
    } catch (error: any) {
        return { success: false, error: error.message, url: null }
    }
}

/**
 * Estadísticas de productos
 */
export async function obtenerEstadisticasProductos() {
    try {
        const { data: productos, error } = await supabase
            .from('productos')
            .select('*')

        if (error) throw error

        const stats = {
            total: productos.length,
            activos: productos.filter((p: any) => p.estado === 'activo').length,
            inactivos: productos.filter((p: any) => p.estado === 'inactivo').length,
            stockBajo: productos.filter((p: any) => p.stock_actual < p.stock_minimo).length,
            valorTotalStock: productos.reduce((sum: number, p: any) => sum + (p.stock_actual * p.precio_unitario), 0),
        }

        return { success: true, data: stats }
    } catch (error: any) {
        return { success: false, error: error.message, data: null }
    }
}

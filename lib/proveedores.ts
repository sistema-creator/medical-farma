
import { supabase } from './supabase'

// Definición de la interfaz de Proveedor según el esquema
export interface Proveedor {
    id: string
    nombre: string
    cuit: string
    contacto_nombre: string
    telefono: string
    email: string
    productos_suministrados: string[] | null // Array de strings (nombres o IDs)
    tiempo_entrega_promedio_dias: number
    condiciones_pago: string
    calificacion: number // 0 a 5
    logo_url: string | null
    estado: 'activo' | 'inactivo'
    created_at: string
    updated_at: string
}

// Interfaz para la creación/edición
export interface ProveedorFormData {
    nombre: string
    cuit: string
    contacto_nombre: string
    telefono: string
    email: string
    productos_suministrados: string
    tiempo_entrega_promedio_dias: number
    condiciones_pago: string
    calificacion: number
    logo_url?: string
    estado: 'activo' | 'inactivo'
}

/**
 * Obtiene la lista de proveedores con filtros opcionales
 */
export async function obtenerProveedores(busqueda: string = '', estado: string = 'todos') {

    let query = supabase
        .from('proveedores')
        .select('*')
        .order('created_at', { ascending: false })

    if (busqueda) {
        // Búsqueda por nombre, CUIT o nombre de contacto
        query = query.or(`nombre.ilike.%${busqueda}%,cuit.ilike.%${busqueda}%,contacto_nombre.ilike.%${busqueda}%`)
    }

    if (estado !== 'todos') {
        query = query.eq('estado', estado)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error al obtener proveedores:', error)
        throw error
    }

    return data as Proveedor[]
}

/**
 * Obtiene un proveedor por su ID
 */
export async function obtenerProveedorPorId(id: string) {

    const { data, error } = await supabase
        .from('proveedores')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error al obtener proveedor:', error)
        throw error
    }

    return data as Proveedor
}

/**
 * Crea un nuevo proveedor
 */
export async function crearProveedor(datos: ProveedorFormData) {

    // Convertir string de productos a array si viene separado por comas
    const productosArray = typeof datos.productos_suministrados === 'string'
        ? datos.productos_suministrados.split(',').map(p => p.trim()).filter(p => p !== '')
        : datos.productos_suministrados

    const proveedorParaGuardar = {
        ...datos,
        productos_suministrados: productosArray,
        updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
        .from('proveedores')
        .insert([proveedorParaGuardar])
        .select()
        .single()

    if (error) {
        console.error('Error al crear proveedor:', error)
        throw error
    }

    return data as Proveedor
}

/**
 * Actualiza un proveedor existente
 */
export async function actualizarProveedor(id: string, datos: Partial<ProveedorFormData>) {

    const datosParaActualizar: any = { ...datos, updated_at: new Date().toISOString() }

    // Si se actualizan los productos, asegurar formato array
    if (datos.productos_suministrados && typeof datos.productos_suministrados === 'string') {
        datosParaActualizar.productos_suministrados = datos.productos_suministrados
            .split(',')
            .map(p => p.trim())
            .filter(p => p !== '')
    }

    const { data, error } = await supabase
        .from('proveedores')
        .update(datosParaActualizar)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error al actualizar proveedor:', error)
        throw error
    }

    return data as Proveedor
}

/**
 * Elimina (o desactiva) un proveedor
 */
export async function eliminarProveedor(id: string) {
    // Soft delete: cambiar estado a inactivo
    return actualizarProveedor(id, { estado: 'inactivo' })
}

/**
 * Obtiene estadísticas simples de proveedores
 */
export async function obtenerEstadisticasProveedores() {

    const { data: proveedores, error } = await supabase
        .from('proveedores')
        .select('id, estado, calificacion')

    if (error) throw error

    const total = proveedores.length
    const activos = proveedores.filter((p: any) => p.estado === 'activo').length
    const mejorCalificados = proveedores.filter((p: any) => p.calificacion >= 4.5).length

    return {
        total,
        activos,
        mejorCalificados
    }
}

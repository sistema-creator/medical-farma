import { supabase } from './supabase'

export interface Transportista {
    id: string
    nombre: string
    cuit: string
    telefono: string
    email: string
    vehiculo_modelo: string
    vehiculo_patente: string
    notas: string
    estado: 'activo' | 'inactivo'
    created_at: string
}

export async function obtenerTransportistas() {
    try {
        const { data, error } = await supabase
            .from('transportistas')
            .select('*')
            .order('nombre', { ascending: true })

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function crearTransportista(datos: Partial<Transportista>) {
    try {
        const { data, error } = await supabase
            .from('transportistas')
            .insert(datos)
            .select()
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function actualizarTransportista(id: string, datos: Partial<Transportista>) {
    try {
        const { data, error } = await supabase
            .from('transportistas')
            .update({ ...datos, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

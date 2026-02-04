import { supabase } from './supabase'

export interface Configuracion {
    id?: string
    clave: string
    valor: any
    descripcion?: string
    categoria: string
}

export async function obtenerConfiguraciones() {
    const { data, error } = await supabase
        .from('configuracion')
        .select('*')
        .order('categoria', { ascending: true })

    if (error) {
        console.error('Error al obtener configuraciones:', error)
        return []
    }

    return data as Configuracion[]
}

export async function actualizarConfiguracion(clave: string, valor: any) {
    const { data, error } = await supabase
        .from('configuracion')
        .update({ valor, updated_at: new Date().toISOString() })
        .eq('clave', clave)
        .select()

    if (error) {
        console.error(`Error al actualizar configuracion ${clave}:`, error)
        return { success: false, error: error.message }
    }

    return { success: true, data }
}

export async function obtenerConfigPorCategoria(categoria: string) {
    const { data, error } = await supabase
        .from('configuracion')
        .select('*')
        .eq('categoria', categoria)

    if (error) {
        console.error(`Error al obtener configuraciones por categoria ${categoria}:`, error)
        return []
    }

    return data as Configuracion[]
}

import { supabase } from './supabase'

export interface Usuario {
    id: string
    email: string
    nombre_completo: string
    tipo_usuario: string
    perfil_id: string | null
    estado: 'pendiente' | 'aprobado' | 'suspendido' | 'rechazado'
    created_at: string
    updated_at: string
}

/**
 * Obtener todos los usuarios con filtros opcionales
 */
export async function obtenerUsuarios(filtros?: {
    estado?: string
    tipo_usuario?: string
    busqueda?: string
}) {
    try {
        let query = supabase
            .from('usuarios')
            .select('*')
            .order('created_at', { ascending: false })

        if (filtros?.estado) {
            query = query.eq('estado', filtros.estado)
        }

        if (filtros?.tipo_usuario) {
            query = query.eq('tipo_usuario', filtros.tipo_usuario)
        }

        if (filtros?.busqueda) {
            query = query.or(`nombre_completo.ilike.%${filtros.busqueda}%,email.ilike.%${filtros.busqueda}%`)
        }

        const { data, error } = await query

        if (error) throw error
        return { success: true, data: data as Usuario[] }
    } catch (error: any) {
        return { success: false, error: error.message, data: [] }
    }
}

/**
 * Obtener usuario por ID
 */
export async function obtenerUsuarioPorId(id: string) {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return { success: true, data: data as Usuario }
    } catch (error: any) {
        return { success: false, error: error.message, data: null }
    }
}

/**
 * Actualizar estado de usuario
 */
export async function actualizarEstadoUsuario(id: string, estado: 'pendiente' | 'aprobado' | 'suspendido' | 'rechazado') {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .update({ estado })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return { success: true, data: data as Usuario }
    } catch (error: any) {
        return { success: false, error: error.message, data: null }
    }
}

/**
 * Actualizar perfil de usuario
 */
export async function actualizarPerfilUsuario(id: string, perfil_id: string) {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .update({ perfil_id })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return { success: true, data: data as Usuario }
    } catch (error: any) {
        return { success: false, error: error.message, data: null }
    }
}

/**
 * Actualizar tipo de usuario
 */
export async function actualizarTipoUsuario(id: string, tipo_usuario: string) {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .update({ tipo_usuario })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return { success: true, data: data as Usuario }
    } catch (error: any) {
        return { success: false, error: error.message, data: null }
    }
}

/**
 * Obtener estadísticas de usuarios
 */
export async function obtenerEstadisticasUsuarios() {
    try {
        const { data: usuarios, error } = await supabase
            .from('usuarios')
            .select('*')

        if (error) throw error

        const stats = {
            total: usuarios.length,
            pendientes: usuarios.filter((u: any) => u.estado === 'pendiente').length,
            aprobados: usuarios.filter((u: any) => u.estado === 'aprobado').length,
            suspendidos: usuarios.filter((u: any) => u.estado === 'suspendido').length,
            rechazados: usuarios.filter((u: any) => u.estado === 'rechazado').length,
            porTipo: {
                vendedor: usuarios.filter((u: any) => u.tipo_usuario === 'vendedor').length,
                facturacion: usuarios.filter((u: any) => u.tipo_usuario === 'facturacion').length,
                despacho: usuarios.filter((u: any) => u.tipo_usuario === 'despacho').length,
                compras: usuarios.filter((u: any) => u.tipo_usuario === 'compras').length,
                gerencia: usuarios.filter((u: any) => u.tipo_usuario === 'gerencia').length,
                cliente: usuarios.filter((u: any) => u.tipo_usuario === 'cliente').length,
            }
        }

        return { success: true, data: stats }
    } catch (error: any) {
        return { success: false, error: error.message, data: null }
    }
}

/**
 * Obtener perfiles disponibles
 */
export async function obtenerPerfiles() {
    try {
        const { data, error } = await supabase
            .from('perfiles')
            .select('*')
            .order('nombre')

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message, data: [] }
    }
}
/**
 * Obtener todos los permisos disponibles en el sistema
 */
export async function obtenerTodosLosPermisos() {
    try {
        const { data, error } = await supabase
            .from('permisos')
            .select('*')
            .order('modulo', { ascending: true })

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message, data: [] }
    }
}

/**
 * Obtener los códigos de permisos asignados a un usuario
 */
export async function obtenerPermisosUsuario(usuarioId: string) {
    try {
        const { data, error } = await supabase
            .from('asignacion_permisos')
            .select('permisos(codigo)')
            .eq('usuario_id', usuarioId)
            .eq('estado', true)

        if (error) throw error

        // Aplanar el resultado a un array de strings (códigos)
        const codigos = data.map((item: any) => item.permisos.codigo)
        return { success: true, data: codigos }
    } catch (error: any) {
        return { success: false, error: error.message, data: [] }
    }
}

/**
 * Actualizar los permisos asignados a un usuario
 */
export async function actualizarPermisosUsuario(usuarioId: string, permisosIds: string[]) {
    try {
        // 1. Desactivar todos los permisos actuales (Soft delete o borrado físico)
        // Optamos por borrado para mantener la tabla limpia en este caso simple
        const { error: deleteError } = await supabase
            .from('asignacion_permisos')
            .delete()
            .eq('usuario_id', usuarioId)

        if (deleteError) throw deleteError

        if (permisosIds.length === 0) return { success: true }

        // 2. Insertar los nuevos permisos
        const inserts = permisosIds.map(permisoId => ({
            usuario_id: usuarioId,
            permiso_id: permisoId,
            estado: true
        }))

        const { error: insertError } = await supabase
            .from('asignacion_permisos')
            .insert(inserts)

        if (insertError) throw insertError

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

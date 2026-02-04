import { supabase } from './supabase'

export interface AuthUser {
    id: string
    email: string
    nombre_completo: string
    tipo_usuario: string
    perfil_id: string | null
    estado: string
    must_change_password?: boolean
}

/**
 * Registrar nuevo usuario
 */
export async function registrarUsuario(data: {
    email: string
    password: string
    nombre_completo: string
    dni_cuit: string
    whatsapp?: string
    institucion?: string
    tipo_usuario: 'cliente' | 'vendedor' | 'facturacion' | 'despacho' | 'compras' | 'gerencia'
}) {
    try {
        // 1. Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        })

        if (authError) throw authError

        // 2. Crear registro en tabla usuarios
        const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .insert({
                id: authData.user!.id,
                email: data.email,
                nombre_completo: data.nombre_completo,
                dni_cuit: data.dni_cuit,
                whatsapp: data.whatsapp || null,
                institucion: data.institucion || null,
                tipo_usuario: data.tipo_usuario,
                estado: 'pendiente',
                autenticacion_2fa: false,
                perfil_id: null,
            })
            .select()
            .single()

        if (userError) throw userError

        return { success: true, data: userData }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Iniciar sesión
 */
export async function iniciarSesion(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error

        // Obtener datos completos del usuario
        const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', data.user.id)
            .single()

        if (userError) throw userError

        if (userError) throw userError

        return {
            success: true,
            user: userData,
            mustChangePassword: userData.must_change_password || false
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Cerrar sesión
 */
export async function cerrarSesion() {
    const { error } = await supabase.auth.signOut()
    return { success: !error, error: error?.message }
}

/**
 * Cambiar contraseña
 */
export async function cambiarPassword(password: string) {
    try {
        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) throw error

        // Actualizar flag en tabla usuarios
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase
                .from('usuarios')
                .update({ must_change_password: false })
                .eq('id', user.id)
        }

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Obtener usuario actual
 */
export async function obtenerUsuarioActual(): Promise<AuthUser | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return null

        const { data: userData } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', user.id)
            .single()

        return userData as AuthUser
    } catch (error) {
        return null
    }
}

/**
 * Verificar si el usuario tiene un permiso específico
 */
export async function tienePermiso(codigoPermiso: string): Promise<boolean> {
    try {
        const { data, error } = await supabase.rpc('tiene_permiso', {
            codigo_permiso: codigoPermiso
        })

        if (error) throw error
        return data as boolean
    } catch (error) {
        console.error('Error verificando permiso:', error)
        return false
    }
}

/**
 * Verificar si el usuario es gerencia
 */
export async function esGerencia(): Promise<boolean> {
    try {
        const { data, error } = await supabase.rpc('es_gerencia')

        if (error) throw error
        return data as boolean
    } catch (error) {
        console.error('Error verificando gerencia:', error)
        return false
    }
}

/**
 * Obtener permisos del usuario actual
 */
export async function obtenerPermisosUsuario() {
    try {
        const user = await obtenerUsuarioActual()
        if (!user) return []

        const { data, error } = await supabase
            .from('asignacion_permisos')
            .select(`
        permiso_id,
        estado,
        permisos (
          codigo,
          nombre,
          descripcion,
          modulo
        )
      `)
            .or(`usuario_id.eq.${user.id},perfil_id.eq.${user.perfil_id}`)
            .eq('estado', true)

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error obteniendo permisos:', error)
        return []
    }
}

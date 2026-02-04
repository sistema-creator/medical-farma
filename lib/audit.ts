
import { supabase } from './supabase'

export interface AuditLog {
    id: string
    usuario_id: string
    accion: string
    modulo: string
    detalles: any
    ip?: string
    dispositivo?: string
    created_at: string
}

/**
 * Registrar una acción en el log de auditoría
 */
export async function logAction(
    accion: string,
    modulo: string,
    detalles: any = {},
    userId?: string
) {
    try {
        // Si no se pasa userId, intentamos obtenerlo de la sesión actual
        let uid = userId
        if (!uid) {
            const { data } = await supabase.auth.getUser()
            uid = data.user?.id
        }

        if (!uid) {
            console.warn('Intento de log auditable sin usuario identificado', { accion, modulo })
            return
        }

        // En un entorno real, podríamos obtener IP y UserAgent desde headers si estamos en SSR,
        // o pasarlos desde el cliente. Por simplicidad aquí lo dejamos opcional o nulo por ahora.
        // Si estuviéramos en un API Route, podríamos leer req.headers.

        await supabase.from('audit_logs').insert({
            usuario_id: uid,
            accion,
            modulo,
            detalles,
            // ip: ... 
            // dispositivo: ...
        })

    } catch (error) {
        console.error('Error escribiendo log de auditoría:', error)
    }
}

/**
 * Obtener logs de auditoría (Solo para admins)
 */
export async function obtenerAuditLogs(filtros?: {
    modulo?: string
    usuario_id?: string
    fechaDesde?: string
    fechaHasta?: string
    limit?: number
}) {
    try {
        let query = supabase
            .from('audit_logs')
            .select(`
                *,
                usuarios ( email, nombre_completo )
            `)
            .order('created_at', { ascending: false })

        if (filtros?.modulo) {
            query = query.eq('modulo', filtros.modulo)
        }
        if (filtros?.usuario_id) {
            query = query.eq('usuario_id', filtros.usuario_id)
        }
        if (filtros?.fechaDesde) {
            query = query.gte('created_at', filtros.fechaDesde)
        }
        if (filtros?.fechaHasta) {
            query = query.lte('created_at', filtros.fechaHasta)
        }

        if (filtros?.limit) {
            query = query.limit(filtros.limit)
        } else {
            query = query.limit(100)
        }

        const { data, error } = await query

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

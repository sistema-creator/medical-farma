'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ALLOWED_ADMIN_ROLES = ['gerencia', 'vendedor', 'facturacion', 'despacho', 'compras']

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/acceso')
            } else if (!ALLOWED_ADMIN_ROLES.includes(user.tipo_usuario)) {
                // Si está logueado pero no es personal, enviarlo a su portal (cliente)
                router.push('/dashboard')
            }
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-medical-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue-600 mx-auto"></div>
                    <p className="mt-4 text-medical-gray-600 font-medium">Verificando credenciales administrativas...</p>
                </div>
            </div>
        )
    }

    if (!user || !ALLOWED_ADMIN_ROLES.includes(user.tipo_usuario)) {
        return null
    }

    // Verificar estado del usuario (solo si está aprobado o es admin directo)
    if (user.estado !== 'aprobado' && user.tipo_usuario !== 'gerencia') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-medical-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-medical-gray-200">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-medical-gray-900 mb-2">Acceso Restringido</h2>
                    <p className="text-medical-gray-600 mb-6">
                        Tu cuenta de personal aún no ha sido activada o está pendiente de revisión.
                    </p>
                    <button
                        onClick={() => router.push('/acceso')}
                        className="px-6 py-2 bg-medical-blue-600 text-white rounded-lg hover:bg-medical-blue-700 transition-colors"
                    >
                        Volver al Portal de Acceso
                    </button>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

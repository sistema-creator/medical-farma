'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    // Verificar estado del usuario
    if (user.estado === 'pendiente') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Cuenta Pendiente de Aprobación</h2>
                    <p className="text-gray-600 mb-6">
                        Tu cuenta está siendo revisada por nuestro equipo. Te notificaremos por email cuando sea aprobada.
                    </p>
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        )
    }

    if (user.estado === 'rechazado') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Cuenta Rechazada</h2>
                    <p className="text-gray-600 mb-6">
                        Tu solicitud de registro no fue aprobada. Por favor, contacta con soporte para más información.
                    </p>
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        )
    }

    if (user.estado === 'suspendido') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Cuenta Suspendida</h2>
                    <p className="text-gray-600 mb-6">
                        Tu cuenta ha sido suspendida. Por favor, contacta con soporte para más información.
                    </p>
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

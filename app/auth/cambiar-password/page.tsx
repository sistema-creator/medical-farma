'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cambiarPassword } from '@/lib/auth'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck } from 'lucide-react'

export default function CambiarPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            setLoading(false)
            return
        }

        const res = await cambiarPassword(password)

        if (res.success) {
            // Logear la acción si es posible (aunque puede que no tengamos session context completo en client side fácilmente sin auth provider wrapper, 
            // pero el backend de supabase maneja la session).
            // Idealmente aquí redirigimos al dashboard o home
            router.push('/dashboard')
        } else {
            setError(res.error || 'Error al cambiar la contraseña')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-medical-blue-600" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Seguridad de la Cuenta
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Es necesario que cambies tu contraseña antes de continuar.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nueva Contraseña
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="focus:ring-medical-blue-500 focus:border-medical-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmar Contraseña
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="focus:ring-medical-blue-500 focus:border-medical-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medical-blue-600 hover:bg-medical-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

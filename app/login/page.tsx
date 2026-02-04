'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LoginPage() {
    const router = useRouter()
    const { signIn } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        if (!email || !password) {
            setError('Por favor complete todos los campos')
            setIsLoading(false)
            return
        }

        try {
            const result = await signIn(email, password)

            if (result.success) {
                const tipo = result.user?.tipo_usuario
                const ADMIN_ROLES = ['gerencia', 'vendedor', 'facturacion', 'despacho', 'compras']

                if (result.mustChangePassword) {
                    router.push('/auth/cambiar-password')
                } else if (tipo && ADMIN_ROLES.includes(tipo)) {
                    // Si un administrativo entra por el portal de clientes, lo mandamos a /acceso
                    // para que vea el portal correcto, o directo al dashboard si preferimos
                    router.push('/admin/dashboard')
                } else {
                    router.push('/catalogo')
                }
            } else {
                setError(result.error || 'Credenciales inválidas. Por favor intente de nuevo.')
            }
        } catch (err: any) {
            setError('Ocurrió un error inesperado. Por favor, contacte a soporte.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-24 pb-12 gradient-bg flex items-center justify-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-medical-blue-100/30 rounded-full -mr-48 -mt-48 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-medical-blue-200/20 rounded-full -ml-48 -mb-48 blur-3xl" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/50">
                            <div className="p-8">
                                <div className="text-center mb-10">
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="w-20 h-20 medical-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-medical-blue-200"
                                    >
                                        <LogIn className="text-white" size={32} />
                                    </motion.div>
                                    <h1 className="text-3xl font-extrabold text-medical-gray-900 mb-2 tracking-tight">
                                        Portal de Clientes
                                    </h1>
                                    <p className="text-medical-gray-600 font-medium">
                                        Acceso exclusivo para instituciones de salud
                                    </p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 mb-8 flex items-start space-x-3"
                                    >
                                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                        <p className="text-sm text-red-700 font-medium">{error}</p>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-medical-gray-700 ml-1">
                                            Correo Electrónico
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-medical-gray-400 group-focus-within:text-medical-blue-600 transition-colors">
                                                <Mail size={20} />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-medical-gray-50 border border-medical-gray-200 rounded-xl focus:ring-4 focus:ring-medical-blue-100 focus:border-medical-blue-500 transition-all outline-none"
                                                placeholder="ejemplo@institucion.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-medical-gray-700 ml-1">
                                            Contraseña
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-medical-gray-400 group-focus-within:text-medical-blue-600 transition-colors">
                                                <Lock size={20} />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-medical-gray-50 border border-medical-gray-200 rounded-xl focus:ring-4 focus:ring-medical-blue-100 focus:border-medical-blue-500 transition-all outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between px-1">
                                        <label className="flex items-center group cursor-pointer">
                                            <div className="relative flex items-center">
                                                <input type="checkbox" className="peer sr-only" />
                                                <div className="h-5 w-5 bg-medical-gray-100 border border-medical-gray-300 rounded peer-checked:bg-medical-blue-600 peer-checked:border-medical-blue-600 transition-all" />
                                                <ShieldCheck className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5" />
                                            </div>
                                            <span className="ml-2 text-sm text-medical-gray-600 font-medium group-hover:text-medical-gray-900 transition-colors">Recordarme</span>
                                        </label>
                                        <Link href="/recuperar" className="text-sm text-medical-blue-600 hover:text-medical-blue-700 font-bold transition-colors">
                                            ¿Olvidó su contraseña?
                                        </Link>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-medical-blue-600 hover:bg-medical-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-medical-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:transform-none"
                                    >
                                        {isLoading ? (
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Ingresar al Portal</span>
                                                <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-10 pt-8 border-t border-medical-gray-100 text-center">
                                    <p className="text-medical-gray-600 font-medium mb-4">
                                        ¿Aún no es cliente de Medical Farma?
                                    </p>
                                    <Link href="/registro" className="group flex items-center justify-center space-x-2 text-medical-blue-600 font-bold hover:text-medical-blue-700 transition-colors">
                                        <span>Solicitar Apertura de Cuenta</span>
                                        <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

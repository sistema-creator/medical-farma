'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ADMIN_ROLES = ['gerencia', 'vendedor', 'facturacion', 'despacho', 'compras']

export default function AccesoAdminPage() {
    const router = useRouter()
    const { user, signIn, loading } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!loading && user) {
            if (ADMIN_ROLES.includes(user.tipo_usuario)) {
                router.push('/admin/dashboard')
            } else {
                // Si un cliente intenta entrar por aquí, lo mandamos a su portal
                router.push('/dashboard')
            }
        }
    }, [user, loading, router])

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
                if (result.mustChangePassword) {
                    router.push('/auth/cambiar-password')
                } else {
                    const tipo = result.user?.tipo_usuario
                    if (tipo && ADMIN_ROLES.includes(tipo)) {
                        router.push('/admin/dashboard')
                    } else {
                        setError('Este acceso es exclusivo para personal administrativo. Si es cliente, use el portal de clientes.')
                    }
                }
            } else {
                setError(result.error || 'Credenciales inválidas.')
            }
        } catch (err: any) {
            setError('Error de conexión. Intente nuevamente.')
        } finally {
            setIsLoading(false)
        }
    }

    if (loading) return null

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-24 pb-12 bg-medical-gray-50 flex items-center justify-center relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-medical-blue-100/20 rounded-full -mr-64 -mt-64 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-medical-blue-200/10 rounded-full -ml-64 -mb-64 blur-3xl opacity-50" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-xl mx-auto"
                    >
                        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-medical-gray-100">
                            <div className="md:flex">
                                <div className="p-8 md:p-12 w-full">
                                    <div className="inline-flex items-center space-x-2 bg-medical-blue-50 border border-medical-blue-100 px-4 py-1.5 rounded-full mb-8">
                                        <ShieldCheck size={16} className="text-medical-blue-600" />
                                        <span className="text-medical-blue-700 text-xs font-bold uppercase tracking-wider">Acceso Administrativo</span>
                                    </div>

                                    <h1 className="text-4xl font-extrabold text-medical-gray-900 mb-2 tracking-tight">
                                        Portal de Personal
                                    </h1>
                                    <p className="text-medical-gray-600 mb-10 font-medium">
                                        Gestión interna y operativa de Medical Farma
                                    </p>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-start space-x-3 rounded-r-lg"
                                        >
                                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                            <p className="text-sm text-red-700 font-semibold">{error}</p>
                                        </motion.div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-bold text-medical-gray-700 ml-1">
                                                Usuario / Email de Empresa
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
                                                    className="w-full pl-12 pr-4 py-4 bg-medical-gray-50 border border-medical-gray-200 rounded-2xl focus:ring-4 focus:ring-medical-blue-100 focus:border-medical-blue-500 transition-all outline-none"
                                                    placeholder="usuario@medicalfarma.com.ar"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-bold text-medical-gray-700 ml-1">
                                                Contraseña Técnica
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
                                                    className="w-full pl-12 pr-4 py-4 bg-medical-gray-50 border border-medical-gray-200 rounded-2xl focus:ring-4 focus:ring-medical-blue-100 focus:border-medical-blue-500 transition-all outline-none"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-medical-blue-600 hover:bg-medical-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-medical-blue-200/40 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:transform-none mt-4"
                                        >
                                            {isLoading ? (
                                                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span>Ingresar al Sistema de Gestión</span>
                                                    <ArrowRight size={20} />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-12 pt-8 border-t border-medical-gray-100 flex flex-col items-center">
                                        <p className="text-medical-gray-400 text-sm font-medium flex items-center mb-4">
                                            <UserCheck size={16} className="mr-2" />
                                            Solo personal autorizado
                                        </p>
                                        <Link href="/login" className="text-medical-blue-600 font-bold hover:text-medical-blue-700 transition-colors text-sm">
                                            ¿Es administrador de una institución? Ingrese aquí
                                        </Link>
                                    </div>
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

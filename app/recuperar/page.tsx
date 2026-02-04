'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Send } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function RecuperarPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        if (!email) {
            setError('Por favor ingrese su correo electrónico')
            setIsLoading(false)
            return
        }

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/cambiar-password`,
            })

            if (resetError) throw resetError

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al procesar su solicitud.')
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
                        className="max-w-md mx-auto"
                    >
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/50 p-8">
                            <div className="text-center mb-10">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center text-medical-blue-600 hover:text-medical-blue-700 font-bold mb-6 text-sm transition-colors group"
                                >
                                    <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                                    Volver al inicio
                                </Link>
                                <h1 className="text-3xl font-extrabold text-medical-gray-900 mb-2">
                                    Recuperar Acceso
                                </h1>
                                <p className="text-medical-gray-600 font-medium font-sm">
                                    Le enviaremos un enlace para restablecer su contraseña.
                                </p>
                            </div>

                            {success ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-6 py-4"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                        <CheckCircle className="text-green-600" size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-medical-gray-900">Email Enviado</h3>
                                        <p className="text-medical-gray-600">
                                            Hemos enviado las instrucciones a <strong>{email}</strong>.
                                            Por favor revise su bandeja de entrada (y la carpeta de spam).
                                        </p>
                                    </div>
                                    <Link href="/login" className="btn-primary w-full inline-block text-center">
                                        Volver al Login
                                    </Link>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-start space-x-3"
                                        >
                                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                            <p className="text-sm text-red-700 font-medium">{error}</p>
                                        </motion.div>
                                    )}

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

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-medical-blue-600 hover:bg-medical-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-medical-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:transform-none"
                                    >
                                        {isLoading ? (
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Enviar Instrucciones</span>
                                                <Send size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

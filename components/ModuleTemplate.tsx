'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, LucideIcon } from 'lucide-react'
import Header from '@/components/Header'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'

interface ModuleTemplateProps {
    title: string
    subtitle: string
    icon: LucideIcon
    color: string
    children?: React.ReactNode
}

export default function ModuleTemplate({ title, subtitle, icon: Icon, color, children }: ModuleTemplateProps) {
    const router = useRouter()

    return (
        <AdminProtectedRoute>
            <div className="min-h-screen bg-gray-50 pt-20">
                <Header />

                <main className="container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className="flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors group mb-6"
                        >
                            <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                            VOLVER AL PANEL
                        </button>

                        <div className="flex items-center space-x-6">
                            <div className={`w-20 h-20 rounded-3xl ${color} flex items-center justify-center text-white shadow-2xl`}>
                                <Icon size={40} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">{title}</h1>
                                <p className="text-xl text-gray-500 font-medium">{subtitle}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-12 min-h-[500px] flex flex-col items-center justify-center text-center"
                    >
                        {children || (
                            <>
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                                    <Icon size={48} className="text-gray-200" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Módulo en Desarrollo</h2>
                                <p className="text-gray-500 max-w-lg text-lg leading-relaxed">
                                    Estamos preparando las herramientas de <strong>{title}</strong> para Medical Farma.
                                    Próximamente podrás gestionar todas las operaciones de esta área desde aquí.
                                </p>
                                <div className="mt-12 flex space-x-4">
                                    <div className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold animate-pulse">
                                        PRÓXIMAMENTE
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </main>
            </div>
        </AdminProtectedRoute>
    )
}

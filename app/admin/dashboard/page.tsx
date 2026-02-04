'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Users,
    BarChart2,
    Settings,
    ShoppingCart,
    Truck,
    CreditCard,
    Package,
    Briefcase,
    Shield,
    Lock,
    ClipboardList
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import AIAssistant from '@/components/AIAssistant'
import { useAuth } from '@/contexts/AuthContext'
import { obtenerPermisosUsuario } from '@/lib/usuarios'

export default function AdminDashboardPage() {
    return (
        <AdminProtectedRoute>
            <DashboardContent />
        </AdminProtectedRoute>
    )
}

function DashboardContent() {
    const { user } = useAuth()
    const [permisos, setPermisos] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function cargarPermisos() {
            if (user) {
                const res = await obtenerPermisosUsuario(user.id)
                if (res.success) {
                    setPermisos(res.data)
                }
                setLoading(false)
            }
        }
        cargarPermisos()
    }, [user])

    const allModules = [
        {
            title: 'Gestión de Vendedores',
            description: 'Control de pedidos, comisiones y ventas',
            icon: ShoppingCart,
            href: '/admin/ventas',
            color: 'bg-blue-600',
            requiredPermission: 'ventas.ver'
        },
        {
            title: 'Logística y Despacho',
            description: 'Seguimiento de entregas y repartos',
            icon: Truck,
            href: '/admin/despacho',
            color: 'bg-orange-600',
            requiredPermission: 'despacho.ver'
        },
        {
            title: 'Gestión de Clientes',
            description: 'Ver y administrar cartera de clientes',
            icon: Briefcase,
            href: '/admin/usuarios?tipo=cliente',
            color: 'bg-pink-600',
            requiredPermission: 'usuarios.ver'
        },
        {
            title: 'Facturación y Cobros',
            description: 'Gestión de comprobantes y pagos',
            icon: CreditCard,
            href: '/admin/facturacion',
            color: 'bg-purple-600',
            requiredPermission: 'facturacion.ver'
        },
        {
            title: 'Gerencia y Compras',
            description: 'Gestión de proveedores e inventario',
            icon: Package,
            href: '/admin/compras',
            color: 'bg-teal-600',
            requiredPermission: 'compras.ver'
        },
        {
            title: 'Gestión de Stock',
            description: 'Carga y control de productos',
            icon: ClipboardList,
            href: '/admin/stock',
            color: 'bg-emerald-600',
            requiredPermission: 'stock.ver'
        },
        {
            title: 'Auditoría y Estadísticas',
            description: 'Métricas de uso y logs de seguridad',
            icon: BarChart2,
            href: '/admin/estadisticas',
            color: 'bg-indigo-500',
            requiredPermission: 'reportes.ventas'
        },
        {
            title: 'Gestión de Usuarios',
            description: 'Administrar usuarios internos y permisos',
            icon: Users,
            href: '/admin/usuarios',
            color: 'bg-indigo-600',
            requiredPermission: 'usuarios.ver'
        },
        {
            title: 'Configuraciones',
            description: 'Parámetros globales del sistema',
            icon: Settings,
            href: '/settings',
            color: 'bg-gray-600',
            requiredPermission: 'config.general'
        }
    ]

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-extrabold text-medical-gray-900 tracking-tight">Panel de Control</h1>
                        <p className="text-medical-gray-600 mt-2 text-lg">
                            Bienvenido, <span className="font-bold text-indigo-600">{user?.nombre_completo}</span> •
                            Nivel de Acceso: <span className="capitalize font-medium">{user?.tipo_usuario}</span>
                        </p>
                    </div>
                    {user?.tipo_usuario === 'gerencia' && (
                        <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full flex items-center space-x-2">
                            <Shield size={16} className="text-indigo-600" />
                            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">SuperUsuario</span>
                        </div>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allModules.map((module, index) => {
                        const hasPermission = user?.tipo_usuario === 'gerencia' || permisos.includes(module.requiredPermission)

                        return (
                            <motion.div
                                key={module.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {hasPermission ? (
                                    <Link href={module.href} className="block group h-full">
                                        <div className="bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all p-8 h-full border border-gray-100 relative overflow-hidden flex flex-col">
                                            <div className={`w-16 h-16 rounded-2xl ${module.color} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                                <module.icon className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-medical-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                                {module.title}
                                            </h3>
                                            <p className="text-medical-gray-600 leading-relaxed flex-grow">
                                                {module.description}
                                            </p>
                                            <div className="mt-6 flex items-center text-indigo-600 font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                                                <span>Entrar</span>
                                                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="bg-white rounded-[2rem] shadow-sm p-8 h-full border border-gray-100 relative overflow-hidden flex flex-col opacity-60 grayscale-[0.5]">
                                        <div className="absolute top-6 right-6 text-gray-400">
                                            <Lock size={20} />
                                        </div>
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6 text-gray-400">
                                            <module.icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-400 mb-3">
                                            {module.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed flex-grow italic">
                                            Acceso no autorizado
                                        </p>
                                        <div className="mt-6 flex items-center text-gray-300 font-bold text-xs uppercase tracking-widest">
                                            <span>Módulo Bloqueado</span>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </main>

            {/* AI Assistant - Disponible para todos los roles administrativos */}
            <AIAssistant />
        </div>
    )
}

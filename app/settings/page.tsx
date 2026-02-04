'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Settings,
    Globe,
    Link as LinkIcon,
    ShieldCheck,
    Save,
    AlertCircle,
    CheckCircle2,
    Building2,
    CreditCard,
    MessageSquare,
    Cpu,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { obtenerConfiguraciones, actualizarConfiguracion, Configuracion } from '@/lib/configuracion'

export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [configs, setConfigs] = useState<Configuracion[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'general' | 'integracion' | 'seguridad'>('general')
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        if (!authLoading && (!user || user.tipo_usuario !== 'gerencia')) {
            router.push('/login')
            return
        }

        if (user) {
            loadConfigs()
        }
    }, [user, authLoading, router])

    async function loadConfigs() {
        setIsLoading(true)
        const data = await obtenerConfiguraciones()
        setConfigs(data)
        setIsLoading(false)
    }

    const handleValueChange = (clave: string, field: string, value: any) => {
        setConfigs(prev => prev.map(c => {
            if (c.clave === clave) {
                return { ...c, valor: { ...c.valor, [field]: value } }
            }
            return c
        }))
    }

    const handleSave = async (config: Configuracion) => {
        setIsSaving(true)
        setMessage(null)
        const result = await actualizarConfiguracion(config.clave, config.valor)
        if (result.success) {
            setMessage({ type: 'success', text: `Configuración "${config.clave}" actualizada.` })
            setTimeout(() => setMessage(null), 3000)
        } else {
            setMessage({ type: 'error', text: `Error: ${result.error}` })
        }
        setIsSaving(false)
    }

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="h-12 w-12 border-4 border-medical-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    const filteredConfigs = configs.filter(c => c.categoria === activeTab)

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-grow pt-28 pb-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <Link
                                href="/admin/dashboard"
                                className="inline-flex items-center text-medical-blue-600 hover:text-medical-blue-700 font-bold mb-4 text-sm group"
                            >
                                <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                                Volver al Panel
                            </Link>
                            <h1 className="text-4xl font-extrabold text-medical-gray-900 tracking-tight flex items-center">
                                <Settings className="mr-3 text-medical-blue-600" size={32} />
                                Configuración del Sistema
                            </h1>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-medical-gray-100 flex flex-col md:flex-row min-h-[600px]">
                        {/* Sidebar Tabs */}
                        <div className="w-full md:w-64 bg-medical-gray-50 border-r border-medical-gray-100 p-4 space-y-2">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'general'
                                        ? 'bg-medical-blue-600 text-white shadow-lg shadow-medical-blue-200'
                                        : 'text-medical-gray-600 hover:bg-medical-gray-100'
                                    }`}
                            >
                                <Globe size={20} />
                                <span>General</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('integracion')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'integracion'
                                        ? 'bg-medical-blue-600 text-white shadow-lg shadow-medical-blue-200'
                                        : 'text-medical-gray-600 hover:bg-medical-gray-100'
                                    }`}
                            >
                                <LinkIcon size={20} />
                                <span>Integraciones</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('seguridad')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'seguridad'
                                        ? 'bg-medical-blue-600 text-white shadow-lg shadow-medical-blue-200'
                                        : 'text-medical-gray-600 hover:bg-medical-gray-100'
                                    }`}
                            >
                                <ShieldCheck size={20} />
                                <span>Seguridad</span>
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-grow p-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    {message && (
                                        <div className={`p-4 rounded-xl flex items-center space-x-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                            <span className="font-medium">{message.text}</span>
                                        </div>
                                    )}

                                    {filteredConfigs.map((config) => (
                                        <div key={config.clave} className="bg-medical-gray-50/50 rounded-2xl p-6 border border-medical-gray-100">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold text-medical-gray-900 uppercase tracking-wider text-sm flex items-center">
                                                        {config.clave.replace('_', ' ')}
                                                    </h3>
                                                    <p className="text-medical-gray-500 text-sm mt-1">{config.descripcion}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleSave(config)}
                                                    disabled={isSaving}
                                                    className="btn-primary py-2 px-4 text-sm flex items-center space-x-2"
                                                >
                                                    <Save size={16} />
                                                    <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {Object.keys(config.valor).map((field) => (
                                                    <div key={field} className="space-y-2">
                                                        <label className="block text-xs font-bold text-medical-gray-600 uppercase ml-1">
                                                            {field.replace('_', ' ')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={config.valor[field] || ''}
                                                            onChange={(e) => handleValueChange(config.clave, field, e.target.value)}
                                                            className="w-full px-4 py-3 bg-white border border-medical-gray-200 rounded-xl focus:ring-4 focus:ring-medical-blue-100 focus:border-medical-blue-500 transition-all outline-none text-medical-gray-900"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {filteredConfigs.length === 0 && (
                                        <div className="text-center py-20 text-medical-gray-400">
                                            <Cpu size={48} className="mx-auto mb-4 opacity-20" />
                                            <p className="font-medium text-lg">No hay configuraciones en esta categoría.</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

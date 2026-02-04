
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Building2, User, Phone, Mail, Clock, CreditCard, Star, Package } from 'lucide-react'
import Link from 'next/link'
import { crearProveedor, type ProveedorFormData } from '@/lib/proveedores'

export default function NuevoProveedorPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState<ProveedorFormData>({
        nombre: '',
        cuit: '',
        contacto_nombre: '',
        telefono: '',
        email: '',
        productos_suministrados: '',
        tiempo_entrega_promedio_dias: 3,
        condiciones_pago: 'Contado',
        calificacion: 5,
        estado: 'activo'
    })

    // Manejo de cambios en inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await crearProveedor(formData)
            router.push('/proveedores')
            router.refresh()
        } catch (error) {
            console.error('Error al crear proveedor:', error)
            alert('Hubo un error al crear el proveedor. Por favor intente nuevamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">

            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <Link
                    href="/proveedores"
                    className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-4 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver a Proveedores
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Nuevo Proveedor</h1>
                <p className="text-slate-500">Registra un nuevo socio comercial en el sistema.</p>
            </div>

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Tarjeta 1: Información Principal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Datos de la Empresa</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Razón Social / Nombre *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    required
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Distribuidora Médica SRL"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">CUIT *</label>
                                <input
                                    type="text"
                                    name="cuit"
                                    required
                                    value={formData.cuit}
                                    onChange={handleChange}
                                    placeholder="30-12345678-9"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Estado del Proveedor</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="estado"
                                            value="activo"
                                            checked={formData.estado === 'activo'}
                                            onChange={handleChange}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700">Activo</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="estado"
                                            value="inactivo"
                                            checked={formData.estado === 'inactivo'}
                                            onChange={handleChange}
                                            className="text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-sm text-slate-700">Inactivo</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tarjeta 2: Contacto */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <User className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Contacto</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Persona de Contacto *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="contacto_nombre"
                                        required
                                        value={formData.contacto_nombre}
                                        onChange={handleChange}
                                        placeholder="Juan Pérez"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Teléfono / WhatsApp *</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="telefono"
                                        required
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        placeholder="+54 11 1234 5678"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Email *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="contacto@proveedor.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tarjeta 3: Detalles Comerciales */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <Package className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Detalles Comerciales</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Productos Suministrados (separados por coma)</label>
                                <input
                                    type="text"
                                    name="productos_suministrados"
                                    value={formData.productos_suministrados}
                                    onChange={handleChange}
                                    placeholder="Ej: Jeringas, Gasas, Descartables"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Tiempo de Entrega Promedio (días)</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        name="tiempo_entrega_promedio_dias"
                                        min="1"
                                        value={formData.tiempo_entrega_promedio_dias}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Condiciones de Pago</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <select
                                        name="condiciones_pago"
                                        value={formData.condiciones_pago}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none"
                                    >
                                        <option value="Contado">Contado</option>
                                        <option value="15 Días">15 Días</option>
                                        <option value="30 Días">30 Días</option>
                                        <option value="60 Días">60 Días</option>
                                        <option value="Cheque">Cheque</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Calificación Inicial</label>
                                <div className="relative">
                                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        name="calificacion"
                                        min="1"
                                        max="5"
                                        step="0.1"
                                        value={formData.calificacion}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link
                            href="/proveedores"
                            className="px-6 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Guardar Proveedor
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

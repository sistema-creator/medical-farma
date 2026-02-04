'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Building2, User, Phone, Mail, Clock, CreditCard, Star, Package, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { obtenerProveedorPorId, actualizarProveedor, eliminarProveedor, type ProveedorFormData } from '@/lib/proveedores'

export default function DetalleProveedorClient({ id }: { id: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [proveedor, setProveedor] = useState<any>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<ProveedorFormData>({
        nombre: '',
        cuit: '',
        contacto_nombre: '',
        telefono: '',
        email: '',
        productos_suministrados: '',
        tiempo_entrega_promedio_dias: 0,
        condiciones_pago: '',
        calificacion: 0,
        estado: 'activo'
    })

    const cargarProveedor = useCallback(async () => {
        try {
            setLoading(true)
            const data = await obtenerProveedorPorId(id)
            setProveedor(data)
            setFormData({
                nombre: data.nombre,
                cuit: data.cuit,
                contacto_nombre: data.contacto_nombre,
                telefono: data.telefono,
                email: data.email,
                productos_suministrados: data.productos_suministrados ? data.productos_suministrados.join(', ') : '',
                tiempo_entrega_promedio_dias: data.tiempo_entrega_promedio_dias,
                condiciones_pago: data.condiciones_pago,
                calificacion: data.calificacion,
                estado: data.estado
            })
        } catch (error) {
            console.error('Error:', error)
            alert('Error al cargar el proveedor')
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        cargarProveedor()
    }, [cargarProveedor])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name as keyof ProveedorFormData]: value }))
    }

    const handleUpdate = async () => {
        try {
            await actualizarProveedor(id, formData)
            setIsEditing(false)
            cargarProveedor() // Recargar datos frescos
        } catch (error) {
            console.error('Error al actualizar:', error)
            alert('Error al actualizar')
        }
    }

    const handleDelete = async () => {
        if (confirm('¿Estás seguro de que deseas desactivar este proveedor?')) {
            try {
                await eliminarProveedor(id)
                router.push('/proveedores')
                router.refresh()
            } catch (error) {
                console.error('Error al eliminar:', error)
            }
        }
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Cargando detalles...</div>

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            {/* Header */}
            <div className="max-w-5xl mx-auto mb-8 flex justify-between items-start">
                <div>
                    <Link
                        href="/proveedores"
                        className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Volver a Proveedores
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-slate-900">{isEditing ? 'Editar Proveedor' : proveedor.nombre}</h1>
                        {!isEditing && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${proveedor.estado === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {proveedor.estado?.toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    {!isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Editar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-white hover:bg-red-50 text-red-600 border border-slate-200 px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Guardar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* -- INFO DE CONTACTO --- */}
                <div className="md:col-span-2 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Información General</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Razón Social</label>
                                {isEditing ? (
                                    <input name="nombre" value={formData.nombre} onChange={handleChange} className="w-full p-2 border rounded-lg bg-slate-50" />
                                ) : (
                                    <p className="text-slate-800 font-medium">{proveedor.nombre}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">CUIT</label>
                                {isEditing ? (
                                    <input name="cuit" value={formData.cuit} onChange={handleChange} className="w-full p-2 border rounded-lg bg-slate-50" />
                                ) : (
                                    <p className="text-slate-800 font-medium">{proveedor.cuit}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                                {isEditing ? (
                                    <input name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-lg bg-slate-50" />
                                ) : (
                                    <p className="text-slate-800 font-medium">{proveedor.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Teléfono</label>
                                {isEditing ? (
                                    <input name="telefono" value={formData.telefono} onChange={handleChange} className="w-full p-2 border rounded-lg bg-slate-50" />
                                ) : (
                                    <p className="text-slate-800 font-medium">{proveedor.telefono}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <Package className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Productos y Servicios</h2>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Productos Suministrados</label>
                            {isEditing ? (
                                <input
                                    name="productos_suministrados"
                                    value={formData.productos_suministrados}
                                    onChange={handleChange}
                                    placeholder="Separados por coma"
                                    className="w-full p-2 border rounded-lg bg-slate-50"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {proveedor.productos_suministrados?.map((prod: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm border border-slate-200">
                                            {prod}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* -- SIDEBAR METRICAS --- */}
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4">Métricas de Desempeño</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Star className="w-4 h-4" /></div>
                                    <span className="text-sm text-slate-600">Calificación</span>
                                </div>
                                {isEditing ? (
                                    <input type="number" name="calificacion" value={formData.calificacion} onChange={handleChange} className="w-16 p-1 border rounded text-right" />
                                ) : (
                                    <span className="font-bold text-slate-900">{proveedor.calificacion} / 5</span>
                                )}
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Clock className="w-4 h-4" /></div>
                                    <span className="text-sm text-slate-600">Tiempo Entrega</span>
                                </div>
                                {isEditing ? (
                                    <input type="number" name="tiempo_entrega_promedio_dias" value={formData.tiempo_entrega_promedio_dias} onChange={handleChange} className="w-16 p-1 border rounded text-right" />
                                ) : (
                                    <span className="font-bold text-slate-900">{proveedor.tiempo_entrega_promedio_dias} días</span>
                                )}
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-violet-50 text-violet-600 rounded-lg"><CreditCard className="w-4 h-4" /></div>
                                    <span className="text-sm text-slate-600">Pago</span>
                                </div>
                                {isEditing ? (
                                    <select name="condiciones_pago" value={formData.condiciones_pago} onChange={handleChange} className="text-sm border rounded p-1">
                                        <option value="Contado">Contado</option>
                                        <option value="15 Días">15 Días</option>
                                        <option value="30 Días">30 Días</option>
                                        <option value="60 Días">60 Días</option>
                                        <option value="Cheque">Cheque</option>
                                    </select>
                                ) : (
                                    <span className="font-bold text-slate-900">{proveedor.condiciones_pago}</span>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2">Pedidos Recientes</h3>
                            <p className="text-blue-100 text-sm mb-4">Resumen de actividad comercial</p>
                            <div className="text-center py-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                <p className="text-sm opacity-80">Próximamente</p>
                                <p className="font-semibold">Historial de Compras</p>
                            </div>
                        </div>
                        {/* Decoration circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10 blur-xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/30 rounded-full -translate-x-5 translate-y-5 blur-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

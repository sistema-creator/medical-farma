
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Search,
    Plus,
    Filter,
    Truck,
    Star,
    Phone,
    Mail,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Building2,
    Clock
} from 'lucide-react'
import Link from 'next/link'
import { obtenerProveedores, type Proveedor, obtenerEstadisticasProveedores } from '@/lib/proveedores'

export default function ProveedoresPage() {
    const [proveedores, setProveedores] = useState<Proveedor[]>([])
    const [estadisticas, setEstadisticas] = useState({ total: 0, activos: 0, mejorCalificados: 0 })
    const [loading, setLoading] = useState(true)
    const [busqueda, setBusqueda] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')

    useEffect(() => {
        cargarDatos()
    }, [busqueda, filtroEstado])

    const cargarDatos = async () => {
        setLoading(true)
        try {
            // Cargar proveedores y estadísticas en paralelo
            const [dataProveedores, dataStats] = await Promise.all([
                obtenerProveedores(busqueda, filtroEstado),
                obtenerEstadisticasProveedores() // Nota: en app real esto podría optimizarse para no recargar siempre
            ])

            setProveedores(dataProveedores)
            setEstadisticas(dataStats)
        } catch (error) {
            console.error('Error cargando datos:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Proveedores</h1>
                    <p className="text-slate-500 mt-1">Gestión de cadena de suministro y socios comerciales</p>
                </div>
                <Link
                    href="/proveedores/nuevo"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 w-full md:w-auto justify-center"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Proveedor
                </Link>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Proveedores</p>
                            <h3 className="text-2xl font-bold text-slate-900">{estadisticas.total}</h3>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Activos</p>
                            <h3 className="text-2xl font-bold text-slate-900">{estadisticas.activos}</h3>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <Star className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Top Rated</p>
                            <h3 className="text-2xl font-bold text-slate-900">{estadisticas.mejorCalificados}</h3>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, CUIT..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium text-slate-700 focus:outline-none"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="activo">Activos</option>
                            <option value="inactivo">Inactivos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de Proveedores */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-500">Cargando proveedores...</p>
                </div>
            ) : proveedores.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Truck className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No se encontraron proveedores</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        No hay proveedores que coincidan con tu búsqueda. ¿Deseas agregar uno nuevo?
                    </p>
                    <Link
                        href="/proveedores/nuevo"
                        className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                        Registrar proveedor
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {proveedores.map((proveedor) => (
                        <motion.div
                            key={proveedor.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                        <Building2 className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {proveedor.nombre}
                                        </h3>
                                        <p className="text-sm text-slate-500">CUIT: {proveedor.cuit}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${proveedor.estado === 'activo'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {proveedor.estado.toUpperCase()}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    {proveedor.telefono}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{proveedor.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    {proveedor.tiempo_entrega_promedio_dias} días entrega
                                </div>
                                <div className="flex items-center gap-1 text-sm text-amber-500 font-medium">
                                    <Star className="w-4 h-4 fill-amber-500" />
                                    {proveedor.calificacion} / 5.0
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {proveedor.productos_suministrados?.slice(0, 3).map((prod, idx) => (
                                        <span key={idx} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100">
                                            {prod}
                                        </span>
                                    ))}
                                    {(proveedor.productos_suministrados?.length || 0) > 3 && (
                                        <span className="text-xs text-slate-400 px-1 py-1">
                                            +{(proveedor.productos_suministrados?.length || 0) - 3} más
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/proveedores/${proveedor.id}`}
                                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                                        title="Ver detalles"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        href={`/proveedores/${proveedor.id}/editar`}
                                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                                        title="Editar"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

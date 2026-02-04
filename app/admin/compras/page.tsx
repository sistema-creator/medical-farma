'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package,
    ShoppingCart,
    Truck,
    AlertCircle,
    BarChart3,
    TrendingDown,
    Plus,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    ChevronRight,
    Briefcase,
    Zap,
    Download
} from 'lucide-react'
import ModuleTemplate from '@/components/ModuleTemplate'
import { useAuth } from '@/contexts/AuthContext'
import {
    obtenerMetricasGerencia,
    obtenerProductosParaReponer,
    GerenciaMetricas
} from '@/lib/compras'
import { Producto } from '@/lib/productos'
import { Proveedor, obtenerProveedores } from '@/lib/proveedores'

export default function ComprasPage() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [metricas, setMetricas] = useState<GerenciaMetricas | null>(null)
    const [reponer, setReponer] = useState<Producto[]>([])
    const [proveedores, setProveedores] = useState<Proveedor[]>([])
    const [filtroStock, setFiltroStock] = useState('')

    const cargarDatos = useCallback(async () => {
        setLoading(true)
        const [resMetricas, resReponer, resProv] = await Promise.all([
            obtenerMetricasGerencia(),
            obtenerProductosParaReponer(),
            obtenerProveedores()
        ])

        if (resMetricas.success && resMetricas.data) setMetricas(resMetricas.data)
        if (resReponer.success && resReponer.data) setReponer(resReponer.data)
        setProveedores(resProv || [])
        setLoading(false)
    }, [])

    useEffect(() => {
        cargarDatos()
    }, [cargarDatos])

    const filteredReponer = reponer.filter(p =>
        p.nombre.toLowerCase().includes(filtroStock.toLowerCase())
    )

    return (
        <ModuleTemplate
            title="Gerencia y Compras"
            subtitle="Gestión estratégica de inventario, abastecimiento y proveedores"
            icon={Package}
            color="bg-teal-600"
        >
            <div className="w-full space-y-8">
                {/* Dashboard Gerencial - Premium KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <KPI
                        title="Valorización de Stock"
                        value={`$${(metricas?.valorTotalInventario || 0).toLocaleString()}`}
                        description="Valor total a precio costo"
                        icon={BarChart3}
                        color="text-teal-600"
                        bgColor="bg-teal-50"
                    />
                    <KPI
                        title="Quiebre de Stock"
                        value={metricas?.productosStockBajo || 0}
                        description="Productos bajo stock mínimo"
                        icon={AlertCircle}
                        color="text-red-600"
                        bgColor="bg-red-50"
                        urgent={metricas?.productosStockBajo ? metricas.productosStockBajo > 0 : false}
                    />
                    <KPI
                        title="Proveedores Activos"
                        value={metricas?.proveedoresActivos || 0}
                        description="Panel de abastecimiento"
                        icon={Briefcase}
                        color="text-blue-600"
                        bgColor="bg-blue-50"
                    />
                    <KPI
                        title="Órdenes de Compra"
                        value={metricas?.ordenesCompraPendientes || 0}
                        description="En proceso de recepción"
                        icon={Truck}
                        color="text-orange-600"
                        bgColor="bg-orange-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                    {/* Lista de Reposición Urgente */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Plan de Reposición Inmediata</h3>
                                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Sugerencias basadas en stock mínimo</p>
                                </div>
                                <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all shadow-sm">
                                    <Download size={18} />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-6 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Filtrar productos..."
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all font-medium text-sm"
                                        value={filtroStock}
                                        onChange={(e) => setFiltroStock(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-3">
                                    {loading ? (
                                        <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Analizando Inventario...</div>
                                    ) : filteredReponer.length === 0 ? (
                                        <div className="py-12 bg-gray-50 rounded-3xl text-center">
                                            <Package size={32} className="mx-auto text-gray-200 mb-3" />
                                            <p className="text-sm font-bold text-gray-400">Todo el stock está dentro de los parámetros seguros.</p>
                                        </div>
                                    ) : (
                                        filteredReponer.map((prod, idx) => (
                                            <motion.div
                                                key={prod.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="flex items-center justify-between p-5 bg-gray-50 hover:bg-white hover:shadow-md border border-transparent hover:border-teal-100 rounded-3xl transition-all group"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-teal-600 font-black">
                                                        {prod.stock_actual}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900">{prod.nombre}</h4>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">MIN: {prod.stock_minimo} • {prod.categoria || 'SIN CATEGORIA'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex flex-col items-end mr-4">
                                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Faltante</span>
                                                        <span className="text-lg font-black text-red-500">-{prod.stock_minimo - prod.stock_actual}</span>
                                                    </div>
                                                    <button className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-teal-600 transition-all shadow-lg">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar de Proveedores y Acciones */}
                    <div className="space-y-6">
                        <div className="bg-gray-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                                <Zap size={80} />
                            </div>
                            <h3 className="text-xl font-black mb-4 tracking-tighter uppercase relative z-10">Acción Estratégica</h3>
                            <p className="text-gray-400 text-sm font-medium mb-6 relative z-10 leading-relaxed">Genera órdenes de compra masivas basadas en las faltantes de stock automáticas.</p>
                            <button className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-[2rem] font-bold text-xs uppercase tracking-widest transition-all shadow-xl relative z-10">
                                CREAR ÓRDEN MAESTRA
                            </button>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8">
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-6">Proveedores Top</h3>
                            <div className="space-y-4">
                                {proveedores.slice(0, 5).map(prov => (
                                    <div key={prov.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-teal-600">
                                                {prov.nombre[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm">{prov.nombre}</span>
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">⭐ {prov.calificacion}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300" />
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-100 text-gray-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:border-teal-200 hover:text-teal-600 transition-all">
                                VER TODOS LOS PROVEEDORES
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ModuleTemplate>
    )
}

function KPI({ title, value, description, icon: Icon, color, bgColor, urgent }: any) {
    return (
        <div className={`${bgColor} p-8 rounded-[2.5rem] border border-gray-100 relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 text-left group`}>
            {urgent && <div className="absolute top-0 right-0 w-2 h-full bg-red-600 animate-pulse" />}
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-white ${color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${color} mb-1 opacity-70`}>{title}</span>
                    <h4 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h4>
                </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{description}</p>
        </div>
    )
}

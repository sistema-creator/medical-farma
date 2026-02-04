'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CreditCard,
    FileText,
    Clock,
    AlertTriangle,
    CheckCircle2,
    DollarSign,
    Search,
    Filter,
    ArrowRight,
    Calendar,
    Save,
    X,
    MoreHorizontal,
    TrendingUp
} from 'lucide-react'
import ModuleTemplate from '@/components/ModuleTemplate'
import { useAuth } from '@/contexts/AuthContext'
import {
    obtenerMetricasFacturacion,
    obtenerPedidosParaFacturar,
    marcarComoFacturado,
    FacturacionMetricas
} from '@/lib/facturacion'

export default function FacturacionPage() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [metricas, setMetricas] = useState<FacturacionMetricas | null>(null)
    const [pedidosPendientes, setPedidosPendientes] = useState<any[]>([])
    const [filtro, setFiltro] = useState('')
    const [modalFactura, setModalFactura] = useState<any>(null)
    const [nroFactura, setNroFactura] = useState('')
    const [now, setNow] = useState(new Date())

    const cargarDatos = useCallback(async () => {
        setLoading(true)
        // Intentar procesar alertas de auditoría antes de cargar métricas
        import('@/lib/facturacion').then(m => m.procesarAlertasAuditoria())

        const [resMetricas, resPedidos] = await Promise.all([
            obtenerMetricasFacturacion(),
            obtenerPedidosParaFacturar()
        ])
        if (resMetricas.success && resMetricas.data) setMetricas(resMetricas.data)
        if (resPedidos.success) setPedidosPendientes(resPedidos.data)
        setLoading(false)
    }, [])

    useEffect(() => {
        cargarDatos()
        const timer = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(timer)
    }, [cargarDatos])

    const handleFacturar = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!modalFactura || !nroFactura) return

        const res = await marcarComoFacturado(modalFactura.id, nroFactura)
        if (res.success) {
            setModalFactura(null)
            setNroFactura('')
            cargarDatos()
        }
    }

    const filtered = pedidosPendientes.filter(p =>
        p.numero_pedido.toLowerCase().includes(filtro.toLowerCase()) ||
        p.usuarios?.nombre_completo.toLowerCase().includes(filtro.toLowerCase())
    )

    return (
        <ModuleTemplate
            title="Facturación y Cobros"
            subtitle="Gestión de comprobantes, pagos pendientes y conciliaciones"
            icon={CreditCard}
            color="bg-purple-600"
        >
            <div className="w-full space-y-8">
                {/* KPIs Premium */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <KPI
                        title="Pendientes Facturar"
                        value={metricas?.pendientesFacturar || 0}
                        icon={FileText}
                        color="text-purple-600"
                        bgColor="bg-purple-50"
                    />
                    <KPI
                        title="Vencidos (>2hs)"
                        value={metricas?.vencidos || 0}
                        icon={AlertTriangle}
                        color="text-red-600"
                        bgColor="bg-red-50"
                        urgent={metricas?.vencidos ? metricas.vencidos > 0 : false}
                    />
                    <KPI
                        title="Cobranzas Hoy"
                        value={metricas?.cobrosHoy || 0}
                        icon={CheckCircle2}
                        color="text-emerald-600"
                        bgColor="bg-emerald-50"
                    />
                    <KPI
                        title="Total Mes (Facturado)"
                        value={`$${(metricas?.totalMes || 0).toLocaleString()}`}
                        icon={TrendingUp}
                        color="text-blue-600"
                        bgColor="bg-blue-50"
                    />
                </div>

                {/* Filtros y Búsqueda */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por N° pedido o cliente..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={cargarDatos}
                            className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all"
                            title="Recargar datos"
                            aria-label="Recargar datos"
                        >
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* Lista de Pedidos para Facturar */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden text-left">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Pedidos Pendientes de Facturación</h3>
                        <span className="px-4 py-1.5 bg-purple-100 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                            ALERTA 2HS ACTIVADA
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Pedido / Cliente</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Monto</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Limite Facturación</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Tiempo Restante</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-400">Sincronizando con administración...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-400 italic">No hay pedidos pendientes de facturar.</td></tr>
                                ) : (
                                    filtered.map(pedido => {
                                        const { diff, urgent, expired } = calcularTiempo(pedido.deadline_facturacion, now)
                                        return (
                                            <tr key={pedido.id} className="group hover:bg-purple-50/30 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-lg font-black text-gray-900">#{pedido.numero_pedido}</span>
                                                        <span className="text-sm font-bold text-gray-500">{pedido.usuarios?.nombre_completo}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-lg font-black text-gray-900">${pedido.total?.toLocaleString()}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center text-gray-500 font-bold">
                                                        <Clock size={14} className="mr-2 text-gray-400" />
                                                        {pedido.deadline_facturacion ? new Date(pedido.deadline_facturacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={`inline-flex items-center px-4 py-2 rounded-2xl font-black text-sm shadow-sm ${expired ? 'bg-red-600 text-white animate-bounce' :
                                                        urgent ? 'bg-orange-100 text-orange-600 animate-pulse' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {expired ? 'EXCEDIDO / AVISO AUDITORIA' : diff}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button
                                                        onClick={() => setModalFactura(pedido)}
                                                        className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-600 transition-all shadow-md flex items-center float-right"
                                                        title={`Facturar pedido #${pedido.numero_pedido}`}
                                                        aria-label={`Facturar pedido #${pedido.numero_pedido}`}
                                                    >
                                                        <DollarSign size={14} className="mr-2" />
                                                        FACTURAR
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Facturación */}
            <AnimatePresence>
                {modalFactura && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalFactura(null)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative overflow-hidden text-left"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl">
                                        <FileText size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">GENERAR FACTURA</h2>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Pedido #{modalFactura.numero_pedido}</p>
                                    </div>
                                </div>
                                <button onClick={() => setModalFactura(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleFacturar} className="p-10 space-y-8">
                                <div className="space-y-4">
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</span>
                                            <span className="text-sm font-black text-gray-900">{modalFactura.usuarios?.nombre_completo}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total a Facturar</span>
                                            <span className="text-xl font-black text-purple-600">${modalFactura.total?.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Número de Factura (Punto de Venta + Nro)</label>
                                        <input
                                            autoFocus
                                            required
                                            placeholder="Ej: 0001-00001234"
                                            value={nroFactura}
                                            onChange={(e) => setNroFactura(e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 font-black text-lg"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-purple-600 transition-all shadow-xl flex items-center justify-center space-x-3"
                                >
                                    <Save size={20} />
                                    <span>Registrar y Notificar</span>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ModuleTemplate>
    )
}

function KPI({ title, value, icon: Icon, color, bgColor, urgent }: any) {
    return (
        <div className={`${bgColor} p-6 rounded-[2rem] border border-gray-100 relative overflow-hidden transition-all hover:shadow-lg text-left`}>
            {urgent && <div className="absolute top-0 right-0 w-2 h-full bg-red-600 animate-pulse" />}
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white ${color} shadow-sm`}>
                    <Icon size={20} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${color} text-right`}>{title}</span>
            </div>
            <h4 className="text-3xl font-black text-gray-900">{value}</h4>
        </div>
    )
}

function calcularTiempo(deadlineStr: string | null, now: Date) {
    if (!deadlineStr) return { diff: 'N/A', urgent: false, expired: false }

    const deadline = new Date(deadlineStr)
    const diffMs = deadline.getTime() - now.getTime()

    if (diffMs < 0) return { diff: 'EXCEDIDO', urgent: true, expired: true }

    const mins = Math.floor(diffMs / 60000)
    const secs = Math.floor((diffMs % 60000) / 1000)

    const formatted = `${mins}m ${secs}s`
    return {
        diff: formatted,
        urgent: mins < 30, // Alerta naranja si quedan menos de 30 mins
        expired: false
    }
}

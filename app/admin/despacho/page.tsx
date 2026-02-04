'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
    Truck,
    Package,
    Clock,
    CheckCircle2,
    Search,
    Filter,
    MoreHorizontal,
    FileText,
    Upload,
    Calendar,
    Save,
    X,
    MapPin,
    AlertTriangle,
    PlusCircle
} from 'lucide-react'
import ModuleTemplate from '@/components/ModuleTemplate'
import { useAuth } from '@/contexts/AuthContext'
import {
    obtenerMetricasLogistica,
    obtenerDespachosActivos,
    actualizarEstadoDespacho,
    subirComprobanteDespacho
} from '@/lib/logistica'
import { obtenerTransportistas } from '@/lib/transportistas'

export default function DespachoPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [metricas, setMetricas] = useState<any>(null)
    const [despachos, setDespachos] = useState<any[]>([])
    const [listaTransportistas, setListaTransportistas] = useState<any[]>([])
    const [filtro, setFiltro] = useState('')
    const [despachoSeleccionado, setDespachoSeleccionado] = useState<any>(null)
    const [subiendo, setSubiendo] = useState(false)

    useEffect(() => {
        cargarDatos()
    }, [])

    async function cargarDatos() {
        setLoading(true)
        const [resMetricas, resDespachos, resTrans] = await Promise.all([
            obtenerMetricasLogistica(),
            obtenerDespachosActivos(),
            obtenerTransportistas()
        ])
        if (resMetricas.success) setMetricas(resMetricas.data)
        if (resDespachos.success) setDespachos(resDespachos.data)
        if (resTrans.success) setListaTransportistas(resTrans.data)
        setLoading(false)
    }

    const handleActualizarEstado = async (id: string, nuevoEstado: string) => {
        const res = await actualizarEstadoDespacho(id, { estado_despacho: nuevoEstado as any })
        if (res.success) {
            cargarDatos()
            if (nuevoEstado === 'entregado') {
                alert('Orden cerrada. Se ha notificado a Facturación (Plazo: 2hs).')
            }
        }
    }

    const handleGuardarDetalles = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const datos = {
            notas: formData.get('notas') as string,
            transportista: formData.get('transportista') as string,
            num_guia: formData.get('num_guia') as string,
            fecha_retiro: formData.get('fecha_retiro') as string,
            fecha_entrega_estimada: formData.get('fecha_entrega_estimada') as string,
        }

        const res = await actualizarEstadoDespacho(despachoSeleccionado.id, datos)
        if (res.success) {
            setDespachoSeleccionado(null)
            cargarDatos()
        }
    }

    const handleSubirArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !despachoSeleccionado) return

        setSubiendo(true)
        const res = await subirComprobanteDespacho(file, despachoSeleccionado.id)
        setSubiendo(false)
        if (res.success) {
            setDespachoSeleccionado({ ...despachoSeleccionado, comprobante_url: res.url })
            cargarDatos()
        }
    }

    const filteredDespachos = despachos.filter(d =>
        d.pedidos?.numero_pedido.toLowerCase().includes(filtro.toLowerCase()) ||
        d.pedidos?.usuarios?.nombre_completo.toLowerCase().includes(filtro.toLowerCase()) ||
        d.transportista?.toLowerCase().includes(filtro.toLowerCase())
    )

    return (
        <ModuleTemplate
            title="Logística y Despacho"
            subtitle="Seguimiento de entregas, repartos y estados de envío"
            icon={Truck}
            color="bg-orange-600"
        >
            <div className="w-full space-y-8">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <KPI
                        title="En Preparación"
                        value={metricas?.enPreparacion || 0}
                        icon={Package}
                        color="text-blue-600"
                        bgColor="bg-blue-50"
                    />
                    <KPI
                        title="Listos p/ Despacho"
                        value={metricas?.listosParaDespacho || 0}
                        icon={PlusCircle}
                        color="text-indigo-600"
                        bgColor="bg-indigo-50"
                    />
                    <KPI
                        title="En Ruta / Tránsito"
                        value={metricas?.enRuta || 0}
                        icon={Truck}
                        color="text-orange-600"
                        bgColor="bg-orange-50"
                    />
                    <KPI
                        title="Entregados Hoy"
                        value={metricas?.entregadosHoy || 0}
                        icon={CheckCircle2}
                        color="text-emerald-600"
                        bgColor="bg-emerald-50"
                    />
                </div>

                {/* Filtros y Búsqueda */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-left">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por N° pedido, cliente o transporte..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => router.push('/admin/despacho/transportistas')}
                        className="flex items-center space-x-2 bg-gray-900 px-6 py-3 rounded-2xl text-white font-bold hover:bg-gray-800 transition-all shadow-md group"
                    >
                        <Truck size={18} className="group-hover:translate-x-1 transition-transform" />
                        <span>FICHAS TRANSPORTISTAS</span>
                    </button>
                    <button
                        onClick={cargarDatos}
                        className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all"
                        title="Refrescar datos"
                    >
                        <Filter size={20} />
                    </button>
                </div>

                {/* Tabla de Despachos */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden text-left">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">PEDIDO</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">CLIENTE / DESTINO</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">TRANSPORTE</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">ESTADO</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-400 animate-pulse">Cargando datos logísticos...</td></tr>
                                ) : filteredDespachos.length === 0 ? (
                                    <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-400 italic">No hay despachos activos para mostrar.</td></tr>
                                ) : (
                                    filteredDespachos.map(despacho => (
                                        <tr key={despacho.id} className="group hover:bg-orange-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black text-gray-900">#{despacho.pedidos?.numero_pedido}</span>
                                                    <span className="text-xs text-gray-400 font-bold">{new Date(despacho.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{despacho.pedidos?.usuarios?.nombre_completo}</span>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                        <MapPin size={12} className="mr-1 text-orange-400" />
                                                        {despacho.pedidos?.direcciones?.calle || 'Dirección no especificada'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {despacho.transportista ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-700">{despacho.transportista}</span>
                                                        <span className="text-[10px] text-gray-400 uppercase font-black">{despacho.num_guia || 'SIN GUÍA'}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-300 italic">Pendiente de asignación</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center">
                                                    <StatusBadge status={despacho.estado_despacho} />
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => setDespachoSeleccionado(despacho)}
                                                    className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-600 hover:border-orange-200 hover:shadow-lg transition-all"
                                                    title="Gestionar este despacho"
                                                    aria-label="Gestionar este despacho"
                                                >
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Gestión */}
            <AnimatePresence>
                {despachoSeleccionado && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDespachoSeleccionado(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Header Modal */}
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between text-left">
                                <div className="flex items-center space-x-4">
                                    <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
                                        <Truck size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">GESTIÓN DE DESPACHO</h2>
                                        <p className="text-sm text-gray-500 font-bold tracking-widest uppercase">Pedido #{despachoSeleccionado.pedidos?.numero_pedido}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDespachoSeleccionado(null)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                    title="Cerrar modal"
                                    aria-label="Cerrar"
                                >
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Contenido Modal */}
                            <div className="p-10 overflow-y-auto space-y-8 scrollbar-hide text-left">
                                <form onSubmit={handleGuardarDetalles} className="space-y-8">
                                    {/* Transportista y Guía */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="transportista" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Empresa de Transporte</label>
                                            <select
                                                id="transportista"
                                                name="transportista"
                                                title="Seleccionar transportista"
                                                defaultValue={despachoSeleccionado.transportista}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold"
                                            >
                                                <option value="">Seleccionar transporte...</option>
                                                {listaTransportistas.map(t => (
                                                    <option key={t.id} value={t.nombre}>{t.nombre} ({t.vehiculo_patente || 'Sin patente'})</option>
                                                ))}
                                                <option value="OTRO">OTRO (Manual...)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="num_guia" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Número de Guía / Tracking</label>
                                            <input
                                                id="num_guia"
                                                name="num_guia"
                                                title="Número de Guía o Tracking"
                                                defaultValue={despachoSeleccionado.num_guia}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold"
                                                placeholder="ST-000000000"
                                            />
                                        </div>
                                    </div>

                                    {/* Horarios */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center">
                                                <Clock size={12} className="mr-1" /> Hora Retiro por Depósito
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="fecha_retiro"
                                                required
                                                title="Hora de retiro por depósito"
                                                placeholder="Seleccionar fecha y hora"
                                                defaultValue={despachoSeleccionado.fecha_retiro?.slice(0, 16) || new Date().toISOString().slice(0, 16)}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center">
                                                <Calendar size={12} className="mr-1" /> Hora Entrega Estimada
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="fecha_entrega_estimada"
                                                required
                                                title="Hora estimada de entrega al cliente"
                                                placeholder="Seleccionar fecha y hora"
                                                defaultValue={despachoSeleccionado.fecha_entrega_estimada?.slice(0, 16) || new Date().toISOString().slice(0, 16)}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold"
                                            />
                                        </div>
                                    </div>

                                    {/* Notas */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Notas de Entrega / Observaciones</label>
                                        <textarea
                                            name="notas"
                                            defaultValue={despachoSeleccionado.notas}
                                            rows={3}
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold resize-none"
                                            placeholder="Ingresar notas, referencias del domicilio, etc..."
                                        />
                                    </div>

                                    {/* Adjunto de Comprobante Despacho */}
                                    <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-100 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm border border-orange-100">
                                                <Upload size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Comprobante Despacho</p>
                                                {despachoSeleccionado.comprobante_url ? (
                                                    <a href={despachoSeleccionado.comprobante_url} target="_blank" className="text-[10px] text-orange-600 font-black uppercase hover:underline">Ver Documento Actual</a>
                                                ) : (
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Botón para subir archivo</p>
                                                )}
                                            </div>
                                        </div>
                                        <label className="cursor-pointer px-6 py-2 bg-white text-orange-600 rounded-full text-xs font-black border border-orange-200 hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                                            {subiendo ? 'SUBIENDO...' : 'SUBIR COMPROBANTE'}
                                            <input type="file" className="hidden" onChange={handleSubirArchivo} />
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center space-x-3"
                                    >
                                        <Save size={20} />
                                        <span>Guardar Datos de Despacho</span>
                                    </button>
                                </form>

                                {/* Acciones de Ciclo de Vida */}
                                <div className="pt-10 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <LifecycleButton
                                        label="En Preparación"
                                        isActive={despachoSeleccionado.estado_despacho === 'preparacion'}
                                        onClick={() => handleActualizarEstado(despachoSeleccionado.id, 'preparacion')}
                                    />
                                    <LifecycleButton
                                        label="Listo p/ Despacho"
                                        isActive={despachoSeleccionado.estado_despacho === 'listo'}
                                        onClick={() => handleActualizarEstado(despachoSeleccionado.id, 'listo')}
                                    />
                                    <LifecycleButton
                                        label="En Tránsito"
                                        isActive={despachoSeleccionado.estado_despacho === 'despachado'}
                                        onClick={() => handleActualizarEstado(despachoSeleccionado.id, 'despachado')}
                                    />
                                    <button
                                        onClick={() => {
                                            if (confirm('¿Cerrar orden de entrega? Esto activará el envío automático de factura y el conteo de 2hs para auditoría.')) {
                                                handleActualizarEstado(despachoSeleccionado.id, 'entregado')
                                                setDespachoSeleccionado(null)
                                            }
                                        }}
                                        className="flex flex-col items-center justify-center p-4 rounded-3xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg col-span-full md:col-span-1 ring-4 ring-emerald-50"
                                    >
                                        <CheckCircle2 size={24} className="mb-1" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Cerrar Orden</span>
                                    </button>
                                </div>

                                {despachoSeleccionado.estado_despacho === 'error' && (
                                    <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center space-x-3 border border-red-100">
                                        <AlertTriangle size={20} />
                                        <span className="text-sm font-bold">Incidencia reportada en el despacho</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ModuleTemplate>
    )
}

function KPI({ title, value, icon: Icon, color, bgColor }: any) {
    return (
        <div className={`${bgColor} p-6 rounded-[2rem] border border-gray-100 text-left`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white ${color} shadow-sm`}>
                    <Icon size={20} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{title}</span>
            </div>
            <h4 className="text-3xl font-black text-gray-900">{value}</h4>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const config: any = {
        preparacion: { color: 'bg-blue-100 text-blue-600', label: 'PREPARANDO', icon: Package },
        listo: { color: 'bg-indigo-100 text-indigo-600', label: 'LISTO', icon: Clock },
        despachado: { color: 'bg-orange-100 text-orange-600', label: 'EN RUTA', icon: Truck },
        entregado: { color: 'bg-emerald-100 text-emerald-600', label: 'ENTREGADO', icon: CheckCircle2 },
        error: { color: 'bg-red-100 text-red-600', label: 'INCIDENCIA', icon: AlertTriangle }
    }
    const { color, label, icon: Icon } = config[status] || config.preparacion
    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black flex items-center ${color}`}>
            <Icon size={12} className="mr-2" />
            {label}
        </span>
    )
}

function LifecycleButton({ label, isActive, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all border-2 ${isActive
                ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-105'
                : 'bg-white text-gray-400 border-gray-50 hover:border-gray-200'
                }`}
        >
            <span className="text-[10px] font-bold uppercase tracking-tight text-center">{label}</span>
        </button>
    )
}

'use client'

import { useEffect, useState } from 'react'
import ModuleTemplate from '@/components/ModuleTemplate'
import { ShoppingCart, TrendingUp, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { obtenerMetricasVentas, obtenerPedidosVendedor, obtenerComisionesVendedor } from '@/lib/ventas'

export default function VentasPage() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [metricas, setMetricas] = useState<any>(null)
    const [pedidos, setPedidos] = useState<any[]>([])
    const [comisiones, setComisiones] = useState<any[]>([])

    useEffect(() => {
        async function cargarDatos() {
            if (!user) return

            setLoading(true)
            // Si es gerencia, no pasamos ID para ver todo. Si es vendedor, pasamos su ID.
            const vendedorId = user.tipo_usuario === 'vendedor' ? user.id : undefined

            const [resMetricas, resPedidos, resComisiones] = await Promise.all([
                obtenerMetricasVentas(vendedorId),
                obtenerPedidosVendedor(vendedorId),
                obtenerComisionesVendedor(vendedorId)
            ])

            if (resMetricas.success) setMetricas(resMetricas.data)
            if (resPedidos.success) setPedidos(resPedidos.data)
            if (resComisiones.success) setComisiones(resComisiones.data)

            setLoading(false)
        }
        cargarDatos()
    }, [user])

    return (
        <ModuleTemplate
            title="Gestión de Vendedores"
            subtitle="Control de pedidos, comisiones y rendimiento de ventas"
            icon={ShoppingCart}
            color="bg-blue-600"
        >
            <div className="w-full space-y-10">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2rem] text-left">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">VENTAS TOTALES</span>
                        </div>
                        <h4 className="text-3xl font-black text-gray-900">${metricas?.totalVentas?.toLocaleString('es-AR') || '0'}</h4>
                        <p className="text-sm text-gray-500 mt-1">Volumen total facturado</p>
                    </div>

                    <div className="bg-indigo-50/50 border border-indigo-100 p-8 rounded-[2rem] text-left">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                                <ShoppingCart size={24} />
                            </div>
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-100 px-3 py-1 rounded-full">PEDIDOS</span>
                        </div>
                        <h4 className="text-3xl font-black text-gray-900">{metricas?.cantidadPedidos || '0'}</h4>
                        <p className="text-sm text-gray-500 mt-1">Órdenes procesadas</p>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-[2rem] text-left">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200">
                                <DollarSign size={24} />
                            </div>
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">COMISIONES</span>
                        </div>
                        <h4 className="text-3xl font-black text-gray-900">${metricas?.comisionesPendientes?.toLocaleString('es-AR') || '0'}</h4>
                        <p className="text-sm text-gray-500 mt-1">Pendientes de liquidación</p>
                    </div>
                </div>

                {/* Pedidos Recientes */}
                <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Clock size={24} className="mr-3 text-blue-600" />
                        Pedidos Recientes
                    </h3>
                    <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
                        <table className="w-full text-left border-collapse bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">N° Pedido</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cliente</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">Cargando pedidos...</td>
                                    </tr>
                                ) : pedidos.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">No se encontraron pedidos.</td>
                                    </tr>
                                ) : (
                                    pedidos.map(pedido => (
                                        <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">{pedido.numero_pedido}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">{pedido.usuarios?.nombre_completo}</span>
                                                    <span className="text-xs text-gray-400">{pedido.usuarios?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${pedido.estado_pedido === 'entregado' ? 'bg-green-100 text-green-700' :
                                                        pedido.estado_pedido === 'cancelado' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {pedido.estado_pedido}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-gray-900">
                                                ${Number(pedido.total || 0).toLocaleString('es-AR')}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Comisiones */}
                <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <DollarSign size={24} className="mr-3 text-emerald-600" />
                        Estado de Comisiones
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            <div className="col-span-full py-8 text-center text-gray-400 italic">Cargando comisiones...</div>
                        ) : comisiones.length === 0 ? (
                            <div className="col-span-full py-8 text-center text-gray-400 italic">No hay historial de comisiones.</div>
                        ) : (
                            comisiones.map(com => (
                                <div key={com.id} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-2xl ${com.estado_comision === 'liquidado' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {com.estado_comision === 'liquidado' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Pedido {com.pedidos?.numero_pedido || 'N/A'}</p>
                                            <p className="text-xs text-gray-500">{new Date(com.created_at).toLocaleDateString('es-AR')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-gray-900">${Number(com.monto).toLocaleString('es-AR')}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${com.estado_comision === 'liquidado' ? 'text-green-600' : 'text-orange-600'}`}>
                                            {com.estado_comision}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </ModuleTemplate>
    )
}

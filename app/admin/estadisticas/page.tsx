'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { obtenerAuditLogs, AuditLog } from '@/lib/audit'
import { obtenerEstadisticasUsuarios } from '@/lib/usuarios'
import { motion } from 'framer-motion'
import { Download, Search, RefreshCw, Layers } from 'lucide-react'

export default function EstadisticasPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [statsUsuarios, setStatsUsuarios] = useState<any>(null)
    const [filtroModulo, setFiltroModulo] = useState('')

    useEffect(() => {
        cargarDatos()
    }, [])

    async function cargarDatos() {
        setLoading(true)
        try {
            const [resLogs, resStats] = await Promise.all([
                obtenerAuditLogs({ limit: 100 }),
                obtenerEstadisticasUsuarios()
            ])

            if (resLogs.success) {
                setLogs(resLogs.data || [])
            }
            if (resStats.success) {
                setStatsUsuarios(resStats.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const exportarCSV = () => {
        if (!logs.length) return

        const headers = ['Fecha', 'Usuario', 'Acción', 'Módulo', 'Detalles']
        const csvContent = [
            headers.join(','),
            ...logs.map(log => {
                const usuario = log.usuarios?.email || 'Desconocido'
                const detalles = JSON.stringify(log.detalles || {}).replace(/,/g, ';') // Simple escape
                return [
                    new Date(log.created_at).toLocaleString(),
                    usuario,
                    log.accion,
                    log.modulo,
                    detalles
                ].join(',')
            })
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `auditoria_medical_farma_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const filteredLogs = filtroModulo
        ? logs.filter(l => l.modulo.toLowerCase().includes(filtroModulo.toLowerCase()))
        : logs

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Estadísticas y Auditoría</h1>
                        <p className="text-gray-600">Monitoreo y control de seguridad del sistema</p>
                    </div>
                    <button
                        onClick={cargarDatos}
                        className="p-2 bg-white border rounded-full hover:bg-gray-50 shadow-sm"
                    >
                        <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Total Usuarios</h3>
                        <p className="text-3xl font-bold text-gray-900">{statsUsuarios?.total || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Acciones Registradas</h3>
                        <p className="text-3xl font-bold text-indigo-600">{logs.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Módulos Activos</h3>
                        <p className="text-3xl font-bold text-blue-600">
                            {new Set(logs.map(l => l.modulo)).size}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Usuarios Pendientes</h3>
                        <p className="text-3xl font-bold text-yellow-600">{statsUsuarios?.pendientes || 0}</p>
                    </div>
                </div>

                {/* Audit Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                            <Layers className="w-5 h-5 mr-2 text-gray-500" />
                            Registro de Auditoría (Últimos 100)
                        </h2>

                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Filtrar por módulo..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={filtroModulo}
                                    onChange={(e) => setFiltroModulo(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={exportarCSV}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exportar CSV
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha / Hora</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Módulo</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Cargando auditoría...
                                        </td>
                                    </tr>
                                ) : filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No hay registros encontrados.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <div className="flex flex-col">
                                                    <span>{log.usuarios?.nombre_completo || 'Sistema'}</span>
                                                    <span className="text-xs text-gray-500">{log.usuarios?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                                                    {log.modulo}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                                {log.accion}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={JSON.stringify(log.detalles)}>
                                                {JSON.stringify(log.detalles)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}

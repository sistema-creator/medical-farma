'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'
import {
    obtenerUsuarios,
    obtenerEstadisticasUsuarios,
    actualizarEstadoUsuario,
    actualizarTipoUsuario,
    obtenerPerfiles,
    obtenerTodosLosPermisos,
    obtenerPermisosUsuario,
    actualizarPermisosUsuario,
    type Usuario
} from '@/lib/usuarios'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, Check, X, Save, Lock, Users } from 'lucide-react'

export default function AdminUsuariosPage() {
    return (
        <ProtectedRoute>
            <AdminUsuariosContent />
        </ProtectedRoute>
    )
}

function AdminUsuariosContent() {
    const router = useRouter()
    const { user } = useAuth()
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [perfiles, setPerfiles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        total: 0,
        pendientes: 0,
        aprobados: 0,
        suspendidos: 0,
        rechazados: 0,
    })
    const [filtroEstado, setFiltroEstado] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('')
    const [busqueda, setBusqueda] = useState('')
    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    // Estado para permisos
    const [todosLosPermisos, setTodosLosPermisos] = useState<any[]>([])
    const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>([])
    const [loadingPermisos, setLoadingPermisos] = useState(false)

    // Verificar que el usuario sea gerencia (SuperUsuario)
    useEffect(() => {
        if (user && user.tipo_usuario !== 'gerencia') {
            alert('No tienes permisos para acceder a esta página')
            router.push('/dashboard')
        }
    }, [user, router])

    const cargarDatos = useCallback(async () => {
        setLoading(true)

        const [usuariosRes, statsRes, perfilesRes, permisosRes] = await Promise.all([
            obtenerUsuarios({
                estado: filtroEstado || undefined,
                tipo_usuario: filtroTipo || undefined,
                busqueda: busqueda || undefined,
            }),
            obtenerEstadisticasUsuarios(),
            obtenerPerfiles(),
            obtenerTodosLosPermisos()
        ])

        if (usuariosRes.success) {
            setUsuarios(usuariosRes.data)
        }

        if (statsRes.success && statsRes.data) {
            setStats(statsRes.data)
        }

        if (perfilesRes.success) {
            setPerfiles(perfilesRes.data)
        }

        if (permisosRes.success) {
            setTodosLosPermisos(permisosRes.data)
        }

        setLoading(false)
    }, [filtroEstado, filtroTipo, busqueda])

    const cargarPermisosUsuario = useCallback(async (usuarioId: string) => {
        setLoadingPermisos(true)
        const res = await obtenerPermisosUsuario(usuarioId)
        if (res.success) {
            const codigosAsignados = res.data
            const idsAsignados = todosLosPermisos
                .filter(p => codigosAsignados.includes(p.codigo))
                .map(p => p.id)
            setPermisosSeleccionados(idsAsignados)
        }
        setLoadingPermisos(false)
    }, [todosLosPermisos])

    // Cargar datos iniciales y al cambiar filtros
    useEffect(() => {
        cargarDatos()
    }, [cargarDatos])

    // Cargar permisos cuando se selecciona un usuario
    useEffect(() => {
        if (selectedUser && showModal) {
            cargarPermisosUsuario(selectedUser.id)
        }
    }, [selectedUser, showModal, cargarPermisosUsuario])

    async function handleCambiarEstado(usuario: Usuario, nuevoEstado: 'pendiente' | 'aprobado' | 'suspendido' | 'rechazado') {
        setActionLoading(true)
        const result = await actualizarEstadoUsuario(usuario.id, nuevoEstado)

        if (result.success) {
            await cargarDatos()
            setShowModal(false)
            setSelectedUser(null)
        } else {
            alert('Error al cambiar estado: ' + result.error)
        }
        setActionLoading(false)
    }

    async function handleCambiarTipo(usuario: Usuario, nuevoTipo: string) {
        setActionLoading(true)
        const result = await actualizarTipoUsuario(usuario.id, nuevoTipo)

        if (result.success) {
            await cargarDatos()
            // No cerramos el modal porque quizás quiera cambiar permisos
        } else {
            alert('Error al cambiar tipo: ' + result.error)
        }
        setActionLoading(false)
    }

    async function handleGuardarPermisos() {
        if (!selectedUser) return
        setActionLoading(true)
        const res = await actualizarPermisosUsuario(selectedUser.id, permisosSeleccionados)
        if (res.success) {
            alert('Permisos actualizados correctamente')
        } else {
            alert('Error al actualizar permisos: ' + res.error)
        }
        setActionLoading(false)
    }

    function togglePermiso(permisoId: string) {
        setPermisosSeleccionados(prev =>
            prev.includes(permisoId)
                ? prev.filter(id => id !== permisoId)
                : [...prev, permisoId]
        )
    }

    function getEstadoBadge(estado: string) {
        const badges = {
            pendiente: 'bg-yellow-100 text-yellow-700',
            aprobado: 'bg-green-100 text-green-700',
            suspendido: 'bg-red-100 text-red-700',
            rechazado: 'bg-gray-100 text-gray-700',
        }
        return badges[estado as keyof typeof badges] || 'bg-gray-100 text-gray-700'
    }

    function getTipoBadge(tipo: string) {
        const badges = {
            vendedor: 'bg-blue-100 text-blue-700',
            facturacion: 'bg-purple-100 text-purple-700',
            despacho: 'bg-orange-100 text-orange-700',
            compras: 'bg-teal-100 text-teal-700',
            gerencia: 'bg-indigo-100 text-indigo-700',
            cliente: 'bg-pink-100 text-pink-700',
        }
        return badges[tipo as keyof typeof badges] || 'bg-gray-100 text-gray-700'
    }

    // Agrupar permisos por módulo
    const permisosPorModulo = todosLosPermisos.reduce((acc: any, p: any) => {
        if (!acc[p.modulo]) acc[p.modulo] = []
        acc[p.modulo].push(p)
        return acc
    }, {})

    if (!user || user.tipo_usuario !== 'gerencia') {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.back()}
                                className="mr-4 text-gray-600 hover:text-gray-900"
                                aria-label="Volver"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                                <p className="text-gray-600 mt-1">Administrar usuarios del sistema</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <StatsCard title="Total" value={stats.total} color="blue" />
                    <StatsCard title="Pendientes" value={stats.pendientes} color="yellow" />
                    <StatsCard title="Aprobados" value={stats.aprobados} color="green" />
                    <StatsCard title="Suspendidos" value={stats.suspendidos} color="red" />
                    <StatsCard title="Rechazados" value={stats.rechazados} color="gray" />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Búsqueda */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Buscar por nombre o email..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                            <select
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Filtrar por estado"
                            >
                                <option value="">Todos</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="aprobado">Aprobado</option>
                                <option value="suspendido">Suspendido</option>
                                <option value="rechazado">Rechazado</option>
                            </select>
                        </div>

                        {/* Tipo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario</label>
                            <select
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Filtrar por tipo de usuario"
                            >
                                <option value="">Todos</option>
                                <option value="vendedor">Vendedor</option>
                                <option value="facturacion">Facturación</option>
                                <option value="despacho">Despacho</option>
                                <option value="compras">Compras</option>
                                <option value="gerencia">Gerencia</option>
                                <option value="cliente">Cliente</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : usuarios.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
                        <p className="text-gray-600">No se encontraron usuarios con los filtros seleccionados</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {usuario.nombre_completo.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{usuario.nombre_completo}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{usuario.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoBadge(usuario.tipo_usuario)}`}>
                                                {usuario.tipo_usuario}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoBadge(usuario.estado)}`}>
                                                {usuario.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(usuario.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(usuario)
                                                    setShowModal(true)
                                                }}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Gestionar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8 flex-shrink-0">
                            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestionar Usuario</h3>
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setSelectedUser(null)
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full"
                                aria-label="Cerrar modal"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow">
                            {/* User Info Header */}
                            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                        {selectedUser.nombre_completo.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-6">
                                        <h4 className="text-2xl font-bold text-gray-900">{selectedUser.nombre_completo}</h4>
                                        <p className="text-gray-500 font-medium">{selectedUser.email}</p>
                                        <div className="mt-2 flex space-x-2">
                                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${getTipoBadge(selectedUser.tipo_usuario)}`}>
                                                {selectedUser.tipo_usuario}
                                            </span>
                                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${getEstadoBadge(selectedUser.estado)}`}>
                                                {selectedUser.estado}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right text-sm text-gray-400">
                                    <p>Usuario ID: {selectedUser.id.substring(0, 8)}...</p>
                                    <p>Alta: {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column: State & Type */}
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <Check size={20} className="mr-2 text-green-500" />
                                            Estado de Cuenta
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { key: 'aprobado', label: 'Aprobar', color: 'bg-green-600 hover:bg-green-700', icon: '✓' },
                                                { key: 'pendiente', label: 'Pendiente', color: 'bg-yellow-500 hover:bg-yellow-600', icon: '⏳' },
                                                { key: 'suspendido', label: 'Suspender', color: 'bg-red-600 hover:bg-red-700', icon: '🚫' },
                                                { key: 'rechazado', label: 'Rechazar', color: 'bg-gray-600 hover:bg-gray-700', icon: '✗' }
                                            ].map((btn) => (
                                                <button
                                                    key={btn.key}
                                                    onClick={() => handleCambiarEstado(selectedUser, btn.key as any)}
                                                    disabled={actionLoading || selectedUser.estado === btn.key}
                                                    className={`px-4 py-3 text-white rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-30 ${btn.color}`}
                                                >
                                                    <span>{btn.icon}</span>
                                                    <span>{btn.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <Users size={20} className="mr-2 text-blue-500" />
                                            Rol de Sistema
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['vendedor', 'facturacion', 'despacho', 'compras', 'gerencia', 'cliente'].map((tipo) => (
                                                <button
                                                    key={tipo}
                                                    onClick={() => handleCambiarTipo(selectedUser, tipo)}
                                                    disabled={actionLoading}
                                                    className={`px-4 py-3 rounded-xl font-bold transition-all text-sm border-2 ${selectedUser.tipo_usuario === tipo
                                                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-inner'
                                                        : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Permissions */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-bold text-gray-900 flex items-center">
                                            <Lock size={20} className="mr-2 text-indigo-500" />
                                            Permisos de Módulo
                                        </h4>
                                        {selectedUser.tipo_usuario === 'gerencia' && (
                                            <div className="text-[10px] font-black bg-indigo-600 text-white px-2 py-1 rounded tracking-tighter uppercase">
                                                Acceso Total
                                            </div>
                                        )}
                                    </div>

                                    {selectedUser.tipo_usuario === 'gerencia' ? (
                                        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                            <p className="text-sm text-indigo-700 font-medium">
                                                Como <strong>Gerencia (SuperUsuario)</strong>, este usuario tiene acceso a todos los módulos sin restricciones. No se requiere asignar permisos específicos.
                                            </p>
                                        </div>
                                    ) : loadingPermisos ? (
                                        <div className="flex justify-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                                                {Object.keys(permisosPorModulo).map((modulo) => (
                                                    <div key={modulo} className="p-4">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">{modulo}</span>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {permisosPorModulo[modulo].map((p: any) => (
                                                                <label
                                                                    key={p.id}
                                                                    className={`flex items-center p-2.5 rounded-lg cursor-pointer transition-all border ${permisosSeleccionados.includes(p.id)
                                                                        ? 'bg-indigo-50 border-indigo-100'
                                                                        : 'bg-white border-transparent hover:bg-gray-50'
                                                                        }`}
                                                                >
                                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${permisosSeleccionados.includes(p.id)
                                                                        ? 'bg-indigo-600 border-indigo-600'
                                                                        : 'border-gray-200'
                                                                        }`}>
                                                                        {permisosSeleccionados.includes(p.id) && <Check size={14} className="text-white" />}
                                                                    </div>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="hidden"
                                                                        checked={permisosSeleccionados.includes(p.id)}
                                                                        onChange={() => togglePermiso(p.id)}
                                                                    />
                                                                    <div className="ml-3">
                                                                        <p className={`text-sm font-bold ${permisosSeleccionados.includes(p.id) ? 'text-indigo-900' : 'text-gray-700'}`}>
                                                                            {p.nombre}
                                                                        </p>
                                                                        <p className="text-[11px] text-gray-400 leading-tight">{p.descripcion}</p>
                                                                    </div>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={handleGuardarPermisos}
                                                disabled={actionLoading}
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                                            >
                                                <Save size={18} />
                                                <span>GUARDAR PERMISOS</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex-shrink-0">
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setSelectedUser(null)
                                }}
                                className="w-full px-4 py-4 border-2 border-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all uppercase tracking-widest text-xs"
                            >
                                Finalizar Gestión
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

function StatsCard({ title, value, color }: { title: string; value: number; color: string }) {
    const colorClasses = {
        blue: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        red: 'bg-red-50 text-red-600 border-red-100',
        gray: 'bg-gray-50 text-gray-600 border-gray-100',
    }

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`rounded-2xl shadow-sm border p-5 ${colorClasses[color as keyof typeof colorClasses]}`}
        >
            <p className="text-xs font-black uppercase tracking-widest opacity-60 text-center">{title}</p>
            <p className="text-4xl font-black mt-2 text-center">{value}</p>
        </motion.div>
    )
}

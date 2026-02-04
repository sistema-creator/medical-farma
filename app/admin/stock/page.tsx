'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    Plus,
    Download,
    Upload,
    Search,
    Filter,
    Edit2,
    Eye,
    AlertTriangle,
    Package,
    ArrowUpDown,
    CheckCircle2,
    XCircle
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import { Producto, obtenerProductos, eliminarProducto } from '@/lib/productos'

export default function StockManagementPage() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [sectorFilter, setSectorFilter] = useState('all')

    useEffect(() => {
        cargarProductos()
    }, [])

    async function cargarProductos() {
        setLoading(true)
        const res = await obtenerProductos()
        if (res.success) {
            setProductos(res.data)
        }
        setLoading(false)
    }

    const filteredProductos = productos.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.descripcion_tecnica?.toLowerCase() || '').includes(searchTerm.toLowerCase())

        const matchesSector = sectorFilter === 'all' ||
            (p.sectores && p.sectores.includes(sectorFilter))

        return matchesSearch && matchesSector
    })

    const sectors = ['Farmacia', 'Hospitalario', 'Odontología', 'Veterinaria', 'Geriátrico']

    return (
        <AdminProtectedRoute>
            <div className="min-h-screen bg-gray-50 pt-20">
                <Header />

                <main className="container mx-auto px-4 py-8">
                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gestión Integral de Stock</h1>
                            <p className="text-gray-600">Administre el catálogo, precios y detalles técnicos de sus productos.</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link href="/admin/stock/nuevo" className="btn-primary flex items-center space-x-2">
                                <Plus size={20} />
                                <span>Nuevo Producto</span>
                            </Link>
                            <button
                                onClick={() => {/* TODO: n8n import flow */ }}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                            >
                                <Upload size={20} />
                                <span>Importar</span>
                            </button>
                            <button
                                onClick={() => {/* TODO: n8n export flow */ }}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                            >
                                <Download size={20} />
                                <span>Exportar</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm font-medium">Total Productos</span>
                                <Package className="text-blue-600" size={20} />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{productos.length}</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm font-medium">Stock Bajo</span>
                                <AlertTriangle className="text-amber-500" size={20} />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {productos.filter(p => p.stock_actual < p.stock_minimo).length}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm font-medium">Activos</span>
                                <CheckCircle2 className="text-green-600" size={20} />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {productos.filter(p => p.estado === 'activo').length}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm font-medium">Valor Inventario (Costo)</span>
                                <span className="text-gray-400">$</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {productos.reduce((sum, p) => sum + (p.precio_compra * p.stock_actual), 0).toLocaleString('es-AR')}
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                        <div className="flex-grow relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o descripción técnica..."
                                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="text-gray-400" size={20} />
                            <select
                                className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                value={sectorFilter}
                                onChange={(e) => setSectorFilter(e.target.value)}
                            >
                                <option value="all">Todos los Sectores</option>
                                {sectors.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Producto</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Sectores</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">Stock</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Precio Costo</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Precio Venta</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                                                    Cargando inventario...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredProductos.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                No se encontraron productos con los criterios seleccionados.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProductos.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        {p.imagen_url ? (
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                                                                <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                                <Package size={20} className="text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-bold text-gray-900">{p.nombre}</div>
                                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{p.marcas?.join(', ')}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {p.sectores?.map(s => (
                                                            <span key={s} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-bold">
                                                                {s}
                                                            </span>
                                                        )) || <span className="text-gray-400 text-xs">-</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${p.stock_actual < p.stock_minimo
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {p.stock_actual} / {p.stock_minimo}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-gray-600">
                                                    ${p.precio_compra?.toLocaleString('es-AR') || '0'}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-blue-700">
                                                    ${p.precio_venta_final?.toLocaleString('es-AR') || '0'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link href={`/productos/${p.id}/ficha`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Ver ficha técnica">
                                                            <Eye size={18} />
                                                        </Link>
                                                        <Link href={`/admin/stock/${p.id}/editar`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Editar">
                                                            <Edit2 size={18} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </AdminProtectedRoute>
    )
}

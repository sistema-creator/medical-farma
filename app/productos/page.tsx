'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'
import { obtenerProductos, obtenerCategorias, eliminarProducto, type Producto } from '@/lib/productos'
import { solicitarExportacionStock } from '@/lib/n8n'
import BulkImportModal from '@/components/BulkImportModal'
import { useAuth } from '@/contexts/AuthContext'

export default function ProductosPage() {
    return (
        <ProtectedRoute>
            <ProductosContent />
        </ProtectedRoute>
    )
}

function ProductosContent() {
    const router = useRouter()
    const { user } = useAuth()
    const [productos, setProductos] = useState<Producto[]>([])
    const [categorias, setCategorias] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [busqueda, setBusqueda] = useState('')
    const [categoriaFiltro, setCategoriaFiltro] = useState('')
    const [estadoFiltro, setEstadoFiltro] = useState<'activo' | 'inactivo' | ''>('')
    const [stockBajoFiltro, setStockBajoFiltro] = useState(false)
    const [vistaGrid, setVistaGrid] = useState(true)
    const [importModalOpen, setImportModalOpen] = useState(false)
    const [exporting, setExporting] = useState(false)

    useEffect(() => {
        cargarDatos()
    }, [busqueda, categoriaFiltro, estadoFiltro, stockBajoFiltro])

    async function cargarDatos() {
        setLoading(true)

        const [productosRes, categoriasRes] = await Promise.all([
            obtenerProductos({
                busqueda,
                categoria: categoriaFiltro || undefined,
                estado: estadoFiltro || undefined,
                stockBajo: stockBajoFiltro,
            }),
            obtenerCategorias(),
        ])

        if (productosRes.success) {
            setProductos(productosRes.data)
        }

        if (categoriasRes.success) {
            setCategorias(categoriasRes.data as string[])
        }

        setLoading(false)
    }

    async function handleExport() {
        setExporting(true)
        try {
            // Nota: solicitarExportacionStock debe estar correctamente importada de lib/productos (o lib/n8n si se movió)
            // Revisando lib/productos.ts no tiene solicitarExportacionStock, pero lib/n8n.ts si.
            // Voy a usar solicitarExportacionStock de lib/n8n.ts que es lo correcto según el plan.
            // Corregiré los imports en el próximo paso si es necesario, pero aquí asumo que la función existe o la traigo de n8n.
            // Como en el import anterior puse '@/lib/productos', debo corregirlo.

            // ERROR: En el replace anterior importé solicitarExportacionStock de lib/productos, pero está en lib/n8n.
            // Para evitar error, usaré la función correcta aquí y corregiré el import arriba.

            // ...espera, no puedo corregir el import en este mismo bloque tool call si son paralelos sin cuidado.
            // Asumiré que el import de arriba fallará si no está en lib/productos.
            // Verificando lib/productos.ts... NO TIENE solicitarExportacionStock.
            // lib/n8n.ts TIENE solicitarExportacionStock.
            // Por lo tanto, el import anterior fallará o necesitaré añadir un re-export en lib/productos o cambiar el import.
            // Lo mejor es cambiar el import en page.tsx.

            const result = await solicitarExportacionStock()
            if (result.success) {
                alert('Exportación solicitada. Recibirás el archivo por correo o n8n lo generará.')
            } else {
                alert('Error al solicitar exportación.')
            }
        } catch (error) {
            console.error(error)
            alert('Error al exportar.')
        } finally {
            setExporting(false)
        }
    }

    async function handleEliminar(id: string) {
        if (!confirm('¿Estás seguro de que deseas desactivar este producto?')) return

        const result = await eliminarProducto(id)
        if (result.success) {
            cargarDatos()
        } else {
            alert('Error al eliminar producto: ' + result.error)
        }
    }

    function getStockColor(producto: Producto) {
        if (producto.stock_actual === 0) return 'text-red-600 bg-red-50'
        if (producto.stock_actual < producto.stock_minimo) return 'text-yellow-600 bg-yellow-50'
        return 'text-green-600 bg-green-50'
    }

    function getStockIcon(producto: Producto) {
        if (producto.stock_actual === 0) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )
        }
        if (producto.stock_actual < producto.stock_minimo) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        }
        return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                            <p className="text-gray-600 mt-1">Gestión de inventario y catálogo</p>
                        </div>
                        <button
                            onClick={() => router.push('/productos/nuevo')}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nuevo Producto
                        </button>
                    </div>
                </div>
            </div>

            {/* Actions Toolbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setImportModalOpen(true)}
                        className="flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium shadow-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Importar CSV
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium shadow-sm"
                    >
                        {exporting ? (
                            <svg className="animate-spin w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        )}
                        Exportar CSV
                    </button>
                </div>
                <button
                    onClick={() => router.push('/productos/nuevo')}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Producto
                </button>
            </div>

            <BulkImportModal
                isOpen={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onSuccess={() => {
                    cargarDatos()
                    alert('Importación iniciada correctamente. Los productos aparecerán en breve.')
                }}
            />

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {/* Búsqueda */}
                        <div className="md:col-span-2">
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
                                    placeholder="Buscar por nombre o descripción..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                            <select
                                value={categoriaFiltro}
                                onChange={(e) => setCategoriaFiltro(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Todas</option>
                                {categorias.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                            <select
                                value={estadoFiltro}
                                onChange={(e) => setEstadoFiltro(e.target.value as any)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Todos</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={stockBajoFiltro}
                                    onChange={(e) => setStockBajoFiltro(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Solo stock bajo</span>
                            </label>
                            <span className="text-sm text-gray-500">
                                {productos.length} producto{productos.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setVistaGrid(true)}
                                className={`p-2 rounded-lg ${vistaGrid ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setVistaGrid(false)}
                                className={`p-2 rounded-lg ${!vistaGrid ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Grid/List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : productos.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-6">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
                        <p className="text-gray-600 mb-6">Comienza agregando tu primer producto al inventario</p>
                        <button
                            onClick={() => router.push('/productos/nuevo')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Agregar Producto
                        </button>
                    </div>
                ) : vistaGrid ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {productos.map((producto) => (
                            <motion.div
                                key={producto.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                            >
                                {/* Image */}
                                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    {producto.imagen_url ? (
                                        <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{producto.nombre}</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${producto.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {producto.estado}
                                        </span>
                                    </div>

                                    {producto.categoria && (
                                        <span className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full mb-3">
                                            {producto.categoria}
                                        </span>
                                    )}

                                    {/* Stock */}
                                    <div className={`flex items-center px-3 py-2 rounded-lg mb-3 ${getStockColor(producto)}`}>
                                        {getStockIcon(producto)}
                                        <span className="ml-2 text-sm font-medium">
                                            Stock: {producto.stock_actual} / Mín: {producto.stock_minimo}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Precio Unitario</p>
                                            <p className="text-xl font-bold text-gray-900">${producto.precio_unitario.toLocaleString()}</p>
                                        </div>
                                        {producto.precio_lote && (
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Precio Lote</p>
                                                <p className="text-lg font-semibold text-gray-900">${producto.precio_lote.toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => router.push(`/productos/${producto.id}`)}
                                            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                        >
                                            Ver Detalles
                                        </button>
                                        <button
                                            onClick={() => router.push(`/productos/${producto.id}/editar`)}
                                            className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(producto.id)}
                                            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {productos.map((producto) => (
                                    <tr key={producto.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    {producto.imagen_url ? (
                                                        <img src={producto.imagen_url} alt={producto.nombre} className="h-10 w-10 rounded-lg object-cover" />
                                                    ) : (
                                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                                                    {producto.medidas && (
                                                        <div className="text-sm text-gray-500">{producto.medidas}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {producto.categoria ? (
                                                <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                                                    {producto.categoria}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStockColor(producto)}`}>
                                                {getStockIcon(producto)}
                                                <span className="ml-1">{producto.stock_actual}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${producto.precio_unitario.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${producto.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {producto.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => router.push(`/productos/${producto.id}`)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Ver
                                            </button>
                                            <button
                                                onClick={() => router.push(`/productos/${producto.id}/editar`)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(producto.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

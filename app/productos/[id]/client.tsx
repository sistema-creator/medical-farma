'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'
import { obtenerProductoPorId, actualizarStock, type Producto } from '@/lib/productos'

export default function ProductoDetalleClient() {
    return (
        <ProtectedRoute>
            <ProductoDetalleContent />
        </ProtectedRoute>
    )
}

function ProductoDetalleContent() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [producto, setProducto] = useState<Producto | null>(null)
    const [loading, setLoading] = useState(true)
    const [showStockModal, setShowStockModal] = useState(false)
    const [stockOperacion, setStockOperacion] = useState<'sumar' | 'restar' | 'establecer'>('sumar')
    const [stockCantidad, setStockCantidad] = useState(0)
    const [stockLoading, setStockLoading] = useState(false)

    useEffect(() => {
        cargarProducto()
    }, [id])

    async function cargarProducto() {
        setLoading(true)
        const result = await obtenerProductoPorId(id)
        if (result.success && result.data) {
            setProducto(result.data)
        } else {
            alert('Error al cargar producto')
            router.push('/productos')
        }
        setLoading(false)
    }

    async function handleActualizarStock() {
        if (!producto) return

        setStockLoading(true)
        const result = await actualizarStock(producto.id, stockCantidad, stockOperacion)

        if (result.success) {
            setShowStockModal(false)
            setStockCantidad(0)
            cargarProducto()
        } else {
            alert('Error al actualizar stock: ' + result.error)
        }
        setStockLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!producto) {
        return null
    }

    const stockColor = producto.stock_actual === 0
        ? 'text-red-600 bg-red-50'
        : producto.stock_actual < producto.stock_minimo
            ? 'text-yellow-600 bg-yellow-50'
            : 'text-green-600 bg-green-50'

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
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>
                                <p className="text-gray-600 mt-1">Detalles del producto</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowStockModal(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Ajustar Stock
                            </button>
                            <button
                                onClick={() => router.push(`/productos/${producto.id}/editar`)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                {producto.imagen_url ? (
                                    <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <div className="text-center">
                                        <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <p className="text-gray-500">Sin imagen</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción Técnica</h2>
                            {producto.descripcion_tecnica ? (
                                <p className="text-gray-700 whitespace-pre-wrap">{producto.descripcion_tecnica}</p>
                            ) : (
                                <p className="text-gray-400 italic">Sin descripción</p>
                            )}
                        </motion.div>

                        {/* Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Adicional</h2>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {producto.medidas && (
                                    <>
                                        <dt className="text-sm font-medium text-gray-500">Medidas / Presentación</dt>
                                        <dd className="text-sm text-gray-900">{producto.medidas}</dd>
                                    </>
                                )}
                                {producto.marcas && producto.marcas.length > 0 && (
                                    <>
                                        <dt className="text-sm font-medium text-gray-500">Marcas</dt>
                                        <dd className="text-sm text-gray-900">
                                            <div className="flex flex-wrap gap-2">
                                                {producto.marcas.map((marca, i) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                        {marca}
                                                    </span>
                                                ))}
                                            </div>
                                        </dd>
                                    </>
                                )}
                                {producto.ubicacion_almacen && (
                                    <>
                                        <dt className="text-sm font-medium text-gray-500">Ubicación en Almacén</dt>
                                        <dd className="text-sm text-gray-900">{producto.ubicacion_almacen}</dd>
                                    </>
                                )}
                                <dt className="text-sm font-medium text-gray-500">Fecha de Creación</dt>
                                <dd className="text-sm text-gray-900">{new Date(producto.created_at).toLocaleDateString()}</dd>
                                <dt className="text-sm font-medium text-gray-500">Última Actualización</dt>
                                <dd className="text-sm text-gray-900">{new Date(producto.updated_at).toLocaleDateString()}</dd>
                            </dl>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado</h3>
                            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${producto.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {producto.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            </span>
                        </motion.div>

                        {/* Category */}
                        {producto.categoria && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categoría</h3>
                                <span className="inline-block px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full">
                                    {producto.categoria}
                                </span>
                            </motion.div>
                        )}

                        {/* Stock */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventario</h3>
                            <div className="space-y-4">
                                <div className={`p-4 rounded-lg ${stockColor}`}>
                                    <p className="text-sm font-medium mb-1">Stock Actual</p>
                                    <p className="text-3xl font-bold">{producto.stock_actual}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Stock Mínimo</p>
                                    <p className="text-2xl font-semibold text-gray-900">{producto.stock_minimo}</p>
                                </div>
                                {producto.stock_actual < producto.stock_minimo && (
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <p className="text-sm text-yellow-800">Stock por debajo del mínimo</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Prices */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Precios</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Precio Unitario</p>
                                    <p className="text-2xl font-bold text-gray-900">${producto.precio_unitario.toLocaleString()}</p>
                                </div>
                                {producto.precio_lote && (
                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Precio por Lote</p>
                                        <p className="text-2xl font-bold text-gray-900">${producto.precio_lote.toLocaleString()}</p>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-1">Valor Total en Stock</p>
                                    <p className="text-xl font-semibold text-blue-600">
                                        ${(producto.stock_actual * producto.precio_unitario).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stock Modal */}
            {showStockModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Ajustar Stock</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Operación</label>
                                <select
                                    value={stockOperacion}
                                    onChange={(e) => setStockOperacion(e.target.value as any)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="sumar">Sumar (Ingreso)</option>
                                    <option value="restar">Restar (Egreso)</option>
                                    <option value="establecer">Establecer (Ajuste)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                                <input
                                    type="number"
                                    value={stockCantidad}
                                    onChange={(e) => setStockCantidad(parseInt(e.target.value) || 0)}
                                    min="0"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Stock actual:</strong> {producto.stock_actual}
                                    <br />
                                    <strong>Nuevo stock:</strong>{' '}
                                    {stockOperacion === 'sumar'
                                        ? producto.stock_actual + stockCantidad
                                        : stockOperacion === 'restar'
                                            ? Math.max(0, producto.stock_actual - stockCantidad)
                                            : stockCantidad}
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowStockModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleActualizarStock}
                                disabled={stockLoading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {stockLoading ? 'Guardando...' : 'Confirmar'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

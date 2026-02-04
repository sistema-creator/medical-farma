'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'
import { obtenerProductoPorId, actualizarProducto, type Producto } from '@/lib/productos'

export default function EditarProductoClient() {
    return (
        <ProtectedRoute>
            <EditarProductoContent />
        </ProtectedRoute>
    )
}

interface FormData {
    nombre: string
    marcas: string
    descripcion_tecnica: string
    medidas: string
    stock_actual: number
    stock_minimo: number
    precio_unitario: number
    precio_lote: number
    categoria: string
    ubicacion_almacen: string
    estado: 'activo' | 'inactivo'
}

function EditarProductoContent() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        marcas: '',
        descripcion_tecnica: '',
        medidas: '',
        stock_actual: 0,
        stock_minimo: 0,
        precio_unitario: 0,
        precio_lote: 0,
        categoria: '',
        ubicacion_almacen: '',
        estado: 'activo',
    })

    useEffect(() => {
        cargarProducto()
    }, [id])

    async function cargarProducto() {
        setLoading(true)
        const result = await obtenerProductoPorId(id)

        if (result.success && result.data) {
            const p = result.data
            setFormData({
                nombre: p.nombre,
                marcas: p.marcas?.join(', ') || '',
                descripcion_tecnica: p.descripcion_tecnica || '',
                medidas: p.medidas || '',
                stock_actual: p.stock_actual,
                stock_minimo: p.stock_minimo,
                precio_unitario: p.precio_unitario,
                precio_lote: p.precio_lote || 0,
                categoria: p.categoria || '',
                ubicacion_almacen: p.ubicacion_almacen || '',
                estado: p.estado,
            })
        } else {
            alert('Error al cargar producto')
            router.push('/productos')
        }
        setLoading(false)
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            const marcasArray = formData.marcas ? formData.marcas.split(',').map(m => m.trim()).filter(Boolean) : null

            const result = await actualizarProducto(id, {
                nombre: formData.nombre,
                marcas: marcasArray,
                descripcion_tecnica: formData.descripcion_tecnica || null,
                medidas: formData.medidas || null,
                stock_actual: formData.stock_actual,
                stock_minimo: formData.stock_minimo,
                precio_unitario: formData.precio_unitario,
                precio_lote: formData.precio_lote || null,
                categoria: formData.categoria || null,
                ubicacion_almacen: formData.ubicacion_almacen || null,
                estado: formData.estado,
            })

            if (result.success) {
                router.push(`/productos/${id}`)
            } else {
                setError(result.error || 'Error al actualizar producto')
            }
        } catch (err: any) {
            setError(err.message || 'Error inesperado')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                            <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
                            <p className="text-gray-600 mt-1">Modificar información del producto</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
                >
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                            <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Información Básica */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Producto *
                                    </label>
                                    <input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoría
                                    </label>
                                    <input
                                        id="categoria"
                                        name="categoria"
                                        type="text"
                                        value={formData.categoria}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="marcas" className="block text-sm font-medium text-gray-700 mb-2">
                                        Marcas (separadas por coma)
                                    </label>
                                    <input
                                        id="marcas"
                                        name="marcas"
                                        type="text"
                                        value={formData.marcas}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="descripcion_tecnica" className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción Técnica
                                    </label>
                                    <textarea
                                        id="descripcion_tecnica"
                                        name="descripcion_tecnica"
                                        value={formData.descripcion_tecnica}
                                        onChange={handleChange}
                                        rows={4}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="medidas" className="block text-sm font-medium text-gray-700 mb-2">
                                        Medidas / Presentación
                                    </label>
                                    <input
                                        id="medidas"
                                        name="medidas"
                                        type="text"
                                        value={formData.medidas}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="ubicacion_almacen" className="block text-sm font-medium text-gray-700 mb-2">
                                        Ubicación en Almacén
                                    </label>
                                    <input
                                        id="ubicacion_almacen"
                                        name="ubicacion_almacen"
                                        type="text"
                                        value={formData.ubicacion_almacen}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stock */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventario</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="stock_actual" className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Actual *
                                    </label>
                                    <input
                                        id="stock_actual"
                                        name="stock_actual"
                                        type="number"
                                        value={formData.stock_actual}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="stock_minimo" className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Mínimo *
                                    </label>
                                    <input
                                        id="stock_minimo"
                                        name="stock_minimo"
                                        type="number"
                                        value={formData.stock_minimo}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Precios */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Precios</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="precio_unitario" className="block text-sm font-medium text-gray-700 mb-2">
                                        Precio Unitario *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">$</span>
                                        </div>
                                        <input
                                            id="precio_unitario"
                                            name="precio_unitario"
                                            type="number"
                                            value={formData.precio_unitario}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="precio_lote" className="block text-sm font-medium text-gray-700 mb-2">
                                        Precio por Lote (opcional)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">$</span>
                                        </div>
                                        <input
                                            id="precio_lote"
                                            name="precio_lote"
                                            type="number"
                                            value={formData.precio_lote}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Estado */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado</h2>
                            <div>
                                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado del Producto
                                </label>
                                <select
                                    id="estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                                {saving ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </span>
                                ) : (
                                    'Guardar Cambios'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

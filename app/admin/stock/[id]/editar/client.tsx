'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import ProductForm from '@/components/Admin/ProductForm'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Producto, obtenerProductoPorId } from '@/lib/productos'

export default function EditProductClient() {
    const params = useParams()
    const [producto, setProducto] = useState<Producto | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            cargarProducto()
        }
    }, [params.id])

    async function cargarProducto() {
        const res = await obtenerProductoPorId(params.id as string)
        if (res.success) {
            setProducto(res.data)
        }
        setLoading(false)
    }

    return (
        <AdminProtectedRoute>
            <div className="min-h-screen bg-gray-50 pt-20">
                <Header />

                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-5xl mx-auto">
                        <Link
                            href="/admin/stock"
                            className="inline-flex items-center space-x-2 text-gray-500 hover:text-blue-600 font-medium mb-6 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Volver al Inventario</span>
                        </Link>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                                <p className="text-gray-500 font-medium">Cargando datos del producto...</p>
                            </div>
                        ) : producto ? (
                            <>
                                <div className="mb-8">
                                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Editar Producto</h1>
                                    <p className="text-gray-600 mt-2">Modifique los datos técnicos o actualice la estructura de precios.</p>
                                </div>
                                <ProductForm producto={producto} />
                            </>
                        ) : (
                            <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                                <p className="text-xl text-gray-600 mb-6">No se encontró el producto solicitado.</p>
                                <Link href="/admin/stock" className="btn-primary">Volver</Link>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </AdminProtectedRoute>
    )
}

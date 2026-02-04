'use client'

import Header from '@/components/Header'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import ProductForm from '@/components/Admin/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
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

                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Nuevo Producto</h1>
                            <p className="text-gray-600 mt-2">Complete todos los detalles técnicos y comerciales del nuevo artículo.</p>
                        </div>

                        <ProductForm />
                    </div>
                </main>
            </div>
        </AdminProtectedRoute>
    )
}

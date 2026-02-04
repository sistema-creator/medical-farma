'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Lock, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { crearPedido } from '@/lib/pedidos'
import { notificarNuevoPedido } from '@/lib/n8n'

export default function CarritoPage() {
    const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
    const { user, isAuthenticated } = useAuthStore()
    const router = useRouter()

    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null) // Guardará el número de pedido

    const total = getTotalPrice()
    const IVA = total * 0.21
    const totalConIVA = total + IVA

    const handleCheckout = async () => {
        if (!isAuthenticated || !user) {
            router.push('/login?redirect=/carrito')
            return
        }

        setIsCheckingOut(true)

        try {
            // 1. Guardar en Base de Datos (Supabase)
            const resultadoPedido = await crearPedido({
                cliente_id: user.id,
                productos: items,
                subtotal: total,
                total: totalConIVA
            })

            if (!resultadoPedido.success || !resultadoPedido.data) {
                throw new Error(resultadoPedido.error || 'Error al guardar el pedido')
            }

            const pedidoGuardado = resultadoPedido.data

            // 2. Avisar al Robot (n8n) -> Email Ventas / WhatsApp
            await notificarNuevoPedido({
                numero_pedido: pedidoGuardado.numero_pedido,
                cliente_id: user.id,
                total: totalConIVA,
                items: items,
                fecha: new Date().toISOString()
            })

            // 3. Éxito
            setOrderSuccess(pedidoGuardado.numero_pedido)
            clearCart()

        } catch (error: any) {
            console.error('Error en checkout:', error)
            alert(`Hubo un problema al procesar su pedido: ${error.message || error}`)
        } finally {
            setIsCheckingOut(false)
        }
    }

    if (orderSuccess) {
        return (
            <>
                <Header />
                <main className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-green-600" size={48} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h1>
                        <p className="text-xl text-medical-blue-600 font-bold mb-4">{orderSuccess}</p>
                        <p className="text-gray-600 mb-8">
                            Hemos enviado la confirmación a su correo electrónico.
                            Un representante se pondrá en contacto a la brevedad.
                        </p>
                        <div className="space-y-3">
                            <Link href="/catalogo" className="btn-primary w-full block">
                                Volver al Catálogo
                            </Link>
                            <Link href="/cuenta" className="btn-secondary w-full block">
                                Ver Mis Pedidos
                            </Link>
                        </div>
                    </motion.div>
                </main>
                <Footer />
            </>
        )
    }

    if (items.length === 0) {
        return (
            <>
                <Header />
                <main className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="text-gray-400" size={40} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Su carrito está vacío</h1>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Parece que aún no ha agregado productos a su pedido.
                            Explore nuestro catálogo para encontrar lo que necesita.
                        </p>
                        <Link href="/catalogo" className="btn-primary inline-flex items-center space-x-2">
                            <ArrowLeft size={18} />
                            <span>Volver al Catálogo</span>
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                            <ShoppingBag className="mr-3 text-medical-blue-600" />
                            Carrito de Compras
                        </h1>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Lista de Productos */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {/* Placeholder imagen */}
                                            <ShoppingBag className="text-gray-400" size={24} />
                                        </div>

                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.brand} | {item.category}</p>
                                            <div className="mt-1 font-semibold text-medical-blue-600">
                                                ${item.price.toLocaleString('es-AR')}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <div className="text-right min-w-[100px]">
                                            <p className="font-bold text-gray-900">
                                                ${(item.price * item.quantity).toLocaleString('es-AR')}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}

                                <div className="flex justify-between items-center pt-4">
                                    <Link href="/catalogo" className="text-medical-blue-600 font-medium hover:underline flex items-center">
                                        <ArrowLeft size={16} className="mr-2" /> Continuar Comprando
                                    </Link>
                                    <button
                                        onClick={clearCart}
                                        className="text-red-600 text-sm hover:underline"
                                    >
                                        Vaciar Carrito
                                    </button>
                                </div>
                            </div>

                            {/* Resumen de Compra */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                                    <h2 className="text-lg font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span>${total.toLocaleString('es-AR')}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>IVA (21%)</span>
                                            <span>${IVA.toLocaleString('es-AR')}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-gray-900">
                                            <span>Total</span>
                                            <span>${totalConIVA.toLocaleString('es-AR')}</span>
                                        </div>
                                    </div>

                                    <button
                                        className="w-full btn-primary py-3 flex items-center justify-center space-x-2 shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                        onClick={handleCheckout}
                                        disabled={isCheckingOut}
                                    >
                                        {isCheckingOut ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                <span>Procesando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Confirmar Pedido</span>
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                        <Lock size={12} />
                                        <span>Compra protegida y segura</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    )
}

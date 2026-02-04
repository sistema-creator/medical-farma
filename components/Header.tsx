'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Menu, X, User, ShoppingCart, LogIn } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const { user, isAuthenticated } = useAuthStore()
    const { getTotalItems } = useCartStore()
    const cartItemsCount = getTotalItems()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 min-w-fit">
                        {/* Logo Image or Placeholder */}
                        <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                                src="/logo.png"
                                alt="Medical Farma Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-xl font-bold text-medical-gray-900 leading-tight">Medical Farma</h1>
                            <p className="text-xs text-medical-gray-600">Desde 1978</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        <Link href="/" className="text-medical-gray-700 hover:text-medical-blue-600 font-medium transition-colors">
                            Inicio
                        </Link>
                        <Link href="/nosotros" className="text-medical-gray-700 hover:text-medical-blue-600 font-medium transition-colors">
                            Nosotros
                        </Link>
                        <Link href="/catalogo" className="text-medical-gray-700 hover:text-medical-blue-600 font-medium transition-colors">
                            Catálogo
                        </Link>
                        <Link href="/marcas" className="text-medical-gray-700 hover:text-medical-blue-600 font-medium transition-colors">
                            Marcas
                        </Link>
                        <Link href="/contacto" className="text-medical-gray-700 hover:text-medical-blue-600 font-medium transition-colors">
                            Contacto
                        </Link>
                        {isMounted && isAuthenticated && ['admin', 'gerencia', 'compras'].includes(user?.role || '') && (
                            <Link href="/admin/stock" className="text-medical-blue-600 hover:text-medical-blue-700 font-bold transition-colors">
                                Gestión de Stock
                            </Link>
                        )}
                    </nav>

                    {/* Auth & Cart */}
                    <div className="flex items-center space-x-4">
                        {isMounted && isAuthenticated ? (
                            <>
                                <Link href="/cuenta" className="hidden md:flex items-center space-x-2 text-medical-gray-700 hover:text-medical-blue-600">
                                    <User size={20} />
                                    <span className="font-medium">{user?.name}</span>
                                </Link>
                                <Link href="/carrito" className="relative p-2 hover:bg-medical-gray-100 rounded-lg transition-colors">
                                    <ShoppingCart size={24} className="text-medical-gray-700" />
                                    {cartItemsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-medical-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </Link>
                            </>
                        ) : isMounted ? (
                            <Link href="/login" className="btn-primary flex items-center space-x-2">
                                <LogIn size={20} />
                                <span>Ingresar</span>
                            </Link>
                        ) : null}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 hover:bg-medical-gray-100 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:hidden py-4 border-t border-medical-gray-200"
                    >
                        <nav className="flex flex-col space-y-4">
                            <Link href="/" className="text-medical-gray-700 hover:text-medical-blue-600 font-medium">
                                Inicio
                            </Link>
                            <Link href="/nosotros" className="text-medical-gray-700 hover:text-medical-blue-600 font-medium">
                                Nosotros
                            </Link>
                            <Link href="/catalogo" className="text-medical-gray-700 hover:text-medical-blue-600 font-medium">
                                Catálogo
                            </Link>
                            <Link href="/marcas" className="text-medical-gray-700 hover:text-medical-blue-600 font-medium">
                                Marcas
                            </Link>
                            <Link href="/contacto" className="text-medical-gray-700 hover:text-medical-blue-600 font-medium">
                                Contacto
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </div>
        </header>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Lock, ShoppingCart, FileText } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Productos de ejemplo
const allProducts = [
    // Productos para Hospitales (Alta Complejidad)
    { id: 1, name: 'Catéter Venoso Central', category: 'Cirugía', price: 45000, forRole: ['hospital'], brand: 'Arrow' },
    { id: 2, name: 'Prótesis de Cadera Cementada', category: 'Cirugía', price: 320000, forRole: ['hospital'], brand: 'Microport' },
    { id: 3, name: 'Kit de Drenaje Torácico', category: 'Alta Complejidad', price: 28000, forRole: ['hospital'], brand: 'Portex' },
    { id: 4, name: 'Catéter Ureteral', category: 'Alta Complejidad', price: 18000, forRole: ['hospital'], brand: 'Coloplast' },
    { id: 5, name: 'Stent Coronario', category: 'Cirugía', price: 125000, forRole: ['hospital'], brand: 'Terumo' },

    // Productos para Farmacias (Descartables/Venta Libre)
    { id: 6, name: 'Guantes de Látex (Caja x100)', category: 'Descartables', price: 8500, forRole: ['hospital', 'farmacia'], brand: 'Silmag' },
    { id: 7, name: 'Gasas Estériles 10x10 (Pack x50)', category: 'Descartables', price: 4200, forRole: ['hospital', 'farmacia'], brand: 'ADYC' },
    { id: 8, name: 'Alcohol en Gel 500ml', category: 'Descartables', price: 2800, forRole: ['hospital', 'farmacia'], brand: '3M' },
    { id: 9, name: 'Curitas Adhesivas (Caja x100)', category: 'Descartables', price: 3500, forRole: ['hospital', 'farmacia'], brand: '3M' },
    { id: 10, name: 'Jeringas Descartables 5ml (Pack x100)', category: 'Descartables', price: 6200, forRole: ['hospital', 'farmacia'], brand: 'Silmag' },
]

export default function CatalogoPage() {
    const router = useRouter()
    const { user, isAuthenticated } = useAuthStore()
    const { addItem } = useCartStore()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [filteredProducts, setFilteredProducts] = useState(allProducts)

    useEffect(() => {
        let products = allProducts

        // Filtrar por rol del usuario
        if (isAuthenticated && user) {
            products = products.filter(p => p.forRole.includes(user.role))
        } else {
            // Si no está autenticado, no mostrar ningún producto
            products = []
        }

        // Filtrar por búsqueda
        if (searchTerm) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filtrar por categoría
        if (selectedCategory !== 'all') {
            products = products.filter(p => p.category === selectedCategory)
        }

        setFilteredProducts(products)
    }, [searchTerm, selectedCategory, user, isAuthenticated])

    const handleAddToCart = (product: any) => {
        addItem({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            brand: product.brand,
            category: product.category
        })
    }

    // Si no está autenticado, mostrar mensaje de acceso restringido
    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <main className="min-h-screen pt-20 gradient-bg flex items-center justify-center py-12">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="card text-center">
                                <div className="w-20 h-20 bg-medical-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Lock className="text-medical-blue-600" size={48} />
                                </div>
                                <h1 className="text-3xl font-bold text-medical-gray-900 mb-4">
                                    Portal Exclusivo para Instituciones de Salud y Farmacias
                                </h1>
                                <p className="text-xl text-medical-gray-600 mb-8">
                                    Para visualizar condiciones comerciales, precios y realizar pedidos,
                                    por favor inicie sesión o solicite su alta institucional.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/login" className="btn-primary">
                                        Iniciar Sesión
                                    </Link>
                                    <Link href="/registro" className="btn-secondary">
                                        Solicitar Apertura de Cuenta
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    const categories = ['all', ...Array.from(new Set(filteredProducts.map(p => p.category)))]

    return (
        <>
            <Header />
            <main className="min-h-screen pt-20 bg-medical-gray-50">
                <div className="container mx-auto px-4 py-12">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-medical-gray-900 mb-4">
                            Catálogo de Productos
                        </h1>
                        <div className="bg-medical-blue-50 border border-medical-blue-200 rounded-lg p-4">
                            <p className="text-medical-gray-700">
                                <strong className="font-semibold">Perfil:</strong> {user?.role === 'hospital' ? 'Hospital / Institución' : 'Farmacia'} |
                                <strong className="ml-2 font-semibold">Acceso:</strong> {user?.role === 'hospital' ? 'Catálogo Completo (Alta Complejidad + Descartables)' : 'Descartables y Venta Libre'}
                            </p>
                        </div>
                    </motion.div>

                    {/* Filters */}
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-medical-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar productos..."
                                className="w-full pl-11 pr-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-medical-gray-400" size={20} />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all appearance-none"
                            >
                                <option value="all">Todas las Categorías</option>
                                {categories.filter(c => c !== 'all').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-xl text-medical-gray-600">
                                No se encontraron productos que coincidan con su búsqueda.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="card hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="text-xs font-semibold text-medical-blue-600 bg-medical-blue-50 px-3 py-1 rounded-full">
                                            {product.category}
                                        </span>
                                        <span className="text-xs text-medical-gray-500">{product.brand}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-medical-gray-900 mb-3 min-h-[56px]">
                                        {product.name}
                                    </h3>

                                    <div className="mb-4">
                                        <p className="text-3xl font-bold text-medical-blue-600">
                                            ${product.price.toLocaleString('es-AR')}
                                        </p>
                                        <p className="text-sm text-medical-gray-500">+ IVA</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="btn-primary flex-1 flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                                        >
                                            <ShoppingCart size={18} />
                                            <span>Agregar</span>
                                        </button>
                                        {user?.role === 'hospital' && product.forRole.includes('hospital') && (
                                            <button className="btn-secondary flex items-center justify-center px-4" title="Ver ficha técnica">
                                                <FileText size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {user?.role === 'hospital' && product.forRole.includes('hospital') && (
                                        <p className="text-xs text-medical-gray-500 mt-3 text-center">
                                            Solicitar cotización por volumen
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    FileText,
    ExternalLink,
    CheckCircle,
    Package,
    ShieldCheck,
    Truck,
    Download,
    ArrowLeft,
    Tag,
    Info,
    ChevronRight
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Producto, obtenerProductoPorId } from '@/lib/productos'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductFichaClient() {
    const params = useParams()
    const router = useRouter()
    const [producto, setProducto] = useState<Producto | null>(null)
    const [activeImage, setActiveImage] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            cargarProducto()
        }
    }, [params.id])

    async function cargarProducto() {
        const res = await obtenerProductoPorId(params.id as string)
        if (res.success && res.data) {
            setProducto(res.data)
            setActiveImage(res.data.imagen_url || res.data.imagenes_ilustrativas?.[0] || '')
        }
        setLoading(false)
    }

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue-600"></div>
        </div>
    )

    if (!producto) return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
                <button onClick={() => router.back()} className="btn-primary">Volver</button>
            </div>
        </div>
    )

    const hasExtraImages = producto.imagenes_ilustrativas && producto.imagenes_ilustrativas.length > 0
    const allImages = [producto.imagen_url, ...(producto.imagenes_ilustrativas || [])].filter(Boolean) as string[]

    return (
        <ProtectedRoute>
            <Header />
            <main className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    {/* Breadcrumbs & Navigation */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                        <button onClick={() => router.back()} className="hover:text-medical-blue-600 flex items-center">
                            <ArrowLeft size={16} className="mr-1" /> Catálogo
                        </button>
                        <ChevronRight size={14} />
                        <span className="font-semibold text-gray-900 truncate">{producto.nombre}</span>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Visual Section */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="aspect-square bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex items-center justify-center p-8"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        src={activeImage}
                                        alt={producto.nombre}
                                        className="w-full h-full object-contain"
                                    />
                                </AnimatePresence>
                            </motion.div>

                            <div className="grid grid-cols-4 gap-4">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-medical-blue-600 shadow-md transform scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="space-y-8">
                            <div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {producto.sectores?.map(s => (
                                        <span key={s} className="px-3 py-1 bg-medical-blue-50 text-medical-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                            {s}
                                        </span>
                                    ))}
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider flex items-center">
                                        <Tag size={12} className="mr-1" /> {producto.categoria}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">{producto.nombre}</h1>
                                <div className="flex items-center space-x-4 text-gray-500 font-medium">
                                    <span className="flex items-center"><Package size={18} className="mr-1" /> {producto.marcas?.join(', ')}</span>
                                    {producto.medidas && <span className="flex items-center border-l border-gray-300 pl-4">{producto.medidas}</span>}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <Info className="text-medical-blue-600 mr-2" size={20} />
                                    Especificaciones Técnicas
                                </h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {producto.descripcion_tecnica || 'No hay descripción técnica detallada disponible para este producto.'}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Resources: PDFs */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                        <FileText className="text-medical-blue-600 mr-2" size={18} />
                                        Documentación
                                    </h3>
                                    {producto.documentos_pdf && producto.documentos_pdf.length > 0 ? (
                                        <ul className="space-y-3">
                                            {producto.documentos_pdf.map((pdf, i) => (
                                                <li key={i}>
                                                    <a
                                                        href={pdf}
                                                        target="_blank"
                                                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group"
                                                    >
                                                        <Download size={14} className="mr-2 group-hover:translate-y-0.5 transition-transform" />
                                                        Manual de Usuario / Ficha PDF
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No hay documentos adjuntos.</p>
                                    )}
                                </div>

                                {/* Resources: Links */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                        <ExternalLink className="text-medical-blue-600 mr-2" size={18} />
                                        Enlaces Sugeridos
                                    </h3>
                                    {producto.enlaces_relacionados && producto.enlaces_relacionados.length > 0 ? (
                                        <ul className="space-y-3">
                                            {producto.enlaces_relacionados.map((link, i) => (
                                                <li key={i}>
                                                    <a
                                                        href={link}
                                                        target="_blank"
                                                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                                    >
                                                        <ExternalLink size={14} className="mr-2" />
                                                        Ver sitio del fabricante / Video
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No hay enlaces relacionados.</p>
                                    )}
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-8">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Certificación ANMAT</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                                        <Truck size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Logística Trazable</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-2">
                                        <CheckCircle size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Garantía Oficial</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </ProtectedRoute>
    )
}

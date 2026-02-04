'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Brands from '@/components/Brands'
import { motion } from 'framer-motion'

export default function MarcasPage() {
    return (
        <main className="min-h-screen pt-20">
            <Header />

            {/* Page Header */}
            <section className="bg-medical-blue-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        Nuestras Marcas
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-2xl mx-auto"
                    >
                        Representamos a los fabricantes líderes mundiales en tecnología médica.
                    </motion.p>
                </div>
            </section>

            <Brands />

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold text-medical-gray-900 mb-6">¿Buscas un producto específico?</h3>
                    <p className="text-medical-gray-600 mb-8 max-w-2xl mx-auto">
                        Nuestro catálogo incluye miles de productos de estas y otras marcas prestigiosas.
                        Contacta con nuestro equipo para recibir asesoramiento personalizado.
                    </p>
                    <a href="/contacto" className="btn-primary inline-flex items-center">
                        Contactar Asesor
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    )
}

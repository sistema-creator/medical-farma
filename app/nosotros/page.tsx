'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import History from '@/components/History'
import Essence from '@/components/Essence'
import { motion } from 'framer-motion'

export default function NosotrosPage() {
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
                        Nosotros
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-2xl mx-auto"
                    >
                        De la visión pionera de David Vallaro a la conducción de German y sus hijos: un legado familiar que trasciende el tiempo, tejiendo confianza y crecimiento en cada etapa.
                    </motion.p>
                </div>
            </section>

            <History />
            <Essence />

            <Footer />
        </main>
    )
}

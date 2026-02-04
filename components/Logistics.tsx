'use client'

import { motion } from 'framer-motion'
import { MapPin, Truck, Clock } from 'lucide-react'

export default function Logistics() {
    return (
        <section className="py-4 medical-gradient">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-center gap-8 text-white"
                >
                    <div className="flex items-center space-x-3">
                        <MapPin size={28} className="flex-shrink-0" />
                        <div>
                            <p className="font-bold text-lg">Centro de Distribución Nacional</p>
                            <p className="text-sm text-medical-blue-100">Záccaro 1892, Paraná, Entre Ríos</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-white/30"></div>

                    <div className="flex items-center space-x-3">
                        <Truck size={28} className="flex-shrink-0" />
                        <div>
                            <p className="font-bold text-lg">Despachos Diarios</p>
                            <p className="text-sm text-medical-blue-100">Cobertura en toda Argentina</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-white/30"></div>

                    <div className="flex items-center space-x-3">
                        <Clock size={28} className="flex-shrink-0" />
                        <div>
                            <p className="font-bold text-lg">Atención Personalizada</p>
                            <p className="text-sm text-medical-blue-100">Lun a Vie 8:00 - 18:00 hs</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

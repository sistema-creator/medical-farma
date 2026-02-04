'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const brands = [
    { name: 'Silmag', logo: '/brands/silmag.png' },
    { name: 'Coloplast', logo: '/brands/coloplast.png' },
    { name: 'Arrow', logo: '/brands/arrow.png' },
    { name: 'Portex', logo: '/brands/portex.png' },
    { name: 'Argon', logo: '/brands/argon.png' },
    { name: 'ADYC', logo: '/brands/adyc.png' },
    { name: 'Minicomb', logo: '/brands/minicomb.png' },
    { name: '3M', logo: '/brands/3m.png' },
    { name: 'Gastrotex', logo: '/brands/gastrotex.png' },
    { name: 'Microport', logo: '/brands/microport.png' },
    { name: 'Terumo', logo: '/brands/terumo.png' },
]

export default function Brands() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">Nuestras Marcas</h2>
                    <p className="section-subtitle">
                        Representantes oficiales de las marcas líderes en insumos médicos
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8"
                >
                    {brands.map((brand, index) => (
                        <motion.div
                            key={brand.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="card flex items-center justify-center p-6 hover:shadow-2xl transition-all group"
                        >
                            <div className="w-full h-20 bg-medical-gray-100 rounded-lg flex items-center justify-center group-hover:bg-medical-blue-50 transition-colors">
                                <span className="text-2xl font-bold text-medical-gray-400 group-hover:text-medical-blue-600 transition-colors">
                                    {brand.name}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <div className="inline-block card bg-gradient-to-r from-medical-blue-50 to-medical-blue-100 border-2 border-medical-blue-200">
                        <p className="text-lg text-medical-gray-700">
                            <span className="font-bold text-medical-blue-700">Alianzas Estratégicas:</span> Trabajamos
                            directamente con los fabricantes para garantizar autenticidad, disponibilidad y los mejores precios
                            para nuestros clientes institucionales.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

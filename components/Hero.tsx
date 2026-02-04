'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Truck, Award } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/hero-background.png)' }}
            ></div>

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/65 to-white/50"></div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-medical-blue-50 opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-medical-blue-100 opacity-15 blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block bg-medical-blue-100 text-medical-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            🏥 Portal B2B Exclusivo para Instituciones
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-medical-gray-900 mb-6 leading-tight">
                            Medical Farma
                        </h1>

                        <p className="text-2xl md:text-3xl text-medical-blue-600 font-semibold mb-4">
                            Compromiso con la Salud y la Vida
                        </p>

                        <p className="text-lg md:text-xl text-medical-gray-700 font-medium mb-8 leading-relaxed">
                            Empresa familiar líder en distribución de insumos médicos y farmacéuticos con alcance nacional
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link href="/registro" className="btn-primary flex items-center justify-center space-x-2">
                                <span>Solicitar Apertura de Cuenta</span>
                                <ArrowRight size={20} />
                            </Link>
                            <Link href="/catalogo" className="btn-secondary flex items-center justify-center">
                                Ver Catálogo
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-medical-blue-600 mb-1">45+</div>
                                <div className="text-sm text-medical-gray-600">Años de Experiencia</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-medical-blue-600 mb-1">1000+</div>
                                <div className="text-sm text-medical-gray-600">Clientes Activos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-medical-blue-600 mb-1">24/7</div>
                                <div className="text-sm text-medical-gray-600">Disponibilidad</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Image/Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="card hover:scale-105 transition-transform">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-medical-blue-100 rounded-lg">
                                    <Shield className="text-medical-blue-600" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-medical-gray-900 mb-2">
                                        Calidad Certificada
                                    </h3>
                                    <p className="text-medical-gray-600">
                                        Todos nuestros productos cuentan con certificación ANMAT y trazabilidad completa.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card hover:scale-105 transition-transform">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-medical-blue-100 rounded-lg">
                                    <Truck className="text-medical-blue-600" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-medical-gray-900 mb-2">
                                        Logística Nacional
                                    </h3>
                                    <p className="text-medical-gray-600">
                                        Despachos diarios a todo el país desde nuestro centro en Paraná, Entre Ríos.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card hover:scale-105 transition-transform">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-medical-blue-100 rounded-lg">
                                    <Award className="text-medical-blue-600" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-medical-gray-900 mb-2">
                                        Marcas Premium
                                    </h3>
                                    <p className="text-medical-gray-600">
                                        Representantes oficiales de Silmag, Coloplast, 3M, Arrow y más.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

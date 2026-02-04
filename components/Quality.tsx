'use client'

import { motion } from 'framer-motion'
import { Shield, FileCheck, Microscope, TrendingUp } from 'lucide-react'

export default function Quality() {
    return (
        <section className="py-20 gradient-bg">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">Calidad y Trazabilidad</h2>
                    <p className="section-subtitle">
                        Garantía de origen y certificación en cada producto
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="card text-center"
                    >
                        <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="text-white" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-medical-gray-900 mb-3">Certificación ANMAT</h3>
                        <p className="text-medical-gray-600">
                            Todos nuestros productos cuentan con aprobación de la Administración Nacional de
                            Medicamentos, Alimentos y Tecnología Médica.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="card text-center"
                    >
                        <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileCheck className="text-white" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-medical-gray-900 mb-3">Trazabilidad Completa</h3>
                        <p className="text-medical-gray-600">
                            Cada lote incluye documentación que certifica su origen, fecha de fabricación y
                            cadena de custodia hasta su entrega.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="card text-center"
                    >
                        <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                            <Microscope className="text-white" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-medical-gray-900 mb-3">Control de Calidad</h3>
                        <p className="text-medical-gray-600">
                            Verificamos cada ingreso de mercadería para asegurar que cumpla con los estándares
                            internacionales más exigentes.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="card text-center"
                    >
                        <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="text-white" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-medical-gray-900 mb-3">Mejora Continua</h3>
                        <p className="text-medical-gray-600">
                            Actualizamos constantemente nuestros procesos para incorporar las mejores prácticas
                            del sector farmacéutico.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="card bg-white/90 backdrop-blur-sm border-2 border-medical-blue-200">
                        <h3 className="text-2xl font-bold text-medical-gray-900 mb-4 text-center">
                            Compromiso con la Excelencia
                        </h3>
                        <p className="text-lg text-medical-gray-700 leading-relaxed text-center mb-6">
                            En Medical Farma entendemos que trabajamos con productos que impactan directamente en la salud
                            de las personas. Por eso, cada insumo que distribuimos pasa por rigurosos controles de calidad
                            y cuenta con la documentación completa que certifica su autenticidad y seguridad.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                            <div className="bg-medical-blue-50 rounded-lg p-4">
                                <p className="text-3xl font-bold text-medical-blue-600 mb-1">100%</p>
                                <p className="text-sm text-medical-gray-700">Productos Certificados</p>
                            </div>
                            <div className="bg-medical-blue-50 rounded-lg p-4">
                                <p className="text-3xl font-bold text-medical-blue-600 mb-1">ISO</p>
                                <p className="text-sm text-medical-gray-700">Normas Internacionales</p>
                            </div>
                            <div className="bg-medical-blue-50 rounded-lg p-4">
                                <p className="text-3xl font-bold text-medical-blue-600 mb-1">24h</p>
                                <p className="text-sm text-medical-gray-700">Respuesta a Consultas</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

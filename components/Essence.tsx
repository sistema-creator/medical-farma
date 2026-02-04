'use client'

import { motion } from 'framer-motion'
import { Heart, Handshake, Building2, Users2 } from 'lucide-react'

export default function Essence() {
    return (
        <section className="py-20 gradient-bg">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">Nuestra Esencia</h2>
                    <p className="section-subtitle">
                        Grandes en escala, familiares en el trato
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="card bg-white/80 backdrop-blur-sm"
                    >
                        <p className="text-xl text-medical-gray-700 leading-relaxed text-center">
                            A pesar de ser una empresa de <span className="font-bold text-medical-blue-600">gran escala</span> con
                            presencia en todo el país y un equipo de profesionales altamente capacitados,
                            <span className="font-bold text-medical-blue-600"> Medical Farma mantiene su esencia familiar</span>.
                            Cada cliente es tratado con la atención personalizada y el compromiso que nos caracteriza desde 1978.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="card text-center hover:scale-105 transition-transform"
                    >
                        <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="text-white" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-medical-gray-900 mb-3">Valores Fundacionales</h3>
                        <p className="text-medical-gray-600">
                            Mantenemos intactos los principios de honestidad, compromiso y calidad que David Vallaro
                            estableció hace más de 40 años.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="card text-center hover:scale-105 transition-transform"
                    >
                        <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                            <Handshake className="text-white" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-medical-gray-900 mb-3">Trato Personalizado</h3>
                        <p className="text-medical-gray-600">
                            Cada institución recibe atención dedicada. Conocemos sus necesidades y trabajamos
                            como verdaderos socios estratégicos.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="card text-center hover:scale-105 transition-transform"
                    >
                        <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 className="text-white" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-medical-gray-900 mb-3">Escala Nacional</h3>
                        <p className="text-medical-gray-600">
                            Nuestra infraestructura y red logística nos permiten atender grandes volúmenes
                            con la eficiencia que las instituciones requieren.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="card text-center hover:scale-105 transition-transform"
                    >
                        <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users2 className="text-white" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-medical-gray-900 mb-3">Gestión Familiar</h3>
                        <p className="text-medical-gray-600">
                            Bajo el liderazgo de Germán Vallaro, continuamos el legado familiar con visión
                            moderna pero sin perder nuestra calidez humana.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

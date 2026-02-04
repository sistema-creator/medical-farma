'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, TrendingUp } from 'lucide-react'

export default function History() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">Nuestra Historia</h2>
                    <p className="section-subtitle">
                        Más de cuatro décadas de compromiso con la salud argentina
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Narrative History */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <p className="text-lg text-medical-gray-700 leading-relaxed">
                            Todo comenzó con David Vallaro, quien fundó la organización llevando su propio apellido,
                            consolidándose rápidamente como referente por su profundo conocimiento del mercado y su
                            capacidad para anticipar tendencias. Con el paso del tiempo, la empresa evolucionó:
                            primero se denominó Galenos, luego se constituyó como Galenos S.R.L., hasta que en 2000
                            surgió Medical Farma —la firma que daría forma definitiva a su proyecto.
                        </p>
                        <p className="text-lg text-medical-gray-700 leading-relaxed">
                            Con una esencia familiar que define su identidad, desde 1998 German Vallaro trabajó codo
                            a codo con su padre, absorbiendo sus enseñanzas y secretos comerciales transmitidos con
                            paciencia y compromiso. Durante la segunda ola de la pandemia, el legado se materializó:
                            David, manteniendo su grandeza, adoptó un perfil más secundario, cediendo el liderazgo a German.
                            Lo que comenzó como una prueba se convirtió en un rotundo éxito, y hoy, German extiende ese linaje:
                            deposita su propio conocimiento en sus hijos, asegurando la continuidad del proyecto iniciado
                            por David durante generaciones.
                        </p>
                    </motion.div>

                    {/* Stats & Values */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="card bg-gradient-to-br from-medical-blue-50 to-white">
                            <div className="flex items-start space-x-4">
                                <Calendar className="text-medical-blue-600 flex-shrink-0" size={40} />
                                <div>
                                    <h3 className="text-3xl font-bold text-medical-blue-600 mb-2">45+ Años</h3>
                                    <p className="text-medical-gray-700 text-lg">
                                        De experiencia ininterrumpida en el sector de la salud, construyendo relaciones
                                        de confianza con instituciones de todo el país.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-medical-blue-50 to-white">
                            <div className="flex items-start space-x-4">
                                <Users className="text-medical-blue-600 flex-shrink-0" size={40} />
                                <div>
                                    <h3 className="text-3xl font-bold text-medical-blue-600 mb-2">Equipo Dedicado</h3>
                                    <p className="text-medical-gray-700 text-lg">
                                        Contamos con un equipo de profesionales altamente capacitados, comprometidos
                                        con brindar el mejor servicio y asesoramiento técnico.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-medical-blue-50 to-white">
                            <div className="flex items-start space-x-4">
                                <TrendingUp className="text-medical-blue-600 flex-shrink-0" size={40} />
                                <div>
                                    <h3 className="text-3xl font-bold text-medical-blue-600 mb-2">Crecimiento Continuo</h3>
                                    <p className="text-medical-gray-700 text-lg">
                                        Innovamos constantemente para ofrecer las mejores soluciones en insumos médicos,
                                        adaptándonos a las necesidades cambiantes del sector salud.
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

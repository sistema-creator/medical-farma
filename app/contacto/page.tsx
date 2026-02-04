'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

export default function ContactoPage() {
    return (
        <main className="min-h-screen pt-20">
            <Header />

            {/* Contact Header */}
            <section className="bg-medical-blue-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        Contacto
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-2xl mx-auto"
                    >
                        Estamos aquí para ayudarte. Contáctanos para recibir asesoramiento personalizado.
                    </motion.p>
                </div>
            </section>

            <section className="py-16 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-medical-blue-50 p-8 rounded-2xl shadow-lg border border-medical-blue-100"
                        >
                            <h3 className="text-2xl font-bold text-medical-gray-900 mb-8">Información de Contacto</h3>

                            <div className="space-y-8">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-medical-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-medical-blue-200">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-medical-gray-900 mb-1">Dirección</h4>
                                        <p className="text-medical-gray-600">Záccaro 1892</p>
                                        <p className="text-medical-gray-600">Paraná, Entre Ríos</p>
                                        <p className="text-medical-gray-600">Argentina</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-medical-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-medical-blue-200">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-medical-gray-900 mb-1">Teléfonos</h4>
                                        <p className="text-medical-gray-600">Tel: 0343-4247726 / 0343-4243778</p>
                                        <p className="text-medical-gray-600">WhatsApp Depósito: 343-5136855</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-medical-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-medical-blue-200">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-medical-gray-900 mb-1">Email</h4>
                                        <p className="text-medical-gray-600">info@medicalfarma.com.ar</p>
                                        <p className="text-medical-gray-600">ventas@medicalfarma.com.ar</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-medical-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-medical-blue-200">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-medical-gray-900 mb-1">Horario de Atención</h4>
                                        <p className="text-medical-gray-600">Lunes a Viernes</p>
                                        <p className="text-medical-gray-600">8:00 hs - 17:00 hs</p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Embed */}
                            <div className="mt-8 rounded-xl overflow-hidden shadow-md h-64 border-2 border-white">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3393.181878954753!2d-60.512686624443916!3d-31.73836167411442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b452601c3132bf%3A0x6b4f7301017369c!2sZaccaro%201892%2C%20Paran%C3%A1%2C%20Entre%20R%C3%ADos!5e0!3m2!1ses-419!2sar!4v1709230541234!5m2!1ses-419!2sar"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl shadow-xl border border-medical-gray-100"
                        >
                            <h3 className="text-2xl font-bold text-medical-gray-900 mb-6">Envíanos un Mensaje</h3>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-medical-gray-700">Nombre Completo</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-4 py-3 rounded-lg bg-medical-gray-50 border border-medical-gray-200 focus:border-medical-blue-500 focus:ring-2 focus:ring-medical-blue-200 outline-none transition-all"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-medical-gray-700">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-3 rounded-lg bg-medical-gray-50 border border-medical-gray-200 focus:border-medical-blue-500 focus:ring-2 focus:ring-medical-blue-200 outline-none transition-all"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium text-medical-gray-700">Teléfono (Opcional)</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="w-full px-4 py-3 rounded-lg bg-medical-gray-50 border border-medical-gray-200 focus:border-medical-blue-500 focus:ring-2 focus:ring-medical-blue-200 outline-none transition-all"
                                        placeholder="+54 343 ..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium text-medical-gray-700">Asunto</label>
                                    <select
                                        id="subject"
                                        className="w-full px-4 py-3 rounded-lg bg-medical-gray-50 border border-medical-gray-200 focus:border-medical-blue-500 focus:ring-2 focus:ring-medical-blue-200 outline-none transition-all"
                                    >
                                        <option value="">Selecciona un asunto</option>
                                        <option value="ventas">Consulta Comercial / Ventas</option>
                                        <option value="admin">Administración / Pagos</option>
                                        <option value="rrhh">Recursos Humanos</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-medical-gray-700">Mensaje</label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg bg-medical-gray-50 border border-medical-gray-200 focus:border-medical-blue-500 focus:ring-2 focus:ring-medical-blue-200 outline-none transition-all resize-none"
                                        placeholder="Escribe tu mensaje aquí..."
                                    ></textarea>
                                </div>

                                <button type="submit" className="w-full btn-primary flex items-center justify-center space-x-2">
                                    <span>Enviar Mensaje</span>
                                    <Send size={20} />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

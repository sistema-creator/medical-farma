'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-medical-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 medical-gradient rounded-lg flex items-center justify-center">
                                <span className="text-2xl font-bold">MF</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Medical Farma</h3>
                                <p className="text-sm text-medical-gray-400">Desde 1978</p>
                            </div>
                        </div>
                        <p className="text-medical-gray-400 leading-relaxed mb-4">
                            Centro de Distribución Nacional de insumos médicos de alta complejidad.
                            Compromiso con la salud argentina desde hace más de 45 años.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Enlaces Rápidos</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/nosotros" className="text-medical-gray-400 hover:text-white transition-colors">
                                    Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link href="/catalogo" className="text-medical-gray-400 hover:text-white transition-colors">
                                    Catálogo
                                </Link>
                            </li>
                            <li>
                                <Link href="/marcas" className="text-medical-gray-400 hover:text-white transition-colors">
                                    Marcas
                                </Link>
                            </li>
                            <li>
                                <Link href="/registro" className="text-medical-gray-400 hover:text-white transition-colors">
                                    Apertura de Cuenta
                                </Link>
                            </li>
                            <li>
                                <Link href="/contacto" className="text-medical-gray-400 hover:text-white transition-colors">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Contacto</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="text-medical-blue-400 flex-shrink-0 mt-1" size={20} />
                                <span className="text-medical-gray-400">
                                    Záccaro 1892<br />
                                    Paraná, Entre Ríos<br />
                                    Argentina
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="text-medical-blue-400 flex-shrink-0" size={20} />
                                <span className="text-medical-gray-400">0343-4247726 / 0343-4243778</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <MessageCircle className="text-medical-blue-400 flex-shrink-0" size={20} />
                                <span className="text-medical-gray-400">Depósito: 343-5136855</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="text-medical-blue-400 flex-shrink-0" size={20} />
                                <span className="text-medical-gray-400">info@medicalfarma.com.ar</span>
                            </li>
                        </ul>
                    </div>

                    {/* Business Hours */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Horarios de Atención</h4>
                        <div className="space-y-3 text-medical-gray-400">
                            <div>
                                <p className="font-semibold text-white">Lunes a Viernes</p>
                                <p>8:00 - 18:00 hs</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white">Sábados</p>
                                <p>Cerrado</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white">Domingos y Feriados</p>
                                <p>Cerrado</p>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="w-10 h-10 bg-medical-gray-800 hover:bg-medical-blue-600 rounded-full flex items-center justify-center transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-medical-gray-800 hover:bg-medical-blue-600 rounded-full flex items-center justify-center transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-medical-gray-800 hover:bg-medical-blue-600 rounded-full flex items-center justify-center transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-medical-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-medical-gray-400 text-sm">
                            © {new Date().getFullYear()} Medical Farma. Todos los derechos reservados.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <Link href="/terminos" className="text-medical-gray-400 hover:text-white transition-colors">
                                Términos y Condiciones
                            </Link>
                            <Link href="/privacidad" className="text-medical-gray-400 hover:text-white transition-colors">
                                Política de Privacidad
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

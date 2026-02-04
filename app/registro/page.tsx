'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Building2, FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'


import { notificarNuevoCliente } from '@/lib/n8n'

export default function RegistroPage() {
    const router = useRouter()
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        razonSocial: '',
        cuit: '',
        condicionIVA: '',
        tipoInstitucion: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        provincia: '',
        nombreContacto: '',
        cargoContacto: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            // Enviamos la solicitud al "Cerebro" (n8n) para que avise a administración
            await notificarNuevoCliente({
                nombre_completo: formData.nombreContacto,
                institucion: formData.razonSocial,
                dni_cuit: formData.cuit,
                email: formData.email,
                telefono: formData.telefono,
                direccion: `${formData.direccion}, ${formData.ciudad}, ${formData.provincia}`,
                tipo: formData.tipoInstitucion,
                cargo: formData.cargoContacto
            })
        } catch (error) {
            console.error('Error enviando solicitud:', error)
        } finally {
            setSubmitting(false)
            setSubmitted(true)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    if (submitted) {
        return (
            <>
                <Header />
                <main className="min-h-screen pt-20 gradient-bg flex items-center justify-center py-12">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="card text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="text-green-600" size={48} />
                                </div>
                                <h1 className="text-3xl font-bold text-medical-gray-900 mb-4">
                                    ¡Solicitud Recibida!
                                </h1>
                                <p className="text-xl text-medical-gray-600 mb-6">
                                    Su solicitud de apertura de cuenta ha sido enviada exitosamente.
                                </p>
                                <div className="bg-medical-blue-50 border border-medical-blue-200 rounded-lg p-6 mb-8">
                                    <h3 className="font-bold text-medical-gray-900 mb-3">¿Qué sigue?</h3>
                                    <ol className="text-left space-y-3 text-medical-gray-700">
                                        <li className="flex items-start space-x-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-medical-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                            <span>Nuestro equipo verificará la información proporcionada</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-medical-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                            <span>Validaremos su documentación y condición fiscal</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-medical-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                            <span>Recibirá un email con sus credenciales de acceso (24-48 hs hábiles)</span>
                                        </li>
                                    </ol>
                                </div>
                                <p className="text-medical-gray-600 mb-6">
                                    Hemos enviado un correo de confirmación a <strong>{formData.email}</strong>
                                </p>
                                <Link href="/" className="btn-primary inline-block">
                                    Volver al Inicio
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="min-h-screen pt-20 gradient-bg py-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="card">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UserPlus className="text-white" size={32} />
                                </div>
                                <h1 className="text-3xl font-bold text-medical-gray-900 mb-2">
                                    Solicitud de Apertura de Cuenta
                                </h1>
                                <p className="text-medical-gray-600">
                                    Portal exclusivo para Instituciones de Salud y Farmacias
                                </p>
                            </div>

                            <div className="bg-medical-blue-50 border border-medical-blue-200 rounded-lg p-4 mb-8 flex items-start space-x-3">
                                <AlertCircle className="text-medical-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                <div className="text-sm text-medical-gray-700">
                                    <p className="font-semibold mb-1">Importante:</p>
                                    <p>
                                        Esta plataforma es exclusiva para instituciones de salud y farmacias.
                                        Su solicitud será revisada manualmente por nuestro equipo antes de aprobar el acceso.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Datos de la Institución */}
                                <div>
                                    <h3 className="text-xl font-bold text-medical-gray-900 mb-4 flex items-center space-x-2">
                                        <Building2 size={24} className="text-medical-blue-600" />
                                        <span>Datos de la Institución</span>
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-medical-gray-700 mb-2">
                                                Razón Social *
                                            </label>
                                            <input
                                                type="text"
                                                name="razonSocial"
                                                value={formData.razonSocial}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all"
                                                placeholder="Ej: Hospital General San Martín S.A."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-medical-gray-700 mb-2">
                                                CUIT *
                                            </label>
                                            <input
                                                type="text"
                                                name="cuit"
                                                value={formData.cuit}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all"
                                                placeholder="XX-XXXXXXXX-X"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-medical-gray-700 mb-2">
                                                Condición ante IVA *
                                            </label>
                                            <select
                                                name="condicionIVA"
                                                value={formData.condicionIVA}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all"
                                            >
                                                <option value="">Seleccione...</option>
                                                <option value="responsable_inscripto">Responsable Inscripto</option>
                                                <option value="exento">Exento</option>
                                                <option value="monotributo">Monotributo</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-medical-gray-700 mb-2">
                                                Tipo de Institución *
                                            </label>
                                            <select
                                                name="tipoInstitucion"
                                                value={formData.tipoInstitucion}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all"
                                            >
                                                <option value="">Seleccione...</option>
                                                <option value="hospital">Hospital / Clínica / Sanatorio</option>
                                                <option value="municipio">Municipio / Gobierno</option>
                                                <option value="farmacia">Farmacia</option>
                                                <option value="otro">Otro</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-medical-gray-700 mb-2">
                                                Constancia de AFIP
                                            </label>
                                            <div className="border-2 border-dashed border-medical-gray-300 rounded-lg p-6 text-center hover:border-medical-blue-400 transition-colors cursor-pointer">
                                                <Upload className="mx-auto text-medical-gray-400 mb-2" size={32} />
                                                <p className="text-sm text-medical-gray-600">
                                                    Haga clic para adjuntar o arrastre el archivo aquí
                                                </p>
                                                <p className="text-xs text-medical-gray-500 mt-1">
                                                    PDF, JPG o PNG (máx. 5MB)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Datos de Contacto */}
                                <div>
                                    <h3 className="text-xl font-bold text-medical-gray-900 mb-4 flex items-center space-x-2">
                                        <FileText size={24} className="text-medical-blue-600" />
                                        <span>Datos de Contacto</span>
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-medical-gray-700 mb-2">
                                                Email Institucional *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all"
                                                placeholder="compras@institucion.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-medical-gray-700 mb-2">
                                                Teléfono *
                                            </label>
                                            <input
                                                type="tel"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all"
                                                placeholder="(0343) XXX-XXXX"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-medical-gray-700 mb-2">
                                                Dirección *
                                            </label>
                                            <input
                                                type="text"
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all"
                                                placeholder="Calle y Número"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-medical-gray-700 mb-2">
                                                Ciudad *
                                            </label>
                                            <input
                                                type="text"
                                                name="ciudad"
                                                value={formData.ciudad}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all"
                                                placeholder="Ej: Paraná"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-medical-gray-700 mb-2">
                                                Provincia *
                                            </label>
                                            <input
                                                type="text"
                                                name="provincia"
                                                value={formData.provincia}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all"
                                                placeholder="Ej: Entre Ríos"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-medical-gray-700 mb-2">
                                                Nombre del Contacto *
                                            </label>
                                            <input
                                                type="text"
                                                name="nombreContacto"
                                                value={formData.nombreContacto}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all"
                                                placeholder="Nombre y Apellido"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-medical-gray-700 mb-2">
                                                Cargo
                                            </label>
                                            <input
                                                type="text"
                                                name="cargoContacto"
                                                value={formData.cargoContacto}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-medical-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent transition-all"
                                                placeholder="Ej: Jefe de Compras"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        required
                                        className="mt-1 w-4 h-4 text-medical-blue-600 rounded"
                                    />
                                    <label className="text-sm text-medical-gray-700">
                                        Acepto los <Link href="/terminos" className="text-medical-blue-600 hover:underline">términos y condiciones</Link> y
                                        la <Link href="/privacidad" className="text-medical-blue-600 hover:underline">política de privacidad</Link> de Medical Farma.
                                    </label>
                                </div>

                                <button type="submit" className="btn-primary w-full">
                                    Enviar Solicitud
                                </button>

                                <p className="text-center text-sm text-medical-gray-600">
                                    ¿Ya tiene una cuenta? <Link href="/login" className="text-medical-blue-600 hover:underline font-medium">Inicie sesión aquí</Link>
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    )
}

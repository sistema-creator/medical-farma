'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registrarUsuario } from '@/lib/auth'
import { motion } from 'framer-motion'

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        dni_cuit: '',
        whatsapp: '',
        institucion: '',
        password: '',
        confirmPassword: '',
        tipo_usuario: 'cliente' as const,
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [success, setSuccess] = useState(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        // Validaciones
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        setLoading(true)

        try {
            const result = await registrarUsuario({
                email: formData.email,
                password: formData.password,
                nombre_completo: formData.nombre_completo,
                dni_cuit: formData.dni_cuit,
                whatsapp: formData.whatsapp || undefined,
                institucion: formData.institucion || undefined,
                tipo_usuario: formData.tipo_usuario,
            })

            if (result.success) {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/auth/login')
                }, 3000)
            } else {
                setError(result.error || 'Error al registrar usuario')
            }
        } catch (err: any) {
            setError(err.message || 'Error inesperado')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
                >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h2>
                    <p className="text-gray-600 mb-4">
                        Tu cuenta ha sido creada y está pendiente de aprobación.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Recibirás un email cuando tu cuenta sea aprobada. Serás redirigido al login en unos segundos...
                    </p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left side - Register Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl"
                >
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Medical Farma</h1>
                        <p className="text-gray-600">Crear Nueva Cuenta</p>
                    </div>

                    {/* Register Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Registro de Usuario</h2>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start"
                            >
                                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-800">{error}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Nombre Completo */}
                                <div>
                                    <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre Completo *
                                    </label>
                                    <input
                                        id="nombre_completo"
                                        name="nombre_completo"
                                        type="text"
                                        value={formData.nombre_completo}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Juan Pérez"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Correo Electrónico *
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="tu@email.com"
                                    />
                                </div>

                                {/* DNI/CUIT */}
                                <div>
                                    <label htmlFor="dni_cuit" className="block text-sm font-medium text-gray-700 mb-2">
                                        DNI/CUIT *
                                    </label>
                                    <input
                                        id="dni_cuit"
                                        name="dni_cuit"
                                        type="text"
                                        value={formData.dni_cuit}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="20-12345678-9"
                                    />
                                </div>

                                {/* WhatsApp */}
                                <div>
                                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                                        WhatsApp
                                    </label>
                                    <input
                                        id="whatsapp"
                                        name="whatsapp"
                                        type="tel"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="+54 9 11 1234-5678"
                                    />
                                </div>

                                {/* Institución */}
                                <div className="md:col-span-2">
                                    <label htmlFor="institucion" className="block text-sm font-medium text-gray-700 mb-2">
                                        Institución / Empresa
                                    </label>
                                    <input
                                        id="institucion"
                                        name="institucion"
                                        type="text"
                                        value={formData.institucion}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Hospital / Farmacia / Clínica"
                                    />
                                </div>

                                {/* Tipo de Usuario */}
                                <div className="md:col-span-2">
                                    <label htmlFor="tipo_usuario" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Cuenta *
                                    </label>
                                    <select
                                        id="tipo_usuario"
                                        name="tipo_usuario"
                                        value={formData.tipo_usuario}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="cliente">Cliente</option>
                                        <option value="vendedor">Vendedor</option>
                                        <option value="facturacion">Facturación</option>
                                        <option value="despacho">Despacho</option>
                                        <option value="compras">Compras</option>
                                    </select>
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Contraseña *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar Contraseña *
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    required
                                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                    Acepto los{' '}
                                    <Link href="/terminos" className="text-blue-600 hover:text-blue-700 font-medium">
                                        términos y condiciones
                                    </Link>{' '}
                                    y la{' '}
                                    <Link href="/privacidad" className="text-blue-600 hover:text-blue-700 font-medium">
                                        política de privacidad
                                    </Link>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registrando...
                                    </span>
                                ) : (
                                    'Crear Cuenta'
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                ¿Ya tienes una cuenta?{' '}
                                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 mt-8">
                        © 2026 Medical Farma. Todos los derechos reservados.
                    </p>
                </motion.div>
            </div>

            {/* Right side - Branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    className="relative z-10 text-white text-center max-w-lg"
                >
                    <div className="mb-8">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Únete a nosotros</h2>
                        <p className="text-xl text-teal-100">
                            Forma parte de la red de distribución médica más confiable de Argentina
                        </p>
                    </div>

                    <div className="space-y-4 mt-12">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-left">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-semibold">Aprobación Rápida</div>
                                    <div className="text-sm text-teal-100">En menos de 24 horas</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-left">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-semibold">100% Seguro</div>
                                    <div className="text-sm text-teal-100">Tus datos protegidos</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

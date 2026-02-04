'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Truck,
    Plus,
    X,
    Save,
    Search,
    User,
    Phone,
    Mail,
    FileText,
    CreditCard,
    ArrowLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import { obtenerTransportistas, crearTransportista, actualizarTransportista, Transportista } from '@/lib/transportistas'

export default function TransportistasPage() {
    const router = useRouter()
    const [transportistas, setTransportistas] = useState<Transportista[]>([])
    const [loading, setLoading] = useState(true)
    const [filtro, setFiltro] = useState('')
    const [modalAbierto, setModalAbierto] = useState(false)
    const [editando, setEditando] = useState<Transportista | null>(null)

    useEffect(() => {
        cargar()
    }, [])

    async function cargar() {
        setLoading(true)
        const res = await obtenerTransportistas()
        if (res.success) setTransportistas(res.data)
        setLoading(false)
    }

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const datos = Object.fromEntries(formData.entries())

        let res
        if (editando) {
            res = await actualizarTransportista(editando.id, datos)
        } else {
            res = await crearTransportista(datos)
        }

        if (res.success) {
            setModalAbierto(false)
            setEditando(null)
            cargar()
        }
    }

    const filtered = transportistas.filter(t =>
        t.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        t.vehiculo_patente?.toLowerCase().includes(filtro.toLowerCase())
    )

    return (
        <AdminProtectedRoute>
            <div className="min-h-screen bg-gray-50 pt-20">
                <Header />
                <main className="container mx-auto px-4 py-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <button
                            onClick={() => router.push('/admin/despacho')}
                            className="flex items-center text-gray-500 hover:text-orange-600 font-bold transition-colors mb-6 group"
                        >
                            <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1" />
                            VOLVER A DESPACHO
                        </button>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Fichas de Transportistas</h1>
                                <p className="text-lg text-gray-500 font-medium">Registro centralizado de choferes y flota</p>
                            </div>
                            <button
                                onClick={() => { setEditando(null); setModalAbierto(true); }}
                                className="flex items-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-[2rem] font-bold hover:bg-gray-800 transition-all shadow-xl"
                                title="Añadir nuevo transportista"
                                aria-label="Añadir nuevo transportista"
                            >
                                <Plus size={20} />
                                <span>AÑADIR TRANSPORTISTA</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Buscador */}
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 mb-10">
                        <div className="relative max-w-xl">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o patente..."
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold"
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Lista */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full py-12 text-center text-gray-400 italic">Cargando legajos...</div>
                        ) : filtered.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-gray-400 italic">No se encontraron transportistas.</div>
                        ) : (
                            filtered.map(t => (
                                <motion.div
                                    key={t.id}
                                    layoutId={t.id}
                                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
                                    onClick={() => { setEditando(t); setModalAbierto(true); }}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                                            <Truck size={30} />
                                        </div>
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.estado === 'activo' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {t.estado}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-orange-600 transition-colors uppercase">{t.nombre}</h3>
                                    <p className="text-gray-400 font-bold text-sm mb-6 flex items-center">
                                        <CreditCard size={14} className="mr-2" />
                                        CUIT: {t.cuit || 'Pendiente'}
                                    </p>
                                    <div className="space-y-3 pt-6 border-t border-gray-50">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-bold uppercase tracking-tighter">Vehículo</span>
                                            <span className="text-gray-900 font-black">{t.vehiculo_patente || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-bold uppercase tracking-tighter">Contacto</span>
                                            <span className="text-gray-900 font-black">{t.telefono || 'N/A'}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </main>
            </div>

            {/* Modal Formulario */}
            <AnimatePresence>
                {modalAbierto && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalAbierto(false)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{editando ? 'Editar Ficha' : 'Nueva Ficha de Transportista'}</h2>
                                <button onClick={() => setModalAbierto(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={24} className="text-gray-400" /></button>
                            </div>

                            <form onSubmit={handleGuardar} className="p-10 overflow-y-auto space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput label="Nombre Completo" name="nombre" defaultValue={editando?.nombre} icon={User} required placeholder="Nombre del chofer o empresa" />
                                    <FormInput label="CUIT" name="cuit" defaultValue={editando?.cuit} icon={CreditCard} placeholder="20-00000000-0" />
                                    <FormInput label="Teléfono" name="telefono" defaultValue={editando?.telefono} icon={Phone} placeholder="+54 9..." />
                                    <FormInput label="Email" name="email" type="email" defaultValue={editando?.email} icon={Mail} placeholder="correo@ejemplo.com" />
                                    <FormInput label="Modelo Vehículo" name="vehiculo_modelo" defaultValue={editando?.vehiculo_modelo} icon={Truck} placeholder="Ej: Mercedes Sprinter" />
                                    <FormInput label="Patente / Dominio" name="vehiculo_patente" defaultValue={editando?.vehiculo_patente} icon={CreditCard} placeholder="ABC 123" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notas Internas</label>
                                    <textarea
                                        name="notas"
                                        defaultValue={editando?.notas}
                                        rows={4}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold resize-none"
                                        placeholder="Antecedentes, requisitos de ingreso, etc."
                                    />
                                </div>
                                <div className="flex items-center space-x-4">
                                    <label htmlFor="select-estado" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado del Legajo:</label>
                                    <select
                                        id="select-estado"
                                        title="Estado del transportista"
                                        name="estado"
                                        defaultValue={editando?.estado || 'activo'}
                                        className="px-4 py-2 bg-gray-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="activo">ACTIVO</option>
                                        <option value="inactivo">INACTIVO</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center space-x-3"
                                >
                                    <Save size={20} />
                                    <span>{editando ? 'Guardar Cambios' : 'Registrar Transportista'}</span>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminProtectedRoute>
    )
}

function FormInput({ label, icon: Icon, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    {...props}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold transition-all"
                />
            </div>
        </div>
    )
}

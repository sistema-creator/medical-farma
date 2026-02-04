'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Save,
    X,
    Plus,
    Trash2,
    Image as ImageIcon,
    FileText,
    Link as LinkIcon,
    Calculator,
    CheckCircle2,
    Package,
    Eye
} from 'lucide-react'
import { Producto, crearProducto, actualizarProducto, subirImagenProducto } from '@/lib/productos'

interface ProductFormProps {
    producto?: Producto
    onSuccess?: () => void
}

export default function ProductForm({ producto, onSuccess }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [id, setId] = useState(producto?.id || '')

    // Form State
    const [formData, setFormData] = useState({
        nombre: producto?.nombre || '',
        marcas: producto?.marcas || [],
        descripcion_tecnica: producto?.descripcion_tecnica || '',
        medidas: producto?.medidas || '',
        stock_actual: producto?.stock_actual || 0,
        stock_minimo: producto?.stock_minimo || 0,
        precio_unitario: producto?.precio_unitario || 0,
        precio_lote: producto?.precio_lote || null,
        categoria: producto?.categoria || '',
        ubicacion_almacen: producto?.ubicacion_almacen || '',
        imagen_url: producto?.imagen_url || '',
        estado: producto?.estado || 'activo',
        // New Fields
        imagenes_ilustrativas: producto?.imagenes_ilustrativas || [],
        documentos_pdf: producto?.documentos_pdf || [],
        enlaces_relacionados: producto?.enlaces_relacionados || [],
        sectores: producto?.sectores || [],
        precio_compra: producto?.precio_compra || 0,
        impuesto_21: producto?.impuesto_21 || 21,
        impuesto_extra_1: producto?.impuesto_extra_1 || 0,
        impuesto_extra_2: producto?.impuesto_extra_2 || 0,
        impuesto_extra_3: producto?.impuesto_extra_3 || 0,
        precio_venta_final: producto?.precio_venta_final || 0
    })

    // Auto-calculate Final Price
    useEffect(() => {
        const totalTaxPercent = Number(formData.impuesto_21) +
            Number(formData.impuesto_extra_1) +
            Number(formData.impuesto_extra_2) +
            Number(formData.impuesto_extra_3)

        const finalPrice = Number(formData.precio_compra) * (1 + totalTaxPercent / 100)

        setFormData(prev => ({
            ...prev,
            precio_venta_final: Number(finalPrice.toFixed(2)),
            precio_unitario: Number(finalPrice.toFixed(2)) // Keep legacy legacy field synced
        }))
    }, [formData.precio_compra, formData.impuesto_21, formData.impuesto_extra_1, formData.impuesto_extra_2, formData.impuesto_extra_3])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }))
    }

    const handleArrayAdd = (field: 'marcas' | 'imagenes_ilustrativas' | 'documentos_pdf' | 'enlaces_relacionados' | 'sectores', value: string) => {
        if (!value) return
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], value]
        }))
    }

    const handleArrayRemove = (field: 'marcas' | 'imagenes_ilustrativas' | 'documentos_pdf' | 'enlaces_relacionados' | 'sectores', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (id) {
                const res = await actualizarProducto(id, formData)
                if (!res.success) throw new Error(res.error)
            } else {
                const res = await crearProducto(formData as any)
                if (!res.success) throw new Error(res.error)
            }

            if (onSuccess) onSuccess()
            router.push('/admin/stock')
        } catch (error: any) {
            alert('Error al guardar: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const sectorsList = ['Farmacia', 'Hospitalario', 'Odontología', 'Veterinaria', 'Geriátrico', 'Laboratorio']

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {/* General Information Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Package className="text-blue-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Información General</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Producto</label>
                        <input
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ej. Catéter Venoso Central 7Fr x 20cm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                        <select
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Seleccione una categoría</option>
                            <option value="Cirugía">Cirugía</option>
                            <option value="Alta Complejidad">Alta Complejidad</option>
                            <option value="Descartables">Descartables</option>
                            <option value="Equipamiento">Equipamiento</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción Técnica / Detalle</label>
                        <textarea
                            name="descripcion_tecnica"
                            value={formData.descripcion_tecnica}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Detalles sobre materiales, certificaciones, formas de uso..."
                        />
                    </div>
                </div>
            </section>

            {/* Logistics Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-amber-50 rounded-lg">
                        <Calculator className="text-amber-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Control de Stock y Logística</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Actual</label>
                        <input
                            type="number"
                            name="stock_actual"
                            value={formData.stock_actual}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Mínimo (Alerta)</label>
                        <input
                            type="number"
                            name="stock_minimo"
                            value={formData.stock_minimo}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación en Almacén</label>
                        <input
                            name="ubicacion_almacen"
                            value={formData.ubicacion_almacen}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ej. Rack A-12"
                        />
                    </div>
                </div>
            </section>

            {/* Technical Template Content Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <Eye className="text-purple-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Contenido de Ficha Técnica</h2>
                </div>

                <div className="space-y-8">
                    {/* Sectors Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">Sectores de Aplicación / Calificación</label>
                        <div className="flex flex-wrap gap-3">
                            {sectorsList.map(sector => {
                                const isSelected = formData.sectores.includes(sector)
                                return (
                                    <button
                                        key={sector}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) handleArrayRemove('sectores', formData.sectores.indexOf(sector))
                                            else handleArrayAdd('sectores', sector)
                                        }}
                                        className={`px-4 py-2 rounded-full border-2 transition-all font-bold text-sm ${isSelected
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-blue-400'
                                            }`}
                                    >
                                        {sector}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Images Section */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <ImageIcon size={18} />
                            Imágenes Ilustrativas (Máx. 4)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="relative group aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                                    {formData.imagenes_ilustrativas[i] ? (
                                        <>
                                            <img src={formData.imagenes_ilustrativas[i]} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleArrayRemove('imagenes_ilustrativas', i)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center p-4">
                                            <Plus size={24} className="mx-auto text-gray-300 mb-2" />
                                            <input
                                                type="text"
                                                placeholder="URL Imagen"
                                                className="text-[10px] w-full bg-transparent border-none focus:ring-0 text-center outline-none"
                                                onBlur={(e) => {
                                                    if (e.target.value) handleArrayAdd('imagenes_ilustrativas', e.target.value)
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PDFs & Links */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <FileText size={18} />
                                Documentos / Manuales (PDF)
                            </label>
                            <div className="space-y-3">
                                {formData.documentos_pdf.map((pdf, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                                        <span className="text-xs text-gray-600 truncate max-w-[200px]">{pdf}</span>
                                        <button type="button" onClick={() => handleArrayRemove('documentos_pdf', i)} className="text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="newPdfUrl"
                                        placeholder="URL de PDF o manual..."
                                        className="flex-grow px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('newPdfUrl') as HTMLInputElement
                                            handleArrayAdd('documentos_pdf', input.value)
                                            input.value = ''
                                        }}
                                        className="p-2 bg-gray-900 text-white rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <LinkIcon size={18} />
                                Enlaces Relacionados
                            </label>
                            <div className="space-y-3">
                                {formData.enlaces_relacionados.map((link, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                                        <span className="text-xs text-gray-600 truncate max-w-[200px]">{link}</span>
                                        <button type="button" onClick={() => handleArrayRemove('enlaces_relacionados', i)} className="text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="newLinkUrl"
                                        placeholder="URL externa / Video..."
                                        className="flex-grow px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('newLinkUrl') as HTMLInputElement
                                            handleArrayAdd('enlaces_relacionados', input.value)
                                            input.value = ''
                                        }}
                                        className="p-2 bg-gray-900 text-white rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="bg-gray-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-0"></div>

                <div className="flex items-center space-x-3 mb-8 relative z-10">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Calculator className="text-blue-400" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Estructura de Precios e Impuestos</h2>
                </div>

                <div className="grid lg:grid-cols-4 gap-8 relative z-10">
                    <div>
                        <label className="block text-sm font-semibold text-blue-300 mb-2">Precio de Compra (Costo)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input
                                type="number"
                                name="precio_compra"
                                value={formData.precio_compra}
                                onChange={handleInputChange}
                                className="w-full pl-8 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 text-xl font-bold"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-tighter">IVA 21%</label>
                            <input
                                type="number"
                                name="impuesto_21"
                                value={formData.impuesto_21}
                                onChange={handleInputChange}
                                className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-center font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-tighter">Imp. Extra 1 (%)</label>
                            <input
                                type="number"
                                name="impuesto_extra_1"
                                value={formData.impuesto_extra_1}
                                onChange={handleInputChange}
                                className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-center font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-tighter">Imp. Extra 2 (%)</label>
                            <input
                                type="number"
                                name="impuesto_extra_2"
                                value={formData.impuesto_extra_2}
                                onChange={handleInputChange}
                                className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-center font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-tighter">Imp. Extra 3 (%)</label>
                            <input
                                type="number"
                                name="impuesto_extra_3"
                                value={formData.impuesto_extra_3}
                                onChange={handleInputChange}
                                className="w-full px-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-center font-bold"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-600 p-6 rounded-3xl flex flex-col justify-center shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform border border-blue-400/30">
                        <span className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1 text-center">Precio Final Venta</span>
                        <div className="text-4xl font-black text-white text-center">
                            ${formData.precio_venta_final.toLocaleString('es-AR')}
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-12 py-3 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center space-x-2"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <>
                            <Save size={20} />
                            <span>Guardar Producto</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

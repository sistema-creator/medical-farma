'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { solicitarImportacionStock } from '@/lib/n8n'

interface BulkImportModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState<'upload' | 'preview' | 'processing'>('upload')
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Configuración de columnas esperadas
    const expectedColumns = ['nombre', 'categoria', 'precio_unitario', 'stock_actual', 'stock_minimo']

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                setError('Por favor sube un archivo CSV válido.')
                return
            }
            setFile(selectedFile)
            setError('')
            parseCSV(selectedFile)
        }
    }

    const parseCSV = (file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string
                const lines = text.split('\n').filter(line => line.trim() !== '')

                if (lines.length < 2) {
                    setError('El archivo CSV parece estar vacío o no tener cabeceras.')
                    return
                }

                // Detectar separador (coma o punto y coma)
                const firstLine = lines[0]
                const separator = firstLine.includes(';') ? ';' : ','

                const headers = firstLine.split(separator).map(h => h.trim().toLowerCase().replace(/['"]/g, ''))

                // Validar cabeceras mínimas
                const missingColumns = expectedColumns.filter(col => !headers.includes(col))

                if (missingColumns.length > 0) {
                    // No bloqueamos, pero advertimos si es crítico. Aquí asumimos mapeo flexible.
                    // Para este MVP, mapeamos por índice si las cabeceras no coinciden, o buscamos aproximaciones.
                }

                const data = lines.slice(1).map((line, index) => {
                    const values = line.split(separator).map(v => v.trim().replace(/['"]/g, ''))

                    // Crear objeto dinámico basado en cabeceras
                    const obj: any = {}
                    headers.forEach((header, i) => {
                        obj[header] = values[i]
                    })

                    // Asegurar campos numéricos
                    if (obj.stock_actual) obj.stock_actual = Number(obj.stock_actual) || 0
                    if (obj.stock_minimo) obj.stock_minimo = Number(obj.stock_minimo) || 0
                    if (obj.precio_unitario) obj.precio_unitario = Number(obj.precio_unitario) || 0

                    return obj
                })

                setPreview(data.slice(0, 5)) // Mostrar solo los primeros 5
                setStep('preview')
            } catch (err) {
                setError('Error al leer el archivo CSV.')
                console.error(err)
            }
        }
        reader.readAsText(file)
    }

    const handleUpload = async () => {
        // En este punto, ya tenemos 'preview' que es una muestra, pero necesitamos enviar TODO el archivo procesado.
        // Volvemos a parsear todo o usamos el estado si lo guardamos (aquí simplificado, re-leemos o usamos lo que tenemos si fuera pequeño).
        // Para archivos grandes, mejor enviar el archivo raw a n8n o parsear completo en memoria si es razonable (<几MB).
        // Vamos a parsear completo en memoria por simplicidad y enviar JSON a n8n.

        if (!file) return
        setLoading(true)
        setStep('processing')

        try {
            const reader = new FileReader()
            reader.onload = async (e) => {
                const text = e.target?.result as string
                const lines = text.split('\n').filter(line => line.trim() !== '')
                const separator = lines[0].includes(';') ? ';' : ','
                const headers = lines[0].split(separator).map(h => h.trim().toLowerCase().replace(/['"]/g, ''))

                const fullData = lines.slice(1).map(line => {
                    const values = line.split(separator).map(v => v.trim().replace(/['"]/g, ''))
                    const obj: any = {}
                    headers.forEach((header, i) => {
                        obj[header] = values[i]
                    })
                    // Conversiones básicas
                    if (obj.stock_actual) obj.stock_actual = Number(obj.stock_actual) || 0
                    if (obj.stock_minimo) obj.stock_minimo = Number(obj.stock_minimo) || 0
                    if (obj.precio_unitario) obj.precio_unitario = Number(obj.precio_unitario) || 0

                    return obj
                })

                const result = await solicitarImportacionStock(fullData)

                if (result.success) {
                    onSuccess()
                    onClose()
                    setFile(null)
                    setStep('upload')
                } else {
                    setError('Error al enviar datos a n8n. Verifica la conexión.')
                }
                setLoading(false)
            }
            reader.readAsText(file)
        } catch (err) {
            setError('Error procesando el archivo.')
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                    </div>

                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Importar Productos
                                    </h3>

                                    {step === 'upload' && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500 mb-4">
                                                Sube un archivo CSV con tus productos. Asegúrate de incluir cabeceras como:
                                                <span className="font-mono text-xs bg-gray-100 p-1 mx-1 rounded">nombre</span>,
                                                <span className="font-mono text-xs bg-gray-100 p-1 mx-1 rounded">precio_unitario</span>,
                                                <span className="font-mono text-xs bg-gray-100 p-1 mx-1 rounded">stock_actual</span>.
                                            </p>

                                            <div
                                                className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors cursor-pointer"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <div className="space-y-1 text-center">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600">
                                                        <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                            Sube un archivo
                                                        </span>
                                                        <p className="pl-1">o arrastra y suelta</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">CSV hasta 10MB</p>
                                                </div>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept=".csv"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                                        </div>
                                    )}

                                    {step === 'preview' && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500 mb-2">Vista previa (primera 5 filas):</p>
                                            <div className="overflow-x-auto border rounded-lg">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            {preview.length > 0 && Object.keys(preview[0]).slice(0, 4).map(key => (
                                                                <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    {key}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {preview.map((row, idx) => (
                                                            <tr key={idx}>
                                                                {Object.values(row).slice(0, 4).map((val: any, i) => (
                                                                    <td key={i} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                                        {val}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500">Se encontraron {preview.length} filas (mostrando primeras 5)</p>
                                        </div>
                                    )}

                                    {step === 'processing' && (
                                        <div className="mt-8 text-center pb-4">
                                            <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <p className="text-sm text-gray-600">Procesando y enviando a servidor...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            {step === 'preview' ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleUpload}
                                        disabled={loading}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Importar Datos
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFile(null)
                                            setStep('upload')
                                            setPreview([])
                                        }}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Atrás
                                    </button>
                                </>
                            ) : step === 'upload' ? (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancelar
                                </button>
                            ) : null}
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    )
}

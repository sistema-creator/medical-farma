import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

/**
 * Cliente de Gemini AI para asistencia a vendedores
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-pro-latest'

let genAI: GoogleGenerativeAI | null = null
let model: GenerativeModel | null = null

/**
 * Inicializa el cliente de Gemini
 */
export function initGeminiClient() {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY no está configurada')
    }

    if (!genAI) {
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
        model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
    }

    return model
}

/**
 * Construye el contexto de productos para el prompt
 */
export function buildProductContext(productos: any[]): string {
    let context = "CATÁLOGO DE PRODUCTOS:\n\n"

    productos.forEach(p => {
        context += `📦 ${p.nombre}\n`
        context += `   Categoría: ${p.categoria || 'Sin categoría'}\n`
        context += `   Stock: ${p.stock_actual} unidades`

        if (p.stock_actual < p.stock_minimo) {
            context += " ⚠️ STOCK BAJO"
        } else if (p.stock_actual === 0) {
            context += " ❌ SIN STOCK"
        }

        context += `\n   Precio unitario: $${p.precio_unitario.toFixed(2)}`

        if (p.precio_lote) {
            context += ` | Precio por lote: $${p.precio_lote.toFixed(2)}`
        }

        if (p.marcas && p.marcas.length > 0) {
            context += `\n   Marcas: ${p.marcas.join(', ')}`
        }

        if (p.descripcion_tecnica) {
            context += `\n   Descripción: ${p.descripcion_tecnica.substring(0, 100)}...`
        }

        context += "\n\n"
    })

    return context
}

/**
 * Construye el contexto de clientes para el prompt
 */
export function buildClientContext(clientes: any[]): string {
    let context = "CLIENTES ACTIVOS:\n\n"

    clientes.forEach(c => {
        context += `👤 ${c.nombre_completo}\n`
        context += `   DNI/CUIT: ${c.dni_cuit}\n`
        context += `   Email: ${c.email}\n`

        if (c.telefono) {
            context += `   Teléfono: ${c.telefono}\n`
        }

        context += "\n"
    })

    return context
}

/**
 * Genera el prompt del sistema para el asistente
 */
export function buildSystemPrompt(productContext: string, clientContext: string): string {
    return `Eres un asistente de ventas experto de MEDICAL FARMA S.A., una distribuidora farmacéutica argentina.

TU ROL:
- Ayudar a los vendedores a consultar información de productos
- Verificar disponibilidad y precios
- Proporcionar datos de contacto de clientes
- Recomendar productos según necesidades del cliente
- Alertar sobre productos con stock bajo o sin stock

INSTRUCCIONES:
✅ SIEMPRE responde en español argentino profesional
✅ Sé claro, conciso y útil
✅ Si un producto tiene stock bajo, sugiere contactar a compras
✅ Si no hay stock, ofrece alternativas similares
✅ Formatea las respuestas con emojis para mejor legibilidad
✅ Si no encuentras información exacta, pide más detalles

❌ NO inventes información que no esté en el contexto
❌ NO des consejos médicos
❌ NO modifiques precios ni stock

INFORMACIÓN DISPONIBLE:

${productContext}

${clientContext}

Recuerda: Tu objetivo es hacer que los vendedores sean más eficientes y puedan responder rápidamente a los clientes.`
}

/**
 * Genera una respuesta usando Gemini
 */
export async function generateResponse(
    userMessage: string,
    productos: any[],
    clientes: any[] = []
): Promise<string> {
    try {
        const model = initGeminiClient()

        if (!model) {
            throw new Error('No se pudo inicializar el cliente de Gemini')
        }

        const productContext = buildProductContext(productos)
        const clientContext = clientes.length > 0 ? buildClientContext(clientes) : ""
        const systemPrompt = buildSystemPrompt(productContext, clientContext)

        const fullPrompt = `${systemPrompt}\n\nCONSULTA DEL VENDEDOR:\n${userMessage}`

        const result = await model.generateContent(fullPrompt)
        const response = await result.response
        const text = response.text()

        return text
    } catch (error) {
        console.error('Error al generar respuesta con Gemini:', error)
        throw new Error('No pude procesar tu consulta. Por favor, intenta de nuevo.')
    }
}

/**
 * Genera respuesta directamente desde el cliente (para hosting estático)
 * ADVERTENCIA: Requiere exponer la API Key en variables NEXT_PUBLIC_
 */
export async function generateResponseClient(
    userMessage: string,
    productos: any[],
    clientes: any[] = []
): Promise<string> {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
        if (!apiKey) throw new Error('API Key no configurada')

        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })

        const productContext = buildProductContext(productos)
        const clientContext = clientes.length > 0 ? buildClientContext(clientes) : ""
        const systemPrompt = buildSystemPrompt(productContext, clientContext)

        const fullPrompt = `${systemPrompt}\n\nCONSULTA DEL VENDEDOR:\n${userMessage}`

        const result = await model.generateContent(fullPrompt)
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error('Error en Gemini Client:', error)
        throw error
    }
}

/**
 * Genera respuesta con streaming (para UI más fluida)
 */
export async function generateResponseStream(
    userMessage: string,
    productos: any[],
    clientes: any[] = []
): Promise<ReadableStream> {
    const model = initGeminiClient()

    if (!model) {
        throw new Error('No se pudo inicializar el cliente de Gemini')
    }

    const productContext = buildProductContext(productos)
    const clientContext = clientes.length > 0 ? buildClientContext(clientes) : ""
    const systemPrompt = buildSystemPrompt(productContext, clientContext)

    const fullPrompt = `${systemPrompt}\n\nCONSULTA DEL VENDEDOR:\n${userMessage}`

    const result = await model.generateContentStream(fullPrompt)

    // Crear un ReadableStream compatible con Next.js
    const encoder = new TextEncoder()

    return new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of result.stream) {
                    const text = chunk.text()
                    controller.enqueue(encoder.encode(text))
                }
                controller.close()
            } catch (error) {
                controller.error(error)
            }
        }
    })
}

/**
 * Sugerencias de preguntas frecuentes
 */
export const SUGGESTED_QUESTIONS = [
    "¿Qué productos tenemos con stock bajo?",
    "Muéstrame los precios de antibióticos",
    "¿Cuál es el producto más vendido?",
    "Dame información de contacto del cliente X",
    "¿Qué alternativas tenemos para el producto Y?",
    "¿Cuánto cuesta el producto Z?",
    "Productos de la categoría Analgésicos",
    "¿Qué productos están sin stock?"
]

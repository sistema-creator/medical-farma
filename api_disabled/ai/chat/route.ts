import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateResponse } from '@/lib/gemini'

/**
 * API Route: Chat con Asistente IA
 * POST /api/ai/chat
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Autenticación
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error('❌ Error de autenticación:', authError)
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            )
        }

        console.log('✅ Usuario autenticado:', user.id)

        // SIMPLIFICADO: Permitir a cualquier usuario autenticado usar el asistente
        // (La verificación de roles se puede agregar después cuando la tabla usuarios esté lista)
        // SIMPLIFICADO: Permitir a cualquier usuario autenticado usar el asistente
        // (La verificación de roles se puede agregar después cuando la tabla usuarios esté lista)

        // 2. Obtener mensaje del request
        const body = await request.json()
        const { message, context } = body

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Mensaje inválido' },
                { status: 400 }
            )
        }

        // 3. Obtener contexto de productos
        const maxProducts = parseInt(process.env.AI_MAX_CONTEXT_PRODUCTS || '50')

        let productQuery = supabase
            .from('productos')
            .select('id, nombre, categoria, stock_actual, stock_minimo, precio_unitario, precio_lote, marcas, descripcion_tecnica')
            .eq('estado', 'activo')
            .order('nombre')
            .limit(maxProducts)

        // Si hay contexto específico de producto, filtrarlo
        if (context?.productoId) {
            productQuery = productQuery.eq('id', context.productoId)
        } else if (context?.categoria) {
            productQuery = productQuery.eq('categoria', context.categoria)
        }

        const { data: productos, error: prodError } = await productQuery

        if (prodError) {
            console.error('Error al obtener productos:', prodError)
            return NextResponse.json(
                { error: 'Error al cargar productos' },
                { status: 500 }
            )
        }

        // 4. Obtener contexto de clientes (opcional)
        let clientes: any[] = []

        if (context?.includeClients !== false) {
            const { data: clientesData } = await supabase
                .from('usuarios')
                .select('id, nombre_completo, email, telefono, dni_cuit')
                .eq('rol', 'cliente')
                .eq('aprobado', true)
                .limit(20)

            clientes = clientesData || []
        }

        // 5. Generar respuesta con Gemini
        console.log('🤖 Generando respuesta con Gemini...')
        const respuestaIA = await generateResponse(message, productos || [], clientes)
        console.log('✅ Respuesta generada')

        // 6. Guardar conversación en la base de datos
        const conversationId = context?.conversationId || crypto.randomUUID()

        await supabase
            .from('conversaciones_ia')
            .insert({
                usuario_id: user.id,
                mensaje_usuario: message,
                respuesta_ia: respuestaIA,
                contexto: {
                    productos_count: productos?.length || 0,
                    clientes_count: clientes.length,
                    conversation_id: conversationId
                }
            })

        // 7. Retornar respuesta
        return NextResponse.json({
            success: true,
            response: respuestaIA,
            conversationId,
            timestamp: new Date().toISOString()
        })

    } catch (error: any) {
        console.error('Error en API de chat IA:', error)

        return NextResponse.json(
            {
                error: 'Error al procesar tu consulta',
                details: error.message
            },
            { status: 500 }
        )
    }
}

/**
 * Método GET para verificar estado del servicio
 */
export async function GET() {
    return NextResponse.json({
        service: 'AI Chat Assistant',
        status: 'online',
        model: process.env.GEMINI_MODEL || 'gemini-1.5-pro-latest',
        version: '1.0.0'
    })
}

/**
 * Preparación para integración futura con WhatsApp Business API
 * 
 * IMPORTANTE: Esta integración requiere:
 * 1. Cuenta de WhatsApp Business API (no WhatsApp Business App)
 * 2. Verificación de negocio con Meta
 * 3. Número de teléfono dedicado
 * 4. Proceso de aprobación de 1-2 semanas
 * 
 * Contacto actual del depósito: +543435136855
 */

export interface WhatsAppMessage {
    from: string
    to: string
    message: string
    timestamp: string
    messageId?: string
}

export interface WhatsAppWebhookPayload {
    object: string
    entry: Array<{
        id: string
        changes: Array<{
            value: {
                messaging_product: string
                metadata: {
                    display_phone_number: string
                    phone_number_id: string
                }
                messages?: Array<{
                    from: string
                    id: string
                    timestamp: string
                    text: {
                        body: string
                    }
                    type: string
                }>
            }
        }>
    }>
}

/**
 * Configuración de WhatsApp Business API
 */
const WHATSAPP_CONFIG = {
    apiUrl: 'https://graph.facebook.com/v18.0',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'medical-pharma-webhook-token',
    businessPhoneNumber: '+543435136855'
}

/**
 * Enviar mensaje de WhatsApp (FUTURO)
 */
export async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
    if (!WHATSAPP_CONFIG.phoneNumberId || !WHATSAPP_CONFIG.accessToken) {
        console.warn('WhatsApp no configurado. Mensaje no enviado:', { to, message })
        return false
    }

    try {
        const response = await fetch(
            `${WHATSAPP_CONFIG.apiUrl}/${WHATSAPP_CONFIG.phoneNumberId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: to.replace(/\D/g, ''), // Solo números
                    type: 'text',
                    text: {
                        body: message
                    }
                })
            }
        )

        if (!response.ok) {
            throw new Error(`WhatsApp API error: ${response.statusText}`)
        }

        return true
    } catch (error) {
        console.error('Error al enviar mensaje de WhatsApp:', error)
        return false
    }
}

/**
 * Procesar mensaje entrante de WhatsApp (FUTURO)
 */
export async function processIncomingWhatsAppMessage(payload: WhatsAppWebhookPayload): Promise<void> {
    const entry = payload.entry?.[0]
    const change = entry?.changes?.[0]
    const message = change?.value?.messages?.[0]

    if (!message) {
        console.log('No hay mensaje en el payload')
        return
    }

    const from = message.from
    const text = message.text?.body
    const messageId = message.id

    console.log('Mensaje recibido de WhatsApp:', { from, text, messageId })

    // TODO: Integrar con el asistente IA
    // 1. Identificar usuario por número de teléfono
    // 2. Enviar mensaje al asistente IA
    // 3. Obtener respuesta
    // 4. Enviar respuesta por WhatsApp

    // Ejemplo de respuesta automática:
    // await sendWhatsAppMessage(from, '¡Hola! Gracias por contactarte con Medical Pharma. Un vendedor te responderá pronto.')
}

/**
 * Verificar webhook de WhatsApp (requerido por Meta)
 */
export function verifyWhatsAppWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === WHATSAPP_CONFIG.verifyToken) {
        console.log('Webhook de WhatsApp verificado')
        return challenge
    }

    console.warn('Verificación de webhook fallida')
    return null
}

/**
 * Formatear mensaje para WhatsApp
 * WhatsApp tiene límites de caracteres y formato específico
 */
export function formatMessageForWhatsApp(message: string): string {
    // WhatsApp permite hasta 4096 caracteres
    const maxLength = 4096

    if (message.length > maxLength) {
        return message.substring(0, maxLength - 3) + '...'
    }

    return message
}

/**
 * Plantillas de mensajes para WhatsApp
 */
export const WHATSAPP_TEMPLATES = {
    nuevoPedido: (numeroPedido: string, total: number) =>
        `📦 *Nuevo Pedido Recibido*\n\nPedido: #${numeroPedido}\nMonto: $${total.toFixed(2)}\n\nVerificar en dashboard.`,

    stockBajo: (producto: string, stock: number) =>
        `⚠️ *Alerta de Stock Bajo*\n\nProducto: ${producto}\nStock actual: ${stock} unidades\n\nGestionar reposición.`,

    clienteNuevo: (nombre: string) =>
        `👤 *Nuevo Cliente Registrado*\n\nNombre: ${nombre}\n\nPendiente de aprobación en el panel.`,

    bienvenida: (nombre: string) =>
        `¡Hola ${nombre}! 👋\n\nBienvenido a MEDICAL FARMA S.A.\n\n¿En qué podemos ayudarte hoy?`
}

/**
 * Guía de implementación para WhatsApp Business API
 */
export const WHATSAPP_IMPLEMENTATION_GUIDE = `
# Guía de Implementación: WhatsApp Business API

## Requisitos Previos

1. **Cuenta de Meta Business**
   - Crear cuenta en business.facebook.com
   - Verificar identidad del negocio
   - Agregar método de pago

2. **Número de Teléfono**
   - Número dedicado para WhatsApp Business
   - No puede estar registrado en WhatsApp personal
   - Recomendado: +543435136855 (depósito)

3. **Verificación de Negocio**
   - Documentación legal de la empresa
   - Comprobante de domicilio
   - Proceso de revisión: 1-2 semanas

## Pasos de Configuración

### 1. Configurar WhatsApp Business API
\`\`\`bash
# En Meta Business Manager:
1. Ir a "WhatsApp" > "Comenzar"
2. Seleccionar número de teléfono
3. Verificar número con código SMS
4. Crear perfil de negocio
\`\`\`

### 2. Obtener Credenciales
\`\`\`env
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id
WHATSAPP_ACCESS_TOKEN=tu_access_token
WHATSAPP_VERIFY_TOKEN=medical-pharma-webhook-token
\`\`\`

### 3. Configurar Webhook en n8n
- URL: https://vps-5604742-x.dattaweb.com/webhook/whatsapp-incoming
- Método: POST
- Eventos: messages, message_status

### 4. Activar Nodos de WhatsApp en n8n
- Descomentar nodos WhatsApp en workflows
- Configurar credenciales
- Probar envío de mensajes

### 5. Integrar con Asistente IA
- Crear endpoint /api/whatsapp/webhook
- Procesar mensajes entrantes
- Enviar a Gemini AI
- Responder automáticamente

## Costos Estimados

- Conversaciones iniciadas por negocio: ~$0.05 USD/mensaje
- Conversaciones iniciadas por usuario: Gratis (primeras 24h)
- Plantillas aprobadas: Gratis
- Sesiones de servicio: Variable según país

## Plantillas Requeridas

Crear y aprobar plantillas en Meta Business Manager:
1. Confirmación de pedido
2. Actualización de estado
3. Alerta de stock
4. Bienvenida a clientes

## Testing

1. Usar número de prueba de Meta
2. Enviar mensajes de prueba
3. Verificar recepción en n8n
4. Validar respuestas del asistente IA

## Documentación Oficial

- https://developers.facebook.com/docs/whatsapp/cloud-api
- https://business.whatsapp.com/products/business-platform
`


/**
 * Librería para interactuar con los flujos de automatización de n8n
 */

// Usamos la URL pública de n8n directamente para hosting estático
const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://vps-5604742-x.dattaweb.com/webhook'

/**
 * Dispara un flujo de trabajo en n8n
 * @param webhookPath El segmento final de la URL del webhook (ej: 'nuevo-pedido')
 * @param data Los datos a enviar al flujo
 */
export async function triggerWorkflow(webhookPath: string, data: any) {
    try {
        // Enviar directamente a n8n
        // Nota: Asegúrate de que n8n tenga CORS habilitado si esto falla desde el navegador
        const response = await fetch(`${N8N_WEBHOOK_URL}/${webhookPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                source: 'medical-farma-web-static'
            }),
        })

        if (!response.ok) {
            throw new Error(`Error en n8n: ${response.statusText}`)
        }

        return { success: true }
    } catch (error) {
        console.error(`Fallo al disparar workflow ${webhookPath}:`, error)
        // No bloqueamos la UI si falla la automatización, pero lo registramos
        return { success: false, error }
    }
}

// --- CATALOGO DE EVENTOS ---

/**
 * Notificar nuevo pedido a ventas/logística
 */
export async function notificarNuevoPedido(pedido: any) {
    return triggerWorkflow('nuevo-pedido', pedido)
}

/**
 * Notificar alerta de stock bajo a compras
 */
export async function notificarStockBajo(producto: any) {
    return triggerWorkflow('alerta-stock', producto)
}

/**
 * Notificar registro de nuevo cliente para validación
 */
export async function notificarNuevoCliente(cliente: any) {
    return triggerWorkflow('validacion-cliente', cliente)
}

/**
 * Notificar cambio de estado de pedido (ej: entregado)
 */
export async function notificarEstadoPedido(pedidoId: string, estado: string, clienteEmail: string) {
    return triggerWorkflow('estado-pedido', { pedidoId, estado, clienteEmail })
}

/**
 * Solicitar importación de stock (n8n procesará los datos)
 */
export async function solicitarImportacionStock(data: any[]) {
    return triggerWorkflow('import-stock', { body: data })
}

/**
 * Solicitar exportación de stock (n8n generará un archivo)
 */
export async function solicitarExportacionStock() {
    return triggerWorkflow('export-stock', {})
}

$ErrorActionPreference = "Continue"

# Configuración
$BaseWebhookUrl = "https://vps-5604742-x.dattaweb.com/webhook"

# Función Helper
function Test-Webhook {
    param(
        [string]$Name,
        [string]$Path,
        [string]$JsonPayload
    )
    Write-Host "----------------------------------------"
    Write-Host "Probando: $Name" -ForegroundColor Cyan
    $Url = "$BaseWebhookUrl/$Path"
    Write-Host "URL: $Url" -ForegroundColor DarkGray
    
    try {
        # Convertir JSON string a objeto para Invoke-RestMethod
        $Body = $JsonPayload | ConvertFrom-Json
        
        $Response = Invoke-RestMethod -Uri $Url -Method Post -Body $Body -ContentType "application/json" -ErrorAction Stop
        
        Write-Host "Estado: ÉXITO" -ForegroundColor Green
        Write-Host "Respuesta:"
        $Response | ConvertTo-Json -Depth 2 | Write-Host -ForegroundColor Gray
    }
    catch {
        Write-Host "Estado: ERROR" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Yellow
        if ($_.Exception.Response) {
            $Stream = $_.Exception.Response.GetResponseStream()
            $Reader = New-Object System.IO.StreamReader($Stream)
            $Body = $Reader.ReadToEnd()
            Write-Host "Detalle del error: $Body" -ForegroundColor Red
        }
    }
}

Write-Host "=== INICIANDO PRUEBAS DE WORKFLOWS N8N ===" -ForegroundColor Magenta

# 1. Nuevo Pedido
$Payload1 = '{
    "numero_pedido": "TEST-AUTO-001",
    "cliente_id": "Cliente Prueba",
    "total": 12500.50
}'
Test-Webhook -Name "1. Nuevo Pedido" -Path "nuevo-pedido" -JsonPayload $Payload1

# 2. Alerta Stock
$Payload2 = '{
    "producto": "Paracetamol Test 500mg",
    "sku": "TEST-PAR-500",
    "stock": 5
}'
Test-Webhook -Name "2. Alerta Stock" -Path "alerta-stock" -JsonPayload $Payload2

# 3. Validación Cliente
$Payload3 = '{
    "nombre_completo": "Usuario Test Automático",
    "dni_cuit": "20123456789",
    "email": "test@medicalfarma.com"
}'
Test-Webhook -Name "3. Validación Cliente" -Path "validacion-cliente" -JsonPayload $Payload3

# 4. Seguridad (Cambio Pass)
$Payload4a = '{
    "evento": "cambio_password",
    "nombre_completo": "Admin Test"
}'
Test-Webhook -Name "4. Seguridad (Cambio Password)" -Path "seguridad-accesos" -JsonPayload $Payload4a

# 4. Seguridad (Login)
$Payload4b = '{
    "evento": "login",
    "nombre_completo": "Admin Test",
    "dispositivo": "Test Script Runner",
    "ubicacion": "Datacenter",
    "fecha": "2026-02-03"
}'
Test-Webhook -Name "4. Seguridad (Alerta Login)" -Path "seguridad-accesos" -JsonPayload $Payload4b

# 5. Gestión Cuentas (Aprobado)
$Payload5 = '{
    "nuevo_estado": "aprobado",
    "nombre_completo": "Cliente Nuevo Test"
}'
Test-Webhook -Name "5. Gestión Cuentas (Aprobación)" -Path "gestion-cuentas" -JsonPayload $Payload5

# 6. Alertas Morosidad
$Payload6 = '{
    "institucion": "Clínica Test Deuda",
    "monto_vencido": 50000,
    "detalle_facturas": "FAC-TEST-999",
    "email_cliente": "pagos@clinica-test.com"
}'
Test-Webhook -Name "6. Alertas Morosidad" -Path "alerta-morosidad" -JsonPayload $Payload6

# 7. Import Stock (Atención: Esto intentará escribir en BD, usamos datos dummy)
# El nodo espera un ARRAY de objetos en el body.
$Payload7 = '[{
    "nombre": "PRODUCTO TEST INTEGRACION",
    "marca": "Generico",
    "descripcion_tecnica": "Producto creado por script de prueba",
    "categoria": "Test",
    "stock_actual": 100,
    "precio_compra": 10,
    "precio_venta_final": 20,
    "estado": "inactivo"
}]'
# Nota: La URL es import-stock
Test-Webhook -Name "7. Importación Stock" -Path "import-stock" -JsonPayload $Payload7

Write-Host "`n=== PRUEBAS FINALIZADAS ===" -ForegroundColor Magenta

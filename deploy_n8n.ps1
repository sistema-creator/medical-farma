$ErrorActionPreference = "Stop"

Write-Host "=== Despliegue de Workflows n8n Medical Farma ===" -ForegroundColor Cyan

# 1. Verificar Python y Dependencias
Write-Host "1. Verificando entorno..."
try {
    python --version | Out-Null
}
catch {
    Write-Error "Python no está instalado o no está en el PATH."
}

try {
    python -c "import requests" | Out-Null
}
catch {
    Write-Host "Instalando librería 'requests'..." -ForegroundColor Yellow
    pip install requests
}

# 2. Solicitar Credenciales
$apiKey = Read-Host "Ingresa tu N8N_API_KEY (API Key del Owner)"
if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Error "La API Key es obligatoria."
}

$baseUrl = Read-Host "Ingresa la URL de n8n [Enter para http://localhost:5678]"
if ([string]::IsNullOrWhiteSpace($baseUrl)) {
    $baseUrl = "http://localhost:5678"
}

$env:N8N_API_KEY = $apiKey
$env:N8N_BASE_URL = $baseUrl

# 3. Función Helper
function Deploy-Workflow {
    param($file)
    Write-Host "Desplegando $file..." -ForegroundColor Gray
    try {
        python n8n_manager.py create "n8n_workflows\$file"
        Write-Host "OK: $file" -ForegroundColor Green
    }
    catch {
        Write-Host "ERROR al desplegar $file" -ForegroundColor Red
        Write-Host $_
    }
}

# 4. Desplegar Workflows Modulares
Write-Host "`n2. Creando nuevos workflows modulares..." -ForegroundColor Cyan

$workflows = @(
    "1_Nuevo_Pedido.json",
    "2_Alerta_Stock.json",
    "3_Validacion_Cliente.json",
    "4_Gestion_Stock_Import_Export.json",
    "4_Seguridad_Accesos.json",
    "5_Gestion_Cuentas.json",
    "6_Alertas_Morosidad.json"
)

foreach ($wf in $workflows) {
    Deploy-Workflow -file $wf
}

# 5. Desactivar Monolito Antiguo
Write-Host "`n3. Desactivando workflow antiguo (Monolito)..." -ForegroundColor Cyan
$oldWorkflowId = "_Xfk9B2FKxLMS62ARxrS7"
try {
    python n8n_manager.py deactivate $oldWorkflowId
    Write-Host "Monolito desactivado correctamente." -ForegroundColor Green
}
catch {
    Write-Host "Nota: No se pudo desactivar el monolito (quizás ya no existe o cambió ID)." -ForegroundColor Yellow
}

Write-Host "`n=== Despliegue Completado ===" -ForegroundColor Cyan
Write-Host "Por favor, verifica en tu panel de n8n que los nuevos workflows estén activos."

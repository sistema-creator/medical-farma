# Definir rutas
$ProjectDir = "c:\Users\Pablo\Documents\MEDICAL FARMA WEB"
$PublicDir = Join-Path $ProjectDir "public"
$LogoPath = Join-Path $PublicDir "logo.png"
$IconPath = Join-Path $PublicDir "logo.ico"
$BatchPath = Join-Path $ProjectDir "INICIAR_LOCAL.bat"
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "Medical Farma Local.lnk"

# 1. Intentar convertir el logo a un archivo .ico basico (metodo sin dependencias externas)
# Nota: Windows puede usar archivos .png para iconos en algunos contextos, 
# pero un .ico de una sola capa es mas compatible para el acceso directo.
Add-Type -AssemblyName System.Drawing
try {
    $bmp = [System.Drawing.Bitmap]::FromFile($LogoPath)
    $hIcon = $bmp.GetHicon()
    $icon = [System.Drawing.Icon]::FromHandle($hIcon)
    
    $fileStream = New-Object System.IO.FileStream($IconPath, [System.IO.FileMode]::Create)
    $icon.Save($fileStream)
    $fileStream.Close()
    $bmp.Dispose()
    Write-Host "Icono generado con exito: $IconPath" -ForegroundColor Green
} catch {
    Write-Warning "No se pudo generar el archivo .ico. Se usara el icono predeterminado."
    $IconPath = $null
}

# 2. Crear el acceso directo en el escritorio
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "cmd.exe"
$Shortcut.Arguments = "/c `"$BatchPath`""
$Shortcut.WorkingDirectory = $ProjectDir
$Shortcut.Description = "Iniciar Medical Farma en Localhost"
if ($IconPath) {
    $Shortcut.IconLocation = $IconPath
}
$Shortcut.Save()

Write-Host "Acceso directo creado en el escritorio: $ShortcutPath" -ForegroundColor Green

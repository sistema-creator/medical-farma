@echo off
title INICIAR MEDICAL FARMA - LOCAL
echo.
echo ==========================================
echo    INICIANDO PROYECTO MEDICAL FARMA
echo ==========================================
echo.
echo 1. Quieres limpiar la cache antes de empezar? (Recomendado si ves errores)
set /p clean="Escribe 'S' para limpiar o pulsa Enter para continuar: "
if /i "%clean%"=="S" (
    echo    Limpiando cache .next...
    rmdir /s /q .next 2>nul
    echo    Cache limpia.
)
echo.
echo 2. Abriendo la aplicacion en el navegador...
start http://localhost:3000
echo.
echo 3. Iniciando el servidor de desarrollo...
echo    (Presiona Ctrl+C para detener el servidor)
echo.
npm run dev
pause

@echo off
echo ========================================
echo   MEDICAL FARMA - Preparacion para Hosting
echo ========================================
echo.

echo [1/3] Limpiando build anterior...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out

echo [2/3] Instalando dependencias...
call npm install

echo [3/3] Construyendo version de produccion...
call npm run build

echo.
echo ========================================
echo   BUILD COMPLETADO!
echo ========================================
echo.
echo Archivos listos en la carpeta .next
echo.
echo Opciones para desplegar:
echo 1. Subir todo el proyecto a Vercel/Netlify
echo 2. Usar 'npm start' en tu servidor Node.js
echo 3. Ver INSTRUCCIONES_DESPLIEGUE.md para mas detalles
echo.
pause

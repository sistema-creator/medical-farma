@echo off
echo ========================================
echo   MEDICAL FARMA - Preparando Archivos para Ferozo
echo ========================================
echo.

echo [1/4] Limpiando carpetas anteriores...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist CARPETA_SUBIDA_FEROZO rmdir /s /q CARPETA_SUBIDA_FEROZO
mkdir CARPETA_SUBIDA_FEROZO

echo.
echo [2/4] Instalando dependencias (asegurando todo al dia)...
call npm install

echo.
echo [3/4] Generando sitio estatico (npm run build)...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    echo   ERROR EN EL BUILD
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    echo   Por favor revisa los errores arriba.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [4/4] Copiando archivos a CARPETA_SUBIDA_FEROZO...
xcopy out\* CARPETA_SUBIDA_FEROZO\ /E /I /Y

echo.
echo ========================================
echo   LISTO!
echo   La carpeta 'CARPETA_SUBIDA_FEROZO' tiene todo
echo   lo que necesitas subir al 'public_html' de Ferozo.
echo ========================================
echo.
pause

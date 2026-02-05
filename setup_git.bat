@echo off
setlocal

echo [INFO] Buscando instalacion de Git...

REM Intentar encontrar git en PATH
where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set "GIT_CMD=git"
    goto :FOUND
)

REM Intentar rutas comunes
if exist "C:\Program Files\Git\cmd\git.exe" (
    set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    goto :FOUND
)
if exist "C:\Program Files\Git\bin\git.exe" (
    set "GIT_CMD=C:\Program Files\Git\bin\git.exe"
    goto :FOUND
)
if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" (
    set "GIT_CMD=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
    goto :FOUND
)

echo [ERROR] No se pudo encontrar Git. Por favor instala Git desde https://git-scm.com/download/win y reinicia la consola.
pause
exit /b 1

:FOUND
echo [INFO] Git encontrado: %GIT_CMD%

echo.
echo [1/4] Inicializando repositorio...
"%GIT_CMD%" init
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo al inicializar repositorio.
    pause
    exit /b 1
)

echo.
echo [2/4] Configurando usuario (si hace falta)...
REM Configurar usuario localmente si no existe global
"%GIT_CMD%" config user.name "Medical Farma Admin"
"%GIT_CMD%" config user.email "admin@medicalfarma.com"

echo.
echo [3/4] Agregando archivos...
"%GIT_CMD%" add .

echo.
echo [4/4] Creando commit inicial...
"%GIT_CMD%" commit -m "Configuracion inicial para Vercel: API Bridge y optimizacion"

echo.
echo [EXITO] Repositorio Git configurado correctamente.
echo.
echo Ahora sigue los pasos en la web de Vercel para importar este proyecto.
echo Si necesitas subirlo a GitHub, ejecuta:
echo    git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
echo    git branch -M main
echo    git push -u origin main
echo.
pause

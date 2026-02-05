@echo off
setlocal
echo [INFO] Buscando instalacion de Git...

REM Intentar encontrar git en PATH y rutas comunes
where git >nul 2>nul
if %ERRORLEVEL% EQU 0 ( set "GIT_CMD=git" && goto :FOUND )
if exist "C:\Program Files\Git\cmd\git.exe" ( set "GIT_CMD=C:\Program Files\Git\cmd\git.exe" && goto :FOUND )
if exist "C:\Program Files\Git\bin\git.exe" ( set "GIT_CMD=C:\Program Files\Git\bin\git.exe" && goto :FOUND )
if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" ( set "GIT_CMD=%LOCALAPPDATA%\Programs\Git\cmd\git.exe" && goto :FOUND )

echo [ERROR] No se encuentra Git.
pause
exit /b 1

:FOUND
echo.
echo ==========================================
echo    SUBIR PROYECTO A GITHUB
echo ==========================================
echo.
echo 1. Ve a https://github.com/new
echo 2. Crea un repositorio vacio (sin README, sin .gitignore)
echo 3. Copia la URL HTTPS (ej: https://github.com/usuario/repo.git)
echo.
set /p REPO_URL="Pega la URL del repositorio aqui: "

if "%REPO_URL%"=="" (
    echo [ERROR] URL no valida.
    pause
    exit /b 1
)

echo.
echo [1/3] Configurando remoto...
"%GIT_CMD%" remote remove origin >nul 2>nul
"%GIT_CMD%" remote add origin %REPO_URL%

echo.
echo [2/3] Verificando rama principal...
"%GIT_CMD%" branch -M main

echo.
echo [3/3] Subiendo codigo (Se abrira una ventana de login en el navegador)...
"%GIT_CMD%" push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Hubo un problema al subir. Verifica la URL y tus permisos.
) else (
    echo.
    echo [EXITO] Proyecto subido a GitHub correctamente!
)

echo.
pause

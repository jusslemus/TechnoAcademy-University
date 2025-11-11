@echo off
REM =====================================================
REM SCRIPT DE INICIO - TECHNOACADEMY UNIVERSITY
REM =====================================================

echo.
echo ╔═══════════════════════════════════════════════════╗
echo ║  🎓 TECHNOACADEMY UNIVERSITY                      ║
echo ║  Sistema de Registro Académico                    ║
echo ╚═══════════════════════════════════════════════════╝
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    echo Descárgalo desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detectado
node --version

echo.
echo 📦 Verificando dependencias...
if not exist "node_modules" (
    echo ⚠️  Carpeta node_modules no encontrada
    echo 🔄 Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencias ya instaladas
)

echo.
echo 🔐 Verificando archivo .env...
if not exist ".env" (
    echo ⚠️  Archivo .env no encontrado
    echo 📋 Creando desde plantilla...
    copy ".env.example" ".env"
    echo ⚠️  IMPORTANTE: Edita .env con tus credenciales Oracle
    echo    Usuario: %EDITOR%
    pause
)

echo.
echo 🗄️  Base de datos: SCHEMA.sql
echo    Asegúrate de ejecutar este archivo en Oracle SQL*Plus
echo    Comando: @SCHEMA.sql
echo.

echo ✅ Configuración completa!
echo.
echo 🚀 Iniciando servidor...
echo.
echo   http://localhost:3000
echo.
echo Presiona CTRL+C para detener
echo.

call npm start
pause

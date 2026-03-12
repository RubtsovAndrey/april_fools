@echo off
chcp 65001 >nul 2>&1
title Dodo Reigns - Game Server

echo ========================================
echo   DODO REIGNS - Game Server
echo ========================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo [1/2] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: npm install failed!
        echo Make sure Node.js is installed: https://nodejs.org
        pause
        exit /b 1
    )
    echo.
)

echo [2/2] Starting dev server on http://127.0.0.1:3000
echo.
echo Game will open in your browser automatically.
echo Press Ctrl+C to stop the server.
echo ========================================
echo.

:: Use 127.0.0.1 instead of localhost for VPN compatibility
:: Vite config already binds to 127.0.0.1
call npx vite --host 127.0.0.1 --port 3000 --open

pause

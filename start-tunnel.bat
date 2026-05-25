@echo off
echo ========================================
echo  LingvaUZ - Tunnel + Expo Starter
echo ========================================
echo.
echo [1/2] Starting backend ngrok tunnel...
echo Backend: https://seclusion-watch-deception.ngrok-free.dev
echo.
start "Backend Tunnel" cmd /k "cd /d %~dp0 && ngrok start backend --config ngrok.yml"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Expo in LAN mode...
echo.
echo NOTE: Phone must be on same WiFi as laptop.
echo If you need tunnel for Expo too, run in another terminal:
echo   npx localtunnel --port 8081
echo.
cd /d %~dp0mobile
start "Expo Dev" cmd /k "npx expo start --lan --clear"

echo.
echo Both started! Check the opened windows.
pause

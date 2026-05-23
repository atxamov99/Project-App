@echo off
echo ========================================
echo  LingvaUZ - Full Tunnel Mode (Cellular)
echo ========================================
echo.
echo [1/3] Starting backend ngrok tunnel...
echo Backend API: https://seclusion-watch-deception.ngrok-free.dev/api
start "Backend Tunnel" cmd /k "ngrok start backend --config %~dp0ngrok.yml"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Expo dev server...
start "Expo Dev" cmd /k "cd /d %~dp0mobile && npx expo start --lan --clear"

timeout /t 3 /nobreak >nul

echo [3/3] Starting localtunnel for Expo (port 8081)...
echo.
echo *** COPY the localtunnel URL below and open it in Expo Go ***
echo *** URL format: exp+https://xxx.loca.lt ***
echo.
start "Expo Tunnel" cmd /k "npx localtunnel --port 8081 --subdomain lingvauz-expo"

echo.
echo All 3 started!
echo - Backend:  https://seclusion-watch-deception.ngrok-free.dev
echo - Expo LAN: Check the Expo Dev window for LAN URL
echo - Expo URL: Check the Expo Tunnel window (localtunnel URL)
pause

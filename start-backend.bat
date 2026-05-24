@echo off
echo Starting LingvaUZ Backend + Ngrok...

cd /d "%~dp0backend"

echo [1/2] Starting backend on port 3001...
start "LingvaUZ Backend" cmd /k "node dist/server.js"

timeout /t 3 /nobreak > nul

echo [2/2] Starting ngrok tunnel...
start "LingvaUZ Ngrok" cmd /k "C:\Users\GIGABYTE\AppData\Roaming\npm\node_modules\ngrok\bin\ngrok.exe http --domain=seclusion-watch-deception.ngrok-free.dev 3001"

echo.
echo Backend: http://localhost:3001
echo Public:  https://seclusion-watch-deception.ngrok-free.dev
echo Mobile ENV: already configured
echo.
echo Ready! Run mobile with: npx expo start --tunnel
pause

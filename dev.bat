@echo off
set PATH=C:\Program Files\nodejs;%PATH%
title Riverside Community Hall Dev Mode
echo ===================================================
echo Starting Backend (Port 5000) and Frontend (Port 5173)...
echo ===================================================
cd /d %~dp0
start "Riverside Backend (5000)" cmd /c "set PATH=C:\Program Files\nodejs;%PATH% && node server/src/index.js"
timeout /t 2 /nobreak > nul
cd /d %~dp0\client
start "Riverside Frontend (5173)" cmd /c "set PATH=C:\Program Files\nodejs;%PATH% && npx vite --port 5173"
echo.
echo ===================================================
echo Both servers started!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo ===================================================


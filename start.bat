@echo off
set PATH=C:\Program Files\nodejs;%PATH%
title Riverside Community Hall Server
echo ===================================================
echo Starting Riverside Community Hall on http://localhost:5000
echo ===================================================
cd /d %~dp0
node server/src/index.js
pause


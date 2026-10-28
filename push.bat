@echo off
set "PATH=C:\Users\abdul\AppData\Local\Programs\Git\cmd;%PATH%"
cd /d "%~dp0"
echo ===================================================
echo   Pushing Riverside Community Hall to GitHub
echo   Repository: https://github.com/abduladnan-01/community-hall-booking
echo ===================================================
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo If prompted, sign in via your browser or provide a GitHub Personal Access Token.
)
pause

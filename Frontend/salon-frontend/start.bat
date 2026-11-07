@echo off
echo ============================================
echo   Shreyanshu Salon Frontend (JS) - Setup + Run
echo ============================================
echo.
echo [1/2] Installing dependencies (first run only, takes a minute)...
call npm install
if errorlevel 1 (
    echo.
    echo Something went wrong during npm install. Copy the error above and send it over.
    pause
    exit /b 1
)
echo.
echo [2/2] Starting the dev server...
echo Once it says "Local: http://localhost:3000", open that link in your browser.
echo.
call npm run dev
pause

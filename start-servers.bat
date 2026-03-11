@echo off
echo ========================================
echo   MWU Clearance System - Starting...
echo ========================================
echo.

REM Check if XAMPP MySQL is running
echo [1/4] Checking MySQL...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MySQL is running
) else (
    echo ✗ MySQL is not running!
    echo Please start MySQL from XAMPP Control Panel
    pause
    exit /b 1
)

echo.
echo [2/4] Starting Backend Server...
echo Backend will run on: http://localhost:8000
start "Backend Server" cmd /k "cd backend && php artisan serve"

timeout /t 3 /nobreak >nul

echo.
echo [3/4] Starting Frontend Server...
echo Frontend will run on: http://localhost:3000
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo [4/4] Servers Started!
echo ========================================
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to open the application in browser...
pause >nul

start http://localhost:3000

echo.
echo Servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause

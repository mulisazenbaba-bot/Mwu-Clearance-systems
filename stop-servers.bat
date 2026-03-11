@echo off
echo ========================================
echo   Stopping MWU Clearance System...
echo ========================================
echo.

echo [1/2] Stopping Backend Server (Port 8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo ✓ Backend server stopped
)

echo.
echo [2/2] Stopping Frontend Server (Port 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo ✓ Frontend server stopped
)

echo.
echo ========================================
echo   All servers stopped!
echo ========================================
echo.
pause

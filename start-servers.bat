@echo off
echo Starting MWU Clearance System...

echo Starting Laravel Backend...
start "Laravel Backend" cmd /k "cd backend && php artisan serve"

timeout /t 2 /nobreak >nul

echo Starting Next.js Frontend...
start "Next.js Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Wait 10-15 seconds then open http://localhost:3000
pause
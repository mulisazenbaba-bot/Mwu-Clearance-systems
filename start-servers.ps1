# MWU Clearance System - Start Servers Script

Write-Host "Starting MWU Clearance System..." -ForegroundColor Green

# Start Laravel Backend
Write-Host "Starting Laravel Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend'; php artisan serve"

# Wait a moment
Start-Sleep -Seconds 2

# Start Next.js Frontend
Write-Host "Starting Next.js Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frontend'; npm run dev"

Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend: http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Wait 10-15 seconds then open http://localhost:3000" -ForegroundColor Magenta
# MDA Server Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MDA Backend Server Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to find and kill processes using port 3000
function Stop-PortProcess {
    param($Port)
    
    try {
        $processes = netstat -ano | Select-String ":$Port\s" | ForEach-Object {
            ($_ -split '\s+')[-1]
        }
        
        if ($processes) {
            Write-Host "Found processes using port $Port. Stopping them..." -ForegroundColor Yellow
            $processes | ForEach-Object {
                try {
                    Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
                    Write-Host "Stopped process ID: $_" -ForegroundColor Green
                } catch {
                    Write-Host "Could not stop process ID: $_" -ForegroundColor Red
                }
            }
        } else {
            Write-Host "No processes found using port $Port" -ForegroundColor Green
        }
    } catch {
        Write-Host "Error checking port $Port" -ForegroundColor Red
    }
}

# Stop processes on port 3000
Stop-PortProcess -Port 3000

Write-Host ""
Write-Host "Waiting 3 seconds for processes to fully stop..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting MDA Backend Server..." -ForegroundColor Green
Write-Host ""

# Start the server
try {
    node server.js
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} 
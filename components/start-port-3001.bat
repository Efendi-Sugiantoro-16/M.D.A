@echo off
echo ========================================
echo MDA Server on Port 3001
echo ========================================
echo.

echo Stopping all Node.js processes...
taskkill /f /im node.exe 2>nul

echo.
echo Waiting 3 seconds for processes to fully stop...
timeout /t 3 /nobreak >nul

echo.
echo Setting PORT=3001...
set PORT=3001

echo.
echo Starting MDA Backend Server on port 3001...
echo.
node server.js

pause 
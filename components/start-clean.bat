@echo off
echo ========================================
echo MDA Server Clean Start
echo ========================================
echo.

echo Stopping all Node.js processes...
taskkill /f /im node.exe 2>nul
if %errorlevel% equ 0 (
    echo Node.js processes stopped successfully.
) else (
    echo No Node.js processes found or already stopped.
)

echo.
echo Waiting 3 seconds for processes to fully stop...
timeout /t 3 /nobreak >nul

echo.
echo Starting MDA Backend Server...
echo.
node server.js

pause 
@echo off
echo ========================================
echo    MDA Backend Server Startup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo WARNING: .env file not found
    echo Copying env.example to .env...
    copy env.example .env
    echo Please edit .env file with your configuration
    echo.
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

REM Setup database if needed
echo Checking database setup...
node database/setup.js
if %errorlevel% neq 0 (
    echo WARNING: Database setup may have failed
    echo Please check your database configuration
    echo.
)

REM Start the server
echo Starting MDA Backend Server...
echo.
echo Server will be available at:
echo - API: http://localhost:3000/api
echo - Health Check: http://localhost:3000/health
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause 
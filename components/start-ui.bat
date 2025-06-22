@echo off
echo ========================================
echo    MDA Admin Dashboard Starter
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ❌ Please run this script from the backend directory
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found, creating from env.example...
    copy env.example .env
    if %errorlevel% neq 0 (
        echo ❌ Failed to create .env file
        pause
        exit /b 1
    )
    echo ✅ .env file created
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
)

REM Check if database is set up
echo 🔍 Checking database setup...
node -e "const { testConnection } = require('./database/config'); testConnection().then(connected => { if (!connected) { console.log('❌ Database not connected'); process.exit(1); } else { console.log('✅ Database connected'); } });"
if %errorlevel% neq 0 (
    echo.
    echo ❌ Database connection failed
    echo Please ensure MySQL is running and configured in .env file
    echo.
    echo Running database setup...
    npm run migrate
    if %errorlevel% neq 0 (
        echo ❌ Database setup failed
        pause
        exit /b 1
    )
    echo ✅ Database setup completed
)

echo.
echo 🚀 Starting MDA Admin Dashboard...
echo.
echo 📊 Admin Dashboard: http://localhost:3000
echo 🔐 Login Page: http://localhost:3000/login
echo 🏥 Health Check: http://localhost:3000/api/health
echo.
echo Default Login Credentials:
echo Email: admin@mda.com
echo Password: admin123
echo.
echo Press Ctrl+C to stop the server
echo.

npm start 
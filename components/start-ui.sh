#!/bin/bash

echo "========================================"
echo "    MDA Admin Dashboard Starter"
echo "========================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found"
echo

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found, creating from env.example..."
    cp env.example .env
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create .env file"
        exit 1
    fi
    echo "✅ .env file created"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
fi

# Check if database is set up
echo "🔍 Checking database setup..."
node -e "
const { testConnection } = require('./database/config');
testConnection().then(connected => {
    if (!connected) {
        console.log('❌ Database not connected');
        process.exit(1);
    } else {
        console.log('✅ Database connected');
    }
});
"

if [ $? -ne 0 ]; then
    echo
    echo "❌ Database connection failed"
    echo "Please ensure MySQL is running and configured in .env file"
    echo
    echo "Running database setup..."
    npm run migrate
    if [ $? -ne 0 ]; then
        echo "❌ Database setup failed"
        exit 1
    fi
    echo "✅ Database setup completed"
fi

echo
echo "🚀 Starting MDA Admin Dashboard..."
echo
echo "📊 Admin Dashboard: http://localhost:3000"
echo "🔐 Login Page: http://localhost:3000/login"
echo "🏥 Health Check: http://localhost:3000/api/health"
echo
echo "Default Login Credentials:"
echo "Email: admin@mda.com"
echo "Password: admin123"
echo
echo "Press Ctrl+C to stop the server"
echo

npm start 
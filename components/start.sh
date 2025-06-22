#!/bin/bash

echo "========================================"
echo "   MDA Backend Server Startup"
echo "========================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "WARNING: .env file not found"
    echo "Copying env.example to .env..."
    cp env.example .env
    echo "Please edit .env file with your configuration"
    echo
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
    echo
fi

# Setup database if needed
echo "Checking database setup..."
node database/setup.js
if [ $? -ne 0 ]; then
    echo "WARNING: Database setup may have failed"
    echo "Please check your database configuration"
    echo
fi

# Start the server
echo "Starting MDA Backend Server..."
echo
echo "Server will be available at:"
echo "- API: http://localhost:3000/api"
echo "- Health Check: http://localhost:3000/health"
echo
echo "Press Ctrl+C to stop the server"
echo

npm run dev 
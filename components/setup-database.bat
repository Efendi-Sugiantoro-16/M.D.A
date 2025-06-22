@echo off
echo ========================================
echo MDA Database Setup Script
echo ========================================
echo.

echo Creating database tables...
node database/create-tables.js
if %errorlevel% neq 0 (
    echo Error creating tables!
    pause
    exit /b 1
)

echo.
echo Seeding initial data...
node database/seed-ui.js
if %errorlevel% neq 0 (
    echo Error seeding data!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Database setup completed successfully!
echo ========================================
echo.
echo You can now:
echo - Start the server: npm start
echo - Access login: http://localhost:3000/login
echo - Access register: http://localhost:3000/register
echo.
echo Default admin credentials:
echo Email: admin@mda.com
echo Password: admin123
echo.
pause 


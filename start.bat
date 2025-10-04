@echo off
REM Expense Management System Startup Script for Windows

echo Starting Expense Management System...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Start backend
echo Starting backend server...
cd expense-backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
)

REM Check if .env exists
if not exist ".env" (
    echo Warning: .env file not found. Please create one based on .env.example
    echo You can copy .env.example to .env and modify the values
)

REM Start backend
start "Backend Server" cmd /k "npm run start:dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting frontend server...
cd ..\expense-frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)

REM Start frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ==========================================
echo Expense Management System is starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo ==========================================
echo.
echo Both servers are running in separate windows.
echo Close the windows to stop the servers.
echo.

pause

@echo off
echo ========================================
echo Starting Floorplan 3D Docker Environment
echo ========================================
echo.
echo Prerequisites:
echo - Docker Desktop for Windows must be running
echo - Run this script as Administrator
echo.
pause

REM Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running
    echo Please install Docker Desktop first
    pause
    exit /b 1
)

echo.
echo Building Docker image...
docker build -t floorplan-3d .
if %errorlevel% neq 0 (
    echo ERROR: Docker build failed
    pause
    exit /b 1
)

echo.
echo Starting Docker container...
docker run -d -p 3000:3000 --name floorplan-3d-dev floorplan-3d
if %errorlevel% neq 0 (
    echo ERROR: Failed to start Docker container
    pause
    exit /b 1
)

echo.
echo ========================================
echo Floorplan 3D is now running in Docker!
echo Access at: http://localhost:3000
echo ========================================
echo.
echo To stop: docker stop floorplan-3d-dev
echo To view logs: docker logs floorplan-3d-dev
echo.
pause

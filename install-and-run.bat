@echo off
echo ========================================
echo UserApp Backend Integration Setup
echo Production Mode - Render Backend
echo ========================================
echo.

echo Backend URL: https://passo-backend.onrender.com
echo Note: Local backend start karne ki zaroorat nahi!
echo.

echo Step 1: Installing axios...
call npm install axios
echo.

echo Step 2: Backend Status Check...
echo Checking if Render backend is live...
curl -s https://passo-backend.onrender.com/health
echo.
echo Note: First request slow ho sakti hai (cold start)
echo.

pause

echo Step 3: Starting React Native Metro...
start cmd /k "npm start"
echo.

echo Step 4: Waiting for Metro to start...
timeout /t 5
echo.

echo Step 5: Running on Android...
call npm run android
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your app should now be running with backend integration!
echo.
pause

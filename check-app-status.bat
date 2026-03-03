@echo off
echo ========================================
echo   APP STATUS CHECK
echo ========================================
echo.

echo [1/4] Checking Backend Health...
curl -s https://passo-backend.onrender.com/health
echo.
echo.

echo [2/4] Checking Categories Endpoint...
curl -s https://passo-backend.onrender.com/api/categories | findstr "success"
echo.
echo.

echo [3/4] Checking if Metro is running...
netstat -ano | findstr ":8081"
if %ERRORLEVEL% EQU 0 (
    echo ✅ Metro bundler is running on port 8081
) else (
    echo ❌ Metro bundler is NOT running
    echo    Run: npx react-native start
)
echo.

echo [4/4] Checking if Android device is connected...
adb devices
echo.

echo ========================================
echo   STATUS CHECK COMPLETE
echo ========================================
echo.
echo Next Steps:
echo 1. If backend is healthy ✅
echo 2. If categories endpoint works ✅
echo 3. If Metro is running ✅
echo 4. If device is connected ✅
echo.
echo Then run: npx react-native run-android
echo ========================================
pause

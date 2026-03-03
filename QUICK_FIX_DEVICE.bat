@echo off
cls
echo ========================================
echo   DEVICE CONNECTION CHECK
echo ========================================
echo.

echo [Step 1] Checking ADB...
where adb >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ADB not found!
    echo    Please install Android SDK Platform Tools
    pause
    exit /b 1
)
echo ✅ ADB found
echo.

echo [Step 2] Restarting ADB server...
adb kill-server
adb start-server
echo.

echo [Step 3] Checking connected devices...
adb devices
echo.

echo ========================================
echo   INSTRUCTIONS
echo ========================================
echo.
echo If you see a device listed above:
echo   ✅ Device is connected!
echo   ✅ Run: npm run android
echo.
echo If NO device is listed:
echo   ❌ No device connected
echo.
echo   Option 1: Connect Physical Phone
echo   1. Enable USB Debugging in phone
echo   2. Connect USB cable
echo   3. Allow USB debugging popup
echo   4. Run this script again
echo.
echo   Option 2: Start Android Emulator
echo   1. Open Android Studio
echo   2. Click Device Manager
echo   3. Start an emulator
echo   4. Run this script again
echo.
echo ========================================
pause

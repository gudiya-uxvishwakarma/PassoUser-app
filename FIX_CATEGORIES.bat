@echo off
echo ========================================
echo   FIXING CATEGORY DISPLAY ISSUE
echo ========================================
echo.

echo Step 1: Testing backend connection...
cd ..\Passo_backend
node test-categories.js
echo.

echo Step 2: Clearing React Native cache...
cd ..\UserApp
call npx react-native start --reset-cache
echo.

echo ========================================
echo   INSTRUCTIONS:
echo ========================================
echo 1. The backend has categories (check above)
echo 2. Metro bundler is starting with cleared cache
echo 3. In a NEW terminal, run: npx react-native run-android
echo 4. Check the Metro logs for category fetch messages
echo ========================================
pause

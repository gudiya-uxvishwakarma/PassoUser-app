@echo off
echo ========================================
echo Android App Logo Copy Script
echo ========================================
echo.

REM Set source folder where your logo files are
set SOURCE_FOLDER=C:\path\to\your\logo\files

echo Checking if source folder exists...
if not exist "%SOURCE_FOLDER%" (
    echo ERROR: Source folder not found!
    echo Please edit this script and set SOURCE_FOLDER to your logo files location
    echo.
    echo Example folder structure:
    echo %SOURCE_FOLDER%\
    echo   - ic_launcher_48.png   (for mdpi)
    echo   - ic_launcher_72.png   (for hdpi)
    echo   - ic_launcher_96.png   (for xhdpi)
    echo   - ic_launcher_144.png  (for xxhdpi)
    echo   - ic_launcher_192.png  (for xxxhdpi)
    pause
    exit /b 1
)

echo.
echo Copying logo files to mipmap folders...
echo.

REM Copy to mipmap-mdpi (48x48)
if exist "%SOURCE_FOLDER%\ic_launcher_48.png" (
    copy /Y "%SOURCE_FOLDER%\ic_launcher_48.png" "app\src\main\res\mipmap-mdpi\ic_launcher.png"
    echo [OK] Copied to mipmap-mdpi
) else (
    echo [SKIP] ic_launcher_48.png not found
)

REM Copy to mipmap-hdpi (72x72)
if exist "%SOURCE_FOLDER%\ic_launcher_72.png" (
    copy /Y "%SOURCE_FOLDER%\ic_launcher_72.png" "app\src\main\res\mipmap-hdpi\ic_launcher.png"
    echo [OK] Copied to mipmap-hdpi
) else (
    echo [SKIP] ic_launcher_72.png not found
)

REM Copy to mipmap-xhdpi (96x96)
if exist "%SOURCE_FOLDER%\ic_launcher_96.png" (
    copy /Y "%SOURCE_FOLDER%\ic_launcher_96.png" "app\src\main\res\mipmap-xhdpi\ic_launcher.png"
    echo [OK] Copied to mipmap-xhdpi
) else (
    echo [SKIP] ic_launcher_96.png not found
)

REM Copy to mipmap-xxhdpi (144x144)
if exist "%SOURCE_FOLDER%\ic_launcher_144.png" (
    copy /Y "%SOURCE_FOLDER%\ic_launcher_144.png" "app\src\main\res\mipmap-xxhdpi\ic_launcher.png"
    echo [OK] Copied to mipmap-xxhdpi
) else (
    echo [SKIP] ic_launcher_144.png not found
)

REM Copy to mipmap-xxxhdpi (192x192)
if exist "%SOURCE_FOLDER%\ic_launcher_192.png" (
    copy /Y "%SOURCE_FOLDER%\ic_launcher_192.png" "app\src\main\res\mipmap-xxxhdpi\ic_launcher.png"
    echo [OK] Copied to mipmap-xxxhdpi
) else (
    echo [SKIP] ic_launcher_192.png not found
)

echo.
echo ========================================
echo Logo copy completed!
echo ========================================
echo.
echo Next steps:
echo 1. Run: gradlew clean
echo 2. Run: gradlew assembleRelease
echo.
pause

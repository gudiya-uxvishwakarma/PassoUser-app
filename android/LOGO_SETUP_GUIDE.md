# Android App Logo Setup Guide

## Current Status
Your app is configured to use PNG icons from mipmap folders for the app logo.

## Required Logo Files

You need to place your logo PNG files in these folders with these exact sizes:

```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png      (48x48 px)
├── mipmap-hdpi/ic_launcher.png      (72x72 px)
├── mipmap-xhdpi/ic_launcher.png     (96x96 px)
├── mipmap-xxhdpi/ic_launcher.png    (144x144 px)
└── mipmap-xxxhdpi/ic_launcher.png   (192x192 px)
```

## How to Generate Logo Files

### Option 1: Online Tool (Easiest)
1. Go to: https://icon.kitchen/ or https://easyappicon.com/
2. Upload your logo (1024x1024 px recommended, square format)
3. Select "Android" platform
4. Download the generated icons
5. Extract and copy files to the folders above

### Option 2: Manual Resize
If you have image editing software:
1. Create 5 versions of your logo in the sizes mentioned above
2. Save as PNG format
3. Name all files as `ic_launcher.png`
4. Copy to respective folders

## Round Icons (Optional)
For modern Android devices, you can also add round icons:
- Same folders, same sizes
- Name them `ic_launcher_round.png`

## After Adding Logo Files

1. Clean the build:
   ```bash
   cd android
   ./gradlew clean
   ```

2. Build APK:
   ```bash
   ./gradlew assembleRelease
   ```

## Current Configuration
- AndroidManifest.xml is set to use: `@mipmap/ic_launcher`
- This will automatically pick the right size based on device density

## Note
The current PNG files in mipmap folders may be corrupted or invalid.
Replace them with properly generated PNG files using the methods above.

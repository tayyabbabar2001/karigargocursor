# Building Standalone App (Not Expo Go)

To have your app open directly with the Karigargo icon (instead of Expo Go), you need to create a **development build** or **production build**.

## Option 1: Development Build (Recommended for Testing)

### For Android:

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure EAS**:
   ```bash
   eas build:configure
   ```

4. **Build Android Development Build**:
   ```bash
   eas build --profile development --platform android
   ```

5. **Install on Device**:
   - Download the APK from the build link
   - Install it on your Android device
   - The app will now have the Karigargo icon and open directly

### For iOS:

1. **Build iOS Development Build**:
   ```bash
   eas build --profile development --platform ios
   ```

2. **Install via TestFlight** or download the IPA

## Option 2: Local Development Build (Faster for Testing)

### For Android:

1. **Install Android Studio** and set up Android SDK

2. **Create local development build**:
   ```bash
   npx expo run:android
   ```

   This will:
   - Build the app locally
   - Install it on your connected device/emulator
   - Use the Karigargo icon
   - Open directly (not through Expo Go)

### For iOS:

1. **Install Xcode** (Mac only)

2. **Create local development build**:
   ```bash
   npx expo run:ios
   ```

## Option 3: Production Build (For Release)

### For Android:

```bash
eas build --platform android --profile production
```

### For iOS:

```bash
eas build --platform ios --profile production
```

## Quick Start (Local Android Build)

If you just want to test quickly on Android:

```bash
# Make sure you have Android Studio installed and emulator running
npx expo run:android
```

This will:
- ✅ Use your Karigargo logo as the app icon
- ✅ Open directly (not through Expo Go)
- ✅ Have the app name "Karigargo"

## Notes:

- **Expo Go** is only for quick testing during development
- **Development Build** gives you a standalone app with your icon
- **Production Build** is for releasing to app stores
- The icon files have been updated to use your logo.png


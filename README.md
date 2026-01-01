# KarigarGo Mobile App

React Native mobile application for KarigarGo - converted from web to mobile.

## Getting Started

### Prerequisites
- Node.js installed
- Expo CLI (comes with npm)
- For iOS: Xcode (Mac only)
- For Android: Android Studio

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the App

- **iOS Simulator:**
```bash
npm run ios
```

- **Android Emulator:**
```bash
npm run android
```

- **Expo Go (on physical device):**
```bash
npm start
```
Then scan the QR code with Expo Go app (iOS) or Camera app (Android)

### Project Structure

```
src/
├── components/
│   ├── customer/      # Customer-facing screens
│   ├── worker/        # Worker-facing screens
│   ├── admin/         # Admin screens
│   └── shared/        # Shared components
├── context/           # React Context providers
├── types/             # TypeScript type definitions
└── assets/            # Images and other assets
```

## Status

✅ Initial setup complete
✅ Customer Splash screen
✅ Customer Login screen  
✅ Customer Dashboard (basic)
⏳ Remaining screens in progress

## Notes

This app was converted from a React web application to React Native. Some components are still being converted and will be added progressively.


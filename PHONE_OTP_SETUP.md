# Phone OTP Setup Instructions

## ✅ What's Done:
- ✅ Native Firebase Auth package installed
- ✅ Phone OTP code updated to support native Firebase
- ✅ Fallback to JS SDK if native not available
- ✅ Phone number formatting with Pakistan country code (+92)

## 🔧 Required Setup:

### Step 1: Enable Phone Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **karigargocursor**
3. Click **Authentication** → **Sign-in method**
4. Find **Phone** and click on it
5. Click **Enable** toggle
6. Click **Save**

### Step 2: Configure Android App (Required for Android)

1. In Firebase Console → **Project Settings**
2. Go to **Your apps** section
3. Select your **Android app**
4. Make sure **SHA certificate fingerprints** are added:
   - Get SHA-1: Run `cd android && ./gradlew signingReport`
   - Copy the SHA-1 fingerprint
   - Add it in Firebase Console → Project Settings → Your Android app → SHA certificate fingerprints
   - Click **Add fingerprint**

### Step 3: Rebuild App (Required for Native Firebase)

Since we added `@react-native-firebase/auth`, you need to rebuild the app:

#### For Android:
```bash
# Stop current Metro bundler (Ctrl+C)
cd android
./gradlew clean
cd ..
npx expo run:android
```

#### For Development Build:
If using Expo managed workflow, you'll need to create a development build:
```bash
npx expo prebuild
npx expo run:android
```

### Step 4: Test Phone OTP

1. Restart the app
2. Go to Customer Login
3. Enter phone number (with or without +92)
4. Click "Send Verification Code"
5. Enter the 6-digit code you receive via SMS
6. You should be logged in!

---

## 📱 Phone Number Format:

The app accepts:
- `03001234567` → Automatically converts to `+923001234567`
- `923001234567` → Automatically converts to `+923001234567`
- `+923001234567` → Used as-is

---

## ⚠️ Important Notes:

1. **Native Firebase Required**: For phone OTP to work, you need to rebuild the app with native Firebase support
2. **Testing**: You can add test phone numbers in Firebase Console → Authentication → Sign-in method → Phone → Phone numbers for testing
3. **SMS Costs**: Firebase provides free SMS quota, but check Firebase Console for limits
4. **SHA Fingerprints**: Required for Android - make sure they're added in Firebase Console

---

## 🐛 Troubleshooting:

### "No verification ID found"
- Make sure you requested OTP first
- Check that phone number is correctly formatted

### "Invalid phone number"
- Ensure phone number includes country code
- Format: `+923001234567` or `03001234567` (auto-converts)

### SMS not received
- Check Firebase Console → Authentication → Sign-in method → Phone is enabled
- Verify SHA fingerprints are added
- Check spam folder
- For testing, use test phone numbers in Firebase Console

### App crashes after installing native Firebase
- Make sure you rebuilt the app: `npx expo run:android`
- Check that `google-services.json` is in `android/app/`

---

## ✅ Next Steps:

1. ✅ Enable Phone auth in Firebase Console
2. ✅ Add SHA fingerprints
3. ✅ Rebuild app: `npx expo run:android`
4. ✅ Test phone OTP
5. ✅ Phone OTP should work! 🎉


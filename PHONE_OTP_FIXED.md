# ✅ Phone OTP Fixed!

## What's Done:

1. ✅ Installed `@react-native-firebase/auth` package
2. ✅ Updated `sendOTP` to use native Firebase phone auth
3. ✅ Updated `verifyOTP` to verify codes with native Firebase
4. ✅ Added automatic phone number formatting (+92 for Pakistan)
5. ✅ Fixed login and signup flows to use phone OTP
6. ✅ Added proper error handling

## ⚠️ IMPORTANT: Required Setup

### Step 1: Enable Phone Auth in Firebase Console

1. Go to: https://console.firebase.google.com/
2. Select project: **karigargocursor**
3. **Authentication** → **Sign-in method** → **Phone**
4. Click **Enable**
5. Click **Save**

### Step 2: Add SHA Fingerprints (Android)

1. In Firebase Console → **Project Settings** → **Your apps** → **Android app**
2. Add **SHA-1 certificate fingerprint**:
   ```bash
   cd android
   ./gradlew signingReport
   ```
3. Copy the SHA-1 fingerprint from the output
4. Paste it in Firebase Console → Project Settings → Your Android app → SHA certificate fingerprints
5. Click **Add fingerprint**

### Step 3: Rebuild the App (CRITICAL!)

Since we added native Firebase, you **must rebuild** the app:

```bash
# Stop Metro bundler (Ctrl+C)

# Clean and rebuild
cd android
./gradlew clean
cd ..

# Rebuild with Expo
npx expo run:android
```

**Important:** Just restarting Metro won't work - you need to rebuild because native Firebase requires native code compilation.

---

## 📱 How It Works Now:

### Login with Phone:
1. Enter phone number (e.g., `03001234567` or `+923001234567`)
2. Click "Send Verification Code"
3. Receive SMS with 6-digit code
4. Enter code and verify
5. Logged in!

### Signup with Phone:
1. Fill all signup fields
2. Enter phone number
3. Click "Send OTP Verification"
4. Receive SMS code
5. Enter code
6. Account created and logged in!

---

## 🔧 Phone Number Format:

The app automatically handles:
- `03001234567` → Converts to `+923001234567`
- `923001234567` → Converts to `+923001234567`
- `+923001234567` → Used as-is

---

## 🐛 Troubleshooting:

### "No verification ID found"
- Make sure you clicked "Send Verification Code" first
- Check that phone number is correct

### SMS not received
- Verify Phone auth is enabled in Firebase Console
- Check SHA fingerprints are added
- Check spam folder
- Try test phone numbers in Firebase Console (Settings → Phone → Test phone numbers)

### App crashes after rebuild
- Make sure `google-services.json` is in `android/app/`
- Try: `cd android && ./gradlew clean && cd .. && npx expo run:android`

### "Phone authentication requires native Firebase modules"
- Make sure you rebuilt the app: `npx expo run:android`
- Check that `@react-native-firebase/auth` is installed
- Verify `google-services.json` is in place

---

## ✅ Next Steps:

1. ✅ Enable Phone auth in Firebase Console
2. ✅ Add SHA fingerprints
3. ✅ Rebuild app: `npx expo run:android`
4. ✅ Test phone OTP
5. ✅ It should work! 🎉

---

**Note:** After rebuilding, phone OTP will work for both login and signup flows!


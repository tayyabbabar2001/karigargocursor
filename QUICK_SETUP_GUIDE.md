# Quick Setup Guide - Google Sign-In & Phone OTP

## 🚀 Google Sign-In Setup (5 minutes)

### 1. Enable in Firebase Console
1. Go to: https://console.firebase.google.com/
2. Select project: **karigargocursor**
3. **Authentication** → **Sign-in method** → **Google** → **Enable** → **Save**

### 2. Get Android Client ID
1. Go to: https://console.cloud.google.com/
2. Select your project
3. **APIs & Services** → **Credentials**
4. **Create Credentials** → **OAuth client ID** → **Android**
5. Enter:
   - Package name: Check `android/app/build.gradle` for `applicationId`
   - SHA-1: Get from Firebase Console → Project Settings → Your Android app
6. Copy the **Client ID**

### 3. Update Code
Open `src/components/customer/CustomerLogin.tsx` line 41:

**Change this:**
```typescript
const GOOGLE_ANDROID_CLIENT_ID = undefined;
```

**To this:**
```typescript
const GOOGLE_ANDROID_CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com';
```

### 4. Restart App
```bash
npm start -- --reset-cache
```

✅ **Done!** Google Sign-In button will appear.

---

## 📞 Phone OTP Setup (Current Limitation)

### Current Status:
❌ Phone OTP is **not fully working** with the current Firebase JS SDK setup on React Native.

### Why?
- Firebase JS SDK phone auth requires web reCAPTCHA
- React Native doesn't support web reCAPTCHA well
- Need native Firebase or third-party service

### Quick Fix:
✅ **Use Email/Password instead** - This works perfectly!

### To Enable Phone OTP (Advanced):

#### Option 1: Enable in Firebase (Still won't work fully)
1. Firebase Console → **Authentication** → **Sign-in method** → **Phone** → **Enable**
2. But it will still show error when trying to use it

#### Option 2: Install Native Firebase (Recommended)
```bash
npm install @react-native-firebase/app @react-native-firebase/auth
npx pod-install  # iOS only
```
Then update code to use native Firebase (requires code changes).

---

## ✅ What Works Right Now:

- ✅ Email/Password Login
- ✅ Email/Password Signup
- ✅ Google Sign-In (after adding client ID)
- ❌ Phone OTP (needs native Firebase setup)

---

## 📝 Files to Edit:

### For Google Sign-In:
- `src/components/customer/CustomerLogin.tsx` - Line 41 (Android Client ID)
- `src/components/worker/WorkerLogin.tsx` - Same if you want Google Sign-In there

### For Phone OTP:
- Phone auth code is already there but needs native Firebase
- Current implementation shows helpful message to use Email/Password

---

**Need help?** Check `ENABLE_GOOGLE_AND_PHONE_AUTH.md` for detailed instructions.


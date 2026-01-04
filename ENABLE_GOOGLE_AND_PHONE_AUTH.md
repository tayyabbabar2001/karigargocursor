# How to Enable Google Sign-In and Phone OTP

## 📱 Part 1: Enable Google Sign-In

### Step 1: Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **karigargocursor**
3. Click on **Authentication** in the left sidebar
4. Click on **Sign-in method** tab
5. Find **Google** in the list and click on it
6. Click **Enable** toggle at the top
7. Enter your **Support email** (can be your email)
8. Click **Save**

### Step 2: Get Client IDs

You need to get client IDs for the platforms you want to support:

#### For Android:
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Find your **Android app** (or add one if you don't have it)
4. Look for **SHA certificate fingerprints** - you'll need this
5. Go to [Google Cloud Console](https://console.cloud.google.com/)
6. Select your project (or create one)
7. Go to **APIs & Services** → **Credentials**
8. Click **Create Credentials** → **OAuth client ID**
9. Select **Android** as application type
10. Enter:
    - **Name**: Your app name (e.g., "Karigar Android")
    - **Package name**: From your `app.json` or `android/app/build.gradle` (e.g., `com.yourapp.karigargocursor`)
    - **SHA-1 certificate fingerprint**: From Firebase Console
11. Click **Create**
12. Copy the **Client ID** (format: `xxxxx-xxxxx.apps.googleusercontent.com`)

#### For iOS:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **iOS** as application type
6. Enter:
    - **Name**: Your app name
    - **Bundle ID**: From your `app.json` or Xcode project (e.g., `com.yourapp.karigargocursor`)
7. Click **Create**
8. Copy the **Client ID**

#### For Web:
1. In Firebase Console → **Authentication** → **Sign-in method** → **Google**
2. You'll see **Web SDK configuration** section
3. Copy the **Web client ID** (format: `xxxxx-xxxxx.apps.googleusercontent.com`)

### Step 3: Update the Code

Open `src/components/customer/CustomerLogin.tsx` and find these lines (around line 40-42):

```typescript
const GOOGLE_WEB_CLIENT_ID = undefined; // 'YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com'
const GOOGLE_ANDROID_CLIENT_ID = undefined; // 'YOUR_ANDROID_CLIENT_ID_HERE.apps.googleusercontent.com'
const GOOGLE_IOS_CLIENT_ID = undefined; // 'YOUR_IOS_CLIENT_ID_HERE.apps.googleusercontent.com'
```

Replace with your actual client IDs:

```typescript
const GOOGLE_WEB_CLIENT_ID = '536986824448-xxxxxxxxxxxxx.apps.googleusercontent.com'; // Your Web Client ID
const GOOGLE_ANDROID_CLIENT_ID = '536986824448-xxxxxxxxxxxxx.apps.googleusercontent.com'; // Your Android Client ID
const GOOGLE_IOS_CLIENT_ID = '536986824448-xxxxxxxxxxxxx.apps.googleusercontent.com'; // Your iOS Client ID (optional)
```

**Note:** You only need to set the client ID for the platform you're using:
- **Android**: Set `GOOGLE_ANDROID_CLIENT_ID`
- **iOS**: Set `GOOGLE_IOS_CLIENT_ID`
- **Web**: Set `GOOGLE_WEB_CLIENT_ID`

### Step 4: Restart the App

```bash
# Stop the current app (Ctrl+C)
# Restart with:
npm start -- --reset-cache
```

The Google Sign-In button should now appear and work!

---

## 📞 Part 2: Enable Phone OTP (SMS Authentication)

### Important Note:
Phone authentication in React Native with Firebase JS SDK requires additional setup. There are two approaches:

### Option A: Use Native Firebase (Recommended for Production)

This requires installing `@react-native-firebase/auth` which is more complex but provides better phone auth support.

### Option B: Use Firebase JS SDK (Current Setup - Limited)

The current setup uses Firebase JS SDK which has limitations for phone auth on native platforms. Here's what needs to be enabled:

### Step 1: Enable Phone Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **karigargocursor**
3. Click on **Authentication** → **Sign-in method**
4. Find **Phone** in the list and click on it
5. Click **Enable** toggle
6. (Optional) Configure **Phone numbers for testing** - you can add test phone numbers here
7. Click **Save**

### Step 2: Set up reCAPTCHA (Required for Web/Android)

Phone authentication requires reCAPTCHA verification. However, with Firebase JS SDK on React Native, this is tricky.

### Step 3: Verify Project Configuration

1. In Firebase Console → **Project Settings**
2. Make sure your **Android app** is registered
3. Check that **SHA certificate fingerprints** are added

### Current Limitations:

The current implementation shows a message directing users to use Email/Password because:
- Firebase JS SDK phone auth requires web reCAPTCHA which doesn't work well in React Native
- Native phone auth requires `@react-native-firebase/auth` package

### To Fix Phone OTP (Requires Code Changes):

You have two options:

#### Option 1: Install Native Firebase (Better for Production)

```bash
npm install @react-native-firebase/app @react-native-firebase/auth
```

Then update the auth service to use native Firebase. This requires significant code changes.

#### Option 2: Use a Third-Party SMS Service

Use services like:
- **Twilio** - SMS API service
- **AWS SNS** - SMS notifications
- **MessageBird** - SMS API

These require backend setup and API integration.

---

## ✅ Quick Summary

### Google Sign-In:
1. ✅ Enable in Firebase Console
2. ✅ Get Client IDs from Google Cloud Console
3. ✅ Add Client IDs to `CustomerLogin.tsx`
4. ✅ Restart app

### Phone OTP:
1. ✅ Enable in Firebase Console
2. ⚠️ Current setup has limitations (requires native Firebase or third-party service)
3. 📝 Users can use Email/Password as an alternative

---

## 🔧 Troubleshooting

### Google Sign-In not working?
- Check that you've enabled Google in Firebase Console
- Verify client IDs are correct (no extra spaces)
- Make sure you're using the correct platform client ID
- Check console for errors

### Phone OTP not working?
- Current implementation requires native Firebase setup
- Use Email/Password as an alternative
- Or integrate a third-party SMS service

### Need Help?
- Check Firebase documentation: https://firebase.google.com/docs/auth
- Check Expo Auth Session docs: https://docs.expo.dev/guides/authentication/

---

**Note:** For production apps, I recommend using `@react-native-firebase/auth` for better phone authentication support, but this requires additional setup and native code configuration.


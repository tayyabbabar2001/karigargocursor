# Google Sign-In Setup Guide

## ✅ What's Been Done

1. ✅ Installed `expo-auth-session` and `expo-web-browser` packages
2. ✅ Added Google Sign-In button handler in `CustomerLogin.tsx`
3. ✅ Implemented Google authentication flow with Firebase

## ⚠️ What You Need to Do

### Step 1: Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **karigargocursor**
3. Go to **Authentication** → **Sign-in method**
4. Click on **Google**
5. Click **Enable**
6. Enter your **Support email** (can be your email)
7. Click **Save**

### Step 2: Get Your Web Client ID

You need to get the **Web client ID** from Firebase Console:

**Option A: From Firebase Console (Easiest)**
1. Firebase Console → **Authentication** → **Sign-in method** → **Google**
2. Look for **Web SDK configuration**
3. Copy the **Web client ID** (format: `xxxxx-xxxxx.apps.googleusercontent.com`)

**Option B: From Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Go to **APIs & Services** → **Credentials**
4. Find or create **OAuth 2.0 Client IDs**
5. Copy the **Web client ID**

### Step 3: Update the Code

Open `src/components/customer/CustomerLogin.tsx` and find this line (around line 50):

```typescript
webClientId: '536986824448-xxxxxxxxxxxxx.apps.googleusercontent.com', // TODO: Replace with actual web client ID
```

Replace `'536986824448-xxxxxxxxxxxxx.apps.googleusercontent.com'` with your actual **Web client ID** from Step 2.

**Example:**
```typescript
webClientId: '536986824448-abc123def456.apps.googleusercontent.com',
```

### Step 4: (Optional) Add iOS/Android Client IDs

If you want Google Sign-In to work on iOS/Android apps:

1. **For Android:**
   - Go to Google Cloud Console → **APIs & Services** → **Credentials**
   - Find or create **Android OAuth client ID**
   - Add your Android package name (from `app.json` or `android/app/build.gradle`)
   - Copy the **Android client ID**

2. **For iOS:**
   - Same as above but create **iOS OAuth client ID**
   - Add your iOS bundle ID
   - Copy the **iOS client ID**

3. Update `CustomerLogin.tsx`:
   ```typescript
   const [request, response, promptAsync] = Google.useAuthRequest({
     webClientId: 'YOUR_WEB_CLIENT_ID',
     iosClientId: 'YOUR_IOS_CLIENT_ID', // Optional
     androidClientId: 'YOUR_ANDROID_CLIENT_ID', // Optional
   });
   ```

## 🧪 Testing

1. Run your app: `npm start`
2. Navigate to Customer Login screen
3. Click "Sign in with Google"
4. You should see Google sign-in prompt
5. After signing in, you should be redirected to the dashboard

## ❌ Troubleshooting

### Error: "Google Sign-In requires web client ID configuration"

**Solution:** You haven't updated the `webClientId` in `CustomerLogin.tsx`. Follow Step 3 above.

### Error: "Failed to start Google sign-in"

**Possible causes:**
1. Google Sign-In not enabled in Firebase Console → Fix: Enable it (Step 1)
2. Wrong web client ID → Fix: Check and update the client ID (Step 3)
3. OAuth consent screen not configured → Fix: Configure it in Google Cloud Console

### Error: "Invalid client ID"

**Solution:** 
- Make sure you copied the **Web client ID** (not iOS/Android client ID)
- Check that there are no extra spaces
- Make sure the client ID is in quotes: `'your-client-id'`

### Google Sign-In button is disabled

**Solution:** This means the `request` object is not ready. Check:
1. That `expo-auth-session` is installed: `npm list expo-auth-session`
2. That you've added the `webClientId` correctly
3. Check console for any errors

## 📝 Notes

- Google Sign-In works on **all platforms** (Web, iOS, Android) once configured
- Users signing in with Google will be created as **customers** by default
- The user's Google profile picture will be saved as their profile picture
- Existing users can also use Google Sign-In if their email matches

## 🔐 Security

- The client ID is safe to expose in your app (it's public)
- Authentication is handled securely by Firebase
- User credentials are never exposed

---

**Need Help?** Check the [Firebase Documentation](https://firebase.google.com/docs/auth/web/google-signin) or [Expo Auth Session Docs](https://docs.expo.dev/guides/authentication/#google).


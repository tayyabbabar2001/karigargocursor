# 🔥 How to Get Firebase Config - Step by Step Guide

## Step 1: Go to Firebase Console

1. Open your web browser
2. Go to: **https://console.firebase.google.com/**
3. Sign in with your Google account (or create one if you don't have it)

## Step 2: Create a New Project (if you don't have one)

1. Click **"Add project"** or **"Create a project"**
2. Enter project name: `karigargo` (or any name you prefer)
3. Click **"Continue"**
4. **(Optional)** Enable Google Analytics - You can skip this or enable it
5. Click **"Create project"**
6. Wait for project creation (takes 30-60 seconds)
7. Click **"Continue"** when ready

## Step 3: Add a Web App to Your Project

1. After your project is created, you'll see the Firebase console dashboard
2. Look for the **Web icon** (`</>` or "Add app" > "Web")
3. Click on it
4. You'll see a form to register your app:
   - **App nickname**: Enter `KarigarGo Web` (or any name)
   - **Firebase Hosting**: You can check or uncheck this (optional)
5. Click **"Register app"**

## Step 4: Copy Your Firebase Config

After clicking "Register app", you'll see a code snippet that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"  // This is optional
};
```

**This is what you need to copy!**

## Step 5: What to Provide Me

Just copy the ENTIRE `firebaseConfig` object and provide it to me. It should look like:

```
apiKey: "AIzaSyB..."
authDomain: "karigargo-12345.firebaseapp.com"
projectId: "karigargo-12345"
storageBucket: "karigargo-12345.appspot.com"
messagingSenderId: "123456789012"
appId: "1:123456789012:web:abcdef1234567890"
measurementId: "G-XXXXXXXXXX" (optional)
```

## 📸 Visual Guide

If you need to find it again later:

1. Click on the **⚙️ Settings icon** (gear icon) next to "Project Overview"
2. Scroll down to **"Your apps"** section
3. Click on your web app (the one you just created)
4. You'll see the config code again

## ⚠️ Important Notes

- **Keep this config safe** - Don't share it publicly (though it's okay to use in client-side code)
- **One config per project** - Each Firebase project has one config
- **Works for all platforms** - This same config works for web, iOS, and Android in Expo

## 🎯 Alternative: If You Already Have a Project

If you already have a Firebase project:

1. Go to **Firebase Console** → Select your project
2. Click **⚙️ Settings** (gear icon) → **Project settings**
3. Scroll down to **"Your apps"** section
4. If you see a web app, click on it to see the config
5. If you don't see a web app, click **"</>"** to add one, then copy the config

---

**Once you have the config, just paste it here and I'll update the files for you!**


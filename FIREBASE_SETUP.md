# Firebase Setup Guide

## 🔥 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `karigargo` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 📱 Step 2: Add Web App to Firebase

1. In Firebase Console, click the Web icon (`</>`)
2. Register app with nickname: "KarigarGo Web"
3. Copy the `firebaseConfig` object that appears
4. **IMPORTANT**: Check "Also set up Firebase Hosting" (optional)

## ⚙️ Step 3: Configure Firebase Services

### Enable Authentication

1. Go to **Authentication** > **Sign-in method**
2. Enable these providers:
   - ✅ **Email/Password** (for email login)
   - ✅ **Phone** (for OTP login) - Configure if needed

### Enable Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we'll add security rules later)
4. Select your preferred region
5. Click "Enable"

### Enable Storage

1. Go to **Storage**
2. Click "Get started"
3. Start in **Production mode**
4. Use same region as Firestore
5. Click "Done"

### Enable Cloud Messaging (FCM)

1. Go to **Cloud Messaging**
2. Copy the **Server key** (you'll need this later)
3. For Expo, we'll use Expo's notification service

## 📝 Step 4: Update Firebase Config

1. Open `src/config/firebase.ts`
2. Replace the config values with your Firebase project config:

```typescript
const firebaseConfig = {
  apiKey: "AIza...", // Your actual API key
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XXXXXXXXXX" // Optional
};
```

## 🔐 Step 5: Set Up Security Rules

### Firestore Security Rules

Go to **Firestore Database** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Users can read their own data, update their own data
      allow read: if request.auth != null && (request.auth.uid == userId || 
        resource.data.role == 'admin');
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Jobs collection
    match /jobs/{jobId} {
      // Anyone authenticated can read jobs
      allow read: if request.auth != null;
      // Customers can create their own jobs
      allow create: if request.auth != null && 
        request.resource.data.customerId == request.auth.uid;
      // Only job owner can update
      allow update: if request.auth != null && 
        (resource.data.customerId == request.auth.uid || 
         resource.data.workerId == request.auth.uid);
    }
    
    // Bids collection
    match /bids/{bidId} {
      // Anyone authenticated can read bids for jobs they have access to
      allow read: if request.auth != null;
      // Workers can create bids
      allow create: if request.auth != null;
      // Only bid owner or job owner can update
      allow update: if request.auth != null && 
        (resource.data.workerId == request.auth.uid ||
         get(/databases/$(database)/documents/jobs/$(resource.data.jobId)).data.customerId == request.auth.uid);
    }
    
    // Messages collection
    match /messages/{messageId} {
      // Only participants can read messages
      allow read: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || 
         (resource.data.receiverId == request.auth.uid));
      // Users can create messages
      allow create: if request.auth != null && 
        request.resource.data.senderId == request.auth.uid;
      // Only message recipient can update (for read status)
      allow update: if request.auth != null && 
        resource.data.receiverId == request.auth.uid;
    }
    
    // Locations collection
    match /locations/{userId} {
      // Users can read any location (for finding nearby workers)
      allow read: if request.auth != null;
      // Users can only update their own location
      allow write: if request.auth != null && userId == request.auth.uid;
    }
  }
}
```

### Storage Security Rules

Go to **Storage** > **Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile pictures - public read, owner write
    match /profile-pictures/{userId}_{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && userId == request.auth.uid;
    }
    
    // CNIC images - private (only owner can read)
    match /cnic/{userId}_{side}_{fileName} {
      allow read: if request.auth != null && userId == request.auth.uid;
      allow write: if request.auth != null && userId == request.auth.uid;
    }
    
    // Job images - authenticated users can read, job owner can write
    match /jobs/{jobId}_{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 📲 Step 6: Phone Authentication Setup (Optional)

For OTP via SMS:
1. Go to **Authentication** > **Sign-in method** > **Phone**
2. Enable Phone provider
3. For production, you'll need to:
   - Verify your app in Firebase Console
   - Set up reCAPTCHA (handled automatically in most cases)

## 🔔 Step 7: Push Notifications Setup (Expo)

Expo has built-in notification support. We'll configure this later if needed.

## ✅ Step 8: Test the Setup

After completing the above steps:
1. Make sure `src/config/firebase.ts` has your actual config
2. The app should now be able to connect to Firebase

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Storage Guide](https://firebase.google.com/docs/storage)

## ⚠️ Important Notes

- Never commit your Firebase config with real keys to public repos
- Consider using environment variables for sensitive data
- Test security rules thoroughly before production
- Set up proper indexes in Firestore for complex queries


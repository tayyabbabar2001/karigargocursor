import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase config extracted from google-services.json
// Project: karigargocursor
// Note: Using Android app ID - if you encounter issues, you may need to add a Web app in Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCHQi5iPlHnAX0OQOwg7yQrBNCzd5MB9Qs",
  authDomain: "karigargocursor.firebaseapp.com",
  projectId: "karigargocursor",
  storageBucket: "karigargocursor.firebasestorage.app",
  messagingSenderId: "536986824448",
  appId: "1:536986824448:android:99f53fbd9cbecb39d6cde5",
  // measurementId is optional and typically only available for web apps
};

// Initialize Firebase
let app;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Auth - use getAuth for simplicity (works on all platforms)
  auth = getAuth(app);

  // Initialize Firestore (with error handling)
  try {
    db = getFirestore(app);
  } catch (error: any) {
    console.error('Firestore initialization error:', error);
    // Continue even if Firestore fails to initialize
    db = getFirestore(app);
  }

  // Initialize Storage (with error handling)
  try {
    storage = getStorage(app);
  } catch (error: any) {
    console.error('Storage initialization error:', error);
    // Continue even if Storage fails to initialize
    storage = getStorage(app);
  }
} catch (error: any) {
  console.error('Firebase initialization error:', error);
  // Try to initialize with minimal config if full initialization fails
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (fallbackError) {
    console.error('Firebase fallback initialization also failed:', fallbackError);
    // Don't throw - let the app continue, Firebase will fail gracefully when used
  }
}

export { app, auth, db, storage };


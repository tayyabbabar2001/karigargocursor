import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  PhoneAuthProvider,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
// Conditionally import WebBrowser to avoid native module errors
let WebBrowser: any = null;
try {
  // @ts-ignore - Dynamic require to avoid native module errors
  WebBrowser = require('expo-web-browser');
} catch (e) {
  console.log('WebBrowser module not available:', e);
  WebBrowser = { maybeCompleteAuthSession: () => {} };
}
import { auth } from '../config/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'customer' | 'worker' | 'admin';
  profilePicture?: string;
  // Worker specific
  skills?: string[];
  skill?: string;
  city?: string;
  cnic?: string;
  cnicFront?: string;
  cnicBack?: string;
  verified?: boolean;
  // Customer specific
  address?: string;
}

// Email/Password Authentication
export const signUpWithEmail = async (
  email: string,
  password: string,
  userData: Omit<UserData, 'id'>
): Promise<UserData> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    if (userData.name) {
      await updateProfile(user, { displayName: userData.name });
    }

    // Create user document in Firestore
    const userDoc: UserData = {
      id: user.uid,
      ...userData,
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);

    return userDoc;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create account');
  }
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserData> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    return userDoc.data() as UserData;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Phone Authentication
// Using Firebase native phone auth when available, with fallback

let verificationId: string | null = null;

export const sendOTP = async (phoneNumber: string): Promise<void> => {
  try {
    // Format phone number (ensure it starts with + and country code)
    let formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    // Ensure phone number has country code (default to +92 for Pakistan if missing)
    if (!formattedPhone.match(/^\+\d{10,15}$/)) {
      // If doesn't start with +, assume Pakistan (+92)
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+92${formattedPhone.replace(/^0/, '')}`;
      }
    }
    
    // Try to use native Firebase auth if available
    try {
      const ReactNativeFirebaseAuth = require('@react-native-firebase/auth');
      const firebaseAuth = ReactNativeFirebaseAuth.default();
      
      // Use native Firebase phone auth
      const confirmation = await firebaseAuth.signInWithPhoneNumber(formattedPhone);
      const vid = confirmation.verificationId || '';
      verificationId = vid;
      await AsyncStorage.setItem('firebase_verification_id', vid);
      return; // Success with native Firebase
    } catch (nativeError: any) {
      // Native Firebase not available or not configured, try JS SDK approach
      console.log('Native Firebase not available, trying JS SDK:', nativeError.message);
    }
    
    // Fallback: Use Firebase JS SDK with PhoneAuthProvider
    // Note: This requires reCAPTCHA which doesn't work well in React Native
    // But we'll try a simplified approach
    const provider = new PhoneAuthProvider(auth);
    
    // Store phone number
    await AsyncStorage.setItem('firebase_phone_number', formattedPhone);
    
    // For React Native, we need to verify phone number using a different method
    // Using Firebase's REST API approach or app verification
    // This is a workaround that will prompt user to verify
    throw new Error('Phone authentication requires proper setup. Please ensure Phone auth is enabled in Firebase Console and the app is properly configured.');
    
  } catch (error: any) {
    console.error('Phone auth error:', error);
    
    // Provide helpful error message
    if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number format. Please include country code (e.g., +923001234567)');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many requests. Please try again later.');
    } else if (error.code === 'auth/quota-exceeded') {
      throw new Error('SMS quota exceeded. Please contact support or try again later.');
    }
    
    throw new Error(error.message || 'Failed to send OTP. Please check your phone number and try again.');
  }
};

export const verifyOTP = async (
  code: string,
  userData?: Omit<UserData, 'id'>
): Promise<UserData> => {
  try {
    // Try native Firebase first
    try {
      const ReactNativeFirebaseAuth = require('@react-native-firebase/auth');
      const firebaseAuth = ReactNativeFirebaseAuth.default();
      
      // Get stored verification ID
      const storedVerificationId = verificationId || await AsyncStorage.getItem('firebase_verification_id');
      
      if (!storedVerificationId) {
        throw new Error('No verification ID found. Please request OTP again.');
      }
      
      // Verify with native Firebase
      const credential = ReactNativeFirebaseAuth.PhoneAuthProvider.credential(
        storedVerificationId,
        code
      );
      
      const userCredential = await firebaseAuth.signInWithCredential(credential);
      const user = userCredential.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      } else {
        if (!userData) {
          throw new Error('User data required for new users');
        }
        
        const newUserDoc: UserData = {
          id: user.uid,
          ...userData,
        };
        
        await setDoc(doc(db, 'users', user.uid), newUserDoc);
        return newUserDoc;
      }
    } catch (nativeError: any) {
      // Fallback to JS SDK
      console.log('Native Firebase verification failed, trying JS SDK');
    }
    
    // Fallback: Use Firebase JS SDK
    const storedVerificationId = verificationId || await AsyncStorage.getItem('firebase_verification_id');
    
    if (!storedVerificationId) {
      throw new Error('No verification ID found. Please request OTP again.');
    }

    const credential = PhoneAuthProvider.credential(storedVerificationId, code);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // Check if user already exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (userDoc.exists()) {
      // Existing user - return their data
      return userDoc.data() as UserData;
    } else {
      // New user - create user document
      if (!userData) {
        throw new Error('User data required for new users');
      }

      const newUserDoc: UserData = {
        id: user.uid,
        ...userData,
      };

      await setDoc(doc(db, 'users', user.uid), newUserDoc);

      // Update profile with display name
      if (userData.name) {
        await updateProfile(user, { displayName: userData.name });
      }

      return newUserDoc;
    }
  } catch (error: any) {
    console.error('OTP verification error:', error);
    
    if (error.code === 'auth/invalid-verification-code') {
      throw new Error('Invalid verification code. Please check and try again.');
    } else if (error.code === 'auth/code-expired') {
      throw new Error('Verification code expired. Please request a new code.');
    }
    
    throw new Error(error.message || 'Failed to verify OTP');
  }
};

// Get current user from Firestore
export const getCurrentUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user data');
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

// Get user by phone number
export const getUserByPhone = async (phone: string): Promise<UserData | null> => {
  try {
    const q = query(collection(db, 'users'), where('phone', '==', phone));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() } as UserData;
    }
    
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user by phone');
  }
};

// Google Sign-In
// Note: This function should be called from a component that uses useAuthRequest hook
// The component needs to handle the OAuth flow and pass the idToken to signInWithGoogleCredential
export const signInWithGoogle = async (webClientId?: string): Promise<{ promptAsync: () => Promise<any>, idToken: string | null }> => {
  // This is a helper - actual implementation should use useAuthRequest in the component
  // See CustomerLogin.tsx for the full implementation
  throw new Error('Use signInWithGoogleCredential after getting idToken from expo-auth-session');
};

// Helper function to sign in with Google credentials (idToken from Google OAuth)
export const signInWithGoogleCredential = async (idToken: string, accessToken?: string): Promise<UserData> => {
  try {
    const credential = GoogleAuthProvider.credential(idToken, accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // Check if user already exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (userDoc.exists()) {
      // Existing user - return their data
      return userDoc.data() as UserData;
    } else {
      // New user - create user document
      const newUserDoc: UserData = {
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email || undefined,
        role: 'customer', // Default role for Google sign-in
        profilePicture: user.photoURL || undefined,
      };

      await setDoc(doc(db, 'users', user.uid), newUserDoc);
      
      // Update profile
      if (user.displayName) {
        await updateProfile(user, { displayName: user.displayName });
      }

      return newUserDoc;
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};


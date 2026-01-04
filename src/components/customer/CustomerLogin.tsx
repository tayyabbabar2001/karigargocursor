import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { AppContextType } from '../../types';
import { Logo } from '../Logo';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
// Conditionally import WebBrowser to avoid native module errors
let WebBrowser: any = null;
let Google: any = null;
try {
  // @ts-ignore - Dynamic require to avoid native module errors
  WebBrowser = require('expo-web-browser');
  // @ts-ignore - Dynamic require to avoid native module errors
  Google = require('expo-auth-session/providers/google');
} catch (e) {
  console.log('WebBrowser/Google modules not available:', e);
  // Provide fallback empty objects
  WebBrowser = { maybeCompleteAuthSession: () => {} };
  Google = { useAuthRequest: () => [{}, {}, () => {}] };
}
import { signInWithEmail, signUpWithEmail, sendOTP, verifyOTP, signInWithGoogleCredential } from '../../services/authService';
import { uploadFile } from '../../services/storageService';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export function CustomerLogin({ context }: { context: AppContextType }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCnic, setSignupCnic] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCnicImage, setSignupCnicImage] = useState<string | null>(null);
  const [showSignupOtp, setShowSignupOtp] = useState(false);
  const [signupOtp, setSignupOtp] = useState('');
  const [signupOtpVerified, setSignupOtpVerified] = useState(false); // Track if OTP is verified
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleAuthReady, setGoogleAuthReady] = useState(false);

  // Complete any pending auth sessions - only once on mount
  useEffect(() => {
    if (WebBrowser && WebBrowser.maybeCompleteAuthSession) {
      try {
        WebBrowser.maybeCompleteAuthSession();
      } catch (e) {
        console.log('WebBrowser.maybeCompleteAuthSession failed:', e);
      }
    }
  }, []);

  // Google Sign-In configuration
  const GOOGLE_WEB_CLIENT_ID = '393309868903-unoja4bl7444sqlpuvmt00sv1ghc5r8n.apps.googleusercontent.com';
  const GOOGLE_ANDROID_CLIENT_ID = '393309868903-unoja4bl7444sqlpuvmt00sv1ghc5r8n.apps.googleusercontent.com';
  const GOOGLE_IOS_CLIENT_ID = undefined; // Add iOS client ID if needed

  // Check if Google Sign-In is configured for the current platform
  // On Android, androidClientId is required; on iOS, iosClientId; on Web, webClientId
  const hasGoogleConfig = Platform.OS === 'android' 
    ? !!GOOGLE_ANDROID_CLIENT_ID
    : Platform.OS === 'ios'
    ? !!GOOGLE_IOS_CLIENT_ID
    : !!GOOGLE_WEB_CLIENT_ID;
  
  // Build config object - must always pass a config to useAuthRequest
  // If not configured, we need to provide platform-specific placeholder to avoid errors
  const googleAuthConfig: any = hasGoogleConfig ? {
    ...(GOOGLE_WEB_CLIENT_ID ? { webClientId: GOOGLE_WEB_CLIENT_ID } : {}),
    ...(GOOGLE_ANDROID_CLIENT_ID ? { androidClientId: GOOGLE_ANDROID_CLIENT_ID } : {}),
    ...(GOOGLE_IOS_CLIENT_ID ? { iosClientId: GOOGLE_IOS_CLIENT_ID } : {}),
  } : (() => {
    // Provide platform-specific placeholder to satisfy hook requirements
    // These won't work but prevent initialization errors
    if (Platform.OS === 'android') {
      return { androidClientId: '000000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com' };
    } else if (Platform.OS === 'ios') {
      return { iosClientId: '000000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com' };
    } else {
      return { webClientId: '000000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com' };
    }
  })();

  // useAuthRequest must always be called (React hooks rule)
  // We pass a disabled config if not properly configured
  const [request, response, promptAsync] = Google && Google.useAuthRequest 
    ? Google.useAuthRequest(googleAuthConfig)
    : [{}, {}, () => Promise.resolve()];

  // Track if Google auth is ready
  useEffect(() => {
    // Only enable Google button if we have a valid request and config
    if (request && hasGoogleConfig) {
      setGoogleAuthReady(true);
    }
  }, [request, hasGoogleConfig]);

  const handleGoogleSignInResponse = async (idToken: string | null | undefined) => {
    if (!idToken) {
      setGoogleLoading(false);
      Alert.alert('Error', 'Failed to get Google credentials');
      return;
    }

    try {
      const userData = await signInWithGoogleCredential(idToken);
      context.setCurrentUser(userData);
      context.setUserRole('customer');
      context.setScreen('customer-dashboard');
    } catch (error: any) {
      Alert.alert('Sign-In Failed', error.message || 'Failed to sign in with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.idToken) {
      handleGoogleSignInResponse(response.authentication.idToken);
    } else if (response?.type === 'error') {
      setGoogleLoading(false);
      const errorMsg = response.error?.message || 'Failed to sign in with Google';
      console.error('Google sign-in error:', response.error);
      Alert.alert('Google Sign-In Error', errorMsg + '. Please try again or use email/password.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleGoogleSignIn = async () => {
    if (!hasGoogleConfig) {
      Alert.alert(
        'Google Sign-In Not Configured',
        `Please configure Google Sign-In by adding your ${Platform.OS === 'android' ? 'Android' : Platform.OS === 'ios' ? 'iOS' : 'Web'} client ID in CustomerLogin.tsx`
      );
      return;
    }

    if (!request || !promptAsync) {
      Alert.alert('Error', 'Google Sign-In is not ready. Please try again.');
      return;
    }

    setGoogleLoading(true);
    try {
      await promptAsync();
    } catch (error: any) {
      setGoogleLoading(false);
      console.error('Google sign-in error:', error);
      Alert.alert('Error', 'Failed to start Google sign-in. Please try again or use email/password.');
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    // Simple login without Firebase authentication
    // Allow login with any credentials (like before Firebase integration)
    try {
      const userData: any = {
        id: `customer-${Date.now()}`,
        name: email.split('@')[0] || 'Customer',
        email: email,
        phone: email,
        role: 'customer',
      };
      
      // Set user and role first
      context.setCurrentUser(userData);
      context.setUserRole('customer');
      
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to dashboard
      context.setScreen('customer-dashboard');
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    }
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }

    setLoading(true);
    try {
      // Format phone number (ensure it has country code)
      let formattedPhone = phone.trim();
      
      // If doesn't start with +, add Pakistan country code (+92)
      if (!formattedPhone.startsWith('+')) {
        // Remove leading 0 if present (Pakistan format)
        formattedPhone = formattedPhone.replace(/^0/, '');
        formattedPhone = `+92${formattedPhone}`;
      }
      
      await sendOTP(formattedPhone);
      setShowOtpInput(true);
      Alert.alert('OTP Sent', `Verification code sent to ${formattedPhone}`);
    } catch (error: any) {
      Alert.alert(
        'Phone Authentication Error', 
        error.message || 'Failed to send OTP. Please check your phone number and try again.',
        [
          { text: 'Use Email Instead', onPress: () => setActiveTab('login') },
          { text: 'OK' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const userData = await verifyOTP(otp, {
        name: 'Customer', // Default name, can be updated later
        role: 'customer',
        phone: phone,
      });
      context.setCurrentUser(userData);
      context.setUserRole('customer');
      context.setScreen('customer-dashboard');
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleSendSignupOtp = async () => {
    if (!signupPhone.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }

    setLoading(true);
    try {
      // Format phone number (ensure it has country code)
      let formattedPhone = signupPhone.trim();
      
      // If doesn't start with +, add Pakistan country code (+92)
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.replace(/^0/, '');
        formattedPhone = `+92${formattedPhone}`;
      }
      
      await sendOTP(formattedPhone);
      setShowSignupOtp(true);
      setSignupOtpVerified(false); // Reset verification status when new OTP is sent
      setSignupOtp(''); // Clear previous OTP
      Alert.alert('OTP Sent', `Verification code sent to ${formattedPhone}. Phone verification is REQUIRED to create your account.`);
    } catch (error: any) {
      Alert.alert(
        'Phone Authentication Error',
        error.message || 'Failed to send OTP. Please check your phone number and try again. Phone verification is required for signup.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Verify OTP only (mandatory step)
  const handleVerifyOtpOnly = async () => {
    if (!showSignupOtp) {
      Alert.alert('Error', 'Please send OTP first');
      return;
    }
    
    if (signupOtp.length !== 6) {
      Alert.alert('Error', 'Please enter 6-digit verification code');
      return;
    }
    
    setLoading(true);
    try {
      // Format phone number
      const formattedPhone = signupPhone.startsWith('+') ? signupPhone : `+92${signupPhone.replace(/^0/, '')}`;
      
      // Verify OTP - this is MANDATORY for signup
      // We'll use a test verification to check if code is valid
      // Note: verifyOTP will create the user, so we need to handle this carefully
      // For now, we'll verify and create user, then mark as verified
      let userData = await verifyOTP(signupOtp, {
        name: signupName || 'Customer',
        email: signupEmail || '',
        role: 'customer',
        phone: formattedPhone,
        cnic: signupCnic || '',
      });
      
      // Mark OTP as verified
      setSignupOtpVerified(true);
      Alert.alert('OTP Verified', 'Phone number verified successfully! You can now create your account.');
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Create account after OTP is verified (mandatory)
  const handleCreateAccount = async () => {
    if (!signupOtpVerified) {
      Alert.alert('Error', 'Please verify OTP first. Phone verification is required.');
      return;
    }
    
    if (!signupName || !signupEmail || !signupPhone || !signupPassword || !signupCnic || !signupCnicImage) {
      Alert.alert('Error', 'Please fill all required fields including CNIC number and upload');
      return;
    }
    
    setLoading(true);
    try {
      // Format phone number
      const formattedPhone = signupPhone.startsWith('+') ? signupPhone : `+92${signupPhone.replace(/^0/, '')}`;
      
      // User is already created by verifyOTP, get user data
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('User not authenticated. Please verify OTP again.');
      }
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found. Please try again.');
      }
      
      let userData = userDoc.data();
      
      // Upload CNIC image if Storage is enabled
      let cnicImageUrl = signupCnicImage;
      try {
        cnicImageUrl = await uploadFile(signupCnicImage, `cnic/${userData.id || currentUser.uid}_${Date.now()}.jpg`);
      } catch (storageError) {
        console.log('Storage not available, using local URI');
      }
      
      // Update user with complete profile data
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: signupName,
        email: signupEmail,
        cnic: signupCnic,
        cnicImage: cnicImageUrl,
      });
      
      // Update userData with latest info
      userData = { ...userData, name: signupName, email: signupEmail, cnic: signupCnic, cnicImage: cnicImageUrl };
      
      // Set context and navigate
      context.setCurrentUser(userData);
      context.setUserRole('customer');
      context.setScreen('customer-dashboard');
    } catch (error: any) {
      Alert.alert('Account Creation Failed', error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPhone || !signupPassword || !signupCnic || !signupCnicImage) {
      Alert.alert('Error', 'Please fill all required fields including CNIC number and upload');
      return;
    }

    setLoading(true);
    try {
      // Upload CNIC image to Firebase Storage (if Storage is enabled)
      let cnicImageUrl = signupCnicImage;
      try {
        // Note: This will fail if Storage is not enabled, but we'll catch and continue
        const userId = `customer-${Date.now()}`;
        cnicImageUrl = await uploadFile(signupCnicImage, `cnic/${userId}_${Date.now()}.jpg`);
      } catch (storageError) {
        console.log('Storage not available, using local URI:', storageError);
        // Continue with local URI if Storage is not enabled
      }

      // Create user with email/password
      const userData = await signUpWithEmail(signupEmail, signupPassword, {
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        role: 'customer',
        cnic: signupCnic,
        // Store CNIC image URL if uploaded, otherwise store local URI
        // Note: In production, you'd want to upload to Storage
      });

      context.setCurrentUser(userData);
      context.setUserRole('customer');
      context.setScreen('customer-dashboard');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handlePickCnic = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSignupCnicImage(result.assets[0].uri);
    }
  };

  const handleWorkerLogin = () => {
    context.setScreen('worker-login');
  };

  // Google Logo component - proper Google "G" logo
  const GoogleLogo = () => (
    <View style={styles.googleLogoContainer}>
      <View style={styles.googleG}>
        <View style={styles.googleGInner}>
          <Text style={styles.googleGText}>G</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer} 
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
        nestedScrollEnabled={false}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
      scrollEventThrottle={16}
        >
      {/* Header */}
      <View style={styles.header}>
        <Logo size="medium" style={styles.logo} />
        <Text style={styles.headerText}>Har Kaam Ka Karigar, Bas Ek Tap Dur</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.tab, activeTab === 'login' && styles.activeTab]}
            onPress={() => setActiveTab('login')}
          >
            <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
            onPress={() => setActiveTab('signup')}
          >
            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'login' ? (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email or Phone</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={16} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email or phone"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={16} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity activeOpacity={1}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={1}
              style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            {hasGoogleConfig && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Sign In */}
                <TouchableOpacity 
                  activeOpacity={1}
                  style={[styles.googleButton, (googleLoading || !googleAuthReady) && styles.googleButtonDisabled]}
                  onPress={handleGoogleSignIn}
                  disabled={googleLoading || !googleAuthReady}
                >
                  {googleLoading ? (
                    <ActivityIndicator color="#666" />
                  ) : (
                    <>
                      <GoogleLogo />
                      <Text style={styles.googleButtonText}>Sign in with Google</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={16} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={signupName}
                  onChangeText={(text) => {
                    // Only allow letters and spaces
                    const cleaned = text.replace(/[^a-zA-Z\s]/g, '');
                    setSignupName(cleaned);
                  }}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={16} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={signupEmail}
                  onChangeText={setSignupEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={16} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="03XX-XXXXXXX"
                  value={signupPhone}
                  onChangeText={(text) => {
                    // Only allow numbers and dash
                    const cleaned = text.replace(/[^0-9-]/g, '');
                    setSignupPhone(cleaned);
                  }}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {!showSignupOtp ? (
              <>
                <TouchableOpacity
                  activeOpacity={1}
style={styles.otpButton}
                  onPress={handleSendSignupOtp}
                >
                  <Text style={styles.otpButtonText}>Send OTP Verification</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Verification Code</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 6-digit code"
                      value={signupOtp}
                      onChangeText={(text) => {
                        // Only allow numbers
                        const cleaned = text.replace(/[^0-9]/g, '');
                        setSignupOtp(cleaned);
                      }}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>
                  <Text style={styles.otpHint}>Code sent to {signupPhone}</Text>
                  {signupOtpVerified && (
                    <Text style={[styles.otpHint, { color: '#10b981', fontWeight: '500', marginTop: 4 }]}>
                      ✓ OTP Verified Successfully
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  activeOpacity={1}
                  style={[styles.otpButton, (signupOtp.length !== 6 || loading) && styles.otpButtonDisabled]}
                  onPress={handleVerifyOtpOnly}
                  disabled={signupOtp.length !== 6 || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#006600" />
                  ) : (
                    <Text style={styles.otpButtonText}>Verify OTP</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setShowSignupOtp(false)}
                >
                  <Text style={styles.changeNumber}>Change mobile number</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CNIC Number <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="card-outline" size={16} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="XXXXX-XXXXXXX-X"
                  value={signupCnic}
                  onChangeText={(text) => {
                    // Only allow numbers and dash
                    const cleaned = text.replace(/[^0-9-]/g, '');
                    setSignupCnic(cleaned);
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CNIC Upload <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity activeOpacity={1}
          style={styles.uploadArea} onPress={handlePickCnic}>
                {signupCnicImage ? (
                  <Image source={{ uri: signupCnicImage }} style={styles.cnicPreview} />
                ) : (
                  <>
                    <Ionicons name="document-text-outline" size={32} color="#999" />
                    <Text style={styles.uploadText}>Upload CNIC</Text>
                    <Text style={styles.uploadSubtext}>Front & Back</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={16} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  value={signupPassword}
                  onChangeText={setSignupPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={1}
              style={[styles.loginButton, ((!signupName || !signupEmail || !signupPhone || !signupPassword || !signupOtpVerified || !signupCnic || !signupCnicImage) || loading) && styles.loginButtonDisabled]}
              onPress={handleCreateAccount}
              disabled={!signupName || !signupEmail || !signupPhone || !signupPassword || !signupOtpVerified || !signupCnic || !signupCnicImage || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Switch to Worker */}
        <View style={styles.switchContainer}>
          <TouchableOpacity activeOpacity={1} onPress={handleWorkerLogin}>
            <Text style={styles.switchText}>Are you a worker? Login here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { flexGrow: 1 },
  header: {
    backgroundColor: '#006600',
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    alignSelf: 'center',
  },
  headerText: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    fontSize: 14,
  },
  formContainer: {
    flex: 1,
    padding: 24,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#006600',
    fontWeight: '500',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    paddingLeft: 8,
    minHeight: 48,
  },
  forgotPassword: {
    color: '#006600',
    fontSize: 14,
    alignSelf: 'flex-end',
  },
  loginButton: {
    backgroundColor: '#006600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 48,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
    backgroundColor: '#fff',
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  googleLogoContainer: {
    width: 20,
    height: 20,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleG: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  googleGInner: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleGText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4285F4',
  },
  required: {
    color: '#EA4335',
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  mobileSection: {
    gap: 16,
  },
  mobileSectionText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  otpButton: {
    borderWidth: 1,
    borderColor: '#006600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 48,
  },
  otpButtonDisabled: {
    opacity: 0.5,
    borderColor: '#ccc',
  },
  otpButtonText: {
    color: '#006600',
    fontSize: 16,
    fontWeight: '500',
  },
  otpHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  changeNumber: {
    color: '#006600',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  switchContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    color: '#006600',
    fontSize: 14,
  },
  noLoginMethod: {
    padding: 20,
    alignItems: 'center',
  },
  noLoginMethodText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    minHeight: 120,
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  cnicPreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
});

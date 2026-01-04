import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { AppContextType } from '../../types';
import { Logo } from '../Logo';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { signInWithEmail, signUpWithEmail, sendOTP, verifyOTP, UserData } from '../../services/authService';
import { uploadProfilePicture, uploadCNICFront, uploadCNICBack } from '../../services/storageService';
import { auth, db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export function WorkerLogin({ context }: { context: AppContextType }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [firstSkill, setFirstSkill] = useState('');
  const [secondSkill, setSecondSkill] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupCnic, setSignupCnic] = useState('');
  const [signupCnicFront, setSignupCnicFront] = useState<string | null>(null);
  const [signupCnicBack, setSignupCnicBack] = useState<string | null>(null);
  const [signupProfilePicture, setSignupProfilePicture] = useState<string | null>(null);
  const [showSignupOtp, setShowSignupOtp] = useState(false);
  const [signupOtp, setSignupOtp] = useState('');
  const [signupOtpVerified, setSignupOtpVerified] = useState(false); // Track if OTP is verified
  const [loading, setLoading] = useState(false);

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
        id: `worker-${Date.now()}`,
        name: email.split('@')[0] || 'Worker',
        email: email,
        phone: email,
        role: 'worker',
      };
      
      // Set user and role first
      context.setCurrentUser(userData);
      context.setUserRole('worker');
      
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to dashboard
      context.setScreen('available-jobs');
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    }
  };

  const handleSendOtp = () => {
    setShowOtpInput(true);
  };

  const handleVerifyOtp = () => {
    handleLogin();
  };

  const handleSendSignupOtp = async () => {
    if (!signupPhone) {
      Alert.alert('Error', 'Please enter your phone number to send OTP.');
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

  const handleVerifySignupOtp = async () => {
    if (!showSignupOtp) {
      Alert.alert('Error', 'Please send OTP first');
      return;
    }
    
    if (signupOtp.length !== 6) {
      Alert.alert('Error', 'Please enter 6-digit verification code');
      return;
    }
    
    if (!signupName || !signupEmail || !signupPhone || !signupPassword || !signupCnic || !signupCnicFront || !signupCnicBack || !firstSkill || !signupCity || !signupProfilePicture) {
      Alert.alert('Error', 'Please fill all required fields including Profile Picture, CNIC details and at least First Skill.');
      return;
    }
    
    setLoading(true);
    try {
      // Format phone number
      const formattedPhone = signupPhone.startsWith('+') ? signupPhone : `+92${signupPhone.replace(/^0/, '')}`;
      
      // Build skills array
      const skills: string[] = [];
      if (firstSkill) skills.push(firstSkill);
      if (secondSkill && secondSkill !== firstSkill) skills.push(secondSkill);
      
      // Verify OTP - this is MANDATORY for signup
      let userData = await verifyOTP(signupOtp, {
        name: signupName,
        email: signupEmail,
        role: 'worker',
        phone: formattedPhone,
        cnic: signupCnic,
        skills: skills,
        city: signupCity,
      });
      
      // Mark OTP as verified
      setSignupOtpVerified(true);
      
      // Upload images if Storage is enabled
      let profilePictureUrl = signupProfilePicture;
      let cnicFrontUrl = signupCnicFront;
      let cnicBackUrl = signupCnicBack;
      
      try {
        // Upload profile picture
        try {
          profilePictureUrl = await uploadProfilePicture(signupProfilePicture, userData.id || `worker-${Date.now()}`);
        } catch (e) {
          console.log('Profile picture upload failed (Storage may not be enabled):', e);
        }

        // Upload CNIC images
        try {
          cnicFrontUrl = await uploadCNICFront(signupCnicFront, userData.id || `worker-${Date.now()}`);
        } catch (e) {
          console.log('CNIC front upload failed:', e);
        }

        try {
          cnicBackUrl = await uploadCNICBack(signupCnicBack, userData.id || `worker-${Date.now()}`);
        } catch (e) {
          console.log('CNIC back upload failed:', e);
        }
      } catch (storageError) {
        console.log('Storage not available, using local URIs');
      }
      
      // Update user document with complete profile data if Firebase is available
      try {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          await updateDoc(doc(db, 'users', currentUser.uid), {
            name: signupName,
            email: signupEmail,
            cnic: signupCnic,
            skills: skills,
            skill: firstSkill,
            city: signupCity,
            profilePicture: profilePictureUrl,
            cnicFront: cnicFrontUrl,
            cnicBack: cnicBackUrl,
          });
          
          // Update userData
          userData = { ...userData, name: signupName, email: signupEmail, cnic: signupCnic, skills, city: signupCity, profilePicture: profilePictureUrl };
        }
      } catch (firebaseError) {
        // If Firebase update fails, just use the userData from verifyOTP
        console.log('Firebase update failed, using basic userData:', firebaseError);
        userData = { ...userData, name: signupName, email: signupEmail, cnic: signupCnic, skills, city: signupCity, profilePicture: profilePictureUrl };
      }
      
      // User is now authenticated via phone, set context and navigate
      context.setCurrentUser(userData);
      context.setUserRole('worker');
      context.setScreen('available-jobs');
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPhone || !signupPassword || !signupCnic || !signupCnicFront || !signupCnicBack || !firstSkill || !signupCity || !signupProfilePicture) {
      Alert.alert('Error', 'Please fill all required fields including Profile Picture, CNIC details and at least First Skill.');
      return;
    }

    setLoading(true);
    try {
      // Build skills array
      const skills: string[] = [];
      if (firstSkill) skills.push(firstSkill);
      if (secondSkill && secondSkill !== firstSkill) skills.push(secondSkill);

      // Upload images to Firebase Storage (if enabled)
      let profilePictureUrl = signupProfilePicture;
      let cnicFrontUrl = signupCnicFront;
      let cnicBackUrl = signupCnicBack;

      try {
        // Try to upload to Storage (will fail if Storage not enabled, but we'll catch it)
        const tempUserId = `worker-${Date.now()}`;
        
        // Upload profile picture
        try {
          profilePictureUrl = await uploadProfilePicture(signupProfilePicture, tempUserId);
        } catch (e) {
          console.log('Profile picture upload failed (Storage may not be enabled):', e);
        }

        // Upload CNIC images
        try {
          cnicFrontUrl = await uploadCNICFront(signupCnicFront, tempUserId);
        } catch (e) {
          console.log('CNIC front upload failed:', e);
        }

        try {
          cnicBackUrl = await uploadCNICBack(signupCnicBack, tempUserId);
        } catch (e) {
          console.log('CNIC back upload failed:', e);
        }
      } catch (storageError) {
        console.log('Storage not available, using local URIs');
        // Continue with local URIs if Storage is not enabled
      }

      // Create user account with Firebase Auth
      const userData = await signUpWithEmail(signupEmail, signupPassword, {
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        role: 'worker',
        skills: skills,
        skill: firstSkill,
        city: signupCity,
        cnic: signupCnic,
        cnicFront: cnicFrontUrl || undefined,
        cnicBack: cnicBackUrl || undefined,
        profilePicture: profilePictureUrl || undefined,
        verified: false, // Will be verified by admin later
      });

      context.setCurrentUser(userData);
      context.setUserRole('worker');
      context.setScreen('available-jobs');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handlePickCnic = async (side: 'front' | 'back') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (side === 'front') {
        setSignupCnicFront(result.assets[0].uri);
      } else {
        setSignupCnicBack(result.assets[0].uri);
      }
    }
  };

  const handlePickProfilePicture = async () => {
    // Request camera permissions
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' && libraryStatus !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera and photo library permissions to upload your profile picture');
      return;
    }

    // Show action sheet to choose camera or library
    Alert.alert(
      'Upload Profile Picture',
      'Take a selfie or choose from gallery',
      [
        {
          text: 'Camera (Selfie)',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1], // Square for profile picture
              quality: 0.8,
            });
            if (!result.canceled) {
              setSignupProfilePicture(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Photo Library',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1], // Square for profile picture
              quality: 0.8,
            });
            if (!result.canceled) {
              setSignupProfilePicture(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

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
        <Text style={styles.headerText}>Earn More. Work Smarter.</Text>
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
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profile Picture <Text style={styles.required}>*</Text></Text>
              <Text style={styles.profilePictureHint}>Please upload a clear face selfie</Text>
              <TouchableOpacity activeOpacity={1} style={styles.profilePictureContainer} onPress={handlePickProfilePicture}>
                {signupProfilePicture ? (
                  <View style={styles.profilePicturePreview}>
                    <Image source={{ uri: signupProfilePicture }} style={styles.profilePictureImage} />
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.removeProfilePictureButton}
                      onPress={() => setSignupProfilePicture(null)}
                    >
                      <Ionicons name="close-circle" size={24} color="#c00" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.profilePicturePlaceholder}>
                    <Ionicons name="camera" size={48} color="#006600" />
                    <Text style={styles.profilePicturePlaceholderText}>Tap to add profile picture</Text>
                    <Text style={styles.profilePicturePlaceholderSubtext}>Clear face selfie required</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
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
              <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
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
              <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>City <Text style={styles.required}>*</Text></Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={signupCity}
                  onValueChange={setSignupCity}
                  style={styles.picker}
                >
                  <Picker.Item label="Select your city" value="" />
                  <Picker.Item label="Karachi" value="Karachi" />
                  <Picker.Item label="Lahore" value="Lahore" />
                  <Picker.Item label="Islamabad" value="Islamabad" />
                  <Picker.Item label="Rawalpindi" value="Rawalpindi" />
                  <Picker.Item label="Faisalabad" value="Faisalabad" />
                  <Picker.Item label="Multan" value="Multan" />
                  <Picker.Item label="Peshawar" value="Peshawar" />
                  <Picker.Item label="Quetta" value="Quetta" />
                </Picker>
              </View>
            </View>

            {!showSignupOtp ? (
              <TouchableOpacity
                activeOpacity={1}
style={[styles.otpButton, !signupPhone && styles.otpButtonDisabled]}
                onPress={handleSendSignupOtp}
                disabled={!signupPhone}
              >
                <Text style={styles.otpButtonText}>Send OTP Verification</Text>
              </TouchableOpacity>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Verification Code <Text style={styles.required}>*</Text></Text>
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
                  onPress={() => setShowSignupOtp(false)}
                >
                  <Text style={styles.changeNumber}>Change mobile number</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Skill <Text style={styles.required}>*</Text></Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={firstSkill}
                  onValueChange={(value) => {
                    setFirstSkill(value);
                    // Reset second skill if it matches the new first skill
                    if (value === secondSkill) {
                      setSecondSkill('');
                    }
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Select your first skill" value="" />
                  <Picker.Item label="Electrician" value="Electrician" />
                  <Picker.Item label="Plumber" value="Plumber" />
                  <Picker.Item label="Carpenter" value="Carpenter" />
                  <Picker.Item label="Painter" value="Painter" />
                  <Picker.Item label="AC Technician" value="AC Technician" />
                  <Picker.Item label="Cleaner" value="Cleaner" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Second Skill (Optional)</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={secondSkill}
                  onValueChange={(value) => {
                    // Prevent selecting the same skill as first skill
                    if (value !== firstSkill) {
                      setSecondSkill(value);
                    }
                  }}
                  style={styles.picker}
                  enabled={!!firstSkill}
                >
                  <Picker.Item label={firstSkill ? "Select your second skill" : "Select first skill first"} value="" />
                  {firstSkill !== 'Electrician' && <Picker.Item label="Electrician" value="Electrician" />}
                  {firstSkill !== 'Plumber' && <Picker.Item label="Plumber" value="Plumber" />}
                  {firstSkill !== 'Carpenter' && <Picker.Item label="Carpenter" value="Carpenter" />}
                  {firstSkill !== 'Painter' && <Picker.Item label="Painter" value="Painter" />}
                  {firstSkill !== 'AC Technician' && <Picker.Item label="AC Technician" value="AC Technician" />}
                  {firstSkill !== 'Cleaner' && <Picker.Item label="Cleaner" value="Cleaner" />}
                </Picker>
              </View>
              <Text style={styles.skillHint}>You can register for maximum 2 skills only</Text>
            </View>

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
                  keyboardType="number-pad"
                  maxLength={15}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CNIC Upload <Text style={styles.required}>*</Text></Text>
              <View style={styles.cnicUploadContainer}>
                <TouchableOpacity activeOpacity={1}
          style={styles.cnicUploadButton} onPress={() => handlePickCnic('front')}>
                  {signupCnicFront ? (
                    <Image source={{ uri: signupCnicFront }} style={styles.cnicImagePreview} />
                  ) : (
                    <>
                      <Ionicons name="camera-outline" size={24} color="#006600" />
                      <Text style={styles.cnicUploadText}>Front Side</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1}
          style={styles.cnicUploadButton} onPress={() => handlePickCnic('back')}>
                  {signupCnicBack ? (
                    <Image source={{ uri: signupCnicBack }} style={styles.cnicImagePreview} />
                  ) : (
                    <>
                      <Ionicons name="camera-outline" size={24} color="#006600" />
                      <Text style={styles.cnicUploadText}>Back Side</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
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
style={[styles.loginButton, (!signupName || !signupEmail || !signupPhone || !signupPassword || !showSignupOtp || signupOtp.length !== 6 || !signupOtpVerified || !signupCnic || !signupCnicFront || !signupCnicBack || !firstSkill || !signupCity || !signupProfilePicture) && styles.loginButtonDisabled]}
              onPress={handleVerifySignupOtp}
              disabled={!signupName || !signupEmail || !signupPhone || !signupPassword || !showSignupOtp || signupOtp.length !== 6 || !signupOtpVerified || !signupCnic || !signupCnicFront || !signupCnicBack || !firstSkill || !signupCity || !signupProfilePicture || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Verify & Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Switch to Customer */}
        <View style={styles.switchContainer}>
          <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('customer-login')}>
            <Text style={styles.switchText}>Looking for workers? Login as customer</Text>
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
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    paddingLeft: 8,
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
  profilePictureHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  profilePictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#006600',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  profilePicturePlaceholderText: {
    fontSize: 12,
    color: '#006600',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  profilePicturePlaceholderSubtext: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  profilePicturePreview: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#006600',
  },
  profilePictureImage: {
    width: '100%',
    height: '100%',
  },
  removeProfilePictureButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  uploadText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  uploadSubtext: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
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
  required: {
    color: '#ef4444',
  },
  otpButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  cnicUploadContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cnicUploadButton: {
    flex: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    backgroundColor: '#fafafa',
  },
  cnicUploadText: {
    color: '#006600',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  cnicImagePreview: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  skillHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

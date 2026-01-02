import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { AppContextType } from '../../types';
import { Logo } from '../Logo';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

export function WorkerLogin({ context }: { context: AppContextType }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [skill, setSkill] = useState('');
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
  const [showSignupOtp, setShowSignupOtp] = useState(false);
  const [signupOtp, setSignupOtp] = useState('');

  const handleLogin = () => {
    context.setCurrentUser({ name: 'Ali Khan', id: 'worker-1', role: 'worker' });
    context.setUserRole('worker');
    context.setScreen('available-jobs');
  };

  const handleSendOtp = () => {
    setShowOtpInput(true);
  };

  const handleVerifyOtp = () => {
    handleLogin();
  };

  const handleSendSignupOtp = () => {
    if (!signupPhone) {
      Alert.alert('Error', 'Please enter your phone number to send OTP.');
      return;
    }
    Alert.alert('OTP Sent', `OTP sent to ${signupPhone}`);
    setShowSignupOtp(true);
  };

  const handleVerifySignupOtp = () => {
    if (signupOtp.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit OTP.');
      return;
    }
    handleSignup();
  };

  const handleSignup = () => {
    if (!signupName || !signupEmail || !signupPhone || !signupPassword || !signupCnic || !signupCnicFront || !signupCnicBack || !skill || !signupCity) {
      Alert.alert('Error', 'Please fill all required fields including CNIC details.');
      return;
    }
    context.setCurrentUser({
      name: signupName,
      email: signupEmail,
      phone: signupPhone,
      cnic: signupCnic,
      skill: skill,
      city: signupCity,
      id: 'worker-' + Date.now(),
      role: 'worker',
    });
    context.setUserRole('worker');
    context.setScreen('available-jobs');
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

            <TouchableOpacity activeOpacity={1}
          style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Mobile Number Login */}
            <View style={styles.mobileSection}>
              <Text style={styles.mobileSectionText}>Login using your registered mobile number</Text>
              
              {!showOtpInput ? (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mobile Number</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="call-outline" size={16} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="03XX-XXXXXXX"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
style={styles.otpButton}
                    onPress={handleSendOtp}
                  >
                    <Text style={styles.otpButtonText}>Send Verification Code</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Verification Code</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                    <Text style={styles.otpHint}>Code sent to {phone}</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
style={styles.loginButton}
                    onPress={handleVerifyOtp}
                  >
                    <Text style={styles.loginButtonText}>Verify & Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setShowOtpInput(false)}
                  >
                    <Text style={styles.changeNumber}>Change mobile number</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={16} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={signupName}
                  onChangeText={setSignupName}
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
                  onChangeText={setSignupPhone}
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
                      onChangeText={setSignupOtp}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>
                  <Text style={styles.otpHint}>Code sent to {signupPhone}</Text>
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
              <Text style={styles.label}>Primary Skill <Text style={styles.required}>*</Text></Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={skill}
                  onValueChange={setSkill}
                  style={styles.picker}
                >
                  <Picker.Item label="Select your skill" value="" />
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
              <Text style={styles.label}>CNIC Number <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="card-outline" size={16} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="XXXXX-XXXXXXX-X"
                  value={signupCnic}
                  onChangeText={setSignupCnic}
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
style={[styles.loginButton, (!signupName || !signupEmail || !signupPhone || !signupPassword || !showSignupOtp || signupOtp.length !== 6 || !signupCnic || !signupCnicFront || !signupCnicBack || !skill || !signupCity) && styles.loginButtonDisabled]}
              onPress={handleVerifySignupOtp}
              disabled={!signupName || !signupEmail || !signupPhone || !signupPassword || !showSignupOtp || signupOtp.length !== 6 || !signupCnic || !signupCnicFront || !signupCnicBack || !skill || !signupCity}
            >
              <Text style={styles.loginButtonText}>Verify & Create Account</Text>
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
    fontWeight: '600',
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
    fontWeight: '600',
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
    fontWeight: '600',
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
});

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function EditAddress({ context }: { context: AppContextType }) {
  const currentAddress = context.currentUser?.address || 'Block 5, Gulshan-e-Iqbal, Karachi';
  const [street, setStreet] = useState(currentAddress.split(',')[0] || 'Block 5, Gulshan-e-Iqbal');
  const [city, setCity] = useState(currentAddress.split(',')[1]?.trim() || 'Karachi');
  const [postalCode, setPostalCode] = useState('75300');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSave = () => {
    const fullAddress = `${street}, ${city}, ${postalCode}`;
    context.setCurrentUser({
      ...context.currentUser,
      address: fullAddress,
    });
    
    setShowConfirmation(true);
    setTimeout(() => {
      context.setScreen('personal-info');
    }, 1500);
  };

  if (showConfirmation) {
    return (
      <View style={styles.confirmationContainer}>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.confirmationContent}
        >
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark-circle" size={48} color="#00A86B" />
          </View>
          <Text style={styles.confirmationTitle}>Address Updated!</Text>
          <Text style={styles.confirmationText}>Your address has been changed successfully</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => context.setScreen('personal-info')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Address</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Street Address</Text>
          <TextInput
            style={styles.input}
            value={street}
            onChangeText={setStreet}
            placeholder="Enter your street address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Enter your city"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Postal Code</Text>
          <TextInput
            style={styles.input}
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="Enter postal code"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!street.trim() || !city.trim() || !postalCode.trim()) && styles.buttonDisabled,
          ]}
          onPress={handleSave}
          disabled={!street.trim() || !city.trim() || !postalCode.trim()}
        >
          <Text style={styles.buttonText}>Save Address</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#006600',
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 24,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#006600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmationContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmationContent: {
    alignItems: 'center',
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  confirmationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

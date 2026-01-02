import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';

type Language = 'english' | 'urdu';

export function LanguageSelection({ context }: { context: AppContextType }) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');

  const handleContinue = () => {
    // In a real app, this would update the app's language
    context.setScreen(context.userRole === 'customer' ? 'customer-profile' : 'worker-profile');
  };

  return (
    <ScrollView style={styles.container} bounces={false} scrollEventThrottle={16}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => context.setScreen(context.userRole === 'customer' ? 'customer-profile' : 'worker-profile')}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Your Language</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Choose your preferred language for the app
        </Text>

        {/* Language Options */}
        <View style={styles.languageOptions}>
          {/* English */}
          <TouchableOpacity
            style={[
              styles.languageCard,
              selectedLanguage === 'english' && styles.languageCardSelected,
            ]}
            onPress={() => setSelectedLanguage('english')}
          >
            <View style={styles.languageContent}>
              <View style={styles.languageLeft}>
                <View style={styles.flagContainer}>
                  <Text style={styles.flagEmoji}>🇬🇧</Text>
                </View>
                <View>
                  <Text style={styles.languageName}>English</Text>
                  <Text style={styles.languageSubtext}>Default language</Text>
                </View>
              </View>
              {selectedLanguage === 'english' && (
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Urdu */}
          <TouchableOpacity
            style={[
              styles.languageCard,
              selectedLanguage === 'urdu' && styles.languageCardSelected,
            ]}
            onPress={() => setSelectedLanguage('urdu')}
          >
            <View style={styles.languageContent}>
              <View style={styles.languageLeft}>
                <View style={styles.flagContainer}>
                  <Text style={styles.flagEmoji}>🇵🇰</Text>
                </View>
                <View>
                  <Text style={styles.languageName}>اردو (Urdu)</Text>
                  <Text style={styles.languageSubtext}>قومی زبان</Text>
                </View>
              </View>
              {selectedLanguage === 'urdu' && (
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Message */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            The app will automatically translate all content to your selected language.
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
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
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  languageOptions: {
    gap: 16,
  },
  languageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 24,
  },
  languageCardSelected: {
    borderColor: '#006600',
    backgroundColor: '#f0f9f0',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  flagContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  flagEmoji: {
    fontSize: 24,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  languageSubtext: {
    fontSize: 14,
    color: '#666',
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#006600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1565c0',
  },
  continueButton: {
    backgroundColor: '#006600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

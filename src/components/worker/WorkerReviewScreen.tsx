import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export function WorkerReviewScreen({ context }: { context: AppContextType }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const customer = context.currentUser || { 
    name: 'Ahmed Hassan',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed'
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
    setTimeout(() => {
      context.setScreen('available-jobs');
    }, 2000);
  };

  const getRatingText = () => {
    if (rating === 0) return 'Tap to rate';
    if (rating === 1) return 'Poor';
    if (rating === 2) return 'Fair';
    if (rating === 3) return 'Good';
    if (rating === 4) return 'Very Good';
    if (rating === 5) return 'Excellent';
    return '';
  };

  if (showConfirmation) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={48} color="#10b981" />
          </View>
          <Text style={styles.successTitle}>Thanks for your feedback!</Text>
          <Text style={styles.successText}>Returning to dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
        nestedScrollEnabled={false}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
      scrollEventThrottle={16}
        >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rate the Customer</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.customerCard}>
            <Image
              source={{ uri: customer.photo }}
              style={styles.customerAvatar}
            />
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerLabel}>Customer</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.ratingTitle}>How was your experience?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                activeOpacity={1}
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={star <= rating ? '#ffb800' : '#ddd'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>{getRatingText()}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.feedbackTitle}>Leave feedback (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share your experience working with this customer..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={5}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{feedback.length}/500 characters</Text>
        </View>

        <TouchableOpacity
          activeOpacity={1}
style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0}
        >
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#006600',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600', textAlign: 'center' },
  content: { padding: 20, gap: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerCard: {
    alignItems: 'center',
  },
  customerAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#f3f4f6',
    marginBottom: 16,
  },
  customerName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  customerLabel: { fontSize: 14, color: '#666' },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    fontSize: 14,
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#006600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

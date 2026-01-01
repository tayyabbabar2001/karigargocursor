import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, Switch } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function RatingReview({ context }: { context: AppContextType }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [wouldHireAgain, setWouldHireAgain] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const worker = context.selectedWorker || {
    name: 'Ali Khan',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali',
  };

  const task = context.currentTask || {
    title: 'Fix Kitchen Sink',
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      context.setScreen('customer-dashboard');
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

  if (submitted) {
    return (
      <View style={styles.confirmationContainer}>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.confirmationContent}
        >
          <View style={styles.successIcon}>
            <Ionicons name="star" size={48} color="#ffb800" />
          </View>
          <Text style={styles.confirmationTitle}>Thank You!</Text>
          <Text style={styles.confirmationText}>Your review has been submitted</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => context.setScreen('customer-dashboard')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate Your Experience</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Worker Info */}
        <View style={styles.workerCard}>
          <View style={styles.workerInfo}>
            <Image
              source={{ uri: worker.photo }}
              style={styles.workerAvatar}
            />
            <View style={styles.workerDetails}>
              <Text style={styles.workerName}>{worker.name}</Text>
              <Text style={styles.taskTitle}>{task.title}</Text>
            </View>
          </View>
        </View>

        {/* Rating */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>How was your experience?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={48}
                  color={star <= rating ? '#ffb800' : '#ddd'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>{getRatingText()}</Text>
        </View>

        {/* Review */}
        <View style={styles.reviewCard}>
          <Text style={styles.reviewTitle}>Write a Review</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience with others..."
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{review.length}/500 characters</Text>
        </View>

        {/* Would Hire Again */}
        <View style={styles.hireAgainCard}>
          <View style={styles.hireAgainRow}>
            <View style={styles.hireAgainContent}>
              <Text style={styles.hireAgainTitle}>Would you hire this worker again?</Text>
              <Text style={styles.hireAgainSubtitle}>Help others make better decisions</Text>
            </View>
            <Switch
              value={wouldHireAgain}
              onValueChange={setWouldHireAgain}
              trackColor={{ false: '#ddd', true: '#006600' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0}
        >
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => context.setScreen('customer-dashboard')}
        >
          <Text style={styles.skipButtonText}>Skip for Now</Text>
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
  workerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  workerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#006600',
  },
  workerDetails: {
    flex: 1,
  },
  workerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 14,
    color: '#666',
  },
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  hireAgainCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hireAgainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hireAgainContent: {
    flex: 1,
  },
  hireAgainTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  hireAgainSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#006600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  skipButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
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
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fef3c7',
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

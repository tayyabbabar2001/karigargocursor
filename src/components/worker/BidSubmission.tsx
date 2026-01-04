import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { createBid } from '../../services/firestoreService';

export function BidSubmission({ context }: { context: AppContextType }) {
  const [bidAmount, setBidAmount] = useState('');
  const [completionTime, setCompletionTime] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const job = context.currentTask;
  const worker = context.currentUser;

  const handleSubmit = async () => {
    if (!bidAmount || !completionTime || !job || !worker) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      // Create bid in Firestore
      await createBid({
        jobId: job.id,
        workerId: worker.id,
        workerName: worker.name || 'Worker',
        workerPhoto: worker.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + worker.name,
        workerProfilePicture: worker.profilePicture,
        skill: job.category,
        bidPrice: parseFloat(bidAmount),
        rating: 4.5, // Default rating, can be loaded from worker profile
        distance: '2.5 km', // Can be calculated from location
        verified: false, // Can be loaded from worker profile
        completionTime: completionTime,
        message: message || undefined,
      });

      setSubmitted(true);
      setTimeout(() => {
        context.setScreen('ongoing-jobs');
      }, 2000);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit bid');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={48} color="#10b981" />
          </View>
          <Text style={styles.successTitle}>Bid Submitted!</Text>
          <Text style={styles.successText}>You'll be notified when the customer responds</Text>
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
        <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('job-detail')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Place Your Bid</Text>
      </View>

      {job && (
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobBudget}>Customer Budget: PKR {job.budget?.toLocaleString()}</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Your Bid Amount (PKR)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your bid amount"
              value={bidAmount}
              onChangeText={(text) => {
                // Only allow numbers
                const cleaned = text.replace(/[^0-9]/g, '');
                setBidAmount(cleaned);
              }}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.hint}>
            Recommended: PKR {job?.budget ? (job.budget * 0.8).toLocaleString() : '0'} - PKR {job?.budget?.toLocaleString()}
          </Text>

          <Text style={styles.label}>Estimated Completion Time</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="time-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g., 2 hours, 1 day"
              value={completionTime}
              onChangeText={(text) => {
                // Only allow letters, spaces, numbers for time, and basic punctuation
                const cleaned = text.replace(/[^a-zA-Z0-9\s.,]/g, '');
                setCompletionTime(cleaned);
              }}
            />
          </View>

          <Text style={styles.label}>Message to Customer (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Introduce yourself and explain why you're the right person for this job..."
            value={message}
            onChangeText={(text) => {
              // Only allow letters, spaces, and basic punctuation
              const cleaned = text.replace(/[^a-zA-Z\s.,!?'-]/g, '');
              setMessage(cleaned);
            }}
            multiline
            numberOfLines={4}
            maxLength={300}
            autoCapitalize="sentences"
          />
          <Text style={styles.charCount}>{message.length}/300 characters</Text>
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips for a Winning Bid</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Be competitive but fair with your pricing</Text>
            <Text style={styles.tipItem}>• Provide a realistic completion time</Text>
            <Text style={styles.tipItem}>• Personalize your message to stand out</Text>
            <Text style={styles.tipItem}>• Highlight your experience with similar jobs</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={1}
style={[styles.submitButton, (!bidAmount || !completionTime) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!bidAmount || !completionTime}
        >
          <Text style={styles.submitButtonText}>Submit Bid</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
style={styles.cancelButton}
          onPress={() => context.setScreen('job-detail')}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '500' },
  jobInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  jobTitle: { color: '#fff', fontSize: 16, fontWeight: '500', marginBottom: 4 },
  jobBudget: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 },
  content: { padding: 20, gap: 16 },
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
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#333' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 8,
  },
  inputIcon: { marginLeft: 12 },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  hint: { fontSize: 12, color: '#666', marginBottom: 16 },
  textArea: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  charCount: { fontSize: 12, color: '#666', textAlign: 'right' },
  tipsCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    padding: 20,
  },
  tipsTitle: { fontSize: 16, fontWeight: '500', color: '#1e3a8a', marginBottom: 12 },
  tipsList: { gap: 8 },
  tipItem: { fontSize: 14, color: '#1e40af' },
  submitButton: {
    backgroundColor: '#006600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelButtonText: { color: '#333', fontSize: 16, fontWeight: '500' },
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
  successTitle: { fontSize: 20, fontWeight: '500', color: '#333', marginBottom: 8 },
  successText: { fontSize: 14, color: '#666', textAlign: 'center' },
});

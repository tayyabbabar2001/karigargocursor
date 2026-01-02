import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function PaymentScreen({ context }: { context: AppContextType }) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const worker = context.selectedWorker || { name: 'Ali Khan' };
  const bid = context.selectedBid || { bidPrice: 2000 };
  const task = context.currentTask || { title: 'Fix Kitchen Sink' };

  const serviceFee = bid.bidPrice * 0.05;
  const total = bid.bidPrice + serviceFee;

  const handleConfirmPayment = () => {
    // Mark current task as completed
    if (context.currentTask) {
      const updatedTask = {
        ...context.currentTask,
        status: 'completed' as const,
      };
      context.setCurrentTask(updatedTask);
      
      // Update tasks list - add if not exists, update if exists
      const existingTaskIndex = context.tasks.findIndex(t => t.id === context.currentTask?.id);
      let updatedTasks;
      if (existingTaskIndex >= 0) {
        updatedTasks = context.tasks.map(t =>
          t.id === context.currentTask?.id ? updatedTask : t
        );
      } else {
        updatedTasks = [...context.tasks, updatedTask];
      }
      context.setTasks(updatedTasks);
    }
    
    setShowConfirmation(true);
    setTimeout(() => {
      context.setScreen('rating-review');
    }, 2000);
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
          <Text style={styles.confirmationTitle}>Payment Confirmed!</Text>
          <Text style={styles.confirmationText}>Redirecting to review...</Text>
        </Animated.View>
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('job-tracking')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Payment Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Summary</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Worker</Text>
            <Text style={styles.summaryValue}>{worker.name}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{task.title}</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Service Amount</Text>
            <Text style={styles.summaryValue}>PKR {bid.bidPrice.toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Service Fee (5%)</Text>
            <Text style={styles.summaryValue}>PKR {serviceFee.toLocaleString()}</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>PKR {total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          
          {/* Cash Payment */}
          <TouchableOpacity
            activeOpacity={1}
style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <View style={styles.paymentOptionContent}>
              <View style={[styles.paymentIcon, { backgroundColor: '#e8f5e9' }]}>
                <Ionicons name="cash" size={20} color="#006600" />
              </View>
              <View style={styles.paymentOptionText}>
                <Text style={styles.paymentOptionTitle}>Cash Payment</Text>
                <Text style={styles.paymentOptionSubtitle}>Pay directly to worker</Text>
              </View>
              {paymentMethod === 'cash' && (
                <View style={styles.radioSelected}>
                  <View style={styles.radioInner} />
                </View>
              )}
              {paymentMethod !== 'cash' && <View style={styles.radioUnselected} />}
            </View>
          </TouchableOpacity>

          {/* Online Payment (Disabled) */}
          <TouchableOpacity
            activeOpacity={1}
style={[styles.paymentOption, styles.paymentOptionDisabled]}
            disabled
          >
            <View style={styles.paymentOptionContent}>
              <View style={[styles.paymentIcon, { backgroundColor: '#e3f2fd' }]}>
                <Ionicons name="card" size={20} color="#1976d2" />
              </View>
              <View style={styles.paymentOptionText}>
                <Text style={[styles.paymentOptionTitle, styles.disabledText]}>Online Payment</Text>
                <Text style={[styles.paymentOptionSubtitle, styles.disabledText]}>Coming soon</Text>
              </View>
              <View style={styles.radioUnselected} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Receipt Download */}
        <TouchableOpacity activeOpacity={1}
          style={styles.downloadButton}>
          <Ionicons name="download-outline" size={20} color="#333" />
          <Text style={styles.downloadButtonText}>Download Receipt</Text>
        </TouchableOpacity>

        {/* Confirm Payment */}
        <TouchableOpacity
          activeOpacity={1}
style={styles.confirmButton}
          onPress={handleConfirmPayment}
        >
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#006600',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentOptionSelected: {
    borderColor: '#006600',
    backgroundColor: '#f0f9f0',
  },
  paymentOptionDisabled: {
    opacity: 0.5,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentOptionText: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  paymentOptionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  disabledText: {
    opacity: 0.5,
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#006600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#006600',
  },
  radioUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#006600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
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

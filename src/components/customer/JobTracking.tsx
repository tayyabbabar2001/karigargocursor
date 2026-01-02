import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export function JobTracking({ context }: { context: AppContextType }) {
  const worker = context.selectedWorker || {
    name: 'Ali Khan',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali',
    rating: 4.8,
  };

  const task = context.currentTask || {
    title: 'Fix Kitchen Sink',
    location: 'Karachi, Pakistan',
  };

  const steps = [
    { label: 'Accepted', completed: true },
    { label: 'In Progress', completed: true },
    { label: 'Completed', completed: false },
  ];

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
          <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('customer-dashboard')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Tracking</Text>
        </View>

        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="rgba(255, 255, 255, 0.9)" />
            <Text style={styles.taskLocation}>{task.location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Progress Tracker */}
        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Job Status</Text>
          <View style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                {/* Icon */}
                <View
                  style={[
                    styles.stepIcon,
                    step.completed && styles.stepIconCompleted,
                  ]}
                >
                  {step.completed ? (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  ) : (
                    <View style={styles.stepDot} />
                  )}
                </View>

                {/* Label */}
                <View style={styles.stepLabelContainer}>
                  <Text
                    style={[
                      styles.stepLabel,
                      step.completed && styles.stepLabelCompleted,
                    ]}
                  >
                    {step.label}
                  </Text>
                  {step.completed && index === 1 && (
                    <Text style={styles.stepSubtext}>Worker is on the way</Text>
                  )}
                </View>

                {/* Line */}
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      step.completed && styles.stepLineCompleted,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Worker Info */}
        <View style={styles.workerCard}>
          <Text style={styles.sectionTitle}>Worker Details</Text>
          <View style={styles.workerInfo}>
            <Image
              source={{ uri: worker.photo }}
              style={styles.workerAvatar}
            />
            <View style={styles.workerDetails}>
              <Text style={styles.workerName}>{worker.name}</Text>
              <View style={styles.ratingRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < Math.floor(worker.rating) ? 'star' : 'star-outline'}
                    size={16}
                    color={i < Math.floor(worker.rating) ? '#ffb800' : '#ddd'}
                  />
                ))}
                <Text style={styles.ratingText}>{worker.rating}</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity activeOpacity={1}
          style={styles.phoneButton}>
                <Ionicons name="call" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
style={styles.messageButton}
                onPress={() => context.setScreen('chat')}
              >
                <Ionicons name="chatbubble-ellipses" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Live Map */}
        <View style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="location" size={48} color="#006600" />
            <Text style={styles.mapText}>Live Location Tracking</Text>
            <Text style={styles.mapSubtext}>Worker is 5 mins away</Text>
          </View>
        </View>

        {/* Mark as Complete Button */}
        <TouchableOpacity
          activeOpacity={1}
style={styles.completeButton}
          onPress={() => context.setScreen('payment')}
        >
          <Text style={styles.completeButtonText}>Mark as Completed</Text>
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
    marginBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  taskInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  taskTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskLocation: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
  },
  stepsContainer: {
    position: 'relative',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 32,
    position: 'relative',
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stepIconCompleted: {
    backgroundColor: '#006600',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#999',
  },
  stepLabelContainer: {
    flex: 1,
    paddingTop: 4,
  },
  stepLabel: {
    fontSize: 16,
    color: '#999',
  },
  stepLabelCompleted: {
    color: '#333',
    fontWeight: '600',
  },
  stepSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stepLine: {
    position: 'absolute',
    left: 15,
    top: 40,
    width: 2,
    height: 32,
    backgroundColor: '#e0e0e0',
  },
  stepLineCompleted: {
    backgroundColor: '#006600',
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
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  phoneButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#006600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    height: 256,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  mapSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  completeButton: {
    backgroundColor: '#006600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

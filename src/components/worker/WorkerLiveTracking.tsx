import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export function WorkerLiveTracking({ context }: { context: AppContextType }) {
  const [workerStatus, setWorkerStatus] = useState<'on-the-way' | 'arrived' | 'in-progress' | 'completed'>('on-the-way');
  const [estimatedTime, setEstimatedTime] = useState('12 mins');
  const [distance, setDistance] = useState('2.3 km');
  
  const task = context.currentTask;
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.2, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.75,
  }));

  const getStatusInfo = () => {
    switch (workerStatus) {
      case 'on-the-way':
        return { text: 'On the way to customer', color: '#3b82f6' };
      case 'arrived':
        return { text: 'Arrived at location', color: '#00A86B' };
      case 'in-progress':
        return { text: 'Job in progress', color: '#f97316' };
      case 'completed':
        return { text: 'Job completed', color: '#006600' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('ongoing-jobs')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Active Job</Text>
          <Text style={styles.headerSubtitle}>{task?.title}</Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapBackground}>
          {/* Customer Location Marker */}
          <View style={styles.customerMarker}>
            <View style={styles.customerPin}>
              <Ionicons name="location" size={24} color="#fff" />
            </View>
            <View style={styles.markerLabel}>
              <Text style={styles.markerText}>Customer Location</Text>
            </View>
          </View>

          {/* Worker Location Marker with animation */}
          <View style={styles.workerMarker}>
            <Animated.View style={[styles.pulseCircle, animatedStyle]} />
            <View style={styles.workerPin}>
              <Ionicons name="navigate" size={24} color="#fff" />
            </View>
            <View style={[styles.markerLabel, styles.workerLabel]}>
              <Text style={styles.markerText}>You</Text>
            </View>
          </View>

          {/* Route Line */}
          <View style={styles.routeLine} />
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadgeContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Ionicons name="navigate" size={16} color="#fff" />
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>

        {/* Navigation Button */}
        <TouchableOpacity activeOpacity={1}
          style={styles.navButton}>
          <Ionicons name="navigate" size={20} color="#006600" />
        </TouchableOpacity>
      </View>

      <View style={styles.jobCard}>
        <View style={styles.dragHandle} />

        <View style={styles.customerInfo}>
          <Image
            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed' }}
            style={styles.customerAvatar}
          />
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{task?.customerName || 'Customer Name'}</Text>
            <Text style={styles.customerLocation}>{task?.location}</Text>
            <View style={styles.distanceRow}>
              <View style={styles.distanceItem}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.distanceText}>{distance}</Text>
              </View>
              {workerStatus === 'on-the-way' && (
                <View style={styles.distanceItem}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.distanceText}>ETA: {estimatedTime}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            activeOpacity={1}
style={styles.chatButton}
            onPress={() => context.setScreen('worker-messages')}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#006600" />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1}
          style={styles.callButton}>
            <Ionicons name="call-outline" size={20} color="#fff" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
        </View>

        {workerStatus === 'on-the-way' && (
          <TouchableOpacity
            activeOpacity={1}
style={styles.arrivedButton}
            onPress={() => {
              setWorkerStatus('arrived');
              setDistance('0 km');
            }}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.arrivedButtonText}>Mark as Arrived</Text>
          </TouchableOpacity>
        )}

        {workerStatus === 'arrived' && (
          <TouchableOpacity
            activeOpacity={1}
style={styles.startButton}
            onPress={() => setWorkerStatus('in-progress')}
          >
            <Text style={styles.startButtonText}>Start Working</Text>
          </TouchableOpacity>
        )}

        {workerStatus === 'in-progress' && (
          <TouchableOpacity
            activeOpacity={1}
style={styles.completeButton}
            onPress={() => {
              setWorkerStatus('completed');
              setTimeout(() => context.setScreen('ongoing-jobs'), 1500);
            }}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.completeButtonText}>Complete Job</Text>
          </TouchableOpacity>
        )}

        <View style={styles.taskDetails}>
          <Text style={styles.taskTitle}>Job Details</Text>
          <Text style={styles.taskDescription}>{task?.description}</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Amount:</Text>
            <Text style={styles.paymentAmount}>PKR {task?.budget?.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </View>
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
  },
  headerContent: { flex: 1 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '500' },
  headerSubtitle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, marginTop: 4 },
  mapContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    position: 'relative',
  },
  customerMarker: {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  customerPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  workerMarker: {
    position: 'absolute',
    top: '66%',
    left: '33%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  pulseCircle: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00A86B',
  },
  workerPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00A86B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerLabel: {
    position: 'absolute',
    top: 56,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workerLabel: {
    backgroundColor: '#006600',
  },
  markerText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  routeLine: {
    position: 'absolute',
    top: '25%',
    left: '50%',
    width: 2,
    height: '41%',
    backgroundColor: '#006600',
    opacity: 0.6,
    transform: [{ translateX: -1 }, { rotate: '-30deg' }],
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: 16,
    left: '50%',
    transform: [{ translateX: -100 }],
    zIndex: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  navButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    marginTop: -24,
  },
  dragHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  customerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#006600',
  },
  customerDetails: { flex: 1 },
  customerName: { fontSize: 18, fontWeight: '500', marginBottom: 4 },
  customerLocation: { fontSize: 14, color: '#666', marginBottom: 8 },
  distanceRow: {
    flexDirection: 'row',
    gap: 16,
  },
  distanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: { fontSize: 14, color: '#666' },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#006600',
    padding: 16,
    borderRadius: 12,
  },
  chatButtonText: { color: '#006600', fontSize: 16, fontWeight: '500' },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006600',
    padding: 16,
    borderRadius: 12,
  },
  callButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  arrivedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00A86B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  arrivedButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  startButton: {
    backgroundColor: '#f97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006600',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  completeButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  taskDetails: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  taskTitle: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  taskDescription: { fontSize: 14, color: '#666', marginBottom: 12 },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: { fontSize: 14, color: '#666' },
  paymentAmount: { fontSize: 16, fontWeight: '500', color: '#006600' },
});

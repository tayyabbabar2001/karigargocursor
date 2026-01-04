import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContextType } from '../../types';

export function LiveJobTracking({ context }: { context: AppContextType }) {
  const [workerStatus, setWorkerStatus] = useState<'on-the-way' | 'arrived' | 'in-progress' | 'completed'>('on-the-way');
  const [estimatedTime, setEstimatedTime] = useState('12 mins');
  const [distance, setDistance] = useState('2.3 km');
  
  const worker = context.selectedWorker;
  const task = context.currentTask;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (workerStatus === 'on-the-way') {
        setWorkerStatus('arrived');
        setEstimatedTime('Arrived');
        setDistance('0 km');
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [workerStatus]);

  const handleJobComplete = () => {
    context.setScreen('payment');
  };

  const statusInfo = {
    'on-the-way': { text: 'Worker is on the way', color: '#3b82f6' },
    'arrived': { text: 'Worker has arrived', color: '#00A86B' },
    'in-progress': { text: 'Job in progress', color: '#f97316' },
    'completed': { text: 'Job completed', color: '#006600' },
  }[workerStatus];

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
        <View style={styles.headerTop}>
          <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('customer-dashboard')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Live Job Tracking</Text>
            <Text style={styles.headerSubtitle}>{task?.title}</Text>
          </View>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>📍</Text>
          <Text style={styles.mapLabel}>Live Map View</Text>
          <Text style={styles.mapSubtext}>Worker location tracking</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.statusCard, { backgroundColor: statusInfo.color }]}>
          <Text style={styles.statusText}>{statusInfo.text}</Text>
          <Text style={styles.timeText}>{estimatedTime}</Text>
          <Text style={styles.distanceText}>{distance}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.workerName}>{worker?.name || 'Worker'}</Text>
          <Text style={styles.taskTitle}>{task?.title}</Text>
          <Text style={styles.taskLocation}>📍 {task?.location}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            activeOpacity={1}
style={styles.button}
            onPress={() => context.setScreen('chat')}
          >
            <Text style={styles.buttonText}>💬 Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
style={[styles.button, styles.callButton]}
          >
            <Text style={styles.buttonText}>📞 Call</Text>
          </TouchableOpacity>
        </View>

        {workerStatus === 'in-progress' && (
          <TouchableOpacity
            activeOpacity={1}
style={[styles.button, styles.completeButton]}
            onPress={handleJobComplete}
          >
            <Text style={styles.buttonText}>Mark as Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#006600', padding: 24, paddingTop: 40 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '500' },
  headerSubtitle: { color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  mapContainer: { height: 300, backgroundColor: '#e0e0e0' },
  mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapText: { fontSize: 24, marginBottom: 12 },
  mapLabel: { fontSize: 18, color: '#666', marginBottom: 4 },
  mapSubtext: { fontSize: 14, color: '#999' },
  content: { padding: 16 },
  statusCard: { borderRadius: 12, padding: 20, marginBottom: 16, alignItems: 'center' },
  statusText: { color: '#fff', fontSize: 18, fontWeight: '500', marginBottom: 8 },
  timeText: { color: '#fff', fontSize: 24, fontWeight: '500', marginBottom: 4 },
  distanceText: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 14 },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  workerName: { fontSize: 18, fontWeight: '500', marginBottom: 8 },
  taskTitle: { fontSize: 16, color: '#333', marginBottom: 8 },
  taskLocation: { fontSize: 14, color: '#666' },
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  button: { flex: 1, backgroundColor: '#006600', borderRadius: 12, padding: 16, alignItems: 'center' },
  callButton: { backgroundColor: '#10b981' },
  completeButton: { marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});


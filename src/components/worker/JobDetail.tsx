import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export function JobDetail({ context }: { context: AppContextType }) {
  const job = context.currentTask;

  if (!job) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>No job selected</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false} scrollEventThrottle={16}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => context.setScreen('available-jobs')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{job.category}</Text>
            </View>
          </View>
          <Text style={styles.description}>{job.description}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#d4edda' }]}>
                <Ionicons name="cash-outline" size={20} color="#006600" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>PKR {job.budget?.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#cfe2ff' }]}>
                <Ionicons name="location-outline" size={20} color="#0066CC" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{job.location}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#e2d9f3' }]}>
                <Ionicons name="calendar-outline" size={20} color="#9C27B0" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{new Date(job.date).toLocaleDateString()}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#ffe4cc' }]}>
                <Ionicons name="time-outline" size={20} color="#f97316" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{job.time}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <View style={styles.customerInfo}>
            <View style={styles.customerAvatar}>
              <Text style={styles.customerAvatarText}>{job.customerName?.[0] || 'C'}</Text>
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{job.customerName}</Text>
              <Text style={styles.customerMeta}>Posted today</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location Map</Text>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="location" size={48} color="#006600" />
            <Text style={styles.mapText}>Map View</Text>
            <Text style={styles.mapSubtext}>2.5 km away</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => context.setScreen('bid-submission')}
        >
          <Text style={styles.actionButtonText}>Place a Bid</Text>
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
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  content: { padding: 16, gap: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#666', fontSize: 16 },
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
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  jobTitle: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  categoryBadge: {
    backgroundColor: 'rgba(0, 102, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: { color: '#006600', fontSize: 12, fontWeight: '600' },
  description: { color: '#666', fontSize: 14, marginBottom: 16 },
  detailsContainer: { gap: 12 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: { flex: 1 },
  detailLabel: { color: '#666', fontSize: 12, marginBottom: 4 },
  detailValue: { color: '#333', fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#006600',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  customerAvatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  customerDetails: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  customerMeta: { color: '#666', fontSize: 14 },
  mapPlaceholder: {
    height: 192,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: { color: '#666', fontSize: 16, marginTop: 8 },
  mapSubtext: { color: '#999', fontSize: 14, marginTop: 4 },
  actionButton: {
    backgroundColor: '#006600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';

interface Job {
  id: string;
  title: string;
  customer: string;
  location: string;
  amount: number;
  status: 'In Progress' | 'Accepted' | 'Completed';
  date: string;
  rating?: number;
}

const initialActiveJobs: Job[] = [
  {
    id: '1',
    title: 'Fix Kitchen Sink',
    customer: 'Ahmed Khan',
    location: 'Karachi',
    amount: 2000,
    status: 'In Progress',
    date: 'Today, 10:00 AM',
  },
  {
    id: '2',
    title: 'Electrical Wiring',
    customer: 'Sara Ali',
    location: 'Lahore',
    amount: 3500,
    status: 'Accepted',
    date: 'Tomorrow, 2:00 PM',
  },
];

const initialCompletedJobs: Job[] = [
  {
    id: '3',
    title: 'Paint Living Room',
    customer: 'Usman Ahmed',
    location: 'Islamabad',
    amount: 5000,
    status: 'Completed',
    rating: 5,
    date: '2 days ago',
  },
  {
    id: '4',
    title: 'Repair Door',
    customer: 'Fatima Shah',
    location: 'Karachi',
    amount: 1500,
    status: 'Completed',
    rating: 4,
    date: '1 week ago',
  },
];

export function OngoingJobs({ context }: { context: AppContextType }) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [activeJobs, setActiveJobs] = useState<Job[]>(initialActiveJobs);
  const [completedJobs, setCompletedJobs] = useState<Job[]>(initialCompletedJobs);

  const handleJobComplete = (jobId: string) => {
    const job = activeJobs.find(j => j.id === jobId);
    if (job) {
      // Remove from active jobs
      setActiveJobs(prev => prev.filter(j => j.id !== jobId));
      // Add to completed jobs with rating
      setCompletedJobs(prev => [
        {
          ...job,
          status: 'Completed' as const,
          rating: 5,
          date: 'Just now',
        },
        ...prev,
      ]);
      // Navigate to review screen
      context.setScreen('worker-review');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('available-jobs')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Jobs</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          activeOpacity={1}
style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Active ({activeJobs.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
            Completed ({completedJobs.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        nestedScrollEnabled={false}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={16}
        >
        {activeTab === 'active' ? (
          <View style={styles.jobsList}>
            {activeJobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <View style={styles.jobInfo}>
                    <View style={styles.jobTitleRow}>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                      <View style={[
                        styles.statusBadge,
                        job.status === 'In Progress' ? styles.statusActive : styles.statusAccepted
                      ]}>
                        <Text style={styles.statusText}>{job.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.customerName}>{job.customer}</Text>
                    <Text style={styles.location}>{job.location}</Text>
                  </View>
                  <View style={styles.jobAmount}>
                    <Text style={styles.amount}>PKR {job.amount.toLocaleString()}</Text>
                    <Text style={styles.date}>{job.date}</Text>
                  </View>
                </View>

                <View style={styles.jobActions}>
                  <TouchableOpacity activeOpacity={1}
          style={styles.actionButton}>
                    <Ionicons name="call-outline" size={16} color="#006600" />
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
style={styles.actionButton}
                    onPress={() => context.setScreen('worker-messages')}
                  >
                    <Ionicons name="chatbubble-outline" size={16} color="#006600" />
                    <Text style={styles.actionText}>Chat</Text>
                  </TouchableOpacity>
                  {job.status === 'In Progress' && (
                    <TouchableOpacity
                      activeOpacity={1}
style={styles.doneButton}
                      onPress={() => handleJobComplete(job.id)}
                    >
                      <Ionicons name="checkmark-circle" size={16} color="#fff" />
                      <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.jobsList}>
            {completedJobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={styles.customerRow}>
                      <View style={styles.customerAvatar}>
                        <Text style={styles.customerAvatarText}>{job.customer[0]}</Text>
                      </View>
                      <Text style={styles.customerName}>{job.customer}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < (job.rating || 0) ? 'star' : 'star-outline'}
                          size={16}
                          color={i < (job.rating || 0) ? '#ffb800' : '#ddd'}
                        />
                      ))}
                    </View>
                  </View>
                  <View style={styles.jobAmount}>
                    <Text style={styles.amount}>PKR {job.amount.toLocaleString()}</Text>
                    <Text style={styles.date}>{job.date}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#006600',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: { flex: 1, padding: 20 },
  jobsList: { gap: 16 },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  jobInfo: { flex: 1 },
  jobTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  jobTitle: { fontSize: 16, fontWeight: '600', flex: 1 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusActive: { backgroundColor: '#00A86B' },
  statusAccepted: { backgroundColor: '#3b82f6' },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  customerName: { fontSize: 14, color: '#666', marginBottom: 4 },
  location: { fontSize: 12, color: '#999' },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  customerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#006600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerAvatarText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  jobAmount: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: '600', color: '#006600', marginBottom: 4 },
  date: { fontSize: 12, color: '#999' },
  jobActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 12,
  },
  actionText: { color: '#006600', fontSize: 14, fontWeight: '600' },
  doneButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#006600',
    padding: 12,
    borderRadius: 12,
  },
  doneText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

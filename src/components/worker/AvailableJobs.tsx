import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { AppContextType, Task } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { getAvailableJobs } from '../../services/firestoreService';

export function AvailableJobs({ context }: { context: AppContextType }) {
  const [sortBy, setSortBy] = useState('all');
  const [activeTab, setActiveTab] = useState('home');
  const [availableJobs, setAvailableJobs] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Get worker's skills from currentUser
  const worker = context.currentUser;
  const workerSkills = worker?.skills || (worker?.skill ? [worker.skill] : []);

  // Load jobs from Firestore
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobs = await getAvailableJobs(workerSkills);
        
        // Convert Firestore jobs to Task format
        const tasks: Task[] = jobs.map(job => ({
          id: job.id,
          title: job.title,
          description: job.description,
          category: job.category,
          location: job.location,
          budget: job.budget,
          date: typeof job.date === 'string' ? job.date : job.date?.toDate().toISOString().split('T')[0] || '',
          time: job.time || '',
          status: job.status,
          customerId: job.customerId,
          customerName: job.customerName,
          image: job.image,
        }));

        setAvailableJobs(tasks);
      } catch (error) {
        console.error('Failed to load jobs:', error);
        setAvailableJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [workerSkills.join(',')]); // Reload when skills change

  // Filter jobs based on worker's registered skills
  let skillFilteredJobs = availableJobs.filter(job => 
    workerSkills.length > 0 && workerSkills.includes(job.category)
  );

  // Apply category filter on top of skill filter
  const filteredJobs = sortBy === 'all' 
    ? skillFilteredJobs 
    : skillFilteredJobs.filter(job => job.category === sortBy);

  const handleViewDetails = (job: Task) => {
    context.setCurrentTask(job);
    context.setScreen('job-detail');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Centered Title */}
        <Text style={styles.headerTitle}>Worker Home</Text>
        
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{worker?.name || 'Worker'} 👋</Text>
            {workerSkills.length > 0 && (
              <Text style={styles.skillsText}>Skills: {workerSkills.join(', ')}</Text>
            )}
          </View>
          <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('worker-profile')}>
            {worker?.profilePicture ? (
              <Image
                source={{ uri: worker.profilePicture }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(worker?.name || 'Worker').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Available</Text>
            <Text style={styles.statValue}>{skillFilteredJobs.length}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Bids Sent</Text>
            <Text style={styles.statValue}>5</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Active</Text>
            <Text style={styles.statValue}>2</Text>
          </View>
        </View>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <Ionicons name="filter-outline" size={20} color="#666" />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sortBy}
            onValueChange={setSortBy}
            style={styles.picker}
          >
            <Picker.Item label="All Categories" value="all" />
            <Picker.Item label="Electrician" value="Electrician" />
            <Picker.Item label="Plumber" value="Plumber" />
            <Picker.Item label="Carpenter" value="Carpenter" />
            <Picker.Item label="Painter" value="Painter" />
            <Picker.Item label="AC Technician" value="AC Technician" />
            <Picker.Item label="Cleaner" value="Cleaner" />
          </Picker>
        </View>
      </View>

      {/* Jobs List */}
      <ScrollView 
        style={styles.jobsList} 
        showsVerticalScrollIndicator={false} 
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        nestedScrollEnabled={false}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={16}
        >
        <View style={styles.jobsHeader}>
          <Text style={styles.jobsTitle}>Jobs for Your Skills</Text>
          <Text style={styles.jobsCount}>{filteredJobs.length} jobs</Text>
        </View>

        {filteredJobs.length === 0 ? (
          <View style={styles.noJobsContainer}>
            <Ionicons name="briefcase-outline" size={64} color="#ccc" />
            <Text style={styles.noJobsText}>No jobs available</Text>
            <Text style={styles.noJobsSubtext}>Jobs matching your registered skills will appear here</Text>
          </View>
        ) : (
          filteredJobs.map((job) => (
          <TouchableOpacity
            activeOpacity={1}
            key={job.id}
            style={styles.jobCard}
            onPress={() => handleViewDetails(job)}
          >
            <View style={styles.jobCardContent}>
              <View style={styles.jobHeader}>
                <View style={styles.jobTitleRow}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{job.category}</Text>
                  </View>
                </View>
                <Text style={styles.jobDescription}>{job.description}</Text>
                
                <View style={styles.jobDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="cash-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>PKR {job.budget.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>2.5 km</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{new Date(job.date).toLocaleDateString()}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.jobFooter}>
                <View style={styles.customerInfo}>
                  <View style={styles.customerAvatar}>
                    <Text style={styles.customerAvatarText}>{job.customerName[0]}</Text>
                  </View>
                  <Text style={styles.customerName}>{job.customerName}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={1}
style={styles.viewButton}
                  onPress={() => handleViewDetails(job)}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          activeOpacity={1}
style={[styles.navItem, activeTab === 'home' && styles.navItemActive]}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons name="home" size={24} color={activeTab === 'home' ? '#006600' : '#999'} />
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
style={[styles.navItem, activeTab === 'ongoing' && styles.navItemActive]}
          onPress={() => {
            setActiveTab('ongoing');
            context.setScreen('ongoing-jobs');
          }}
        >
          <Ionicons name="briefcase" size={24} color={activeTab === 'ongoing' ? '#006600' : '#999'} />
          <Text style={[styles.navText, activeTab === 'ongoing' && styles.navTextActive]}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
style={[styles.navItem, activeTab === 'earnings' && styles.navItemActive]}
          onPress={() => {
            setActiveTab('earnings');
            context.setScreen('earnings-history');
          }}
        >
          <Ionicons name="cash" size={24} color={activeTab === 'earnings' ? '#006600' : '#999'} />
          <Text style={[styles.navText, activeTab === 'earnings' && styles.navTextActive]}>Earnings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
style={[styles.navItem, activeTab === 'profile' && styles.navItemActive]}
          onPress={() => {
            setActiveTab('profile');
            context.setScreen('worker-profile');
          }}
        >
          <Ionicons name="person" size={24} color={activeTab === 'profile' ? '#006600' : '#999'} />
          <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#006600',
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 },
  userName: { color: '#fff', fontSize: 20, fontWeight: '500' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '500' },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  statLabel: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, marginBottom: 4 },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '500' },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  picker: { height: 50 },
  jobsList: { flex: 1, paddingHorizontal: 24 },
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobsTitle: { fontSize: 18, fontWeight: '500', color: '#333' },
  jobsCount: { fontSize: 14, color: '#666' },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobCardContent: { padding: 16 },
  jobHeader: {
    marginBottom: 12,
  },
  jobTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  jobTitle: { fontSize: 16, fontWeight: '500', flex: 1 },
  categoryBadge: {
    backgroundColor: 'rgba(0, 102, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: { color: '#006600', fontSize: 12, fontWeight: '500' },
  jobDescription: { color: '#666', fontSize: 14, marginBottom: 12 },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: { color: '#666', fontSize: 14 },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#006600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerAvatarText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  customerName: { color: '#666', fontSize: 14 },
  viewButton: {
    backgroundColor: '#006600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  viewButtonText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 12,
    paddingBottom: 24,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navItemActive: {},
  navText: { fontSize: 12, color: '#999' },
  navTextActive: { color: '#006600', fontWeight: '500' },
  skillsText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  noJobsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  noJobsText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noJobsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

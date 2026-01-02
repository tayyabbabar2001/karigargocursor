import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { name: 'Electrician', color: '#FFB800', icon: '⚡' },
  { name: 'Plumber', color: '#0066CC', icon: '💧' },
  { name: 'AC Technician', color: '#CC3300', icon: '❄️' },
  { name: 'Carpenter', color: '#8B4513', icon: '🔨' },
  { name: 'Painter', color: '#9C27B0', icon: '🎨' },
  { name: 'Cleaner', color: '#10B981', icon: '🏠' },
];

interface Job {
  id: string;
  title: string;
  worker: string;
  status: 'In Progress' | 'Bidding' | 'Completed';
  category: string;
  rating?: number;
  date?: string;
}

export function CustomerDashboard({ context }: { context: AppContextType }) {
  const [activeTab, setActiveTab] = useState('home');
  const categoryScrollRef = useRef<ScrollView>(null);
  const [ongoingJobs, setOngoingJobs] = useState<Job[]>([
    { id: '1', title: 'Fix Kitchen Sink', worker: 'Ali Khan', status: 'In Progress', category: 'Plumber' },
    { id: '2', title: 'Electrical Wiring', worker: 'Bilal Ahmed', status: 'Bidding', category: 'Electrician' },
  ]);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([
    { id: '3', title: 'Paint Living Room', worker: 'Farhan Malik', status: 'Completed', category: 'Painter', rating: 5, date: '2 days ago' },
    { id: '4', title: 'Repair Furniture', worker: 'Kamran Ali', status: 'Completed', category: 'Carpenter', rating: 4, date: '1 week ago' },
  ]);

  // Move job from ongoing to completed when marked complete
  useEffect(() => {
    // Check if any tasks were completed
    const completedTask = context.tasks.find(t => t.status === 'completed');
    if (completedTask) {
      setOngoingJobs(prev => {
        const job = prev.find(j => j.id === completedTask.id);
        if (job) {
          // Add to completed if not already there
          setCompletedJobs(prevCompleted => {
            const exists = prevCompleted.find(j => j.id === completedTask.id);
            if (!exists) {
              return [
                {
                  ...job,
                  status: 'Completed' as const,
                  rating: 5,
                  date: 'Just now',
                },
                ...prevCompleted,
              ];
            }
            return prevCompleted;
          });
          // Remove from ongoing
          return prev.filter(j => j.id !== completedTask.id);
        }
        return prev;
      });
    }
  }, [context.tasks]);

  // Smooth continuous auto-slide categories - faster and smoother
  useEffect(() => {
    let scrollPosition = 0;
    const itemWidth = 100; // Approximate width of each category item
    const totalWidth = categories.length * itemWidth;
    
    const interval = setInterval(() => {
      scrollPosition += 2; // Move 2 pixels at a time for faster scrolling
      
      // If we've scrolled past all items, reset to create infinite loop
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0;
        categoryScrollRef.current?.scrollTo({ x: 0, animated: false });
      } else {
        categoryScrollRef.current?.scrollTo({
          x: scrollPosition,
          animated: false, // Use false for smooth continuous scrolling
        });
      }
    }, 30); // Update every 30ms for smoother and faster animation

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Centered Title */}
        <Text style={styles.appTitle}>KarigarGo</Text>
        
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.helloText}>Hello,</Text>
            <Text style={styles.userName}>{context.currentUser?.name || 'Ahmed'} 👋</Text>
          </View>
          <TouchableOpacity onPress={() => context.setScreen('customer-profile')}>
            <Image
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed' }}
              style={styles.profileAvatar}
            />
          </TouchableOpacity>
        </View>

        {/* Post Task Button */}
        <TouchableOpacity
          style={styles.postTaskButton}
          onPress={() => context.setScreen('post-task')}
        >
          <Ionicons name="add" size={20} color="#006600" />
          <Text style={styles.postTaskText}>Post a Task</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} bounces={false} scrollEventThrottle={16}>
        {/* Service Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Categories</Text>
          <ScrollView
            ref={categoryScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            scrollEnabled={false}
            bounces={false}
          >
            {/* Duplicate categories for infinite loop */}
            {[...categories, ...categories, ...categories].map((category, index) => (
              <TouchableOpacity key={`${category.name}-${index}`} style={styles.categoryItem}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Ongoing Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ongoing Jobs</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {ongoingJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No ongoing jobs</Text>
            </View>
          ) : (
            ongoingJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                style={styles.jobCard}
                onPress={() => {
                  context.setCurrentTask({
                    id: job.id,
                    title: job.title,
                    description: 'Need professional help',
                    category: job.category,
                    location: 'Karachi, Pakistan',
                    budget: 2500,
                    date: '2025-11-05',
                    time: '10:00 AM',
                    status: job.status === 'Bidding' ? 'pending' : 'in-progress',
                    customerId: 'customer-1',
                    customerName: 'Ahmed',
                  });
                  context.setScreen(job.status === 'Bidding' ? 'bidding' : 'job-tracking');
                }}
              >
                <View style={styles.jobCardContent}>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobWorker}>{job.worker}</Text>
                    <Text style={styles.jobCategory}>{job.category}</Text>
                  </View>
                  <View style={[styles.statusBadge, job.status === 'In Progress' ? styles.statusActive : styles.statusPending]}>
                    <Text style={styles.statusText}>{job.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Completed Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Completed Jobs</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {completedJobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobCardContent}>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobWorker}>{job.worker}</Text>
                  <View style={styles.ratingContainer}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Text key={i} style={i < job.rating ? styles.starFilled : styles.starEmpty}>
                        ★
                      </Text>
                    ))}
                  </View>
                </View>
                <Text style={styles.jobDate}>{job.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons name="home" size={24} color={activeTab === 'home' ? '#006600' : '#999'} />
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('jobs')}
        >
          <Ionicons name="briefcase" size={24} color={activeTab === 'jobs' ? '#006600' : '#999'} />
          <Text style={[styles.navText, activeTab === 'jobs' && styles.navTextActive]}>My Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('messages');
            context.setScreen('chat');
          }}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color={activeTab === 'messages' ? '#006600' : '#999'} />
          <Text style={[styles.navText, activeTab === 'messages' && styles.navTextActive]}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('profile');
            context.setScreen('customer-profile');
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
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
  appTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  helloText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  postTaskButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postTaskText: {
    fontSize: 18,
    color: '#006600',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAll: {
    color: '#006600',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesScroll: {
    marginTop: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0,
  },
  jobCardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  jobWorker: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  jobCategory: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  jobDate: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusActive: {
    backgroundColor: '#00A86B',
  },
  statusPending: {
    backgroundColor: '#f97316',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 8,
    marginBottom: 4,
  },
  starFilled: {
    fontSize: 16,
    color: '#ffb800',
  },
  starEmpty: {
    fontSize: 16,
    color: '#ddd',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 12,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 12,
    color: '#999',
  },
  navTextActive: {
    color: '#006600',
    fontWeight: '600',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 14,
  },
});

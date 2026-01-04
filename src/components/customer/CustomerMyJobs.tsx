import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContextType, Task, Bid } from '../../types';
import { Picker } from '@react-native-picker/picker';

export function CustomerMyJobs({ context }: { context: AppContextType }) {
  const [filterBy, setFilterBy] = useState<'closest' | 'lowest-bid' | 'highest-rating'>('closest');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  // Get all jobs posted by the current customer
  const customerJobs = context.tasks.filter(task => 
    task.customerId === context.currentUser?.id || task.customerId === 'customer-1'
  );

  const handleExpandJob = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const handleAcceptBid = (job: Task, bid: Bid) => {
    context.setCurrentTask(job);
    context.setSelectedBid(bid);
    context.setSelectedWorker({
      id: bid.workerId,
      name: bid.workerName,
      photo: bid.workerPhoto,
      skills: [bid.skill],
      rating: bid.rating,
      totalJobs: 45,
      verified: bid.verified,
      distance: bid.distance,
      jobHistory: [],
    });
    context.setScreen('live-tracking');
  };

  const handleViewProfile = (bid: Bid) => {
    context.setSelectedWorker({
      id: bid.workerId,
      name: bid.workerName,
      photo: bid.workerPhoto,
      skills: [bid.skill],
      rating: bid.rating,
      totalJobs: 45,
      verified: bid.verified,
      distance: bid.distance,
      jobHistory: [],
    });
    context.setScreen('worker-profile-view');
  };

  const handleViewBids = (job: Task) => {
    context.setCurrentTask(job);
    context.setScreen('bidding');
  };

  const sortBids = (bids: Bid[]) => {
    const sorted = [...bids];
    if (filterBy === 'lowest-bid') {
      return sorted.sort((a, b) => a.bidPrice - b.bidPrice);
    }
    if (filterBy === 'highest-rating') {
      return sorted.sort((a, b) => b.rating - a.rating);
    }
    if (filterBy === 'closest') {
      return sorted.sort((a, b) => {
        const distA = parseFloat(a.distance.replace(' km', '').trim());
        const distB = parseFloat(b.distance.replace(' km', '').trim());
        return distA - distB;
      });
    }
    return sorted;
  };

  const totalBids = customerJobs.reduce((sum, job) => sum + (job.bids?.length || 0), 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('customer-dashboard')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>My Jobs</Text>
            <Text style={styles.headerSubtitle}>{customerJobs.length} jobs posted</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Jobs</Text>
            <Text style={styles.statValue}>{customerJobs.length}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Bids</Text>
            <Text style={styles.statValue}>{totalBids}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Active</Text>
            <Text style={styles.statValue}>{customerJobs.filter(j => j.status === 'pending' || j.status === 'in-progress').length}</Text>
          </View>
        </View>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <Ionicons name="filter-outline" size={20} color="#666" />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={filterBy}
            onValueChange={(value) => setFilterBy(value)}
            style={styles.picker}
          >
            <Picker.Item label="Sort by: Closest" value="closest" />
            <Picker.Item label="Sort by: Lowest Bid" value="lowest-bid" />
            <Picker.Item label="Sort by: Highest Rating" value="highest-rating" />
          </Picker>
        </View>
      </View>

      {/* Jobs List */}
      <ScrollView 
        style={styles.jobsList} 
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        nestedScrollEnabled={false}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={16}
        >
        {customerJobs.length === 0 ? (
          <View style={styles.noJobsContainer}>
            <Ionicons name="briefcase-outline" size={64} color="#ccc" />
            <Text style={styles.noJobsText}>No jobs posted yet</Text>
            <Text style={styles.noJobsSubtext}>Post a task to see it here</Text>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.postTaskButton}
              onPress={() => context.setScreen('post-task')}
            >
              <Text style={styles.postTaskButtonText}>Post a Task</Text>
            </TouchableOpacity>
          </View>
        ) : (
          customerJobs.map((job) => {
            const bids = job.bids || [];
            const sortedBids = sortBids(bids);
            const isExpanded = expandedJob === job.id;

            return (
              <View key={job.id} style={styles.jobCard}>
                {/* Job Header */}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => handleExpandJob(job.id)}
                  style={styles.jobHeader}
                >
                  <View style={styles.jobHeaderContent}>
                    <View style={styles.jobTitleRow}>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                      <View style={[styles.statusBadge, job.status === 'pending' ? styles.statuspending : job.status === 'in-progress' ? styles.statusinprogress : styles.statuscompleted]}>
                        <Text style={styles.statusText}>{job.status.replace('-', ' ').toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={styles.jobDescription}>{job.description}</Text>
                    <View style={styles.jobMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.metaText}>{job.location}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="cash-outline" size={16} color="#666" />
                        <Text style={styles.metaText}>PKR {job.budget.toLocaleString()}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="pricetag-outline" size={16} color="#006600" />
                        <Text style={styles.bidCountText}>{bids.length} {bids.length === 1 ? 'bid' : 'bids'}</Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color="#666" 
                  />
                </TouchableOpacity>

                {/* Expanded Bids Section */}
                {isExpanded && (
                  <View style={styles.bidsSection}>
                    {sortedBids.length === 0 ? (
                      <View style={styles.noBidsContainer}>
                        <Ionicons name="people-outline" size={48} color="#ccc" />
                        <Text style={styles.noBidsText}>No bids received yet</Text>
                        <Text style={styles.noBidsSubtext}>Bids will appear here when workers submit them</Text>
                      </View>
                    ) : (
                      <>
                        <View style={styles.bidsHeader}>
                          <Text style={styles.bidsTitle}>Bids Received</Text>
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => handleViewBids(job)}
                            style={styles.viewAllButton}
                          >
                            <Text style={styles.viewAllText}>View All</Text>
                          </TouchableOpacity>
                        </View>
                        {sortedBids.slice(0, 3).map((bid) => (
                          <View key={bid.id} style={styles.bidCard}>
                            <View style={styles.bidHeader}>
                              <Image source={{ uri: bid.workerPhoto }} style={styles.avatar} />
                              <View style={styles.bidInfo}>
                                <View style={styles.workerNameRow}>
                                  <Text style={styles.workerName}>{bid.workerName}</Text>
                                  {bid.verified && (
                                    <View style={styles.verifiedBadge}>
                                      <Text style={styles.verifiedText}>✓</Text>
                                    </View>
                                  )}
                                </View>
                                <Text style={styles.skill}>{bid.skill}</Text>
                                <View style={styles.ratingRow}>
                                  <Text style={styles.rating}>⭐ {bid.rating}</Text>
                                  <Text style={styles.distance}>📍 {bid.distance}</Text>
                                  {bid.completionTime && (
                                    <Text style={styles.time}>Est: {bid.completionTime}</Text>
                                  )}
                                </View>
                              </View>
                              <Text style={styles.price}>PKR {bid.bidPrice.toLocaleString()}</Text>
                            </View>

                            {bid.message && (
                              <View style={styles.messageContainer}>
                                <Text style={styles.message}>{bid.message}</Text>
                              </View>
                            )}

                            <View style={styles.buttonRow}>
                              <TouchableOpacity
                                activeOpacity={1}
                                style={[styles.button, styles.secondaryButton]}
                                onPress={() => handleViewProfile(bid)}
                              >
                                <Text style={styles.secondaryButtonText}>View Profile</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                activeOpacity={1}
                                style={[styles.button, styles.primaryButton]}
                                onPress={() => handleAcceptBid(job, bid)}
                              >
                                <Text style={styles.primaryButtonText}>Accept</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                        {sortedBids.length > 3 && (
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => handleViewBids(job)}
                            style={styles.moreBidsButton}
                          >
                            <Text style={styles.moreBidsText}>
                              View {sortedBids.length - 3} more {sortedBids.length - 3 === 1 ? 'bid' : 'bids'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
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
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  picker: {
    height: 50,
  },
  jobsList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  jobHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  jobHeaderContent: {
    flex: 1,
  },
  jobTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statuspending: {
    backgroundColor: '#fef3c7',
  },
  statusinprogress: {
    backgroundColor: '#dbeafe',
  },
  statuscompleted: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#333',
  },
  jobDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 12,
  },
  jobMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  bidCountText: {
    fontSize: 14,
    color: '#006600',
    fontWeight: '500',
  },
  bidsSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 16,
    backgroundColor: '#fafafa',
  },
  bidsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bidsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    color: '#006600',
    fontSize: 14,
    fontWeight: '500',
  },
  bidCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  bidHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  bidInfo: {
    flex: 1,
  },
  workerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  verifiedBadge: {
    backgroundColor: '#00A86B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  skill: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    color: '#006600',
    fontSize: 18,
    fontWeight: '500',
  },
  messageContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  message: {
    color: '#666',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#006600',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  moreBidsButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
  },
  moreBidsText: {
    color: '#006600',
    fontSize: 14,
    fontWeight: '500',
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
    marginBottom: 24,
  },
  postTaskButton: {
    backgroundColor: '#006600',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  postTaskButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  noBidsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  noBidsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  noBidsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});


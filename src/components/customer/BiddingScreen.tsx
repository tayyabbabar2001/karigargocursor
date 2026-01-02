import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AppContextType } from '../../types';

export function BiddingScreen({ context }: { context: AppContextType }) {
  const [sortBy, setSortBy] = useState('lowest-price');
  const task = context.currentTask;
  const bids = task?.bids || [];

  const sortedBids = [...bids].sort((a, b) => {
    if (sortBy === 'lowest-price') return a.bidPrice - b.bidPrice;
    if (sortBy === 'highest-rating') return b.rating - a.rating;
    if (sortBy === 'nearest') return parseFloat(a.distance) - parseFloat(b.distance);
    return 0;
  });

  const handleAcceptBid = (bid: any) => {
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

  const handleViewProfile = (bid: any) => {
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
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Bids on Your Task</Text>
            <Text style={styles.headerSubtitle}>{task?.title}</Text>
          </View>
        </View>

        <View style={styles.taskInfo}>
          <Text style={styles.taskLocation}>📍 {task?.location}</Text>
          <View style={styles.taskDetails}>
            <Text style={styles.taskBudget}>Budget: PKR {task?.budget?.toLocaleString()}</Text>
            <Text style={styles.bidCount}>{bids.length} Bids</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {sortedBids.map((bid) => (
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
                onPress={() => handleAcceptBid(bid)}
              >
                <Text style={styles.primaryButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    color: '#fff',
    fontSize: 24,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  taskInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  taskLocation: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskBudget: {
    color: '#fff',
  },
  bidCount: {
    color: '#fff',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  bidCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontWeight: '600',
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
  },
  skill: {
    color: '#666',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rating: {
    fontSize: 14,
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
    fontWeight: '600',
  },
  messageContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  message: {
    color: '#666',
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
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#006600',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});


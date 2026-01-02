import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AppContextType } from '../../types';

export function WorkerProfileView({ context }: { context: AppContextType }) {
  const worker = context.selectedWorker;

  if (!worker) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No worker selected</Text>
      </View>
    );
  }

  const handleHire = () => {
    context.setScreen('job-tracking');
  };

  return (
    <ScrollView style={styles.container} bounces={false} scrollEventThrottle={16}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => context.setScreen('bidding')}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Worker Profile</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <Image source={{ uri: worker.photo }} style={styles.avatar} />
          <View style={styles.nameRow}>
            <Text style={styles.workerName}>{worker.name}</Text>
            {worker.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            )}
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.stat}>⭐ {worker.rating}</Text>
            <Text style={styles.stat}>💼 {worker.totalJobs} jobs</Text>
            <Text style={styles.stat}>📍 {worker.distance}</Text>
          </View>
        </View>

        <View style={styles.skillsCard}>
          <Text style={styles.cardTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {worker.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {worker.jobHistory && worker.jobHistory.length > 0 && (
          <View style={styles.historyCard}>
            <Text style={styles.cardTitle}>Recent Jobs</Text>
            {worker.jobHistory.map((job, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyContent}>
                  <Text style={styles.historyTitle}>{job.title}</Text>
                  <View style={styles.historyRating}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Text key={i} style={i < job.rating ? styles.starFilled : styles.starEmpty}>
                        ★
                      </Text>
                    ))}
                  </View>
                  <Text style={styles.historyDate}>{job.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.messageButton]}
            onPress={() => context.setScreen('chat')}
          >
            <Text style={styles.messageButtonText}>💬 Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.hireButton]}
            onPress={handleHire}
          >
            <Text style={styles.hireButtonText}>Hire Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#006600', padding: 24, paddingTop: 40, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  backButton: { color: '#fff', fontSize: 24, marginRight: 12 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  content: { padding: 16 },
  profileCard: { backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#006600', marginBottom: 16 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  workerName: { fontSize: 24, fontWeight: '600' },
  verifiedBadge: { backgroundColor: '#00A86B', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  verifiedText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 16 },
  stat: { fontSize: 14, color: '#666' },
  skillsCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillTag: { backgroundColor: '#f0f9f0', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8 },
  skillText: { color: '#006600', fontWeight: '500' },
  historyCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  historyItem: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  historyContent: { gap: 4 },
  historyTitle: { fontSize: 16, fontWeight: '500' },
  historyRating: { flexDirection: 'row', gap: 2 },
  starFilled: { fontSize: 14, color: '#ffb800' },
  starEmpty: { fontSize: 14, color: '#ddd' },
  historyDate: { fontSize: 12, color: '#999' },
  buttonRow: { flexDirection: 'row', gap: 12 },
  button: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  messageButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  hireButton: { backgroundColor: '#006600' },
  buttonText: { fontSize: 16, fontWeight: '600' },
  messageButtonText: { color: '#006600' },
  hireButtonText: { color: '#fff' },
  errorText: { textAlign: 'center', marginTop: 100, fontSize: 16, color: '#666' },
});


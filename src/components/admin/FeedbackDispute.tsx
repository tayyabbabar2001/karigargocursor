import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContextType } from '../../types';

export function FeedbackDispute({ context }: { context: AppContextType }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => context.setScreen('admin-dashboard')}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback Dispute</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Feedback Dispute</Text>
        <Text style={styles.subtitle}>Screen coming soon...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#006600', padding: 24, paddingTop: 40, flexDirection: 'row', alignItems: 'center' },
  backButton: { color: '#fff', fontSize: 24, marginRight: 12 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
});

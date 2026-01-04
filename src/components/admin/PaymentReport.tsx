import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContextType } from '../../types';

export function PaymentReport({ context }: { context: AppContextType }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('admin-dashboard')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Report</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Payment Report</Text>
        <Text style={styles.subtitle}>Screen coming soon...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#006600', padding: 24, paddingTop: 40, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '500', marginLeft: 12 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '500', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
});

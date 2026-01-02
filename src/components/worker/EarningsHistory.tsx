import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';

const earningsData = {
  total: 45000,
  thisMonth: 15000,
  lastMonth: 12000,
  avgRating: 4.7,
  totalJobs: 45,
};

const weeklyData = [
  { day: 'Mon', amount: 2000 },
  { day: 'Tue', amount: 1500 },
  { day: 'Wed', amount: 3000 },
  { day: 'Thu', amount: 2500 },
  { day: 'Fri', amount: 4000 },
  { day: 'Sat', amount: 1500 },
  { day: 'Sun', amount: 500 },
];

const jobHistory = [
  { id: '1', title: 'Fix Kitchen Sink', customer: 'Ahmed Khan', amount: 2000, rating: 5, date: 'Nov 3, 2025' },
  { id: '2', title: 'Electrical Wiring', customer: 'Sara Ali', amount: 3500, rating: 4, date: 'Nov 2, 2025' },
  { id: '3', title: 'Paint Living Room', customer: 'Usman Ahmed', amount: 5000, rating: 5, date: 'Nov 1, 2025' },
  { id: '4', title: 'Repair Door', customer: 'Fatima Shah', amount: 1500, rating: 4, date: 'Oct 30, 2025' },
  { id: '5', title: 'AC Installation', customer: 'Bilal Khan', amount: 8000, rating: 5, date: 'Oct 28, 2025' },
];

export function EarningsHistory({ context }: { context: AppContextType }) {
  const maxAmount = Math.max(...weeklyData.map(d => d.amount));
  const weeklyTotal = weeklyData.reduce((sum, d) => sum + d.amount, 0);

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
        <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('available-jobs')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings & History</Text>
      </View>

      <View style={styles.totalEarnings}>
        <Text style={styles.totalLabel}>Total Earnings</Text>
        <Text style={styles.totalAmount}>PKR {earningsData.total.toLocaleString()}</Text>
        <View style={styles.monthlyRow}>
          <View style={styles.monthlyItem}>
            <Text style={styles.monthlyLabel}>This Month</Text>
            <Text style={styles.monthlyValue}>PKR {earningsData.thisMonth.toLocaleString()}</Text>
          </View>
          <View style={styles.monthlyItem}>
            <Text style={styles.monthlyLabel}>Last Month</Text>
            <Text style={styles.monthlyValue}>PKR {earningsData.lastMonth.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="star" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.statLabel}>Avg Rating</Text>
            <Text style={styles.statValue}>{earningsData.avgRating}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="trending-up" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.statLabel}>Total Jobs</Text>
            <Text style={styles.statValue}>{earningsData.totalJobs}</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>This Week</Text>
          <View style={styles.chartContainer}>
            {weeklyData.map((item, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      { height: `${(item.amount / maxAmount) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.chartTotal}>
            Weekly Total: PKR {weeklyTotal.toLocaleString()}
          </Text>
        </View>

        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Job History</Text>
            <TouchableOpacity activeOpacity={1}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historyList}>
            {jobHistory.map((job) => (
              <View key={job.id} style={styles.historyItem}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyJobTitle}>{job.title}</Text>
                  <Text style={styles.historyCustomer}>{job.customer}</Text>
                  <View style={styles.historyRating}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < job.rating ? 'star' : 'star-outline'}
                        size={12}
                        color={i < job.rating ? '#ffb800' : '#ddd'}
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.historyAmount}>
                  <Text style={styles.historyAmountText}>PKR {job.amount.toLocaleString()}</Text>
                  <Text style={styles.historyDate}>{job.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity activeOpacity={1}
          style={styles.withdrawButton} disabled>
          <Ionicons name="cash-outline" size={16} color="#9ca3af" />
          <Text style={styles.withdrawText}>Withdraw Earnings (Coming Soon)</Text>
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
    marginBottom: 16,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  totalEarnings: {
    backgroundColor: '#006600',
    margin: 20,
    marginTop: 8,
    padding: 24,
    borderRadius: 16,
  },
  totalLabel: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, marginBottom: 8 },
  totalAmount: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  monthlyRow: {
    flexDirection: 'row',
    gap: 16,
  },
  monthlyItem: { flex: 1 },
  monthlyLabel: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, marginBottom: 4 },
  monthlyValue: { color: '#fff', fontSize: 16, fontWeight: '600' },
  content: { padding: 20, gap: 20 },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  chartSpacer: { height: 8 },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 20,
    paddingBottom: 8,
    marginTop: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    height: '100%',
  },
  barContainer: {
    width: '75%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  bar: {
    width: '100%',
    backgroundColor: '#006600',
    borderRadius: 4,
  },
  barLabel: { fontSize: 12, color: '#666' },
  chartTotal: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 16,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: { fontSize: 18, fontWeight: '600' },
  viewAll: { color: '#006600', fontSize: 14, fontWeight: '600' },
  historyList: { gap: 12 },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  historyInfo: { flex: 1 },
  historyJobTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  historyCustomer: { fontSize: 12, color: '#666', marginBottom: 4 },
  historyRating: {
    flexDirection: 'row',
    gap: 2,
  },
  historyAmount: { alignItems: 'flex-end' },
  historyAmountText: { fontSize: 14, fontWeight: '600', color: '#006600', marginBottom: 4 },
  historyDate: { fontSize: 12, color: '#999' },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 12,
    opacity: 0.6,
  },
  withdrawText: { color: '#6b7280', fontSize: 16, fontWeight: '600' },
});

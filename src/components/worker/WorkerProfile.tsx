import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export function WorkerProfile({ context }: { context: AppContextType }) {
  const [verificationStatus] = useState<'pending' | 'verified' | 'rejected'>('verified');
  
  const user = context.currentUser || { 
    name: 'Ali Khan', 
    email: 'ali@example.com',
    phone: '0300-1234567',
    skill: 'Electrician',
    city: 'Karachi',
  };

  const handleLogout = () => {
    context.setCurrentUser(null);
    context.setUserRole(null);
    context.setScreen('customer-login');
  };

  return (
    <ScrollView style={styles.container} bounces={false} scrollEventThrottle={16}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => context.setScreen('available-jobs')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali' }}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              {verificationStatus === 'verified' && (
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              )}
            </View>
            <Text style={styles.userSkill}>{user.skill}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Verification Status */}
        <View style={[
          styles.card,
          verificationStatus === 'verified' && styles.verifiedCard,
          verificationStatus === 'pending' && styles.pendingCard,
          verificationStatus === 'rejected' && styles.rejectedCard,
        ]}>
          {verificationStatus === 'verified' && (
            <View style={styles.verificationContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#d1fae5' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
              <View style={styles.verificationText}>
                <Text style={[styles.verificationTitle, { color: '#065f46' }]}>Verified Worker</Text>
                <Text style={[styles.verificationSubtitle, { color: '#047857' }]}>Your account is verified</Text>
              </View>
            </View>
          )}
          {verificationStatus === 'pending' && (
            <View style={styles.verificationContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="time-outline" size={24} color="#f59e0b" />
              </View>
              <View style={styles.verificationText}>
                <Text style={[styles.verificationTitle, { color: '#92400e' }]}>Verification Pending</Text>
                <Text style={[styles.verificationSubtitle, { color: '#b45309' }]}>We're reviewing your documents</Text>
              </View>
            </View>
          )}
          {verificationStatus === 'rejected' && (
            <View style={styles.verificationContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#fee2e2' }]}>
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </View>
              <View style={styles.verificationText}>
                <Text style={[styles.verificationTitle, { color: '#991b1b' }]}>Verification Required</Text>
                <Text style={[styles.verificationSubtitle, { color: '#dc2626' }]}>Please upload valid documents</Text>
              </View>
            </View>
          )}
        </View>

        {/* Personal Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="person-outline" size={20} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="briefcase-outline" size={20} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Primary Skill</Text>
              <Text style={styles.infoValue}>{user.skill}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="location-outline" size={20} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>City</Text>
              <Text style={styles.infoValue}>{user.city}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="document-text-outline" size={20} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>CNIC</Text>
              <Text style={styles.infoValue}>42101-XXXXXXX-X</Text>
            </View>
          </View>
        </View>

        {/* Documents */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Documents & Certificates</Text>
          
          <View style={styles.documentItem}>
            <View style={styles.documentLeft}>
              <View style={[styles.documentIcon, { backgroundColor: '#d1fae5' }]}>
                <Ionicons name="document-text" size={20} color="#10b981" />
              </View>
              <View>
                <Text style={styles.documentTitle}>CNIC (Front & Back)</Text>
                <Text style={styles.documentSubtitle}>Uploaded</Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#065f46" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          <View style={styles.documentItem}>
            <View style={styles.documentLeft}>
              <View style={[styles.documentIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="document-text" size={20} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.documentTitle}>Skill Certificate</Text>
                <Text style={styles.documentSubtitle}>Optional</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => context.setScreen('personal-info')}
          >
            <Ionicons name="create-outline" size={16} color="#006600" />
            <Text style={styles.actionText}>Edit Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => context.setScreen('help-support')}
          >
            <Ionicons name="help-circle-outline" size={16} color="#006600" />
            <Text style={styles.actionText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={16} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
  },
  userDetails: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: { color: '#fff', fontSize: 18, fontWeight: '600' },
  userSkill: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { paddingHorizontal: 24, paddingBottom: 24, gap: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verifiedCard: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0' },
  pendingCard: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a' },
  rejectedCard: { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca' },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationText: { flex: 1 },
  verificationTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  verificationSubtitle: { fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: { color: '#666', fontSize: 14, marginBottom: 4 },
  infoValue: { color: '#333', fontSize: 16 },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
    marginLeft: 52,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  documentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  documentSubtitle: { fontSize: 12, color: '#666' },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: { color: '#065f46', fontSize: 12, fontWeight: '600' },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  uploadText: { color: '#333', fontSize: 14, fontWeight: '600' },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#006600',
    padding: 16,
    borderRadius: 12,
    height: 48,
  },
  actionText: { color: '#006600', fontSize: 14, fontWeight: '600' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    height: 48,
  },
  logoutText: { color: '#ef4444', fontSize: 14, fontWeight: '600' },
});

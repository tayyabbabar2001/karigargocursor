import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export function PersonalInfoOverview({ context }: { context: AppContextType }) {
  const user = context.currentUser || {
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '0300-1234567',
    address: 'Block 5, Gulshan-e-Iqbal, Karachi',
  };

  const infoItems = [
    {
      icon: 'person-outline',
      label: 'Full Name',
      value: user.name,
      onClick: () => context.setScreen('edit-name'),
    },
    {
      icon: 'call-outline',
      label: 'Mobile Number',
      value: user.phone,
      onClick: () => context.setScreen('edit-phone'),
    },
    {
      icon: 'mail-outline',
      label: 'Email Address',
      value: user.email,
      onClick: () => context.setScreen('edit-email'),
    },
    {
      icon: 'location-outline',
      label: 'Address',
      value: user.address,
      onClick: () => context.setScreen('edit-address'),
    },
  ];

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => context.setScreen(context.userRole === 'customer' ? 'customer-profile' : 'worker-profile')}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Information</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Info Items */}
        <View style={styles.card}>
          {infoItems.map((item, index) => (
            <View key={index}>
              {index > 0 && <View style={styles.separator} />}
              <TouchableOpacity
                activeOpacity={1}
style={styles.infoItem}
                onPress={item.onClick}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as any} size={20} color="#666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
});

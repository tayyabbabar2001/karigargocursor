import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContextType, Screen } from '../../types';

interface PlaceholderScreenProps {
  context: AppContextType;
  screenName: string;
  backScreen?: Screen;
}

export function PlaceholderScreen({ context, screenName, backScreen = 'customer-dashboard' }: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen(backScreen)}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{screenName}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{screenName}</Text>
        <Text style={styles.subtitle}>Screen coming soon...</Text>
        <Text style={styles.info}>This screen is being developed.</Text>
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
  subtitle: { fontSize: 16, color: '#666', marginBottom: 4 },
  info: { fontSize: 14, color: '#999', textAlign: 'center' },
});


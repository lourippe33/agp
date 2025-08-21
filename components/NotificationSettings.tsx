import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function NotificationSettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres de notification</Text>
      <Text style={styles.subtitle}>
        Les notifications seront disponibles dans une version future
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginLeft: 36,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
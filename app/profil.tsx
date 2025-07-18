import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

// Cette page a été vidée - tout le contenu a été migré vers app/(tabs)/profil.tsx
export default function ProfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Cette page a été déplacée vers l'onglet Profil principal.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
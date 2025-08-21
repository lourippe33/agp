import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function DetenteScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.relaxation, '#FFB3BA']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Exercices de Détente</Text>
          <View style={styles.placeholder} />
        </View>
        <Text style={styles.headerSubtitle}>
          Relaxation et gestion du stress
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.comingSoonCard}>
          <Heart size={48} color={Colors.relaxation} />
          <Text style={styles.comingSoonTitle}>Exercices de détente en préparation</Text>
          <Text style={styles.comingSoonText}>
            Les exercices de respiration, méditation et relaxation seront 
            bientôt disponibles pour votre bien-être quotidien.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  comingSoonCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
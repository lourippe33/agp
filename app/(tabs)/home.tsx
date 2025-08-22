import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dumbbell, Heart, Utensils, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const getMomentText = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bon matin';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.agpBlue, Colors.agpGreen]} 
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>
              {getMomentText()}, Eric
            </Text>
            <Text style={styles.subtitle}>
              Votre parcours chronobiologique vous attend
            </Text>
          </View>
        </LinearGradient>

        {/* Bienvenue */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bienvenue sur AGP 👋</Text>
        </View>

        {/* Actions rapides */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCardLarge, { backgroundColor: Colors.sport }]}
              onPress={() => router.push('/(tabs)/sport/')}
            >
              <Dumbbell size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Sport</Text>
              <Text style={styles.actionSubtitle}>activités</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCardLarge, { backgroundColor: Colors.agpGreen }]}
              onPress={() => router.push('/(tabs)/recettes/')}
            >
              <Utensils size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Recettes</Text>
              <Text style={styles.actionSubtitle}>adaptées</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.actionCard, styles.actionCardFull, { backgroundColor: Colors.relaxation }]}
            onPress={() => router.push('/(tabs)/detente/')}
          >
            <Heart size={32} color={Colors.textLight} />
            <Text style={styles.actionTitle}>Détente</Text>
            <Text style={styles.actionSubtitle}>& bien-être</Text>
          </TouchableOpacity>
        </View>

        {/* Programme du jour */}
        <View style={styles.programmeSection}>
          <Text style={styles.sectionTitle}>Programme du jour</Text>
          
          <TouchableOpacity 
            style={styles.programmeCard}
            onPress={() => router.push('/(tabs)/programme')}
          >
            <Calendar size={24} color={Colors.agpBlue} />
            <View style={styles.programmeContent}>
              <Text style={styles.programmeTitle}>Jour 1 - Démarrage</Text>
              <Text style={styles.programmeText}>
                Commencez votre transformation avec des exercices adaptés
              </Text>
            </View>
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  actionCardLarge: {
    flex: 1,
  },
  actionCardFull: {
    width: '100%',
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginTop: 12,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
  },
  programmeSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  programmeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  programmeContent: {
    flex: 1,
  },
  programmeTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  programmeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
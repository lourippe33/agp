import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sun, Utensils, Coffee, Moon, Dumbbell, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getCurrentMoment = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return 'matin';
    if (hour >= 12 && hour < 16) return 'midi';
    if (hour >= 16 && hour < 20) return 'gouter';
    return 'soir';
  };

  const getMomentIcon = () => {
    const moment = getCurrentMoment();
    switch (moment) {
      case 'matin': return <Sun size={24} color={Colors.morning} />;
      case 'midi': return <Utensils size={24} color={Colors.agpBlue} />;
      case 'gouter': return <Coffee size={24} color={Colors.snack} />;
      case 'soir': return <Moon size={24} color={Colors.evening} />;
      default: return <Sun size={24} color={Colors.morning} />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={[
          styles.content,
          Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
        ]}
        showsVerticalScrollIndicator={true}
      >
        {/* Header */}
        <LinearGradient
          colors={[Colors.agpBlue, Colors.agpGreen]} 
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>
              {getGreeting()}, Utilisateur
            </Text>
            <Text style={styles.subtitle}>
              Votre parcours chronobiologique vous attend
            </Text>
            <View style={styles.momentIndicator}>
              {getMomentIcon()}
              <Text style={styles.momentText}>
                {getCurrentMoment().charAt(0).toUpperCase() + getCurrentMoment().slice(1)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Actions rapides */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: '#FF5722' }]} 
              onPress={() => router.push('/sport')}
            >
              <Dumbbell size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Sport</Text>
              <Text style={styles.actionSubtitle}>activités</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: Colors.agpGreen }]}
              onPress={() => router.push('/recettes')}
            >
              <Utensils size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Recettes</Text>
              <Text style={styles.actionSubtitle}>adaptées</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: Colors.relaxation }]}
              onPress={() => router.push('/detente')}
            >
              <Heart size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Détente</Text>
              <Text style={styles.actionSubtitle}>& bien-être</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Message de bienvenue */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Bienvenue sur AGP Chronobiologie ! 👋
          </Text>
          <Text style={styles.welcomeText}>
            Découvrez des recettes adaptées à votre rythme biologique, 
            des exercices pour votre bien-être et un programme personnalisé.
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
    marginBottom: 20,
  },
  momentIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  momentText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 16,
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
  welcomeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sun, Utensils, Coffee, Moon, Dumbbell, Heart, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const handleNavigation = (route: string) => {
    try {
      router.push(route as any);
    } catch (error) {
      Alert.alert('Navigation', `Redirection vers ${route}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.agpBlue, Colors.agpGreen]} 
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>
              Bonjour, Utilisateur
            </Text>
            <Text style={styles.subtitle}>
              Votre parcours chronobiologique vous attend
            </Text>
          </View>
        </LinearGradient>

        {/* Actions rapides */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: Colors.agpBlue }]}
              onPress={() => handleNavigation('/programme')}
            >
              <Calendar size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Programme</Text>
              <Text style={styles.actionSubtitle}>28 jours</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: '#FF5722' }]}
              onPress={() => handleNavigation('/sport')}
            >
              <Dumbbell size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Sport</Text>
              <Text style={styles.actionSubtitle}>activités</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: Colors.agpGreen }]}
              onPress={() => handleNavigation('/recettes')}
            >
              <Utensils size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Recettes</Text>
              <Text style={styles.actionSubtitle}>adaptées</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: Colors.relaxation }]}
              onPress={() => handleNavigation('/detente')}
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
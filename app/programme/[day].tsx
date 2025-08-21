import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Sun, Utensils, Coffee, Moon, Dumbbell, Heart, Calendar, ChevronRight, Target, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface ProgramProgress {
  completedDays: number[];
  currentDay: number;
  startDate: string;
}

export default function HomeScreen() {
  const [currentProgramDay, setCurrentProgramDay] = useState<number>(1);

  useEffect(() => {
    loadProgramProgress();
  }, []);

  const loadProgramProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('programProgress');
      if (savedProgress) {
        const progress: ProgramProgress = JSON.parse(savedProgress);
        setCurrentProgramDay(Math.min(28, progress.currentDay));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la progression:', error);
    }
  };

  const getMomentText = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bon matin';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getDailyMotivation = (day: number): string => {
    const motivations = [
      "🌟 Chaque grand voyage commence par un premier pas !",
      "💪 Jour 2 : Vous avez déjà commencé, continuez !",
      "🔥 Trois jours ! L'habitude se forme !",
      "⭐ Quatre jours de suite, vous êtes formidable !",
      "🚀 Une semaine presque complète, bravo !",
      "🎯 Six jours ! Vous tenez le bon rythme !",
      "🏆 Une semaine complète ! Félicitations !",
      "🌈 Semaine 2 commence, vous progressez !",
      "💎 Neuf jours ! Vous brillez de détermination !",
      "🔋 Dix jours ! Votre énergie est contagieuse !",
      "⚡ Onze jours ! Vous êtes électrisant !",
      "🌟 Douze jours ! Vous illuminez votre parcours !",
      "🎊 Treize jours ! Porte-bonheur de la motivation !",
      "🎉 Deux semaines ! Vous êtes à mi-chemin !",
      "🚀 Quinze jours ! Vous volez vers vos objectifs !",
      "💪 Seize jours ! Votre force grandit chaque jour !",
      "🔥 Dix-sept jours ! Vous êtes en feu !",
      "⭐ Dix-huit jours ! Vous brillez de mille feux !",
      "🌈 Dix-neuf jours ! Vous colorez votre transformation !",
      "🎯 Vingt jours ! Vous visez juste !",
      "🏆 Trois semaines ! Vous êtes un champion !",
      "💎 Vingt-deux jours ! Vous êtes précieux !",
      "🔋 Vingt-trois jours ! Votre énergie est inépuisable !",
      "⚡ Vingt-quatre jours ! Vous électrisez votre réussite !",
      "🌟 Vingt-cinq jours ! Vous êtes une étoile !",
      "🚀 Vingt-six jours ! Vous volez vers la victoire !",
      "🏆 Avant-dernier jour ! Vous êtes presque au sommet !",
      "🎉 JOUR 28 ! FÉLICITATIONS ! Transformation accomplie !"
    ];
    
    return motivations[Math.min(day - 1, motivations.length - 1)];
  };

  const handleNavigation = (route: string) => {
    try {
      router.push(route as any);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de naviguer vers cette page');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header avec gradient */}
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
          <Text style={styles.welcomeTitle}>Bienvenue sur AGP, Eric 👋</Text>
          <Text style={styles.programDayText}>
            Aujourd'hui est votre {currentProgramDay}{currentProgramDay === 1 ? 'er' : 'e'} jour du programme
          </Text>
          <Text style={styles.motivationText}>
            {getDailyMotivation(currentProgramDay)}
          </Text>
          <TouchableOpacity 
            style={styles.programButton}
            onPress={() => handleNavigation('/(tabs)/programme')}
          >
            <Calendar size={20} color={Colors.textLight} />
            <Text style={styles.programButtonText}>Voir mon programme</Text>
          </TouchableOpacity>
        </View>

        {/* Actions rapides */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCardLarge, { backgroundColor: '#FF5722' }]}
              onPress={() => handleNavigation('/sport')}
            >
              <Dumbbell size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Sport</Text>
              <Text style={styles.actionSubtitle}>activités</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCardLarge, { backgroundColor: Colors.agpGreen }]}
              onPress={() => handleNavigation('/recettes')}
            >
              <Utensils size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Recettes</Text>
              <Text style={styles.actionSubtitle}>adaptées</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.actionCard, styles.actionCardFull, { backgroundColor: Colors.relaxation }]}
            onPress={() => handleNavigation('/detente')}
          >
            <Heart size={32} color={Colors.textLight} />
            <Text style={styles.actionTitle}>Détente</Text>
            <Text style={styles.actionSubtitle}>& bien-être</Text>
          </TouchableOpacity>
        </View>

        {/* Vos Réussites */}
        <View style={styles.reussitesSection}>
          <Text style={styles.sectionTitle}>Vos Réussites</Text>
          
          <View style={styles.reussiteCard}>
            <View style={styles.reussiteIcon}>
              <Target size={20} color={Colors.warning} />
            </View>
            <View style={styles.reussiteContent}>
              <Text style={styles.reussiteTitle}>📌 Prêt à commencer votre transformation ?</Text>
              <Text style={styles.reussiteText}>
                Les changements durables commencent par de petites actions quotidiennes. Lancez-vous dès aujourd'hui !
              </Text>
            </View>
          </View>
        </View>

        {/* Conseil du jour */}
        <View style={styles.conseilSection}>
          <Text style={styles.sectionTitle}>Conseil du jour</Text>
          
          <View style={styles.conseilCard}>
            <View style={styles.conseilIcon}>
              <Heart size={20} color={Colors.info} />
            </View>
            <View style={styles.conseilContent}>
              <Text style={styles.conseilTitle}>🚶 Bouger un peu plus</Text>
              <Text style={styles.conseilText}>
                Un pas après l'autre : 15 min de marche quotidienne suffisent à améliorer votre bien-être.
              </Text>
            </View>
          </View>
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
    marginBottom: 8,
  },
  programDayText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.agpBlue,
    textAlign: 'center',
    marginBottom: 12,
  },
  motivationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  programButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.agpBlue,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  programButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
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
  reussitesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  reussiteCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reussiteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3CD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reussiteContent: {
    flex: 1,
  },
  reussiteTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  reussiteText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  conseilSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  conseilCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  conseilIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  conseilContent: {
    flex: 1,
  },
  conseilTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  conseilText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
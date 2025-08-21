import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Utensils, Dumbbell, Heart, Calendar } from 'lucide-react-native';
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
      const saved = await AsyncStorage.getItem('programProgress');
      if (saved) {
        const progress: ProgramProgress = JSON.parse(saved);
        setCurrentProgramDay(Math.min(28, progress.currentDay || 1));
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

  const getDailyMotivation = (day: number) => {
    const motivations = [
      "Jour 1 : c’est parti ! Un pas après l’autre 💪",
      "Jour 2 : la régularité, c’est la clé 🔑",
      "Jour 3 : l’habitude se crée, continue ! 🔥",
      "Jour 4 : tu tiens le cap, bravo ⭐",
      "Jour 5 : presque une semaine, superbe 🚀",
      "Jour 6 : le rythme s’installe 🎯",
      "Jour 7 : une semaine complète, félicitations 🏆",
      "Jour 8 : semaine 2, tu progresses 🌈",
      "Jour 9 : ta détermination inspire 💎",
      "Jour 10 : l’énergie monte 🔋",
      "Jour 11 : constance = résultats ⚡",
      "Jour 12 : tu éclaires ton parcours 🌟",
      "Jour 13 : porte-bonheur de la motivation 🎊",
      "Jour 14 : deux semaines, cap passé 🎉",
      "Jour 15 : tu voles vers l’objectif 🚀",
      "Jour 16 : plus fort chaque jour 💪",
      "Jour 17 : tu es en feu 🔥",
      "Jour 18 : tu brilles de mille feux ⭐",
      "Jour 19 : tu colories ta transformation 🌈",
      "Jour 20 : tu vises juste 🎯",
      "Jour 21 : trois semaines, champion 🏆",
      "Jour 22 : persévérance précieuse 💎",
      "Jour 23 : énergie inépuisable 🔋",
      "Jour 24 : tu électrises ta réussite ⚡",
      "Jour 25 : tu es une étoile 🌟",
      "Jour 26 : la victoire approche 🚀",
      "Jour 27 : avant-dernier jour, presque au sommet 🏆",
      "Jour 28 : FÉLICITATIONS ! Transformation accomplie 🎉"
    ];
    return motivations[Math.min(Math.max(day, 1) - 1, motivations.length - 1)];
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
      <ScrollView style={styles.content}>
        <LinearGradient colors={[Colors.agpBlue, Colors.agpGreen]} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{getMomentText()}, Eric</Text>
            <Text style={styles.subtitle}>Votre parcours chronobiologique vous attend</Text>
          </View>
        </LinearGradient>

        {/* Bienvenue */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bienvenue sur AGP, Eric 👋</Text>
          <Text style={styles.programDayText}>
            Aujourd'hui est votre {currentProgramDay}{currentProgramDay === 1 ? 'er' : 'e'} jour du programme
          </Text>
          <Text style={styles.motivationText}>{getDailyMotivation(currentProgramDay)}</Text>
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
              {/* tu peux changer l’icône/couleur si besoin */}
              <Calendar size={20} color={Colors.warning} />
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

/* --- Styles --- */
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

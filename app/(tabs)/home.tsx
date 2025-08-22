import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, AsyncStorage } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dumbbell, Heart, Utensils, Calendar, Trophy, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const [currentDay, setCurrentDay] = React.useState(1);
  const [motivationPhrase, setMotivationPhrase] = React.useState('');

  const motivationPhrases = [
    "Jour après jour, tu avances vers ton objectif 💪",
    "Rappelle-toi pourquoi tu as commencé 🌟",
    "Chaque petit effort compte dans tes 21 jours 🔑",
    "Tu es plus fort que tes excuses 🚀",
    "Ton corps et ton esprit te remercieront demain 🙌",
    "21 jours pour changer, une vie pour profiter 💚",
    "Aujourd'hui est le jour parfait pour commencer 🌅",
    "Ta transformation commence maintenant ✨",
    "Chaque choix sain te rapproche de ton objectif 🎯",
    "Tu mérites de te sentir bien dans ton corps 💖",
    "La constance bat la perfection à chaque fois 🔄",
    "Ton futur moi te remercie déjà 🙏",
    "Crois en toi, tu as tout ce qu'il faut 🌈",
    "Chaque jour est une nouvelle opportunité 🆕",
    "Ta santé est ton plus beau cadeau 🎁",
    "L'énergie d'aujourd'hui crée le corps de demain ⚡",
    "Tu es capable de plus que tu ne l'imagines 🦋",
    "Prends soin de toi, tu le vaux bien 💎"
  ];

  React.useEffect(() => {
    loadCurrentDay();
    setRandomMotivationPhrase();
  }, []);

  const loadCurrentDay = async () => {
    try {
      const savedDay = await AsyncStorage.getItem('programDay');
      if (savedDay) {
        setCurrentDay(parseInt(savedDay));
      }
    } catch (error) {
      console.log('Erreur lors du chargement du jour:', error);
    }
  };

  const setRandomMotivationPhrase = () => {
    const randomIndex = Math.floor(Math.random() * motivationPhrases.length);
    setMotivationPhrase(motivationPhrases[randomIndex]);
  };

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

        {/* Encart de motivation */}
        <View style={styles.motivationSection}>
          <View style={styles.motivationCard}>
            <Sparkles size={20} color={Colors.agpBlue} />
            <Text style={styles.motivationText}>{motivationPhrase}</Text>
          </View>
        </View>

        {/* Jour du programme */}
        <View style={styles.programDaySection}>
          <TouchableOpacity 
            style={[styles.programDayCard, { backgroundColor: Colors.agpBlue }]}
            onPress={() => router.push('/(tabs)/programme')}
          >
            <Trophy size={28} color={Colors.textLight} />
            <View style={styles.programDayContent}>
              <Text style={styles.programDayTitle}>
                Bienvenue dans votre jour {currentDay}
              </Text>
              <Text style={styles.programDaySubtitle}>
                du programme AGP
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Actions rapides */}
        <View style={styles.quickActions}>
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCardLarge, { backgroundColor: Colors.sport }]}
              onPress={() => router.push('/sport')}
            >
              <Dumbbell size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Sport</Text>
              <Text style={styles.actionSubtitle}>activités</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCardLarge, { backgroundColor: Colors.agpGreen }]}
              onPress={() => router.push('/recettes')}
            >
              <Utensils size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Recettes</Text>
              <Text style={styles.actionSubtitle}>adaptées</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.actionCard, styles.actionCardFull, { backgroundColor: Colors.relaxation }]}
            onPress={() => router.push('/detente')}
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
  motivationSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  motivationCard: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  motivationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.agpBlue,
    flex: 1,
    lineHeight: 20,
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
  programDaySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  programDayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    gap: 16,
  },
  programDayContent: {
    flex: 1,
  },
  programDayTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 4,
  },
  programDaySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Award, 
  Clock, 
  Activity, 
  Heart, 
  Zap, 
  Sun, 
  Moon, 
  Coffee, 
  Utensils, 
  Dumbbell, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react-native';

import { router, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { isPastDay } from '@/utils/dateUtils';
import NotificationBell from '@/components/NotificationBell';
import PersistentTabBar from '@/components/PersistentTabBar';
import DayProgramCard from '@/components/DayProgramCard';

const dailyTips = [
  {
    title: '💧 Hydratation optimale',
    description: "Buvez un grand verre d'eau dès le réveil pour relancer votre métabolisme et améliorer votre concentration."
  },
  {
    title: '🧘 Respiration apaisante',
    description: "3 minutes de cohérence cardiaque suffisent à réduire le stress et recentrer votre énergie."
  },
  {
    title: '🍽️ Manger en pleine conscience',
    description: "Prenez le temps de savourer chaque bouchée. Cela favorise la satiété et réduit les fringales."
  },
  {
    title: '🧠 Visualisation positive',
    description: "Imaginez votre objectif atteint. Cela active des circuits neuronaux qui renforcent la motivation."
  },
  {
    title: '🚶 Bouger un peu plus',
    description: "Un pas après l'autre : 15 min de marche quotidienne suffisent à améliorer votre bien-être."
  },
  {
    title: '🛌 Préparer son sommeil',
    description: "Coupez les écrans 1h avant de dormir et détendez-vous avec une routine calme pour optimiser votre récupération."
  },
  {
    title: '🎯 Célébrer ses petits pas',
    description: "Notez chaque réussite, même minime. Cela booste votre estime et vous ancre dans la progression durable."
  }
];


const { width } = Dimensions.get('window');

const actionCardWidth = (width - 60) / 2;
const statCardWidth = (width - 56) / 2;
const dayCardWidth = (width - 100) / 7;

interface DayProgram {
  day: number;
  date: Date;
  isCompleted: boolean;
  isToday: boolean;
  activities: {
    breakfast: { name: string; completed: boolean };
    sport: { name: string; completed: boolean };
    relaxation: { name: string; completed: boolean };
    lunch: { name: string; completed: boolean };
    snack: { name: string; completed: boolean };
    dinner: { name: string; completed: boolean };
  };
  totalDuration: number;
  badges?: string[];
}

const HeaderTitle = ({ name }: { name: string }) => (
  <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
    <View style={{ alignItems: 'center', marginBottom: 6 }}>
      <Text style={{ fontSize: 24, fontFamily: 'Poppins-Bold', color: Colors.text, textAlign: 'center' }}>
      Bienvenue sur AGP, {name} 👋
      </Text>
    </View>
  </View>
);

export default function HomeScreen() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [programData, setProgramData] = useState<DayProgram[]>([]);
  const [visibleDayIndex, setVisibleDayIndex] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [selectedDay, setSelectedDay] = useState<DayProgram | null>(null);
  const todayIndex = new Date().getDay();
  const todayTip = dailyTips[todayIndex];

  // Animation scales
  const sportScale = useState(new Animated.Value(1))[0];
  const recipesScale = useState(new Animated.Value(1))[0];
  const relaxScale = useState(new Animated.Value(1))[0];
  
  // Badge pour le streak
  let badge = '';
  if (currentStreak >= 7 && currentStreak < 14) badge = '🌱';
  else if (currentStreak >= 14 && currentStreak < 21) badge = '🌿';
  else if (currentStreak >= 21 && currentStreak < 28) badge = '🌳';
  else if (currentStreak >= 28) badge = '🏆';

  const generateDayActivities = (day: number) => {
    const dayKey = `day-${day}`;
    const choices = {}; // userChoices[dayKey] || {}; // Simplified for home screen
    
    const breakfasts = [
      'Porridge aux fruits rouges',
      'Smoothie bowl banane épinards',
      'Toast avocat œuf mollet',
      'Pancakes Huel banane',
      'Overnight oats coco mangue'
    ];
    
    const sports = [
      'Marche Active (15 min)',
      'Circuit Training (20 min)',
      'Danse Fitness (25 min)',
      'Yoga Dynamique (30 min)',
      'HIIT Intensif (18 min)'
    ];
    
    const relaxations = [
      'Cohérence Cardiaque (3 min)',
      'Respiration du Sourire (2 min)',
      'Méditation des 5 Sens (5 min)',
      'Gratitude (2 min)',
      'Relaxation musculaire (3 min)'
    ];

    return {
      breakfast: { 
        name: breakfasts[day % breakfasts.length], 
        completed: false 
      },
      sport: { 
        name: sports[day % sports.length], 
        completed: false 
      },
      relaxation: { 
        name: relaxations[day % relaxations.length], 
        completed: false 
      },
      lunch: { 
        name: 'Poke bowl saumon avocat', 
        completed: false 
      },
      snack: { 
        name: 'Energy balls dattes amandes', 
        completed: false 
      },
      dinner: { 
        name: 'Salade quinoa légumes grillés', 
        completed: false 
      }
    };
  };

  // Fonction pour calculer la durée réelle d'une activité
  const getActivityDuration = (activityName: string, activityType: string) => {
    // Extraire la durée du nom de l'activité si elle est entre parenthèses
    const durationMatch = activityName.match(/\((\d+)\s*min\)/);
    if (durationMatch) {
      return parseInt(durationMatch[1]);
    }
    
    // Durées par défaut - seulement pour les exercices
    const defaultDurations = {
      breakfast: 0, // Pas de temps pour les recettes
      lunch: 0,
      snack: 0,
      dinner: 0,
      sport: 20, // Durée moyenne des exercices sportifs
      relaxation: 3 // Durée moyenne des exercices de détente
    };
    
    return defaultDurations[activityType] || 10;
  };

  // Fonction pour calculer la durée totale d'un jour
  const calculateDayTotalDuration = (activities: any) => {
    let totalDuration = 0;
    
    // Calculer seulement la durée des exercices (sport et détente)
    totalDuration += getActivityDuration(activities.sport.name, 'sport');
    totalDuration += getActivityDuration(activities.relaxation.name, 'relaxation');
    
    return totalDuration;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    generateProgramData();
  }, []);

  const generateProgramData = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (today.getDay() || 7) + 1); // Lundi de cette semaine
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    const todayStr = today.toDateString();
    const currentHour = today.getHours();
    const currentMinutes = today.getMinutes();
    const isAfter2359 = currentHour === 23 && currentMinutes >= 59;

    const program: DayProgram[] = [];

    for (let i = 0; i < 28; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Déterminer si le jour est aujourd'hui, hier ou un autre jour passé
      const isToday = currentDate.toDateString() === todayStr;
      const isYesterday = currentDate.toDateString() === yesterdayStr;
      const isPast = isPastDay(currentDate);
      const isFuture = currentDate.getTime() > today.getTime();
      
      // Générer les activités du jour
      const activities = generateDayActivities(i + 1);
      
      // Initialiser les états de completion
      let isCompleted = false;
      let isPartiallyCompleted = false;
      let isBlocked = false;
      
      // Logique de blocage des jours futurs
      if (isFuture) {
        // Bloquer tous les jours futurs jusqu'à 23h59 du jour actuel
        if (!isAfter2359) {
          isBlocked = true;
        }
      }
      
      // Les jours ne sont complétés que si l'utilisateur a réellement coché les activités
      // Par défaut, tous les jours sont non complétés sauf aujourd'hui qui est en bleu
      
      program.push({
        day: i + 1,
        date: currentDate,
        isCompleted,
        isPartiallyCompleted,
        isToday,
        isBlocked,
        activities,
        totalDuration: calculateDayTotalDuration(activities),
        badges: i === 6 ? ['🌱'] : i === 13 ? ['🌿'] : i === 20 ? ['🌳'] : i === 27 ? ['🏆'] : undefined
      });
    }

    setProgramData(program);
    
    // Calculate current streak
    let streak = 0;
    today.setHours(0, 0, 0, 0);
    
    // Count consecutive completed days leading up to today
    for (let i = program.length - 1; i >= 0; i--) {
      const dayDate = new Date(program[i].date);
      dayDate.setHours(0, 0, 0, 0);
      
      if (dayDate.getTime() < today.getTime() && program[i].isCompleted) {
        streak++;
      } else if (dayDate.getTime() < today.getTime()) {
        break;
      }
    }
    setCurrentStreak(streak);
    
    // Calculate overall progress
    const completedDays = program.filter(day => day.isCompleted).length;
    const progress = (completedDays / program.length) * 100;
    setOverallProgress(progress);
    
    // Trouver l'index du jour actuel pour le carrousel
    const todayIdx = program.findIndex(day => day.isToday);
    if (todayIdx !== -1) {
      setVisibleDayIndex(Math.floor(todayIdx / 7) * 7);
    }
  };

  const HeaderTitle = ({ name }: { name: string }) => (
    <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <Activity size={24} color={Colors.agpBlue} strokeWidth={2} />
        <Text style={{ fontSize: 24, fontFamily: 'Poppins-Bold', marginLeft: 8, color: Colors.text }}>
          Tableau de bord
        </Text>
      </View>
      <Text style={{ fontSize: 16, fontFamily: 'Inter-Regular', color: Colors.textSecondary }}>
        Bienvenue sur AGP, {name} 👋
      </Text>
    </View>
  );


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
      case 'matin': return <Sun size={24} color={Colors.morning} strokeWidth={2} />;
      case 'midi': return <Utensils size={24} color={Colors.agpBlue} strokeWidth={2} />;
      case 'gouter': return <Coffee size={24} color={Colors.relaxation} strokeWidth={2} />;
      case 'soir': return <Moon size={24} color={Colors.evening} strokeWidth={2} />;
      default: return <Sun size={24} color={Colors.morning} strokeWidth={2} />;
    }
  };

  const getMomentColor = () => {
    const moment = getCurrentMoment();
    switch (moment) {
      case 'matin': return Colors.morning;
      case 'midi': return Colors.agpBlue;
      case 'gouter': return Colors.relaxation;
      case 'soir': return Colors.evening;
      default: return Colors.morning;
    }
  };

  const animateScale = (scale: Animated.Value, value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      friction: 8,
      tension: 100
    }).start();
  };

  const navigateToSport = () => {
    router.push('/sport');
  };

  const navigateToRecipes = () => {
    router.push('/recettes');
  };

  const navigateToDetente = () => {
    router.push('/detente');
  };

  const handleDayPress = (day: DayProgram) => {
    // Empêcher l'ouverture des jours bloqués
    if (day.isBlocked) {
      Alert.alert(
        "Jour bloqué",
        "Les jours suivants sont bloqués jusqu'à 23h59. Revenez après minuit pour accéder à ce jour.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    
    // Navigate to the program screen with the selected day
    router.push({
      pathname: '/(tabs)/programme',
      params: { 
        day: day.day.toString(),
        openDetails: 'true'
      }
    });
  };

  const DayCarousel = () => {
    const days = programData.slice(visibleDayIndex, visibleDayIndex + 7);
    const canScrollLeft = visibleDayIndex > 0;
    const canScrollRight = visibleDayIndex + 7 < programData.length;
    
    const scrollLeft = () => {
      if (canScrollLeft) {
        setVisibleDayIndex(Math.max(0, visibleDayIndex - 7));
      }
    };
    
    const scrollRight = () => {
      if (canScrollRight) {
        setVisibleDayIndex(Math.min(programData.length - 7, visibleDayIndex + 7));
      }
    };
    
    return (
      <View style={styles.carouselContainer}>
        <TouchableOpacity 
          style={[styles.carouselArrow, !canScrollLeft && styles.carouselArrowDisabled]} 
          onPress={scrollLeft}
          disabled={!canScrollLeft}
        >
          <ChevronLeft size={24} color={canScrollLeft ? Colors.agpBlue : Colors.border} />
        </TouchableOpacity>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        >
          {days.map((day) => (
            <DayProgramCard key={day.day} day={day} onPress={handleDayPress} />
          ))}
        </ScrollView>
        
        <TouchableOpacity 
          style={[styles.carouselArrow, !canScrollRight && styles.carouselArrowDisabled]} 
          onPress={scrollRight}
          disabled={!canScrollRight}
        >
          <ChevronRight size={24} color={canScrollRight ? Colors.agpBlue : Colors.border} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        style={[
          styles.content,
          Platform.OS === 'web' ? { className: 'scroll-container' } : undefined
        ]}
      >
        {/* Header */}
        <LinearGradient
          colors={[Colors.agpBlue, Colors.agpGreen]} 
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>
                {getGreeting()}, {user?.firstName || 'Utilisateur'}
              </Text>
              <Text style={styles.subtitle}>
                Votre parcours chronobiologique vous attend
              </Text>
            </View>

            <View style={styles.headerRight}>
              <NotificationBell style={styles.notificationBell} />
              
              <View style={styles.momentIndicator}>
                {getMomentIcon()}
                <Text style={styles.momentText}>
                  {getCurrentMoment().charAt(0).toUpperCase() + getCurrentMoment().slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Welcome message */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold', color: Colors.text, textAlign: 'center' }}>
            Bienvenue sur AGP, {user?.firstName || 'Utilisateur'} 👋
          </Text>
        </View>

        {/* Programme 28 Jours */}
        <View style={styles.programSection}>
          <Text style={styles.sectionTitle}>Programme 28 Jours</Text>
          <DayCarousel />
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          
          <View style={styles.actionsGrid}>
            <View style={styles.actionRow}>
              <Animated.View style={{ transform: [{ scale: sportScale }] }}>
                <TouchableOpacity 
                  style={[styles.actionCard, { backgroundColor: '#FF5722' }]} 
                  onPress={navigateToSport}
                  onPressIn={() => animateScale(sportScale, 0.96)}
                  onPressOut={() => animateScale(sportScale, 1)}
                  activeOpacity={1}
                >
                  <Dumbbell size={32} color={Colors.textLight} />
                  <Text style={styles.actionTitle}>Sport</Text>
                  <Text style={styles.actionSubtitle}>activités</Text>
                </TouchableOpacity>
              </Animated.View>
              
              <Animated.View style={{ transform: [{ scale: recipesScale }] }}>
                <TouchableOpacity 
                  style={[styles.actionCard, { backgroundColor: Colors.agpGreen }]}
                  onPress={navigateToRecipes}
                  onPressIn={() => animateScale(recipesScale, 0.96)}
                  onPressOut={() => animateScale(recipesScale, 1)}
                  activeOpacity={1}
                >
                  <Utensils size={32} color={Colors.textLight} />
                  <Text style={styles.actionTitle}>Recettes</Text>
                  <Text style={styles.actionSubtitle}>adaptées</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
            
            <View style={styles.centerButtonContainer}>
              <Animated.View style={{ transform: [{ scale: relaxScale }] }}>
                <TouchableOpacity 
                  style={[styles.actionCard, { backgroundColor: Colors.relaxation }]}
                  onPress={navigateToDetente}
                  onPressIn={() => animateScale(relaxScale, 0.96)}
                  onPressOut={() => animateScale(relaxScale, 1)}
                  activeOpacity={1}
                >
                  <Heart size={32} color={Colors.textLight} />
                  <Text style={styles.actionTitle}>Détente</Text>
                  <Text style={styles.actionSubtitle}>& bien-être</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Vos Réussites</Text>
          
          <View style={[styles.achievementCard, { borderLeftColor: Colors.morning }]}>
            <View style={styles.achievementIconContainer}>
              <Award size={32} color={Colors.morning} />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>
                {currentStreak > 0 
                  ? `🔥 Bravo ! ${currentStreak} jours consécutifs !` 
                  : '🚀 Prêt à commencer votre transformation ?'
                }
                {badge && <Text style={{ fontSize: 24 }}>{badge}</Text>}
              </Text>
              <Text style={styles.achievementText}>
                {currentStreak >= 5 
                  ? "Vous êtes incroyable ! Votre régularité est la clé du succès. Continuez sur cette lancée !" 
                  : currentStreak > 0
                  ? "Chaque jour compte ! Votre constance commence à porter ses fruits. Continuez ainsi !"
                  : "Les changements durables commencent par de petites actions quotidiennes. Lancez-vous dès aujourd'hui !"
                }
              </Text>
            </View>
          </View>
          
          <View style={[styles.achievementCard, { borderLeftColor: Colors.agpBlue }]}>
            <View style={styles.achievementIconContainer}>
              <Target size={32} color={Colors.agpBlue} />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>
                {overallProgress > 0 
                  ? `✅ ${Math.round(overallProgress)}% du programme complété` 
                  : '🎯 Votre programme vous attend'
                }
              </Text>
              <Text style={styles.achievementText}>
                {overallProgress >= 50 
                  ? "Vous êtes à mi-chemin ! Vos efforts quotidiens transforment votre bien-être." 
                  : overallProgress > 0
                  ? "Chaque étape franchie vous rapproche de vos objectifs. Persévérez !"
                  : "Suivre le programme AGP vous aidera à harmoniser votre mode de vie avec votre chronobiologie."
                }
              </Text>
            </View>
          </View>
          
          <View style={[styles.achievementCard, { borderLeftColor: Colors.relaxation }]}>
            <View style={styles.achievementIconContainer}>
              <Zap size={32} color={Colors.relaxation} />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>
                💪 Votre potentiel est illimité
              </Text>
              <Text style={styles.achievementText}>
                En appliquant les principes de chronobiologie, vous optimisez votre énergie et votre bien-être au quotidien. Chaque petit changement compte !
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Aujourd'hui</Text>
          
          <View style={styles.todayCard}>
            <LinearGradient
              colors={[getMomentColor(), `${getMomentColor()}CC`]}
              style={styles.todayGradient}
            >
              <View style={styles.todayHeader}>
                {getMomentIcon()}
                <Text style={styles.todayTitle}>
                  Moment {getCurrentMoment()}
                </Text>
              </View>
              
              <Text style={styles.todayDescription}>
                {getCurrentMoment() === 'matin' && 
                  "C'est le moment idéal pour activer ton métabolisme 💥 ! Un bon petit-déjeuner et 10 minutes d'énergie suffisent à transformer ta journée."
                }
                {getCurrentMoment() === 'midi' && 
                  "Ton corps est au top de sa forme 💪. Profite-en pour bouger, cuisiner, ou avancer sur tes objectifs."
                }
                {getCurrentMoment() === 'gouter' && 
                  "Recharge-toi sans culpabiliser 😌. Étirements, respiration, ou collation maligne : tout compte."
                }
                {getCurrentMoment() === 'soir' && 
                  "Offre-toi un vrai temps pour toi 🌙. Déconnexion, douceur et dîner léger : ton corps te dira merci."
                }
              </Text>
              
              <TouchableOpacity 
                style={styles.todayButton}
                onPress={() => router.push('/(tabs)/programme')}
                activeOpacity={0.8}
              >
                <Text style={styles.todayButtonText}>
                  Voir le programme
                </Text>
                <Clock size={16} color={Colors.textLight} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Conseil du jour</Text>
          
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Heart size={24} color={Colors.agpBlue} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{todayTip.title}</Text>
              <Text style={styles.tipDescription}>{todayTip.description}</Text>
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 12,
  },
  notificationBell: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight, 
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    lineHeight: 22,
  },
  momentIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
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
  content: {
    flex: 1,
    paddingTop: 0,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 0,
  },
  quickActions: {
    padding: 20,
  },
  programSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  centerButtonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  actionCard: {
    width: actionCardWidth,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20, 
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: statCardWidth,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  achievementIconContainer: {
    backgroundColor: Colors.agpLightBlue,
    padding: 8,
    borderRadius: 50,
  },
  achievementContent: {
    flex: 1,
    marginLeft: 16,
  },
  achievementTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  todaySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  todayCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  todayGradient: {
    padding: 20,
  },
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  todayTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  todayDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
  },
  todayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 12,
  },
  todayButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
    backgroundColor: 'rgba(230, 245, 255, 0.8)',
  },
  tipIcon: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  carouselArrow: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  carouselArrowDisabled: {
    backgroundColor: Colors.background,
    elevation: 0,
    shadowOpacity: 0,
  },
  carouselContent: {
    paddingHorizontal: 8,
  },
});
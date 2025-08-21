import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Trophy, Target, ChevronLeft, ChevronRight, Play } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

interface DayData {
  id: number;
  dayOfWeek: string;
  duration: number;
  status: 'completed' | 'today' | 'upcoming';
  sportExercise?: string;
  relaxationExercise?: string;
  completed?: boolean;
}

interface WeekData {
  weekNumber: number;
  title: string;
  progress: number;
  days: DayData[];
  advice: string;
}

interface ProgramProgress {
  completedDays: number[];
  currentDay: number;
  startDate: string;
}
export default function ProgrammeScreen(): JSX.Element {
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [programProgress, setProgramProgress] = useState<ProgramProgress | null>(null);

  // Charger la progression au démarrage
  useEffect(() => {
    loadProgramProgress();
  }, []);

  const loadProgramProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('programProgress');
      if (savedProgress) {
        const progress: ProgramProgress = JSON.parse(savedProgress);
        setProgramProgress(progress);
        setCompletedDays(progress.completedDays);
        setCurrentDay(progress.currentDay);
        setCurrentWeek(getCurrentWeekFromDay(progress.currentDay));
      } else {
        // Initialiser un nouveau programme
        const newProgress: ProgramProgress = {
          completedDays: [],
          currentDay: 1,
          startDate: new Date().toISOString()
        };
        await AsyncStorage.setItem('programProgress', JSON.stringify(newProgress));
        setProgramProgress(newProgress);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la progression:', error);
    }
  };

  const saveProgramProgress = async (progress: ProgramProgress) => {
    try {
      await AsyncStorage.setItem('programProgress', JSON.stringify(progress));
      setProgramProgress(progress);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const markDayAsCompleted = async (dayId: number) => {
    if (!programProgress) return;
    
    const updatedCompletedDays = [...completedDays];
    if (!updatedCompletedDays.includes(dayId)) {
      updatedCompletedDays.push(dayId);
    }
    
    const newCurrentDay = Math.min(28, Math.max(...updatedCompletedDays) + 1);
    
    const updatedProgress: ProgramProgress = {
      ...programProgress,
      completedDays: updatedCompletedDays,
      currentDay: newCurrentDay
    };
    
    setCompletedDays(updatedCompletedDays);
    setCurrentDay(newCurrentDay);
    setCurrentWeek(getCurrentWeekFromDay(newCurrentDay));
    
    await saveProgramProgress(updatedProgress);
  };
  // Données du programme 28 jours
  const getProgramData = (): WeekData[] => [
    {
      weekNumber: 1,
      title: 'Semaine 1',
      progress: Math.round((completedDays.filter(day => day <= 7).length / 7) * 100),
      advice: 'Commencez votre transformation\nChaque grand voyage commence par un premier pas.',
      days: [
        { id: 1, dayOfWeek: getDayOfWeekName(1), date: getCalendarDate(1), status: getDayStatus(1), sportExercise: 'Échauffement général', relaxationExercise: 'Respiration profonde' },
        { id: 2, dayOfWeek: getDayOfWeekName(2), date: getCalendarDate(2), status: getDayStatus(2), sportExercise: 'Cardio léger', relaxationExercise: 'Méditation guidée' },
        { id: 3, dayOfWeek: getDayOfWeekName(3), date: getCalendarDate(3), status: getDayStatus(3), sportExercise: 'Renforcement', relaxationExercise: 'Étirements' },
        { id: 4, dayOfWeek: getDayOfWeekName(4), date: getCalendarDate(4), status: getDayStatus(4), sportExercise: 'Cardio modéré', relaxationExercise: 'Relaxation progressive' },
        { id: 5, dayOfWeek: getDayOfWeekName(5), date: getCalendarDate(5), status: getDayStatus(5), sportExercise: 'Circuit training', relaxationExercise: 'Yoga doux' },
        { id: 6, dayOfWeek: getDayOfWeekName(6), date: getCalendarDate(6), status: getDayStatus(6), sportExercise: 'HIIT débutant', relaxationExercise: 'Méditation pleine conscience' },
        { id: 7, dayOfWeek: getDayOfWeekName(7), date: getCalendarDate(7), status: getDayStatus(7), sportExercise: 'Récupération active', relaxationExercise: 'Détente complète' }
      ]
    },
    {
      weekNumber: 2,
      title: 'Semaine 2',
      progress: Math.round((completedDays.filter(day => day >= 8 && day <= 14).length / 7) * 100),
      advice: 'Conseil de la semaine 2\nConcentrez-vous sur la création d\'habitudes. La régularité est plus importante que la perfection.',
      days: [
        { id: 8, dayOfWeek: getDayOfWeekName(8), date: getCalendarDate(8), status: getDayStatus(8), sportExercise: 'Cardio intermédiaire', relaxationExercise: 'Respiration rythmée' },
        { id: 9, dayOfWeek: getDayOfWeekName(9), date: getCalendarDate(9), status: getDayStatus(9), sportExercise: 'Renforcement core', relaxationExercise: 'Méditation body scan' },
        { id: 10, dayOfWeek: getDayOfWeekName(10), date: getCalendarDate(10), status: getDayStatus(10), sportExercise: 'Circuit complet', relaxationExercise: 'Étirements profonds' },
        { id: 11, dayOfWeek: getDayOfWeekName(11), date: getCalendarDate(11), status: getDayStatus(11), sportExercise: 'Cardio intense', relaxationExercise: 'Relaxation guidée' },
        { id: 12, dayOfWeek: getDayOfWeekName(12), date: getCalendarDate(12), status: getDayStatus(12), sportExercise: 'HIIT intermédiaire', relaxationExercise: 'Yoga flow' },
        { id: 13, dayOfWeek: getDayOfWeekName(13), date: getCalendarDate(13), status: getDayStatus(13), sportExercise: 'Training complet', relaxationExercise: 'Méditation zen' },
        { id: 14, dayOfWeek: getDayOfWeekName(14), date: getCalendarDate(14), status: getDayStatus(14), sportExercise: 'Récupération', relaxationExercise: 'Détente totale' }
      ]
    },
    {
      weekNumber: 3,
      title: 'Semaine 3',
      progress: Math.round((completedDays.filter(day => day >= 15 && day <= 21).length / 7) * 100),
      advice: 'Conseil de la semaine 3\nVous êtes à mi-parcours ! Votre corps s\'adapte, continuez sur cette lancée.',
      days: [
        { id: 15, dayOfWeek: getDayOfWeekName(15), date: getCalendarDate(15), status: getDayStatus(15), sportExercise: 'Cardio avancé', relaxationExercise: 'Respiration énergisante' },
        { id: 16, dayOfWeek: getDayOfWeekName(16), date: getCalendarDate(16), status: getDayStatus(16), sportExercise: 'Renforcement total', relaxationExercise: 'Méditation dynamique' },
        { id: 17, dayOfWeek: getDayOfWeekName(17), date: getCalendarDate(17), status: getDayStatus(17), sportExercise: 'Circuit intensif', relaxationExercise: 'Étirements actifs' },
        { id: 18, dayOfWeek: getDayOfWeekName(18), date: getCalendarDate(18), status: getDayStatus(18), sportExercise: 'Cardio explosif', relaxationExercise: 'Relaxation profonde' },
        { id: 19, dayOfWeek: getDayOfWeekName(19), date: getCalendarDate(19), status: getDayStatus(19), sportExercise: 'HIIT avancé', relaxationExercise: 'Yoga power' },
        { id: 20, dayOfWeek: getDayOfWeekName(20), date: getCalendarDate(20), status: getDayStatus(20), sportExercise: 'Challenge complet', relaxationExercise: 'Méditation transcendante' },
        { id: 21, dayOfWeek: getDayOfWeekName(21), date: getCalendarDate(21), status: getDayStatus(21), sportExercise: 'Récupération active', relaxationExercise: 'Détente régénératrice' }
      ]
    },
    {
      weekNumber: 4,
      title: 'Semaine 4',
      progress: Math.round((completedDays.filter(day => day >= 22 && day <= 28).length / 7) * 100),
      advice: 'Conseil de la semaine 4\nDernière ligne droite ! Donnez le meilleur de vous-même pour finir en beauté.',
      days: [
        { id: 22, dayOfWeek: getDayOfWeekName(22), date: getCalendarDate(22), status: getDayStatus(22), sportExercise: 'Cardio expert', relaxationExercise: 'Respiration maîtrisée' },
        { id: 23, dayOfWeek: getDayOfWeekName(23), date: getCalendarDate(23), status: getDayStatus(23), sportExercise: 'Renforcement expert', relaxationExercise: 'Méditation avancée' },
        { id: 24, dayOfWeek: getDayOfWeekName(24), date: getCalendarDate(24), status: getDayStatus(24), sportExercise: 'Circuit ultime', relaxationExercise: 'Étirements experts' },
        { id: 25, dayOfWeek: getDayOfWeekName(25), date: getCalendarDate(25), status: getDayStatus(25), sportExercise: 'Cardio final', relaxationExercise: 'Relaxation ultime' },
        { id: 26, dayOfWeek: getDayOfWeekName(26), date: getCalendarDate(26), status: getDayStatus(26), sportExercise: 'HIIT final', relaxationExercise: 'Yoga maître' },
        { id: 27, dayOfWeek: getDayOfWeekName(27), date: getCalendarDate(27), status: getDayStatus(27), sportExercise: 'Défi final', relaxationExercise: 'Méditation maîtresse' },
        { id: 28, dayOfWeek: getDayOfWeekName(28), date: getCalendarDate(28), status: getDayStatus(28), sportExercise: 'Célébration', relaxationExercise: 'Détente victoire' }
      ]
    }
  ];

  const getDayStatus = (dayId: number): 'completed' | 'today' | 'upcoming' => {
    if (completedDays.includes(dayId)) {
      return 'completed';
    }
    if (dayId === currentDay) {
      return 'today';
    }
    return 'upcoming';
  };

  const getCurrentWeekFromDay = (day: number): number => {
    return Math.ceil(day / 7);
  };

  const getCalendarDate = (dayNumber: number): string => {
    // Date de départ : 21 août 2024 (jeudi) = jour 1
    const startDate = new Date(2024, 7, 21); // Mois 7 = août (0-indexé)
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + (dayNumber - 1));
    
    const day = targetDate.getDate();
    const month = targetDate.getMonth() + 1; // Convertir en 1-indexé
    
    return `${day}/${month}`;
  };

  const getDayOfWeekName = (dayNumber: number): string => {
    const startDate = new Date(2024, 7, 21); // 21 août 2024 (jeudi)
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + (dayNumber - 1));
    
    const daysOfWeek = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
    return daysOfWeek[targetDate.getDay()];
  };

  const getConsecutiveDays = (): number => {
    if (completedDays.length === 0) return 0;
    
    const sortedDays = [...completedDays].sort((a, b) => a - b);
    let consecutive = 1;
    let maxConsecutive = 1;
    
    for (let i = 1; i < sortedDays.length; i++) {
      if (sortedDays[i] === sortedDays[i - 1] + 1) {
        consecutive++;
        maxConsecutive = Math.max(maxConsecutive, consecutive);
      } else {
        consecutive = 1;
      }
    }
    
    return maxConsecutive;
  };

  const goToToday = (): void => {
    const todayWeek = getCurrentWeekFromDay(currentDay);
    setCurrentWeek(todayWeek);
  };

  const navigateWeek = (direction: 'prev' | 'next'): void => {
    if (direction === 'prev' && currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    } else if (direction === 'next' && currentWeek < 4) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const handleDayPress = (day: DayData): void => {
    if (day.status === 'upcoming') {
      Alert.alert('Jour non disponible', 'Ce jour n\'est pas encore accessible.');
      return;
    }
    
    // Navigation vers la page de détail du jour
    router.push(`/programme/${day.id}` as any);
  };

  const handleDayComplete = async (dayId: number): Promise<void> => {
    await markDayAsCompleted(dayId);
    Alert.alert('Félicitations !', `Jour ${dayId} terminé ! Continuez comme ça ! 🎉`);
  };
  const getDayStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#FF4444';
      case 'today': return '#4A90E2';
      case 'upcoming': return '#E0E0E0';
      default: return '#E0E0E0';
    }
  };

  const getDayStatusBorderColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#FF4444';
      case 'today': return '#4A90E2';
      case 'upcoming': return '#CCCCCC';
      default: return '#CCCCCC';
    }
  };

  const programData = getProgramData();
  const currentWeekData = programData[currentWeek - 1];
  const remainingDays = 28 - completedDays.length;
  const progressPercentage = Math.round((completedDays.length / 28) * 100);
  const consecutiveDays = getConsecutiveDays();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>AGP</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Programme 28 Jours</Text>
              <Text style={styles.headerSubtitle}>Votre transformation AGP personnalisée</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.calendarButton}>
            <Calendar size={24} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Trophy size={24} color="#FFB800" />
            <Text style={styles.statValue}>{progressPercentage}%</Text>
            <Text style={styles.statLabel}>Progression</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#FF4444' }]} />
            <Text style={styles.statValue}>{consecutiveDays}</Text>
            <Text style={styles.statLabel}>Jours consécutifs</Text>
          </View>
          
          <View style={styles.statItem}>
            <Target size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{remainingDays}</Text>
            <Text style={styles.statLabel}>Jours restants</Text>
          </View>
        </View>

        {/* Message de progression */}
        <View style={styles.progressMessage}>
          <Text style={styles.progressText}>
            🎯 Vous avez complété {progressPercentage}% du programme !
          </Text>
          <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
            <Text style={styles.todayButtonText}>📍 Aller à aujourd'hui</Text>
          </TouchableOpacity>
        </View>

        {/* Indicateur de semaine */}
        <View style={styles.weekIndicator}>
          <Text style={styles.weekIndicatorText}>
            📅 Vous êtes dans la semaine {getCurrentWeekFromDay(currentDay)} !
          </Text>
        </View>

        {/* Navigation des semaines */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity 
            style={[styles.weekNavButton, currentWeek === 1 && styles.weekNavButtonDisabled]}
            onPress={() => navigateWeek('prev')}
            disabled={currentWeek === 1}
          >
            <ChevronLeft size={20} color={currentWeek === 1 ? '#CCC' : Colors.agpBlue} />
          </TouchableOpacity>
          
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>{currentWeekData.title}</Text>
            <Text style={styles.weekProgress}>{currentWeekData.progress}%</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.weekNavButton, currentWeek === 4 && styles.weekNavButtonDisabled]}
            onPress={() => navigateWeek('next')}
            disabled={currentWeek === 4}
          >
            <ChevronRight size={20} color={currentWeek === 4 ? '#CCC' : Colors.agpBlue} />
          </TouchableOpacity>
        </View>

        {/* Jours de la semaine */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysContainer}>
          {currentWeekData.days.map((day) => (
            <TouchableOpacity
              key={day.id}
              style={styles.dayCard}
              onPress={() => handleDayPress(day)}
            >
              <View style={[
                styles.dayCircle,
                { borderColor: getDayStatusBorderColor(day.status) }
              ]}>
                <Text style={[
                  styles.dayNumber,
                  { color: day.status === 'upcoming' ? '#999' : '#333' }
                ]}>
                  {day.id}
                </Text>
                <Text style={[
                  styles.dayOfWeek,
                  { color: day.status === 'upcoming' ? '#999' : '#666' }
                ]}>
                  {day.dayOfWeek}
                </Text>
                <Text style={[
                  styles.dayDuration,
                  { color: day.status === 'upcoming' ? '#999' : '#666' }
                ]}>
                  {day.duration}min
                </Text>
              </View>
              <View style={[
                styles.dayStatus,
                { backgroundColor: getDayStatusColor(day.status) }
              ]} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Conseil de la semaine */}
        <View style={styles.adviceCard}>
          <View style={styles.adviceHeader}>
            <Text style={styles.adviceIcon}>💡</Text>
            <Text style={styles.adviceTitle}>
              {currentWeek === 1 ? 'Commencez votre transformation' : `Conseil de la semaine ${currentWeek}`}
            </Text>
          </View>
          <Text style={styles.adviceText}>{currentWeekData.advice}</Text>
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
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
  },
  calendarButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  progressMessage: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1976D2',
    marginBottom: 12,
    textAlign: 'center',
  },
  todayButton: {
    backgroundColor: '#FF4444',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  todayButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textLight,
  },
  weekIndicator: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  weekIndicatorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2E7D32',
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  weekNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  weekNavButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  weekHeader: {
    alignItems: 'center',
    flex: 1,
  },
  weekTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  weekProgress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4CAF50',
  },
  daysContainer: {
    marginBottom: 24,
  },
  dayCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  dayCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  dayOfWeek: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  dayDate: {
    fontSize: 9,
    fontFamily: 'Inter-Regular',
  },
  dayStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  adviceCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  adviceIcon: {
    fontSize: 20,
  },
  adviceTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#E65100',
  },
  adviceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#BF360C',
    lineHeight: 20,
  },
});
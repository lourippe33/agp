import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, CircleCheck as CheckCircle, Target, Circle, Lock, TrendingUp, Award, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface DayProgress {
  dayId: number;
  tasks: any[];
  isValidated: boolean;
  validatedAt?: string;
  completionPercentage: number;
}

interface ProgramProgress {
  completedDays: number[];
  currentDay: number;
  startDate: string;
  dayProgresses: { [key: number]: DayProgress };
}

export default function ProgrammeScreen() {
  const [programProgress, setProgramProgress] = useState<ProgramProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgramProgress();
  }, []);

  const loadProgramProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('programProgress');
      if (savedProgress) {
        const progress: ProgramProgress = JSON.parse(savedProgress);
        setProgramProgress(progress);
      } else {
        // Créer une progression par défaut
        const defaultProgress: ProgramProgress = {
          completedDays: [],
          currentDay: 1,
          startDate: new Date().toISOString(),
          dayProgresses: {}
        };
        setProgramProgress(defaultProgress);
        await AsyncStorage.setItem('programProgress', JSON.stringify(defaultProgress));
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionStats = () => {
    if (!programProgress || !programProgress.dayProgresses) {
      return { completedDays: 0, totalProgress: 0, currentStreak: 0 };
    }

    const dayProgresses = Object.values(programProgress.dayProgresses);
    const completedDays = dayProgresses.filter(day => day.isValidated && day.completionPercentage === 100).length;
    const totalProgress = Math.round((completedDays / 28) * 100);
    
    // Calculer la série actuelle
    let currentStreak = 0;
    for (let i = 1; i <= programProgress.currentDay - 1; i++) {
      const dayProg = programProgress.dayProgresses[i];
      if (dayProg && dayProg.isValidated) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { completedDays, totalProgress, currentStreak };
  };

  const getDayStatus = (dayId: number) => {
    if (!programProgress) return 'locked';
    
    const dayProg = programProgress.dayProgresses[dayId];
    
    if (dayProg && dayProg.isValidated && dayProg.completionPercentage === 100) {
      return 'completed';
    }
    
    if (dayId === programProgress.currentDay) {
      return 'current';
    }
    
    if (dayId < programProgress.currentDay) {
      return 'available';
    }
    
    return 'locked';
  };

  const handleDayPress = (dayId: number) => {
    if (!programProgress) return;
    
    const status = getDayStatus(dayId);
    
    if (status === 'locked') {
      Alert.alert(
        'Jour verrouillé',
        `Ce jour n'est pas encore accessible. Complétez d'abord le jour ${programProgress.currentDay}.`
      );
      return;
    }
    
    router.push(`/programme/${dayId}` as any);
  };

  const renderDay = (dayId: number) => {
    const status = getDayStatus(dayId);
    
    let backgroundColor = Colors.border;
    let textColor = Colors.textSecondary;
    let IconComponent = Circle;
    
    switch (status) {
      case 'completed':
        backgroundColor = Colors.success;
        textColor = Colors.textLight;
        IconComponent = CheckCircle;
        break;
      case 'current':
        backgroundColor = Colors.agpBlue;
        textColor = Colors.textLight;
        IconComponent = Target;
        break;
      case 'available':
        backgroundColor = Colors.warning;
        textColor = Colors.textLight;
        IconComponent = Circle;
        break;
      case 'locked':
        backgroundColor = Colors.border;
        textColor = Colors.textSecondary;
        IconComponent = Lock;
        break;
    }

    return (
      <TouchableOpacity
        key={dayId}
        style={[styles.dayCard, { backgroundColor }]}
        onPress={() => handleDayPress(dayId)}
        disabled={status === 'locked'}
      >
        <IconComponent size={16} color={textColor} />
        <Text style={[styles.dayNumber, { color: textColor }]}>{dayId}</Text>
      </TouchableOpacity>
    );
  };

  const renderWeek = (weekNumber: number) => {
    const startDay = (weekNumber - 1) * 7 + 1;
    const days = Array.from({ length: 7 }, (_, i) => startDay + i);

    return (
      <View key={weekNumber} style={styles.weekContainer}>
        <Text style={styles.weekTitle}>Semaine {weekNumber}</Text>
        <View style={styles.daysRow}>
          {days.map(dayId => renderDay(dayId))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const stats = getCompletionStats();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Programme 28 Jours</Text>
        <Text style={styles.headerSubtitle}>
          Votre transformation chronobiologique
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Award size={24} color={Colors.success} />
            <Text style={styles.statValue}>{stats.completedDays}</Text>
            <Text style={styles.statLabel}>Jours complétés</Text>
          </View>
          
          <View style={styles.statItem}>
            <TrendingUp size={24} color={Colors.agpBlue} />
            <Text style={styles.statValue}>{stats.totalProgress}%</Text>
            <Text style={styles.statLabel}>Progression</Text>
          </View>
          
          <View style={styles.statItem}>
            <Clock size={24} color={Colors.warning} />
            <Text style={styles.statValue}>{programProgress?.currentDay || 1}</Text>
            <Text style={styles.statLabel}>Jour actuel</Text>
          </View>
        </View>

        {/* Grille des jours */}
        <View style={styles.programGrid}>
          {[1, 2, 3, 4].map(weekNumber => renderWeek(weekNumber))}
        </View>

        {/* Légende */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Légende</Text>
          
          <View style={styles.legendItem}>
            <CheckCircle size={16} color={Colors.success} />
            <Text style={styles.legendText}>Jour complété</Text>
          </View>
          
          <View style={styles.legendItem}>
            <Target size={16} color={Colors.agpBlue} />
            <Text style={styles.legendText}>Jour actuel</Text>
          </View>
          
          <View style={styles.legendItem}>
            <Circle size={16} color={Colors.warning} />
            <Text style={styles.legendText}>Jour disponible</Text>
          </View>
          
          <View style={styles.legendItem}>
            <Lock size={16} color={Colors.textSecondary} />
            <Text style={styles.legendText}>Jour verrouillé</Text>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
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
    marginBottom: 24,
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
  programGrid: {
    marginBottom: 24,
  },
  weekContainer: {
    marginBottom: 20,
  },
  weekTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dayNumber: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  legendContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
});
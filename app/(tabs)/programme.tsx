import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, CircleCheck as CheckCircle, Target, Circle, Lock, TrendingUp } from 'lucide-react-native';
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
      let progress: ProgramProgress;
      
      if (savedProgress) {
        progress = JSON.parse(savedProgress);
      } else {
        progress = {
          completedDays: [],
          currentDay: 1,
          startDate: new Date().toISOString(),
          dayProgresses: {}
        };
        await AsyncStorage.setItem('programProgress', JSON.stringify(progress));
      }
      
      setProgramProgress(progress);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setLoading(false);
    }
  };

  const getCompletionStats = () => {
    if (!programProgress || !programProgress.dayProgresses) {
      return { totalCompleted: 0, totalStarted: 0, averageCompletion: 0 };
    }

    const dayProgresses = Object.values(programProgress.dayProgresses);
    const totalCompleted = dayProgresses.filter(day => day.completionPercentage === 100).length;
    const totalStarted = dayProgresses.filter(day => day.completionPercentage > 0).length;
    const averageCompletion = dayProgresses.length > 0 
      ? Math.round(dayProgresses.reduce((sum, day) => sum + day.completionPercentage, 0) / dayProgresses.length)
      : 0;

    return { totalCompleted, totalStarted, averageCompletion };
  };

  const getDayStatus = (dayId: number) => {
    if (!programProgress) return 'locked';
    
    const dayProgress = programProgress.dayProgresses[dayId];
    
    if (dayProgress?.completionPercentage === 100) return 'completed';
    if (dayId === programProgress.currentDay) return 'current';
    if (dayId <= programProgress.currentDay) return 'available';
    return 'locked';
  };

  const getDayColor = (status: string) => {
    switch (status) {
      case 'completed': return Colors.success;
      case 'current': return Colors.agpBlue;
      case 'available': return Colors.warning;
      case 'locked': return Colors.border;
      default: return Colors.border;
    }
  };

  const getDayIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'current': return Target;
      case 'available': return Circle;
      case 'locked': return Lock;
      default: return Circle;
    }
  };

  const handleDayPress = (dayId: number) => {
    const status = getDayStatus(dayId);
    
    if (status === 'locked') {
      Alert.alert(
        'Jour verrouillé',
        `Le jour ${dayId} n'est pas encore accessible. Complétez d'abord les jours précédents.`
      );
      return;
    }
    
    router.push(`/programme/${dayId}` as any);
  };

  const renderWeek = (weekNumber: number, startDay: number) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dayId = startDay + i;
      if (dayId > 28) break;
      
      const status = getDayStatus(dayId);
      const color = getDayColor(status);
      const IconComponent = getDayIcon(status);
      const dayProgress = programProgress?.dayProgresses[dayId];
      
      days.push(
        <TouchableOpacity
          key={dayId}
          style={[styles.dayCard, { borderColor: color }]}
          onPress={() => handleDayPress(dayId)}
        >
          <View style={[styles.dayIcon, { backgroundColor: color }]}>
            <IconComponent size={16} color={Colors.textLight} />
          </View>
          <Text style={styles.dayNumber}>{dayId}</Text>
          {dayProgress && (
            <Text style={styles.dayProgress}>
              {dayProgress.completionPercentage}%
            </Text>
          )}
        </TouchableOpacity>
      );
    }
    
    return (
      <View key={weekNumber} style={styles.weekContainer}>
        <Text style={styles.weekTitle}>Semaine {weekNumber}</Text>
        <View style={styles.daysRow}>
          {days}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Chargement du programme...</Text>
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
            <CheckCircle size={24} color={Colors.success} />
            <Text style={styles.statValue}>{stats.totalCompleted}</Text>
            <Text style={styles.statLabel}>Jours complétés</Text>
          </View>
          
          <View style={styles.statItem}>
            <TrendingUp size={24} color={Colors.agpBlue} />
            <Text style={styles.statValue}>{stats.averageCompletion}%</Text>
            <Text style={styles.statLabel}>Progression moyenne</Text>
          </View>
          
          <View style={styles.statItem}>
            <Target size={24} color={Colors.warning} />
            <Text style={styles.statValue}>{programProgress?.currentDay || 1}</Text>
            <Text style={styles.statLabel}>Jour actuel</Text>
          </View>
        </View>

        {/* Légende */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Légende</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.legendText}>Complété</Text>
            </View>
            <View style={styles.legendItem}>
              <Target size={16} color={Colors.agpBlue} />
              <Text style={styles.legendText}>Actuel</Text>
            </View>
            <View style={styles.legendItem}>
              <Circle size={16} color={Colors.warning} />
              <Text style={styles.legendText}>Disponible</Text>
            </View>
            <View style={styles.legendItem}>
              <Lock size={16} color={Colors.border} />
              <Text style={styles.legendText}>Verrouillé</Text>
            </View>
          </View>
        </View>

        {/* Calendrier des 28 jours */}
        <View style={styles.calendarContainer}>
          {renderWeek(1, 1)}
          {renderWeek(2, 8)}
          {renderWeek(3, 15)}
          {renderWeek(4, 22)}
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
  legendContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  calendarContainer: {
    gap: 24,
  },
  weekContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weekTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayCard: {
    width: 45,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  dayIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 2,
  },
  dayProgress: {
    fontSize: 8,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
});
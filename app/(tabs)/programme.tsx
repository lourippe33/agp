import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, CircleCheck as CheckCircle, Circle, Lock, Target, TrendingUp, Award } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface DayProgress {
  dayId: number;
  completionPercentage: number;
  isValidated: boolean;
  validatedAt?: string;
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
        // Initialiser le programme
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

  const getDayStatus = (dayId: number): 'completed' | 'current' | 'locked' | 'available' => {
    if (!programProgress) return 'locked';
    
    const dayProgress = programProgress.dayProgresses[dayId];
    
    if (dayProgress?.isValidated && dayProgress.completionPercentage === 100) {
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

  const getDayColor = (status: string): string => {
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
        `Vous devez d'abord compléter le jour ${programProgress?.currentDay} pour débloquer ce jour.`
      );
      return;
    }
    
    router.push(`/programme/${dayId}` as any);
  };

  const getWeekTitle = (weekNumber: number): string => {
    const titles = [
      'Semaine 1 - Démarrage',
      'Semaine 2 - Adaptation',
      'Semaine 3 - Progression',
      'Semaine 4 - Maîtrise'
    ];
    return titles[weekNumber - 1] || `Semaine ${weekNumber}`;
  };

  const getCompletionStats = () => {
    if (!programProgress) return { completed: 0, total: 28, percentage: 0 };
    
    const completed = Object.values(programProgress.dayProgresses).filter(
      day => day.isValidated && day.completionPercentage === 100
    ).length;
    
    return {
      completed,
      total: 28,
      percentage: Math.round((completed / 28) * 100)
    };
  };

  const renderWeek = (weekNumber: number) => {
    const startDay = (weekNumber - 1) * 7 + 1;
    const endDay = Math.min(weekNumber * 7, 28);
    const days = Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);

    return (
      <View key={weekNumber} style={styles.weekContainer}>
        <Text style={styles.weekTitle}>{getWeekTitle(weekNumber)}</Text>
        <View style={styles.daysGrid}>
          {days.map(dayId => {
            const status = getDayStatus(dayId);
            const IconComponent = getDayIcon(status);
            const dayProgress = programProgress?.dayProgresses[dayId];
            
            return (
              <TouchableOpacity
                key={dayId}
                style={[
                  styles.dayCard,
                  { borderColor: getDayColor(status) },
                  status === 'current' && styles.currentDayCard
                ]}
                onPress={() => handleDayPress(dayId)}
                disabled={status === 'locked'}
              >
                <View style={[styles.dayIcon, { backgroundColor: getDayColor(status) }]}>
                  <IconComponent size={16} color={Colors.textLight} />
                </View>
                <Text style={[
                  styles.dayNumber,
                  status === 'locked' && { color: Colors.textSecondary }
                ]}>
                  {dayId}
                </Text>
                {dayProgress && (
                  <Text style={styles.dayProgress}>
                    {dayProgress.completionPercentage}%
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
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
          <View style={styles.statCard}>
            <Award size={24} color={Colors.agpBlue} />
            <Text style={styles.statValue}>{stats.completed}/28</Text>
            <Text style={styles.statLabel}>Jours complétés</Text>
          </View>
          
          <View style={styles.statCard}>
            <TrendingUp size={24} color={Colors.success} />
            <Text style={styles.statValue}>{stats.percentage}%</Text>
            <Text style={styles.statLabel}>Progression</Text>
          </View>
          
          <View style={styles.statCard}>
            <Target size={24} color={Colors.warning} />
            <Text style={styles.statValue}>Jour {programProgress?.currentDay}</Text>
            <Text style={styles.statLabel}>Actuel</Text>
          </View>
        </View>

        {/* Légende */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Légende :</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIcon, { backgroundColor: Colors.success }]}>
                <CheckCircle size={12} color={Colors.textLight} />
              </View>
              <Text style={styles.legendText}>Complété</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIcon, { backgroundColor: Colors.agpBlue }]}>
                <Target size={12} color={Colors.textLight} />
              </View>
              <Text style={styles.legendText}>Actuel</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIcon, { backgroundColor: Colors.warning }]}>
                <Circle size={12} color={Colors.textLight} />
              </View>
              <Text style={styles.legendText}>Disponible</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIcon, { backgroundColor: Colors.border }]}>
                <Lock size={12} color={Colors.textLight} />
              </View>
              <Text style={styles.legendText}>Verrouillé</Text>
            </View>
          </View>
        </View>

        {/* Semaines */}
        {[1, 2, 3, 4].map(weekNumber => renderWeek(weekNumber))}
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
  statCard: {
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  legendTitle: {
    fontSize: 14,
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
  legendIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  weekContainer: {
    marginBottom: 24,
  },
  weekTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayCard: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  currentDayCard: {
    elevation: 4,
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  dayIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  dayProgress: {
    fontSize: 8,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
});
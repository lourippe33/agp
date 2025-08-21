import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Trophy, Flame, Target, ChevronRight, Star, Lightbulb, ChevronLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function ProgrammeScreen() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const totalWeeks = 4; // 28 jours = 4 semaines

  const getDayStatus = (weekNumber: number, dayNumber: number) => {
    const totalDayNumber = (weekNumber - 1) * 7 + dayNumber;
    
    if (totalDayNumber === 1) return 'current'; // Jour actuel
    if (totalDayNumber <= 3) return 'completed'; // Jours complétés
    if (totalDayNumber === 4) return 'today'; // Aujourd'hui
    return 'upcoming'; // Jours à venir
  };

  const getDayColor = (status: string) => {
    switch (status) {
      case 'completed': return '#FF6B6B'; // Rouge pour complété
      case 'current': return '#FF6B6B'; // Rouge pour actuel
      case 'today': return '#4A90E2'; // Bleu pour aujourd'hui
      case 'upcoming': return '#E0E0E0'; // Gris pour à venir
      default: return '#E0E0E0';
    }
  };

  const getDayLabel = (dayNumber: number) => {
    const labels = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
    return labels[dayNumber - 1];
  };

  const getDayTime = (weekNumber: number, dayNumber: number) => {
    const totalDay = (weekNumber - 1) * 7 + dayNumber;
    if (totalDay <= 7) return '20 min';
    if (totalDay <= 14) return '25 min';
    if (totalDay <= 21) return '30 min';
    return '35 min';
  };

  const getWeekProgress = (weekNumber: number) => {
    if (weekNumber === 1) return '0%';
    return '0%';
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    } else if (direction === 'next' && currentWeek < totalWeeks) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Calendar size={32} color={Colors.textLight} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Programme 28 Jours</Text>
            <Text style={styles.headerSubtitle}>Votre transformation AGP personnalisée</Text>
          </View>
          <Calendar size={24} color={Colors.textLight} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Trophy size={32} color={Colors.warning} />
            <Text style={styles.statValue}>0%</Text>
            <Text style={styles.statLabel}>Progression</Text>
          </View>
          
          <View style={styles.statItem}>
            <Flame size={32} color={Colors.error} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Jours consécutifs</Text>
          </View>
          
          <View style={styles.statItem}>
            <Target size={32} color={Colors.success} />
            <Text style={styles.statValue}>28</Text>
            <Text style={styles.statLabel}>Jours restants</Text>
          </View>
        </View>

        {/* Message de progression */}
        <View style={styles.progressMessage}>
          <Text style={styles.progressEmoji}>🎯</Text>
          <Text style={styles.progressText}>Vous avez complété 0% du programme !</Text>
          <TouchableOpacity style={styles.todayButton}>
            <Text style={styles.todayButtonText}>📍 Aller à aujourd'hui</Text>
          </TouchableOpacity>
        </View>

        {/* Indicateur de semaine */}
        <View style={styles.weekIndicator}>
          <Text style={styles.weekText}>📅 Vous êtes dans la semaine 1 🏁</Text>
        </View>

        {/* Navigation des semaines */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity 
            style={[styles.weekNavButton, currentWeek === 1 && styles.weekNavButtonDisabled]}
            onPress={() => navigateWeek('prev')}
            disabled={currentWeek === 1}
          >
            <ChevronLeft size={20} color={currentWeek === 1 ? Colors.textSecondary : Colors.agpBlue} />
          </TouchableOpacity>
          
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>Semaine {currentWeek}</Text>
            <Text style={styles.weekProgress}>{getWeekProgress(currentWeek)}</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.weekNavButton, currentWeek === totalWeeks && styles.weekNavButtonDisabled]}
            onPress={() => navigateWeek('next')}
            disabled={currentWeek === totalWeeks}
          >
            <ChevronRight size={20} color={currentWeek === totalWeeks ? Colors.textSecondary : Colors.agpBlue} />
          </TouchableOpacity>
        </View>

        {/* Jours de la semaine */}
        <View style={styles.weekSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
            <View style={styles.daysContainer}>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const status = getDayStatus(currentWeek, day);
                const dayColor = getDayColor(status);
                const totalDayNumber = (currentWeek - 1) * 7 + day;
                
                return (
                  <TouchableOpacity key={day} style={styles.dayContainer}>
                    <View style={[styles.dayCircle, { borderColor: dayColor }]}>
                      <Text style={[styles.dayNumber, { color: status === 'upcoming' ? Colors.textSecondary : dayColor }]}>
                        {totalDayNumber}
                      </Text>
                      <Text style={styles.dayLabel}>{getDayLabel(day)}</Text>
                      <Text style={styles.dayTime}>{getDayTime(currentWeek, day)}</Text>
                      <View style={[styles.statusDot, { backgroundColor: dayColor }]} />
                    </View>
                  </TouchableOpacity>
                );
              })}
              
              {currentWeek < totalWeeks && (
                <TouchableOpacity style={styles.moreButton} onPress={() => navigateWeek('next')}>
                  <ChevronRight size={20} color={Colors.agpBlue} />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Section motivation */}
        <View style={styles.motivationSection}>
          <View style={styles.motivationCard}>
            <View style={styles.motivationIcon}>
              <Star size={20} color={Colors.warning} />
            </View>
            <View style={styles.motivationContent}>
              <Text style={styles.motivationTitle}>🚀 Commencez votre transformation</Text>
              <Text style={styles.motivationText}>
                Chaque grand voyage commence par un premier pas.
              </Text>
            </View>
          </View>
        </View>

        {/* Conseil de la semaine */}
        <View style={styles.conseilSection}>
          <Text style={styles.sectionTitle}>💡 Conseil de la semaine {currentWeek}</Text>
          <View style={styles.conseilCard}>
            <Text style={styles.conseilText}>
              {currentWeek === 1 && "Concentrez-vous sur la création d'habitudes. La régularité est plus importante que la perfection."}
              {currentWeek === 2 && "Écoutez votre corps et ajustez l'intensité selon vos sensations."}
              {currentWeek === 3 && "Variez vos exercices pour maintenir la motivation et éviter la routine."}
              {currentWeek === 4 && "Félicitations ! Vous êtes dans la dernière ligne droite, gardez le cap !"}
            </Text>
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
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
    paddingVertical: 24,
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
  statValue: {
    fontSize: 28,
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
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  todayButton: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  todayButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  weekIndicator: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  weekText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.agpBlue,
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  weekNavButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  weekNavButtonDisabled: {
    opacity: 0.3,
  },
  weekHeader: {
    alignItems: 'center',
    flex: 1,
  },
  weekTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  weekProgress: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.success,
  },
  weekSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  daysScroll: {
    marginHorizontal: -20,
  },
  daysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    alignItems: 'center',
  },
  dayContainer: {
    alignItems: 'center',
    width: 70,
  },
  dayCircle: {
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 35,
    padding: 8,
    backgroundColor: Colors.background,
  },
  dayNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  dayTime: {
    fontSize: 9,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moreButton: {
    padding: 12,
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 20,
  },
  motivationSection: {
    marginBottom: 20,
  },
  motivationCard: {
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
  motivationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3CD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  motivationContent: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  conseilSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  conseilCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  conseilText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 18,
  },
});
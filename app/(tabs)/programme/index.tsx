import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';
import { Colors } from '../../../constants/Colors';

export default function ProgrammeScreen() {
  const [currentDay, setCurrentDay] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [dayCompletionStatus, setDayCompletionStatus] = useState<{[key: number]: 'complete' | 'partial' | 'none'}>({});

  // Générer les jours de la semaine actuelle
  const getWeekDays = (weekIndex: number) => {
    const startDay = weekIndex * 7 + 1;
    const days = [];
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    
    // Date de début du programme (aujourd'hui)
    const today = new Date();
    const startDate = new Date(today);
    
    for (let i = 0; i < 7; i++) {
      const programDay = startDay + i;
      if (programDay <= 28) {
        // Calculer la vraie date basée sur aujourd'hui + (programDay - currentDay)
        const actualDate = new Date(startDate);
        actualDate.setDate(startDate.getDate() + (programDay - currentDay));
        
        days.push({
          programDay,
          dayName: dayNames[actualDate.getDay()],
          date: actualDate.getDate(),
          month: actualDate.getMonth() + 1, // Pour affichage si nécessaire
        });
      }
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);

  useEffect(() => {
    loadCompletionStatus();
  }, [currentDay]); // Recharger quand le jour actuel change

  const loadCompletionStatus = async () => {
    const status: {[key: number]: 'complete' | 'partial' | 'none'} = {};
    
    for (let day = 1; day <= 28; day++) {
      try {
        const saved = await AsyncStorage.getItem(`day_${day}_validation`);
        if (saved) {
          status[day] = saved as 'complete' | 'partial' | 'none';
        } else {
          status[day] = 'none';
        }
      } catch (error) {
        console.error(`Erreur chargement jour ${day}:`, error);
        status[day] = 'none';
      }
    }
    
    console.log('Statuts chargés:', status);
    setDayCompletionStatus(status);
  };

  // Fonction pour recharger le statut depuis l'écran de jour
  const refreshCompletionStatus = () => {
    loadCompletionStatus();
  };

  // Écouter les changements de focus pour recharger
  useEffect(() => {
    const unsubscribe = router.events?.on('routeChangeComplete', () => {
      loadCompletionStatus();
    }) || (() => {});
    
    return unsubscribe;
  }, []);

  // Recharger quand on revient sur cette page
  useEffect(() => {
    const interval = setInterval(() => {
      loadCompletionStatus();
    }, 2000); // Recharge toutes les 2 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header avec progression */}
      <View style={styles.header}>
        <Text style={styles.title}>Programme AGP</Text>
        <Text style={styles.subtitle}>
          Jour {currentDay} / 28 - Semaine {Math.floor((currentDay - 1) / 7) + 1}
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(currentDay / 28) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round((currentDay / 28) * 100)}%</Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Cliquez sur la journée bleue pour voir votre programme
        </Text>
      </View>

      {/* Carrousel des jours */}
      <View style={styles.weekCarousel}>
        <View style={styles.weekHeader}>
          <TouchableOpacity 
            style={[styles.weekArrow, currentWeek === 0 && styles.weekArrowDisabled]}
            onPress={() => currentWeek > 0 && setCurrentWeek(currentWeek - 1)}
            disabled={currentWeek === 0}
          >
            <ChevronLeft size={20} color={currentWeek === 0 ? Colors.textSecondary : Colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.weekTitle}>
            Semaine {currentWeek + 1} / 4
          </Text>
          
          <TouchableOpacity 
            style={[styles.weekArrow, currentWeek === 3 && styles.weekArrowDisabled]}
            onPress={() => currentWeek < 3 && setCurrentWeek(currentWeek + 1)}
            disabled={currentWeek === 3}
          >
            <ChevronRight size={20} color={currentWeek === 3 ? Colors.textSecondary : Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.daysContainer}
          decelerationRate="fast"
          snapToInterval={82}
          snapToAlignment="start"
        >
          {weekDays.map((dayInfo) => {
            const isPast = dayInfo.programDay < currentDay;
            const isCurrent = dayInfo.programDay === currentDay;
            const isFuture = dayInfo.programDay > currentDay;
            const completionStatus = dayCompletionStatus[dayInfo.programDay] || 'none';
            
            // Vérifier si on peut accéder au jour suivant (après 23h59 du jour actuel)
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();
            const isAfter2359 = currentHour === 23 && currentMinutes === 59;
            const canAccessNextDay = dayInfo.programDay === currentDay + 1 && isAfter2359;
            
            // Déterminer la couleur de fond selon le statut
            let dayBackgroundColor = Colors.background;
            
            // Logique de couleur basée sur le statut de validation
            if (completionStatus === 'complete') {
              dayBackgroundColor = Colors.success; // Vert
            } else if (completionStatus === 'partial') {
              dayBackgroundColor = '#FF9800'; // Orange
            } else if (isCurrent) {
              dayBackgroundColor = Colors.agpBlue; // Bleu pour jour actuel
            } else if (isPast) {
              dayBackgroundColor = '#E0E0E0'; // Gris pour jours passés non validés
            }
            
            return (
              <TouchableOpacity
                key={dayInfo.programDay}
                style={[
                  styles.dayItem,
                  { backgroundColor: dayBackgroundColor },
                ]}
                onPress={() => {
                  if (!isFuture || canAccessNextDay) {
                    router.push(`/(tabs)/programme/${dayInfo.programDay}?readOnly=${isPast}`);
                  }
                }}
                disabled={isFuture && !canAccessNextDay}
              >
                <Text style={[
                  styles.dayText,
                  (completionStatus !== 'none' || isCurrent) && styles.pastDayText,
                  (isFuture && !canAccessNextDay) && styles.futureDayText,
                ]}>
                  {dayInfo.dayName}
                </Text>
                <Text style={[
                  styles.dayNumber,
                  (completionStatus !== 'none' || isCurrent) && styles.pastDayNumber,
                  (isFuture && !canAccessNextDay) && styles.futureDayNumber,
                ]}>
                  {dayInfo.date}
                </Text>
                <Text style={styles.programDay}>
                  J{dayInfo.programDay}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Section d'encouragement et conseil */}
      <View style={styles.encouragementSection}>
        <View style={styles.encouragementCard}>
          <Text style={styles.encouragementTitle}>💪 Votre parcours AGP</Text>
          <Text style={styles.encouragementText}>
            Chaque jour compte dans votre transformation ! Votre corps s'adapte progressivement 
            à ce nouveau rythme de vie plus sain.
          </Text>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>🕐 Conseil Chronobiologie</Text>
            <Text style={styles.tipText}>
              Respectez vos heures de repas : petit-déjeuner avant 9h, déjeuner entre 12h-14h, 
              dîner avant 20h. Votre métabolisme suit naturellement ces rythmes !
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textLight,
    minWidth: 40,
  },
  weekCarousel: {
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  weekArrow: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  weekArrowDisabled: {
    opacity: 0.3,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  daysContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dayItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 70,
  },
  pastDay: {
    borderColor: Colors.border,
  },
  currentDay: {
    borderColor: Colors.primary,
  },
  futureDay: {
    backgroundColor: Colors.border,
    borderColor: Colors.border,
    opacity: 0.5,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  pastDayText: {
    color: 'white',
  },
  currentDayText: {
    color: 'white',
  },
  futureDayText: {
    color: Colors.textSecondary,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  pastDayNumber: {
    color: 'white',
  },
  currentDayNumber: {
    color: 'white',
  },
  futureDayNumber: {
    color: Colors.textSecondary,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.agpLightBlue,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.agpBlue,
    textAlign: 'center',
  },
  programDay: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  encouragementSection: {
    padding: 20,
    backgroundColor: Colors.background,
  },
  encouragementCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  encouragementTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpBlue,
    marginBottom: 12,
    textAlign: 'center',
  },
  encouragementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpBlue,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: Colors.agpBlue,
    lineHeight: 18,
  },
});
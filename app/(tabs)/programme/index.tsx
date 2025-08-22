import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../../constants/Colors';

export default function ProgrammeScreen() {
  const [currentDay, setCurrentDay] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(0);

  const incrementDay = () => {
    if (currentDay < 28) {
      setCurrentDay(currentDay + 1);
      // Mettre à jour la semaine si nécessaire
      const newWeek = Math.floor((currentDay) / 7);
      if (newWeek !== currentWeek && newWeek < 4) {
        setCurrentWeek(newWeek);
      }
    }
  };

  const decrementDay = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
      // Mettre à jour la semaine si nécessaire
      const newWeek = Math.floor((currentDay - 2) / 7);
      if (newWeek !== currentWeek && newWeek >= 0) {
        setCurrentWeek(newWeek);
      }
    }
  };

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

  return (
    <View style={styles.container}>
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary, currentDay === 1 && styles.buttonDisabled]}
            onPress={decrementDay}
            disabled={currentDay === 1}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              Jour précédent
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonPrimary, currentDay === 28 && styles.buttonDisabled]}
            onPress={incrementDay}
            disabled={currentDay === 28}
          >
            <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
              Jour suivant
            </Text>
          </TouchableOpacity>
        </View>
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
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
        >
          {weekDays.map((dayInfo) => {
            const isPast = dayInfo.programDay < currentDay;
            const isCurrent = dayInfo.programDay === currentDay;
           const isFuture = dayInfo.programDay > currentDay;
            
            return (
              <TouchableOpacity
                key={dayInfo.programDay}
                style={[
                  styles.dayItem,
                  isPast && styles.pastDay,
                  isCurrent && styles.currentDay,
                 isFuture && styles.futureDay,
                ]}
               onPress={() => {
                 if (!isFuture) {
                   router.push(`/(tabs)/programme/${dayInfo.programDay}?readOnly=${isPast}`);
                 }
               }}
               disabled={isFuture}
              >
                <Text style={[
                  styles.dayText,
                  isPast && styles.pastDayText,
                  isCurrent && styles.currentDayText,
                 isFuture && styles.futureDayText,
                ]}>
                  {dayInfo.dayName}
                </Text>
                <Text style={[
                  styles.dayNumber,
                  isPast && styles.pastDayNumber,
                  isCurrent && styles.currentDayNumber,
                 isFuture && styles.futureDayNumber,
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

      {/* Bouton temporaire pour tester l'incrémentation */}
      <View style={styles.content}>
        <TouchableOpacity style={styles.testButton} onPress={incrementDay}>
          <Text style={styles.testButtonText}>
            Valider le jour {currentDay} (Test)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    minWidth: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: 'white',
  },
  buttonTextSecondary: {
    color: Colors.primary,
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
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  currentDay: {
    backgroundColor: Colors.primary,
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
  programDay: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
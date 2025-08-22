import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, TrendingUp, Clock, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { format, addDays, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ProgrammeScreen() {
  const [currentDay, setCurrentDay] = React.useState(1);
  const [selectedDay, setSelectedDay] = React.useState(1);
  const [currentWeek, setCurrentWeek] = React.useState(0);
  const totalDays = 28;
  const remainingDays = totalDays - currentDay;
  const progressPercentage = Math.round((currentDay / totalDays) * 100);

  React.useEffect(() => {
    loadCurrentDay();
  }, []);

  const loadCurrentDay = async () => {
    try {
      const savedDay = await AsyncStorage.getItem('programDay');
      if (savedDay) {
        const day = parseInt(savedDay);
        setCurrentDay(day);
        setSelectedDay(day);
        // Calculer la semaine du jour actuel
        const weekIndex = Math.floor((day - 1) / 7);
        setCurrentWeek(weekIndex);
      }
    } catch (error) {
      console.log('Erreur lors du chargement du jour:', error);
    }
  };

  const incrementDay = async () => {
    if (currentDay < totalDays) {
      const newDay = currentDay + 1;
      setCurrentDay(newDay);
      try {
        await AsyncStorage.setItem('programDay', newDay.toString());
      } catch (error) {
        console.log('Erreur lors de la sauvegarde:', error);
      }
    }
  };

  // Générer les jours de la semaine actuelle
  const generateWeekDays = (weekIndex: number) => {
    const startDay = weekIndex * 7 + 1;
    const endDay = Math.min(startDay + 6, totalDays);
    const days = [];
    
    // Date de début du programme (aujourd'hui - jour actuel + 1)
    const programStartDate = addDays(new Date(), -(currentDay - 1));
    
    for (let day = startDay; day <= endDay; day++) {
      const dayDate = addDays(programStartDate, day - 1);
      const dayOfWeek = getDay(dayDate);
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      
      days.push({
        programDay: day,
        date: format(dayDate, 'd', { locale: fr }),
        dayName: dayNames[dayOfWeek],
        fullDate: dayDate,
        isPast: day < currentDay,
        isCurrent: day === currentDay,
        isFuture: day > currentDay
      });
    }
    
    return days;
  };

  const weekDays = generateWeekDays(currentWeek);
  const totalWeeks = Math.ceil(totalDays / 7);

  const goToPreviousWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const goToNextWeek = () => {
    if (currentWeek < totalWeeks - 1) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const selectDay = (day: number) => {
    if (day <= currentDay) {
      setSelectedDay(day);
    }
  };

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

      {/* Boutons de progression */}
      <View style={styles.progressSection}>
        <TouchableOpacity style={styles.progressButton}>
          <TrendingUp size={24} color={Colors.agpBlue} />
          <View style={styles.progressContent}>
            <Text style={styles.progressTitle}>Progression</Text>
            <Text style={styles.progressValue}>Jour {currentDay}/{totalDays}</Text>
            <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.remainingButton}>
          <Clock size={24} color={Colors.agpGreen} />
          <View style={styles.remainingContent}>
            <Text style={styles.remainingTitle}>Jours restants</Text>
            <Text style={styles.remainingValue}>{remainingDays}</Text>
            <Text style={styles.remainingSubtitle}>jours</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Carrousel des semaines */}
      <View style={styles.weekCarousel}>
        <View style={styles.weekHeader}>
          <TouchableOpacity 
            style={[styles.weekArrow, currentWeek === 0 && styles.weekArrowDisabled]}
            onPress={goToPreviousWeek}
            disabled={currentWeek === 0}
          >
            <ChevronLeft size={20} color={currentWeek === 0 ? Colors.textSecondary : Colors.agpBlue} />
          </TouchableOpacity>
          
          <Text style={styles.weekTitle}>
            Semaine {currentWeek + 1} / {totalWeeks}
          </Text>
          
          <TouchableOpacity 
            style={[styles.weekArrow, currentWeek === totalWeeks - 1 && styles.weekArrowDisabled]}
            onPress={goToNextWeek}
            disabled={currentWeek === totalWeeks - 1}
          >
            <ChevronRight size={20} color={currentWeek === totalWeeks - 1 ? Colors.textSecondary : Colors.agpBlue} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
        >
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day.programDay}
              style={[
                styles.dayItem,
                day.isCurrent && styles.currentDay,
                day.isPast && !day.isCurrent && styles.pastDay,
                selectedDay === day.programDay && !day.isCurrent && styles.selectedDay
              ]}
              onPress={() => selectDay(day.programDay)}
              disabled={day.isFuture}
            >
              <Text style={[
                styles.dayText,
                day.isCurrent && styles.currentDayText,
                day.isPast && !day.isCurrent && styles.pastDayText,
                selectedDay === day.programDay && !day.isCurrent && styles.selectedDayText
              ]}>
                {day.dayName}
              </Text>
              <Text style={[
                styles.dayNumber,
                day.isCurrent && styles.currentDayNumber,
                day.isPast && !day.isCurrent && styles.pastDayNumber,
                selectedDay === day.programDay && !day.isCurrent && styles.selectedDayNumber
              ]}>
                {day.date}
              </Text>
              <Text style={[
                styles.programDay,
                day.isCurrent && styles.currentDayText,
                day.isPast && !day.isCurrent && styles.pastDayText,
                selectedDay === day.programDay && !day.isCurrent && styles.selectedDayText
              ]}>
                J{day.programDay}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.comingSoonCard}>
          <Calendar size={48} color={Colors.agpBlue} />
          <Text style={styles.comingSoonTitle}>Programme en développement</Text>
          <Text style={styles.comingSoonText}>
            Votre programme personnalisé de 28 jours sera bientôt disponible.
          </Text>
          <Text style={styles.selectedDayInfo}>
            Jour sélectionné : J{selectedDay}
          </Text>
        </View>

        {/* Bouton temporaire pour tester l'incrémentation */}
        <TouchableOpacity style={styles.testButton} onPress={incrementDay}>
          <Text style={styles.testButtonText}>
            Valider le jour {currentDay} (Test)
          </Text>
        </TouchableOpacity>
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
  progressSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContent: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  progressValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.agpBlue,
  },
  remainingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  remainingContent: {
    flex: 1,
  },
  remainingTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  remainingValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpGreen,
    marginBottom: 2,
  },
  remainingSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  comingSoonCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  selectedDayInfo: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpBlue,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: Colors.agpBlue,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
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
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  daysContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  dayItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.background,
    minWidth: 70,
    marginRight: 8,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  currentDay: {
    backgroundColor: Colors.agpBlue,
  },
  pastDay: {
    backgroundColor: Colors.success,
  },
  selectedDay: {
    backgroundColor: Colors.agpGreen,
  },
  dayText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  currentDayText: {
    color: Colors.textLight,
  },
  pastDayText: {
    color: Colors.textLight,
  },
  selectedDayText: {
    color: Colors.textLight,
  },
  dayNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 2,
  },
  currentDayNumber: {
    color: Colors.textLight,
  },
  pastDayNumber: {
    color: Colors.textLight,
  },
  selectedDayNumber: {
    color: Colors.textLight,
  },
  programDay: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textSecondary,
  },
});
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, TrendingUp, Clock, ChevronLeft, ChevronRight, Utensils, Dumbbell, RefreshCw, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { format, addDays, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import recettesData from '@/data/recettes.json';
import exercicesData from '@/data/exercices.json';
import detenteData from '@/data/detente.json';

export default function ProgrammeScreen() {
  const [currentDay, setCurrentDay] = React.useState(1);
  const [selectedDay, setSelectedDay] = React.useState(1);
  const [currentWeek, setCurrentWeek] = React.useState(0);
  const [dailyRecommendations, setDailyRecommendations] = React.useState<{[key: number]: any}>({});
  const totalDays = 28;
  const remainingDays = totalDays - currentDay;
  const progressPercentage = Math.round((currentDay / totalDays) * 100);

  React.useEffect(() => {
    loadCurrentDay();
    generateDailyRecommendations();
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

  const generateDailyRecommendations = () => {
    const recommendations: {[key: number]: any} = {};
    
    for (let day = 1; day <= totalDays; day++) {
      // Logique de perte de poids : équilibrer les moments de la journée
      const matinRecettes = recettesData.recettes.filter(r => r.moment === 'matin');
      const midiRecettes = recettesData.recettes.filter(r => r.moment === 'midi');
      const gouterRecettes = recettesData.recettes.filter(r => r.moment === 'gouter');
      const soirRecettes = recettesData.recettes.filter(r => r.moment === 'soir');
      
      // Activités : alterner cardio et détente pour optimiser la perte de poids
      const cardioExercices = exercicesData.exercices.filter(e => 
        e.type === 'cardio' || e.tags.includes('cardio') || e.tags.includes('brule-graisse')
      );
      const detenteExercices = detenteData.exercices.filter(e => 
        e.type === 'respiration' || e.type === 'meditation' || e.type === 'relaxation'
      );
      
      recommendations[day] = {
        matin: matinRecettes[Math.floor(Math.random() * matinRecettes.length)],
        midi: midiRecettes[Math.floor(Math.random() * midiRecettes.length)],
        gouter: gouterRecettes[Math.floor(Math.random() * gouterRecettes.length)],
        soir: soirRecettes[Math.floor(Math.random() * soirRecettes.length)],
        sport: cardioExercices[Math.floor(Math.random() * cardioExercices.length)],
        detente: detenteExercices[Math.floor(Math.random() * detenteExercices.length)]
      };
    }
    
    setDailyRecommendations(recommendations);
  };

  const regenerateRecommendation = (day: number, type: string) => {
    const newRecommendations = { ...dailyRecommendations };
    
    if (type === 'sport') {
      const cardioExercices = exercicesData.exercices.filter(e => 
        e.type === 'cardio' || e.tags.includes('cardio') || e.tags.includes('brule-graisse')
      );
      newRecommendations[day].sport = cardioExercices[Math.floor(Math.random() * cardioExercices.length)];
    } else if (type === 'detente') {
      const detenteExercices = detenteData.exercices.filter(e => 
        e.type === 'respiration' || e.type === 'meditation' || e.type === 'relaxation'
      );
      newRecommendations[day].detente = detenteExercices[Math.floor(Math.random() * detenteExercices.length)];
    } else {
      // Recettes par moment
      const recettesByMoment = recettesData.recettes.filter(r => r.moment === type);
      newRecommendations[day][type] = recettesByMoment[Math.floor(Math.random() * recettesByMoment.length)];
    }
    
    setDailyRecommendations(newRecommendations);
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
        {dailyRecommendations[selectedDay] && (
          <View style={styles.dayContent}>
            <Text style={styles.dayTitle}>Programme du Jour {selectedDay}</Text>
            
            {/* Recettes du jour */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🍽️ Vos repas du jour</Text>
              
              {/* Petit-déjeuner */}
              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTime}>Petit-déjeuner</Text>
                  <TouchableOpacity 
                    style={styles.changeButton}
                    onPress={() => regenerateRecommendation(selectedDay, 'matin')}
                  >
                    <RefreshCw size={16} color={Colors.agpBlue} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={styles.recipeItem}
                  onPress={() => router.push(`/recettes/${dailyRecommendations[selectedDay].matin.id}` as any)}
                >
                  <Image source={{ uri: dailyRecommendations[selectedDay].matin.image }} style={styles.recipeImage} />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle}>{dailyRecommendations[selectedDay].matin.titre}</Text>
                    <Text style={styles.recipeTime}>{dailyRecommendations[selectedDay].matin.tempsPreparation} min</Text>
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Déjeuner */}
              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTime}>Déjeuner</Text>
                  <TouchableOpacity 
                    style={styles.changeButton}
                    onPress={() => regenerateRecommendation(selectedDay, 'midi')}
                  >
                    <RefreshCw size={16} color={Colors.agpBlue} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={styles.recipeItem}
                  onPress={() => router.push(`/recettes/${dailyRecommendations[selectedDay].midi.id}` as any)}
                >
                  <Image source={{ uri: dailyRecommendations[selectedDay].midi.image }} style={styles.recipeImage} />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle}>{dailyRecommendations[selectedDay].midi.titre}</Text>
                    <Text style={styles.recipeTime}>{dailyRecommendations[selectedDay].midi.tempsPreparation} min</Text>
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Goûter */}
              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTime}>Goûter</Text>
                  <TouchableOpacity 
                    style={styles.changeButton}
                    onPress={() => regenerateRecommendation(selectedDay, 'gouter')}
                  >
                    <RefreshCw size={16} color={Colors.agpBlue} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={styles.recipeItem}
                  onPress={() => router.push(`/recettes/${dailyRecommendations[selectedDay].gouter.id}` as any)}
                >
                  <Image source={{ uri: dailyRecommendations[selectedDay].gouter.image }} style={styles.recipeImage} />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle}>{dailyRecommendations[selectedDay].gouter.titre}</Text>
                    <Text style={styles.recipeTime}>{dailyRecommendations[selectedDay].gouter.tempsPreparation} min</Text>
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Dîner */}
              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTime}>Dîner</Text>
                  <TouchableOpacity 
                    style={styles.changeButton}
                    onPress={() => regenerateRecommendation(selectedDay, 'soir')}
                  >
                    <RefreshCw size={16} color={Colors.agpBlue} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={styles.recipeItem}
                  onPress={() => router.push(`/recettes/${dailyRecommendations[selectedDay].soir.id}` as any)}
                >
                  <Image source={{ uri: dailyRecommendations[selectedDay].soir.image }} style={styles.recipeImage} />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle}>{dailyRecommendations[selectedDay].soir.titre}</Text>
                    <Text style={styles.recipeTime}>{dailyRecommendations[selectedDay].soir.tempsPreparation} min</Text>
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Activités du jour */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💪 Vos activités du jour</Text>
              
              {/* Sport */}
              <View style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Dumbbell size={20} color={Colors.sport} />
                  <Text style={styles.activityType}>Activité Sportive</Text>
                  <TouchableOpacity 
                    style={styles.changeButton}
                    onPress={() => regenerateRecommendation(selectedDay, 'sport')}
                  >
                    <RefreshCw size={16} color={Colors.sport} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={styles.activityItem}
                  onPress={() => router.push(`/sport/${dailyRecommendations[selectedDay].sport.id}` as any)}
                >
                  <Image source={{ uri: dailyRecommendations[selectedDay].sport.image }} style={styles.activityImage} />
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{dailyRecommendations[selectedDay].sport.titre}</Text>
                    <Text style={styles.activityDetails}>{dailyRecommendations[selectedDay].sport.duree} min • {dailyRecommendations[selectedDay].sport.calories} kcal</Text>
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Détente */}
              <View style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Calendar size={20} color={Colors.relaxation} />
                  <Text style={styles.activityType}>Exercice de Détente</Text>
                  <TouchableOpacity 
                    style={styles.changeButton}
                    onPress={() => regenerateRecommendation(selectedDay, 'detente')}
                  >
                    <RefreshCw size={16} color={Colors.relaxation} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={styles.activityItem}
                  onPress={() => router.push(`/detente/${dailyRecommendations[selectedDay].detente.id}` as any)}
                >
                  <Image source={{ uri: dailyRecommendations[selectedDay].detente.image }} style={styles.activityImage} />
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{dailyRecommendations[selectedDay].detente.titre}</Text>
                    <Text style={styles.activityDetails}>{dailyRecommendations[selectedDay].detente.duree} min • {dailyRecommendations[selectedDay].detente.type}</Text>
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Boutons d'accès rapide */}
            <View style={styles.quickAccessSection}>
              <Text style={styles.sectionTitle}>🔄 Envie de changer ?</Text>
              <View style={styles.quickAccessButtons}>
                <TouchableOpacity 
                  style={[styles.quickAccessButton, { backgroundColor: Colors.agpGreen }]}
                  onPress={() => router.push('/recettes')}
                >
                  <Utensils size={24} color={Colors.textLight} />
                  <Text style={styles.quickAccessText}>Autres recettes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.quickAccessButton, { backgroundColor: Colors.sport }]}
                  onPress={() => router.push('/sport')}
                >
                  <Dumbbell size={24} color={Colors.textLight} />
                  <Text style={styles.quickAccessText}>Autres activités</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

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
  dayContent: {
    paddingBottom: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTime: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpBlue,
  },
  changeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  recipeTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  activityCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  activityType: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  quickAccessSection: {
    marginTop: 20,
  },
  quickAccessButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAccessButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickAccessText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
});
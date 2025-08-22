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
    padding: 20,
  },
  testButton: {
    backgroundColor: Colors.agpBlue,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  content: {
    padding: 20,
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
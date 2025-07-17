import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Trophy, Target, CircleCheck as CheckCircle, Clock, Flame, Star, ChevronLeft, ChevronRight, RefreshCw, ExternalLink, Lock } from 'lucide-react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import AGPLogo from '@/components/AGPLogo';
import ProgramChoiceModal from '@/components/ProgramChoiceModal';

// Import des données pour la navigation directe
import recipesData from '@/data/recettes_agp.json';
import huelRecipesData from '@/data/recettes_huel_matin.json';
import exercisesData from '@/data/exercices_detente.json';
import sportsData from '@/data/exercices_sport.json';

const { width } = Dimensions.get('window');

interface DayProgram {
  day: number;
  date: Date;
  isCompleted: boolean;
  isToday: boolean;
  activities: {
    breakfast: { name: string; completed: boolean };
    sport: { name: string; completed: boolean };
    relaxation: { name: string; completed: boolean };
    lunch: { name: string; completed: boolean };
    snack: { name: string; completed: boolean };
    dinner: { name: string; completed: boolean };
  };
  totalDuration: number;
  badges?: string[];
}

export default function ProgrammeScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState<DayProgram | null>(null);
  const [programData, setProgramData] = useState<DayProgram[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [visibleDayIndex, setVisibleDayIndex] = useState(0);
  
  // États pour le système de choix
  const [todayButtonScale] = useState(new Animated.Value(1));
  const [choiceModalVisible, setChoiceModalVisible] = useState(false);
  const [currentActivityType, setCurrentActivityType] = useState<'breakfast' | 'sport' | 'relaxation' | 'lunch' | 'snack' | 'dinner'>('breakfast');
  const [userChoices, setUserChoices] = useState<{[key: string]: {[key: string]: string}}>({});
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    generateProgramData();
  }, [user]);

  // Fonction pour obtenir l'index du jour actuel
  const getTodayIndex = () => {
    const todayIndex = programData.findIndex(day => day.isToday);
    return todayIndex !== -1 ? todayIndex : 0;
  };

  // Fonction pour obtenir la semaine actuelle (1-4)
  const getCurrentWeek = () => {
    const todayIndex = getTodayIndex();
    return Math.floor(todayIndex / 7) + 1;
  };

  // Fonction pour scroller automatiquement à la semaine actuelle
  const scrollToToday = () => {
    const todayIndex = getTodayIndex();
    if (todayIndex !== -1) {
      const weekIndex = Math.floor(todayIndex / 7) + 1;
      setCurrentWeek(weekIndex);
      setVisibleDayIndex((weekIndex - 1) * 7);
      
      // Animation du bouton
      Animated.sequence([
        Animated.timing(todayButtonScale, {
          toValue: 0.96,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(todayButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true
        })
      ]).start();
    }
  };

  const generateProgramData = () => {
    console.log('Generating program data with params:', params);
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (today.getDay() || 7) + 1); // Lundi de cette semaine
    const todayStr = today.toDateString();

    const program: DayProgram[] = [];

    for (let i = 0; i < 28; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isToday = currentDate.toDateString() === todayStr;
      const isPast = currentDate.getTime() < today.getTime() && !isToday;
      
      program.push({
        day: i + 1,
        date: currentDate,
        isCompleted: isPast && Math.random() > 0.3, // Simulation de progression
        isToday,
        activities: generateDayActivities(i + 1),
        totalDuration: 15 + Math.floor(Math.random() * 10), // 15-25 min
        badges: i === 6 ? ['🌱'] : i === 13 ? ['🌿'] : i === 20 ? ['🌳'] : i === 27 ? ['🏆'] : undefined
      });
    }

    setProgramData(program);
    
    // Trouver l'index du jour actuel pour le carrousel
    const todayIndex = program.findIndex(day => day.isToday);
    const currentWeekNumber = Math.floor(todayIndex / 7) + 1;
    
    // If we have a day parameter, find and select that day
    if (params.day) {
      const dayNumber = parseInt(params.day as string);
      const dayToSelect = program.find(day => day.day === dayNumber);
      if (dayToSelect) {
        setSelectedDay(dayToSelect);
        // Set the visible week based on the selected day
        const weekIndex = Math.floor((dayNumber - 1) / 7) + 1;
        setCurrentWeek(weekIndex);
        setVisibleDayIndex((weekIndex - 1) * 7);
      }
    }
    
    if (todayIndex !== -1) {
      // Centrer automatiquement sur la semaine actuelle
      setCurrentWeek(currentWeekNumber);
      setVisibleDayIndex((currentWeekNumber - 1) * 7);
    }
    
    // Calculer la progression
    const completed = program.filter(day => day.isCompleted).length;
    const progress = (completed / 28) * 100;
    setOverallProgress(progress);
    setCompletionPercentage(Math.round(progress));
    
    // Calculer le streak
    let streak = 0;
    for (let i = program.length - 1; i >= 0; i--) {
      if (program[i].isCompleted) {
        streak++;
      } else {
        break;
      }
    }
    setCurrentStreak(streak);
  };

  const generateDayActivities = (day: number) => {
    const dayKey = `day-${day}`;
    const choices = userChoices[dayKey] || {};
    
    const breakfasts = [
      'Porridge aux fruits rouges',
      'Smoothie bowl banane',
      'Toast avocat œuf',
      'Pancakes Huel banane',
      'Overnight oats coco'
    ];
    
    const sports = [
      'Marche Active (15 min)',
      'Circuit Training (20 min)',
      'Danse Fitness (15 min)',
      'Yoga Dynamique (20 min)',
      'HIIT Léger (15 min)'
    ];
    
    const relaxations = [
      'Cohérence Cardiaque (3 min)',
      'Respiration Sourire (2 min)',
      'Méditation 5 Sens (5 min)',
      'Gratitude Express (2 min)',
      'Relaxation Express (3 min)'
    ];

    return {
      breakfast: { 
        name: choices.breakfast || breakfasts[day % breakfasts.length], 
        completed: false 
      },
      sport: { 
        name: choices.sport || sports[day % sports.length], 
        completed: false 
      },
      relaxation: { 
        name: choices.relaxation || relaxations[day % relaxations.length], 
        completed: false 
      },
      lunch: { 
        name: choices.lunch || 'Poke bowl saumon-avocat', 
        completed: false 
      },
      snack: { 
        name: choices.snack || 'Energy balls dattes', 
        completed: false 
      },
      dinner: { 
        name: choices.dinner || 'Salade quinoa légumes', 
        completed: false 
      }
    };
  };

  const getWeekDays = (week: number) => {
    const startIndex = (week - 1) * 7;
    return programData.slice(startIndex, startIndex + 7);
  };

  const getWeekProgress = (week: number) => {
    const weekDays = getWeekDays(week);
    const completed = weekDays.filter(day => day.isCompleted).length;
    return (completed / 7) * 100;
  };

  const handleDayPress = (day: DayProgram) => {
    setSelectedDay(day);
  };

  const handlePreviousWeek = () => {
    const newWeek = Math.max(1, currentWeek - 1);
    setCurrentWeek(newWeek);
    // Synchroniser l'index des jours visibles avec la semaine sélectionnée
    setVisibleDayIndex((newWeek - 1) * 7);
  };

  const handleNextWeek = () => {
    const newWeek = Math.min(4, currentWeek + 1);
    setCurrentWeek(newWeek);
    // Synchroniser l'index des jours visibles avec la semaine sélectionnée
    setVisibleDayIndex((newWeek - 1) * 7);
  };

  const handleActivityChange = (activityType: 'breakfast' | 'sport' | 'relaxation' | 'lunch' | 'snack' | 'dinner') => {
    // Vérifier si le jour est passé
    if (selectedDay && (selectedDay.isCompleted || isPastDay(selectedDay))) {
      Alert.alert(
        "Modification impossible",
        "Vous ne pouvez pas modifier les activités des jours passés.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    
    setCurrentActivityType(activityType);
    setChoiceModalVisible(true);
  };

  const handleChoiceSelect = (choice: any) => {
    if (!selectedDay) return;
    
    const dayKey = `day-${selectedDay.day}`;
    const newChoices = {
      ...userChoices,
      [dayKey]: {
        ...userChoices[dayKey],
        [currentActivityType]: choice.title
      }
    };
    
    setUserChoices(newChoices);
    
    // Mettre à jour les données du programme
    const updatedProgram = programData.map(day => {
      if (day.day === selectedDay.day) {
        const updatedActivities = { ...day.activities };
        updatedActivities[currentActivityType] = {
          name: choice.title,
          completed: updatedActivities[currentActivityType].completed
        };
        
        return {
          ...day,
          activities: updatedActivities
        };
      }
      return day;
    });
    
    setProgramData(updatedProgram);
    
    // Mettre à jour le jour sélectionné
    const updatedSelectedDay = updatedProgram.find(day => day.day === selectedDay.day);
    if (updatedSelectedDay) {
      setSelectedDay(updatedSelectedDay);
    }
  };

  // Vérifier si un jour est passé (avant aujourd'hui)
  const isPastDay = (day: DayProgram): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    
    return dayDate.getTime() < today.getTime();
  };

  // Fonction pour trouver l'ID exact de l'activité avec recherche améliorée
  const findActivityId = (activityName: string, activityType: string) => {
    let foundItem = null;
    
    // Nettoyer le nom de l'activité (enlever les durées entre parenthèses)
    const cleanActivityName = activityName.replace(/\s*\([^)]*\)\s*/g, '').trim();
    
    console.log(`🔍 Recherche: "${cleanActivityName}" (type: ${activityType})`);
    
    switch (activityType) {
      case 'breakfast':
        // Chercher dans les recettes AGP matin
        foundItem = recipesData.recettes.find(recipe => 
          recipe.moment === 'matin' && (
            recipe.titre.toLowerCase().includes(cleanActivityName.toLowerCase()) ||
            cleanActivityName.toLowerCase().includes(recipe.titre.toLowerCase())
          )
        );
        
        // Si pas trouvé, chercher dans les recettes Huel
        if (!foundItem) {
          foundItem = huelRecipesData.find(recipe => 
            recipe.titre.toLowerCase().includes(cleanActivityName.toLowerCase()) ||
            cleanActivityName.toLowerCase().includes(recipe.titre.toLowerCase())
          );
          
          if (foundItem) {
            // Ajouter un offset pour les recettes Huel
            foundItem = { ...foundItem, id: foundItem.id + 1000 };
          }
        }
        break;
        
      case 'lunch':
        foundItem = recipesData.recettes.find(recipe => 
          recipe.moment === 'midi' && (
            recipe.titre.toLowerCase().includes(cleanActivityName.toLowerCase()) ||
            cleanActivityName.toLowerCase().includes(recipe.titre.toLowerCase())
          )
        );
        break;
        
      case 'snack':
        foundItem = recipesData.recettes.find(recipe => 
          recipe.moment === 'gouter' && (
            recipe.titre.toLowerCase().includes(cleanActivityName.toLowerCase()) ||
            cleanActivityName.toLowerCase().includes(recipe.titre.toLowerCase())
          )
        );
        break;
        
      case 'dinner':
        foundItem = recipesData.recettes.find(recipe => 
          recipe.moment === 'soir' && (
            recipe.titre.toLowerCase().includes(cleanActivityName.toLowerCase()) ||
            cleanActivityName.toLowerCase().includes(recipe.titre.toLowerCase())
          )
        );
        break;
        
      case 'sport':
        foundItem = sportsData.exercices.find(exercise => 
          exercise.titre.toLowerCase().includes(cleanActivityName.toLowerCase()) ||
          cleanActivityName.toLowerCase().includes(exercise.titre.toLowerCase())
        );
        break;
        
      case 'relaxation':
        foundItem = exercisesData.exercices.find(exercise => 
          exercise.titre.toLowerCase().includes(cleanActivityName.toLowerCase()) ||
          cleanActivityName.toLowerCase().includes(exercise.titre.toLowerCase())
        );
        break;
    }
    
    console.log(`📋 Résultat: ${foundItem ? `ID ${foundItem.id} - ${foundItem.titre}` : 'Non trouvé'}`);
    return foundItem?.id || null;
  };

  // Navigation vers les activités spécifiques avec ID exact
  const navigateToActivity = (activityType: string, activityName: string) => {
    const activityId = findActivityId(activityName, activityType);
    
    console.log(`🎯 Navigation vers: ${activityName} (Type: ${activityType}, ID: ${activityId})`);
    
    switch (activityType) {
      case 'breakfast':
        if (activityId) {
          router.push({
            pathname: '/recettes/matin',
            params: { 
              recipeId: activityId.toString(),
              openModal: 'true'
            }
          });
        } else {
          router.push('/recettes/matin');
        }
        break;
        
      case 'lunch':
        if (activityId) {
          router.push({
            pathname: '/recettes/midi',
            params: { 
              recipeId: activityId.toString(),
              openModal: 'true'
            }
          });
        } else {
          router.push('/recettes/midi');
        }
        break;
        
      case 'snack':
        if (activityId) {
          router.push({
            pathname: '/recettes/gouter',
            params: { 
              recipeId: activityId.toString(),
              openModal: 'true'
            }
          });
        } else {
          router.push('/recettes/gouter');
        }
        break;
        
      case 'dinner':
        if (activityId) {
          router.push({
            pathname: '/recettes/soir',
            params: { 
              recipeId: activityId.toString(),
              openModal: 'true'
            }
          });
        } else {
          router.push('/recettes/soir');
        }
        break;
        
      case 'sport':
        if (activityId) {
          router.push({
            pathname: '/sport',
            params: { 
              exerciseId: activityId.toString(),
              openModal: 'true'
            }
          });
        } else {
          router.push('/sport');
        }
        break;
        
      case 'relaxation':
        if (activityId) {
          router.push({
            pathname: '/detente',
            params: { 
              exerciseId: activityId.toString(),
              openModal: 'true'
            }
          });
        } else {
          router.push('/detente');
        }
        break;
        
      default:
        Alert.alert('Navigation', `Redirection vers ${activityName}`);
    }
  };

  // Fonction pour marquer une activité comme complétée
  const toggleActivityCompletion = (activityType: keyof DayProgram['activities']) => {
    if (!selectedDay) return;
    
    // Vérifier si le jour est passé
    if (isPastDay(selectedDay) && !selectedDay.activities[activityType].completed) {
      Alert.alert(
        "Modification impossible",
        "Vous ne pouvez pas modifier les activités des jours passés.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    const updatedProgram = programData.map(day => {
      if (day.day === selectedDay.day) {
        const updatedActivities = { ...day.activities };
        updatedActivities[activityType].completed = !updatedActivities[activityType].completed;
        
        return {
          ...day,
          activities: updatedActivities
        };
      }
      return day;
    });
    
    setProgramData(updatedProgram);
    
    // Mettre à jour le jour sélectionné
    const updatedSelectedDay = updatedProgram.find(day => day.day === selectedDay.day);
    if (updatedSelectedDay) {
      setSelectedDay(updatedSelectedDay);
    }
  };

  const DayCard = ({ day }: { day: DayProgram }) => {
    const isPast = isPastDay(day);
    
    return (
      <TouchableOpacity
        style={[
          styles.dayCard,
          day.isCompleted && styles.dayCardCompleted,
          day.isToday && styles.dayCardToday
        ]}
        onPress={() => handleDayPress(day)}
        activeOpacity={0.8}
      >
        <View style={styles.dayHeader}>
          <Text style={[
            styles.dayNumber,
            day.isCompleted && styles.dayNumberCompleted,
            day.isToday && styles.dayNumberToday
          ]}>
            {day.day}
          </Text>
          {day.isCompleted && (
            <CheckCircle size={16} color={Colors.agpGreen} />
          )}
          {isPast && !day.isCompleted && (
            <Lock size={14} color={Colors.textSecondary} />
          )}
          {day.badges && (
            <View style={styles.badgeContainer}>
              {day.badges.map((badge, index) => (
                <Text key={index} style={styles.badge}>{badge}</Text>
              ))}
            </View>
          )}
          {day.isToday && (
            <Text style={{ fontSize: 12, color: Colors.agpBlue }}>
              Aujourd'hui
            </Text>
          )}
        </View>
        
        <Text style={styles.dayDate}>
          {day.date.toLocaleDateString('fr-FR', { 
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })}
        </Text>
        
        <View style={styles.dayDuration}>
          <Clock size={12} color={Colors.textSecondary} />
          <Text style={styles.durationText}>{day.totalDuration}min</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const WeekSelector = () => (
    <View style={styles.weekSelector}>
      <TouchableOpacity
        style={[styles.weekArrow, currentWeek === 1 && styles.weekArrowDisabled, styles.weekArrowLeft]}
        onPress={handlePreviousWeek}
        disabled={currentWeek === 1}
      >
        <ChevronLeft size={20} color={currentWeek === 1 ? Colors.textSecondary : Colors.agpBlue} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.weekInfo}
        onPress={() => {
          Alert.alert(
            `Semaine ${currentWeek}`,
            `Durée totale: ${getWeekDays(currentWeek).reduce((sum, day) => sum + day.totalDuration, 0)} minutes\n\nJours complétés: ${getWeekDays(currentWeek).filter(day => day.isCompleted).length}/7\n\n${getWeekMotivationalMessage(currentWeek)}`,
            [{ text: 'OK', style: 'default' }]
          );
        }}
      >
        <View>
          <Text style={styles.weekTitle}>Semaine {currentWeek}</Text>
          <View style={styles.weekProgress}>
            <View style={styles.weekProgressBar}>
              <View 
                style={[
                  styles.weekProgressFill, 
                  { width: `${getWeekProgress(currentWeek)}%` }
                ]} 
              />
            </View>
            <Text style={styles.weekProgressText}>
              {Math.round(getWeekProgress(currentWeek))}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.weekArrow, currentWeek === 4 && styles.weekArrowDisabled, styles.weekArrowRight]}
        onPress={handleNextWeek}
        disabled={currentWeek === 4}
      >
        <ChevronRight size={20} color={currentWeek === 4 ? Colors.textSecondary : Colors.agpBlue} />
      </TouchableOpacity>
    </View>
  );

  // Fonction pour obtenir un message motivant selon la semaine
  const getWeekMotivationalMessage = (week: number) => {
    switch (week) {
      case 1:
        return "Semaine de démarrage ! Concentrez-vous sur la création d'habitudes. La régularité est plus importante que la perfection.";
      case 2:
        return "Votre corps s'adapte ! Écoutez vos sensations et ajustez l'intensité si nécessaire.";
      case 3:
        return "Vous êtes à mi-parcours ! C'est le moment de célébrer vos progrès et rester motivé.";
      case 4:
        return "Dernière ligne droite ! Préparez-vous déjà à maintenir ces bonnes habitudes après le programme.";
      default:
        return "Chaque jour compte dans votre transformation !";
    }
  };

  const OverallStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Trophy size={24} color={Colors.morning} />
        <Text style={styles.statValue}>{Math.round(overallProgress)}%</Text>
        <Text style={styles.statLabel}>Progression</Text>
      </View>
      
      <View style={styles.statCard}>
        <Flame size={24} color={Colors.relaxation} />
        <Text style={styles.statValue}>{currentStreak}</Text>
        <Text style={styles.statLabel}>Jours consécutifs</Text>
      </View>
      
      <View style={styles.statCard}>
        <Target size={24} color={Colors.agpGreen} />
        <Text style={styles.statValue}>{28 - Math.round(overallProgress * 28 / 100)}</Text>
        <Text style={styles.statLabel}>Jours restants</Text>
      </View>
    </View>
  );

  const DayCarousel = () => {
    const days = programData.slice(visibleDayIndex, visibleDayIndex + 7);
    const canScrollLeft = visibleDayIndex > 0;
    const canScrollRight = visibleDayIndex + 7 < programData.length;
    
    const scrollLeft = () => {
      if (canScrollLeft && currentWeek > 1) {
        const newWeek = Math.max(1, currentWeek - 1);
        setCurrentWeek(newWeek);
        setVisibleDayIndex((newWeek - 1) * 7);
      }
    };
    
    const scrollRight = () => {
      if (canScrollRight && currentWeek < 4) {
        const newWeek = Math.min(4, currentWeek + 1);
        setCurrentWeek(newWeek);
        setVisibleDayIndex((newWeek - 1) * 7);
      }
    };
    
    return (
      <View style={styles.carouselContainer}>
        <TouchableOpacity 
          style={[styles.carouselArrow, !canScrollLeft && styles.carouselArrowDisabled]} 
          onPress={scrollLeft}
          disabled={!canScrollLeft}
        >
          <ChevronLeft size={24} color={canScrollLeft ? Colors.agpBlue : Colors.border} />
        </TouchableOpacity>
        
        <FlatList
          data={days}
          renderItem={({ item }) => <DayCard day={item} />}
          keyExtractor={(item) => item.day.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        />
        
        <TouchableOpacity 
          style={[styles.carouselArrow, !canScrollRight && styles.carouselArrowDisabled]} 
          onPress={scrollRight}
          disabled={!canScrollRight}
        >
          <ChevronRight size={24} color={canScrollRight ? Colors.agpBlue : Colors.border} />
        </TouchableOpacity>
      </View>
    );
  };

  const ActivityRow = ({ 
    title, 
    activity, 
    activityType 
  }: { 
    title: string; 
    activity: { name: string; completed: boolean }; 
    activityType: keyof DayProgram['activities'];
  }) => (
    <View style={styles.activitySection}>
      {/* En-tête de l'activité */}
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>{title}</Text>
        <View style={styles.activityActions}>
          <TouchableOpacity
            style={styles.goToButton}
            onPress={() => navigateToActivity(activityType, activity.name)}
            activeOpacity={0.8}
          >
            <ExternalLink size={14} color={Colors.agpGreen} />
            <Text style={styles.goToButtonText}>Accéder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => handleActivityChange(activityType)}
            activeOpacity={0.8}
          >
            <RefreshCw size={14} color={Colors.agpBlue} />
            <Text style={styles.changeButtonText}>
              {isPastDay(selectedDay!) && !selectedDay?.isToday 
                ? "Verrouillé" 
                : "Changer"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.activityRow}
        onPress={() => navigateToActivity(activityType, activity.name)}
        activeOpacity={0.8}
      >
        <Text style={styles.activityName}>{activity.name}</Text>
        {/* Checkbox pour marquer comme complété */}
        <TouchableOpacity
          style={[
            styles.checkboxContainer,
            activity.completed && styles.checkboxContainerChecked
          ]}
          onPress={(e) => {
            e.stopPropagation();
            toggleActivityCompletion(activityType);
          }}
        >
          {/* Afficher une icône de cadenas pour les jours passés non complétés */}
          {activity.completed ? (
            <CheckCircle size={20} color={Colors.textLight} />
          ) : (
            <View style={styles.checkbox} />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  // Modal pour afficher les détails du jour
  const DayDetailModal = () => {
    if (!selectedDay) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Jour {selectedDay.day}</Text>
            <TouchableOpacity onPress={() => setSelectedDay(null)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
            {isPastDay(selectedDay) && !selectedDay.isToday && (
              <View style={styles.pastDayBadge}>
                <Lock size={14} color={Colors.textLight} />
                <Text style={styles.pastDayBadgeText}>
                  Jour passé - Lecture seule
                </Text>
              </View>
            )}
            
          </View>
          
          <ScrollView style={styles.modalBody}>
            <ActivityRow
              title="🌅 Petit-déjeuner"
              activity={selectedDay.activities.breakfast}
              activityType="breakfast"
            />
            
            <ActivityRow
              title="💪 Sport"
              activity={selectedDay.activities.sport}
              activityType="sport"
            />
            
            <ActivityRow
              title="🧘 Détente"
              activity={selectedDay.activities.relaxation}
              activityType="relaxation"
            />
            
            <ActivityRow
              title="🍽️ Déjeuner"
              activity={selectedDay.activities.lunch}
              activityType="lunch"
            />
            
            <ActivityRow
              title="🍪 Collation"
              activity={selectedDay.activities.snack}
              activityType="snack"
            />
            
            <ActivityRow
              title="🌙 Dîner"
              activity={selectedDay.activities.dinner}
              activityType="dinner"
            />
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.agpBlue, Colors.agpGreen]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <AGPLogo size={50} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Programme 28 Jours</Text>
              <Text style={styles.headerSubtitle}>
                Votre transformation AGP personnalisée
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Calendar size={32} color={Colors.textLight} />
            </View>
          </View>
        </LinearGradient>

        {/* Statistiques générales */}
        <OverallStats />
        
        {/* Progression globale */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            🎯 Vous avez complété {completionPercentage}% du programme !
          </Text>
          
          <Animated.View style={{
            transform: [{ scale: todayButtonScale }]
          }}>
            <TouchableOpacity
              style={styles.todayButton}
              onPress={scrollToToday}
              onPressIn={() => {
                Animated.timing(todayButtonScale, {
                  toValue: 0.96,
                  duration: 100,
                  useNativeDriver: true
                }).start();
              }}
              onPressOut={() => {
                Animated.timing(todayButtonScale, {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: true
                }).start();
              }}
            >
              <Text style={styles.todayButtonText}>
                📍 Aller à aujourd'hui
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Indicateur de semaine actuelle */}
          <View style={styles.currentWeekIndicator}>
            <Calendar size={16} color={Colors.agpBlue} />
            <Text style={styles.currentWeekText}>
              Vous êtes dans la semaine {getCurrentWeek()} 🗓️
            </Text>
          </View>
        </View>

        {/* Sélecteur de semaine */}
        <View style={styles.weekSelectorContainer}>
          <WeekSelector />
        </View>

        {/* Carrousel des jours */}
        <DayCarousel />

        {/* Message motivationnel */}
        <View style={styles.motivationCard}>
          <Star size={24} color={Colors.morning} />
          <View style={styles.motivationContent}>
            <Text style={styles.motivationTitle}>
              {currentStreak > 0 
                ? `🔥 ${currentStreak} jours consécutifs !` 
                : '🚀 Commencez votre transformation'
              }
            </Text>
            <Text style={styles.motivationText}>
              {currentStreak > 7 
                ? 'Incroyable régularité ! Vous êtes sur la bonne voie.'
                : currentStreak > 0
                ? 'Excellent ! Continuez sur cette lancée.'
                : 'Chaque grand voyage commence par un premier pas.'
              }
            </Text>
          </View>
        </View>

        {/* Conseils de la semaine */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Conseil de la semaine {currentWeek}</Text>
          <Text style={styles.tipsText}>
            {currentWeek === 1 && "Concentrez-vous sur la création d'habitudes. La régularité est plus importante que la perfection."}
            {currentWeek === 2 && "Votre corps s'adapte ! Écoutez vos sensations et ajustez l'intensité si nécessaire."}
            {currentWeek === 3 && "Vous êtes à mi-parcours ! C'est le moment de célébrer vos progrès et rester motivé."}
            {currentWeek === 4 && "Dernière ligne droite ! Préparez-vous déjà à maintenir ces bonnes habitudes après le programme."}
          </Text>
        </View>

        {/* Info sur la navigation directe */}
        <View style={styles.customizationInfo}>
          <RefreshCw size={20} color={Colors.agpBlue} />
          <View style={styles.customizationContent}>
            <Text style={styles.customizationTitle}>🎯 Navigation Directe ACTIVE !</Text>
            <Text style={styles.customizationText}>
              Cliquez sur une activité pour accéder directement à la recette ou l'exercice spécifique ! 
              Plus besoin de chercher dans les listes.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal détail du jour */}
      {selectedDay && <DayDetailModal />}

      {/* Modal de choix d'activité */}
      <ProgramChoiceModal
        visible={choiceModalVisible}
        onClose={() => setChoiceModalVisible(false)}
        activityType={currentActivityType}
        currentChoice={selectedDay?.activities[currentActivityType].name || ''}
        onChoiceSelect={handleChoiceSelect}
      />
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
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    padding: 8,
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
  },
  headerIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weekArrow: {
    padding: 8,
  },
  weekArrowDisabled: {
    opacity: 0.3,
  },
  weekArrowLeft: {
    marginRight: 8,
  },
  weekArrowRight: {
    marginLeft: 8,
  },
  weekInfo: {
    flex: 1,
    alignItems: 'center',
  },
  weekSelectorContainer: {
    marginBottom: 20,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  carouselArrow: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  carouselArrowDisabled: {
    backgroundColor: Colors.background,
    elevation: 0,
    shadowOpacity: 0,
  },
  carouselContent: {
    paddingHorizontal: 8,
  },
  weekTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  weekProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weekProgressBar: {
    width: 100,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
  },
  weekProgressFill: {
    height: '100%',
    backgroundColor: Colors.agpGreen,
    borderRadius: 3,
  },
  weekProgressText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.agpGreen,
  },
  pastDayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.agpBlue,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  weekCalendar: {
    marginBottom: 24,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pastDayBadgeText: {
    color: Colors.textLight,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  dayCard: {
    width: (width - 56) / 7,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayCardCompleted: {
    backgroundColor: Colors.agpLightGreen,
    borderColor: Colors.agpGreen,
  },
  dayCardToday: {
    backgroundColor: Colors.agpLightBlue,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
    width: (width - 56) / 7 + 10, // Légèrement plus large
    zIndex: 1,
  },
  dayCardToday: {
    borderColor: Colors.agpBlue,
    backgroundColor: Colors.agpLightBlue,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    minHeight: 20,
  },
  dayNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  dayNumberCompleted: {
    color: Colors.agpGreen,
  },
  dayNumberToday: {
    color: Colors.agpBlue,
  },
  dayNumberToday: {
    color: Colors.agpBlue,
  },
  badgeContainer: {
    marginLeft: 4,
  },
  badge: {
    fontSize: 12,
  },
  dayDate: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  dayDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  durationText: {
    fontSize: 9,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  progressContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpBlue,
    marginBottom: 12
  },
  currentWeekIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  currentWeekText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpBlue,
    marginLeft: 8,
  },
  todayButton: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  todayButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.morning,
  },
  motivationContent: {
    flex: 1,
    marginLeft: 12,
  },
  motivationTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  customizationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpGreen,
  },
  customizationContent: {
    flex: 1,
    marginLeft: 12,
  },
  customizationTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  customizationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  modalClose: {
    fontSize: 24,
    color: Colors.textSecondary,
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  activitySection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  activityActions: {
    flexDirection: 'row',
    gap: 8,
  },
  goToButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  goToButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpGreen,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  changeButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpBlue,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  activityName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  checkboxContainerChecked: {
    backgroundColor: Colors.agpGreen,
    borderColor: Colors.agpGreen,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
});
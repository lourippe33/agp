import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CheckSquare, Square, Utensils, Dumbbell, Heart, Clock, Lock, Chrome as Home } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface DayTask {
  id: string;
  type: 'meal' | 'sport' | 'relaxation';
  title: string;
  description: string;
  completed: boolean;
}

interface DayProgress {
  dayId: number;
  tasks: DayTask[];
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

export default function ProgramDayScreen() {
  const { day } = useLocalSearchParams();
  const dayId = parseInt(day as string);
  
  const [dayProgress, setDayProgress] = useState<DayProgress | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dayId) {
      loadDayProgress();
    }
  }, [dayId]);

  const loadDayProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('programProgress');
      let programProgress: ProgramProgress;
      
      if (savedProgress) {
        programProgress = JSON.parse(savedProgress);
      } else {
        programProgress = {
          completedDays: [],
          currentDay: 1,
          startDate: new Date().toISOString(),
          dayProgresses: {}
        };
      }

      let dayProg = programProgress.dayProgresses[dayId];
      
      if (!dayProg) {
        // Créer la progression du jour avec les tâches par défaut
        dayProg = createDefaultDayProgress(dayId);
        programProgress.dayProgresses[dayId] = dayProg;
        await AsyncStorage.setItem('programProgress', JSON.stringify(programProgress));
      }

      setDayProgress(dayProg);
      
      // Vérifier si le jour est verrouillé (validé et après minuit)
      if (dayProg.isValidated && dayProg.validatedAt) {
        const validatedDate = new Date(dayProg.validatedAt);
        const now = new Date();
        const nextMidnight = new Date(validatedDate);
        nextMidnight.setDate(validatedDate.getDate() + 1);
        nextMidnight.setHours(0, 0, 0, 0);
        
        setIsLocked(now >= nextMidnight);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setLoading(false);
    }
  };

  const createDefaultDayProgress = (dayId: number): DayProgress => {
    const tasks: DayTask[] = [
      {
        id: 'meal-matin',
        type: 'meal',
        title: 'Petit-déjeuner',
        description: 'Recette chronobiologique du matin',
        completed: false
      },
      {
        id: 'meal-midi',
        type: 'meal',
        title: 'Déjeuner',
        description: 'Recette équilibrée de midi',
        completed: false
      },
      {
        id: 'meal-gouter',
        type: 'meal',
        title: 'Goûter',
        description: 'Collation saine de l\'après-midi',
        completed: false
      },
      {
        id: 'meal-soir',
        type: 'meal',
        title: 'Dîner',
        description: 'Repas léger du soir',
        completed: false
      },
      {
        id: 'sport',
        type: 'sport',
        title: getDaySportExercise(dayId),
        description: 'Activité physique adaptée',
        completed: false
      },
      {
        id: 'relaxation',
        type: 'relaxation',
        title: getDayRelaxationExercise(dayId),
        description: 'Exercice de détente et bien-être',
        completed: false
      }
    ];

    return {
      dayId,
      tasks,
      isValidated: false,
      completionPercentage: 0
    };
  };

  const getDaySportExercise = (dayId: number): string => {
    const exercises = [
      'Échauffement général', 'Cardio léger', 'Renforcement', 'Cardio modéré',
      'Circuit training', 'HIIT débutant', 'Récupération active', 'Cardio intermédiaire',
      'Renforcement core', 'Circuit complet', 'Cardio intense', 'HIIT intermédiaire',
      'Training complet', 'Récupération', 'Cardio avancé', 'Renforcement total',
      'Circuit intensif', 'Cardio explosif', 'HIIT avancé', 'Challenge complet',
      'Récupération active', 'Cardio expert', 'Renforcement expert', 'Circuit ultime',
      'Cardio final', 'HIIT final', 'Défi final', 'Célébration'
    ];
    return exercises[Math.min(dayId - 1, exercises.length - 1)];
  };

  const getDayRelaxationExercise = (dayId: number): string => {
    const exercises = [
      'Respiration profonde', 'Méditation guidée', 'Étirements', 'Relaxation progressive',
      'Yoga doux', 'Méditation pleine conscience', 'Détente complète', 'Respiration rythmée',
      'Méditation body scan', 'Étirements profonds', 'Relaxation guidée', 'Yoga flow',
      'Méditation zen', 'Détente totale', 'Respiration énergisante', 'Méditation dynamique',
      'Étirements actifs', 'Relaxation profonde', 'Yoga power', 'Méditation transcendante',
      'Détente régénératrice', 'Respiration maîtrisée', 'Méditation avancée', 'Étirements experts',
      'Relaxation ultime', 'Yoga maître', 'Méditation maîtresse', 'Détente victoire'
    ];
    return exercises[Math.min(dayId - 1, exercises.length - 1)];
  };

  const toggleTask = async (taskId: string) => {
    if (isLocked || !dayProgress) return;

    const updatedTasks = dayProgress.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const completedCount = updatedTasks.filter(task => task.completed).length;
    const completionPercentage = Math.round((completedCount / updatedTasks.length) * 100);

    const updatedDayProgress: DayProgress = {
      ...dayProgress,
      tasks: updatedTasks,
      completionPercentage
    };

    setDayProgress(updatedDayProgress);

    // Sauvegarder
    try {
      const savedProgress = await AsyncStorage.getItem('programProgress');
      const programProgress: ProgramProgress = savedProgress ? JSON.parse(savedProgress) : {
        completedDays: [],
        currentDay: 1,
        startDate: new Date().toISOString(),
        dayProgresses: {}
      };

      programProgress.dayProgresses[dayId] = updatedDayProgress;
      await AsyncStorage.setItem('programProgress', JSON.stringify(programProgress));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const validateDay = async () => {
    if (!dayProgress || isLocked) return;

    const completedCount = dayProgress.tasks.filter(task => task.completed).length;
    
    if (completedCount === 0) {
      Alert.alert('Attention', 'Vous devez compléter au moins une tâche avant de valider la journée.');
      return;
    }

    const updatedDayProgress: DayProgress = {
      ...dayProgress,
      isValidated: true,
      validatedAt: new Date().toISOString()
    };

    setDayProgress(updatedDayProgress);

    try {
      const savedProgress = await AsyncStorage.getItem('programProgress');
      const programProgress: ProgramProgress = savedProgress ? JSON.parse(savedProgress) : {
        completedDays: [],
        currentDay: 1,
        startDate: new Date().toISOString(),
        dayProgresses: {}
      };

      programProgress.dayProgresses[dayId] = updatedDayProgress;
      
      // Ajouter le jour aux jours complétés s'il n'y est pas déjà
      if (!programProgress.completedDays.includes(dayId)) {
        programProgress.completedDays.push(dayId);
        programProgress.currentDay = Math.min(28, Math.max(...programProgress.completedDays) + 1);
      }

      await AsyncStorage.setItem('programProgress', JSON.stringify(programProgress));

      const statusText = completedCount === dayProgress.tasks.length ? 'complète' : 'incomplète';
      Alert.alert(
        'Journée validée !', 
        `Votre journée ${statusText} (${completedCount}/${dayProgress.tasks.length}) a été sauvegardée. Elle sera verrouillée après minuit.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder la journée.');
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'meal': return Utensils;
      case 'sport': return Dumbbell;
      case 'relaxation': return Heart;
      default: return Clock;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'meal': return Colors.agpGreen;
      case 'sport': return Colors.sport;
      case 'relaxation': return Colors.relaxation;
      default: return Colors.agpBlue;
    }
  };

  const getDayStatusColor = () => {
    if (!dayProgress) return Colors.border;
    if (dayProgress.completionPercentage === 100) return Colors.success;
    if (dayProgress.completionPercentage > 0) return Colors.warning;
    return Colors.border;
  };

  const navigateToContent = (task: DayTask) => {
    if (task.type === 'meal') {
      const moment = task.id.split('-')[1]; // Extraire 'matin', 'midi', etc.
      router.push(`/recettes?moment=${moment}&returnTo=/programme/${dayId}` as any);
    } else if (task.type === 'sport') {
      router.push(`/sport?returnTo=/programme/${dayId}` as any);
    } else if (task.type === 'relaxation') {
      router.push(`/detente?returnTo=/programme/${dayId}` as any);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!dayProgress) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Erreur lors du chargement du jour</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jour {dayId}</Text>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => router.push('/(tabs)/home')}
          >
            <Home size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Programme 28 jours - Votre journée personnalisée
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Statut de la journée */}
        <View style={[styles.statusCard, { borderLeftColor: getDayStatusColor() }]}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>
              {dayProgress.isValidated ? 
                (dayProgress.completionPercentage === 100 ? 'Journée complète' : 'Journée incomplète') :
                'Journée en cours'
              }
            </Text>
            {isLocked && <Lock size={16} color={Colors.textSecondary} />}
          </View>
          <Text style={styles.statusText}>
            {dayProgress.tasks.filter(t => t.completed).length}/{dayProgress.tasks.length} tâches complétées ({dayProgress.completionPercentage}%)
          </Text>
          {isLocked && (
            <Text style={styles.lockedText}>
              🔒 Cette journée est verrouillée car elle a été validée après minuit
            </Text>
          )}
        </View>

        {/* Liste des tâches */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>Vos tâches du jour</Text>
          
          {dayProgress.tasks.map((task) => {
            const IconComponent = getTaskIcon(task.type);
            const taskColor = getTaskColor(task.type);
            
            return (
              <View key={task.id} style={styles.taskCard}>
                <TouchableOpacity
                  style={styles.taskCheckbox}
                  onPress={() => toggleTask(task.id)}
                  disabled={isLocked}
                >
                  {task.completed ? (
                    <CheckSquare size={24} color={Colors.success} />
                  ) : (
                    <Square size={24} color={isLocked ? Colors.border : Colors.textSecondary} />
                  )}
                </TouchableOpacity>
                
                <View style={[styles.taskIcon, { backgroundColor: taskColor }]}>
                  <IconComponent size={20} color={Colors.textLight} />
                </View>
                
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, task.completed && styles.taskCompleted]}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskDescription}>{task.description}</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.taskAction}
                  onPress={() => navigateToContent(task)}
                >
                  <Text style={styles.taskActionText}>Voir</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Bouton de validation */}
        {!dayProgress.isValidated && !isLocked && (
          <TouchableOpacity style={styles.validateButton} onPress={validateDay}>
            <Text style={styles.validateButtonText}>Valider la journée</Text>
          </TouchableOpacity>
        )}

        {dayProgress.isValidated && (
          <View style={styles.validatedCard}>
            <Text style={styles.validatedText}>
              ✅ Journée validée le {new Date(dayProgress.validatedAt!).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        )}
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
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.error,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    minWidth: 40,
  },
  homeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 16,
    minWidth: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    flex: 1,
    textAlign: 'center',
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
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  lockedText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.warning,
    fontStyle: 'italic',
  },
  tasksSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  taskCheckbox: {
    marginRight: 12,
  },
  taskIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  taskDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  taskAction: {
    backgroundColor: Colors.agpLightBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  taskActionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.agpBlue,
  },
  validateButton: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  validateButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  validatedCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  validatedText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2E7D32',
  },
});
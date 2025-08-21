import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Square, RotateCcw, CircleCheck as CheckCircle, Timer, Target, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/types/Exercise';
import { useAuth } from '@/contexts/AuthContext';

interface PilatesTimerProps {
  exercise: Exercise;
  onComplete: () => void;
  onClose: () => void;
}

// Phases Pilates basées sur les étapes du JSON
const PILATES_PHASES = [
  { name: 'Échauffement', duration: 180, description: 'Inspire par le nez, expire par la bouche. Tourne doucement la tête gauche/droite. Hausse puis relâche les épaules.', color: Colors.morning },
  { name: 'Abdos faciles', duration: 180, description: 'Allongé sur le dos, genoux pliés, mains derrière la tête. Monte la tête et les épaules pour regarder le ventre.', color: Colors.agpBlue },
  { name: 'Jambes actives', duration: 180, description: 'Dos au sol, lève une jambe tendue vers le plafond. Dessine 5 petits cercles dans l\'air.', color: Colors.agpGreen },
  { name: 'Dos renforcé', duration: 180, description: 'Allongé sur le ventre, bras tendus devant. Monte bras et jambes, maintiens 1 seconde.', color: Colors.relaxation },
  { name: 'Étirements finaux', duration: 180, description: 'Assis, jambes tendues, penche doucement le buste vers l\'avant. Enchaîne dos rond puis dos creux.', color: Colors.agpGreen },
];

const { width, height } = Dimensions.get('window');

export default function PilatesTimer({ exercise, onComplete, onClose }: PilatesTimerProps) {
  const { addCompletedExercise, user } = useAuth();
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PILATES_PHASES[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const currentPhase = PILATES_PHASES[currentPhaseIndex];
  const totalDuration = PILATES_PHASES.reduce((sum, phase) => sum + phase.duration, 0);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
        setTotalTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as number);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as number);
      }
    };
  }, [isRunning, timeLeft]);

  const handlePhaseComplete = () => {
    setIsRunning(false);

    if (currentPhaseIndex < PILATES_PHASES.length - 1) {
      const nextPhaseIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextPhaseIndex);
      setTimeLeft(PILATES_PHASES[nextPhaseIndex].duration);
      
      const nextPhase = PILATES_PHASES[nextPhaseIndex];
      
      Alert.alert(
        '🎯 Phase suivante !',
        `${nextPhase.name}\n\n${nextPhase.description}`,
        [
          {
            text: 'Continuer',
            onPress: () => setIsRunning(true)
          }
        ]
      );
    } else {
      completeWorkout();
    }
  };

  const completeWorkout = async () => {
    setIsCompleted(true);

    if (!user) return;

    try {
      const result = await addCompletedExercise(
        user.id,
        exercise.id,
        exercise.type,
        exercise.duree
      );

      if (result.success) {
        Alert.alert(
          '🏆 Pilates terminé !',
          `Excellent ! Vous avez complété "${exercise.titre}". Votre corps vous remercie !`,
          [
            {
              text: 'Continuer',
              onPress: () => {
                onComplete();
                onClose();
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('💥 Erreur enregistrement Pilates:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getOverallProgress = () => {
    return ((totalTimeElapsed / totalDuration) * 100);
  };

  const getPhaseProgress = () => {
    const phaseDuration = currentPhase.duration;
    return ((phaseDuration - timeLeft) / phaseDuration) * 100;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setTimeLeft(PILATES_PHASES[0].duration);
    setTotalTimeElapsed(0);
    setIsCompleted(false);
  };

  const skipPhase = () => {
    if (currentPhaseIndex < PILATES_PHASES.length - 1) {
      const nextPhaseIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextPhaseIndex);
      setTimeLeft(PILATES_PHASES[nextPhaseIndex].duration);
    } else {
      completeWorkout();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Progress Circle */}
        <View style={styles.timerContainer}>
          <View style={styles.progressCircle}>
            <View style={[
              styles.progressFill, 
              { 
                backgroundColor: currentPhase.color,
                transform: [{ rotate: `${(getPhaseProgress() * 3.6)}deg` }] 
              }
            ]} />
            <View style={styles.innerCircle}>
              <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
              <Text style={[styles.phaseLabel, { color: currentPhase.color }]}>
                {currentPhase.name}
              </Text>
              <Text style={styles.phaseCounter}>
                {currentPhaseIndex + 1}/{PILATES_PHASES.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Phase actuelle */}
        <View style={styles.currentPhaseContainer}>
          <View style={[styles.phaseCard, { borderLeftColor: currentPhase.color }]}>
            <View style={styles.phaseHeader}>
              <Target size={24} color={currentPhase.color} />
              <Text style={[styles.phaseTitle, { color: currentPhase.color }]}>
                {currentPhase.name}
              </Text>
            </View>
            <Text style={styles.phaseDescription}>
              {currentPhase.description}
            </Text>
            
            <View style={styles.pilatesTip}>
              <Text style={styles.pilatesTipText}>
                🧘‍♀️ Contrôlez vos mouvements et respirez calmement
              </Text>
            </View>
          </View>
        </View>

        {/* Progression générale */}
        <View style={styles.overallProgressContainer}>
          <Text style={styles.overallProgressTitle}>Progression Pilates</Text>
          <View style={styles.overallProgressBar}>
            <View 
              style={[
                styles.overallProgressFill, 
                { width: `${getOverallProgress()}%` }
              ]} 
            />
          </View>
          <Text style={styles.overallProgressText}>
            {Math.round(getOverallProgress())}% • {formatTime(totalTimeElapsed)} / {formatTime(totalDuration)}
          </Text>
        </View>

        {/* Liste des phases */}
        <View style={styles.phasesListContainer}>
          <Text style={styles.phasesListTitle}>Programme Pilates complet :</Text>
          {PILATES_PHASES.map((phase, index) => (
            <View key={index} style={[
              styles.phaseListItem,
              index === currentPhaseIndex && styles.currentPhaseListItem,
              index < currentPhaseIndex && styles.completedPhaseListItem
            ]}>
              <View style={[
                styles.phaseListNumber,
                index === currentPhaseIndex && { backgroundColor: phase.color },
                index < currentPhaseIndex && { backgroundColor: Colors.agpGreen }
              ]}>
                {index < currentPhaseIndex ? (
                  <CheckCircle size={12} color={Colors.textLight} />
                ) : (
                  <Text style={[
                    styles.phaseListNumberText,
                    index === currentPhaseIndex && { color: Colors.textLight }
                  ]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              <View style={styles.phaseListContent}>
                <Text style={[
                  styles.phaseListName,
                  index === currentPhaseIndex && { color: phase.color, fontFamily: 'Poppins-SemiBold' }
                ]}>
                  {phase.name}
                </Text>
                <Text style={styles.phaseListDuration}>
                  {formatTime(phase.duration)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Controls - Fixés en bas */}
      <View style={styles.controlsContainer}>
        <View style={styles.controls}>
          {!isCompleted ? (
            <>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleTimer}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isRunning ? [Colors.relaxation, '#FFB3BA'] : [currentPhase.color, currentPhase.color + '80']}
                  style={styles.controlButtonGradient}
                >
                  {isRunning ? (
                    <Pause size={24} color={Colors.textLight} />
                  ) : (
                    <Play size={24} color={Colors.textLight} />
                  )}
                  <Text style={styles.controlButtonText}>
                    {isRunning ? 'Pause' : 'Démarrer'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.secondaryControls}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={resetTimer}
                  activeOpacity={0.8}
                >
                  <RotateCcw size={20} color={Colors.textSecondary} />
                  <Text style={styles.secondaryButtonText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={skipPhase}
                  activeOpacity={0.8}
                >
                  <Square size={20} color={Colors.textSecondary} />
                  <Text style={styles.secondaryButtonText}>Passer</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                onComplete();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.agpGreen, '#A5D6A7']}
                style={styles.controlButtonGradient}
              >
                <CheckCircle size={24} color={Colors.textLight} />
                <Text style={styles.controlButtonText}>Terminer</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.cardBackground,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  progressFill: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.2,
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  phaseLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 2,
  },
  phaseCounter: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.textSecondary,
  },
  currentPhaseContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  phaseCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  phaseDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  pilatesTip: {
    backgroundColor: Colors.morning + '20',
    borderRadius: 8,
    padding: 12,
  },
  pilatesTipText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.morning,
    textAlign: 'center',
  },
  overallProgressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  overallProgressTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: Colors.agpGreen,
    borderRadius: 4,
  },
  overallProgressText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  phasesListContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  phasesListTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  phaseListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
  },
  currentPhaseListItem: {
    backgroundColor: Colors.agpBlue + '20',
  },
  completedPhaseListItem: {
    backgroundColor: Colors.agpGreen + '20',
  },
  phaseListNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.textSecondary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  phaseListNumberText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textSecondary,
  },
  phaseListContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phaseListName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.textPrimary,
  },
  phaseListDuration: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.textSecondary,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBackground,
  },
  controls: {
    alignItems: 'center',
  },
  controlButton: {
    width: '100%',
    marginBottom: 12,
  },
  controlButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  controlButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
    marginLeft: 8,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});
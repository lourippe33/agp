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
import { Play, Pause, Square, RotateCcw, CircleCheck as CheckCircle, Timer, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/types/Exercise';
import { useAuth } from '@/contexts/AuthContext';

interface SportExerciseTimerProps {
  exercise: Exercise;
  onComplete: () => void;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SportExerciseTimer({ exercise, onComplete, onClose }: SportExerciseTimerProps) {
  const { addCompletedExercise, user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(exercise.duree * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'preparation' | 'exercise' | 'rest' | 'completed'>('preparation');
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(3);
  const intervalRef = useRef<number | null>(null);

  const phases = {
    preparation: { duration: 10, label: 'Préparation', color: Colors.morning },
    exercise: { duration: 30, label: 'Exercice', color: Colors.agpBlue },
    rest: { duration: 15, label: 'Repos', color: Colors.agpGreen },
  };

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

    switch (currentPhase) {
      case 'preparation':
        setCurrentPhase('exercise');
        setTimeLeft(phases.exercise.duration);
        break;
      case 'exercise':
        if (currentRound < totalRounds) {
          setCurrentPhase('rest');
          setTimeLeft(phases.rest.duration);
        } else {
          completeWorkout();
        }
        break;
      case 'rest':
        setCurrentRound(prev => prev + 1);
        setCurrentPhase('exercise');
        setTimeLeft(phases.exercise.duration);
        break;
    }
  };

  const completeWorkout = async () => {
    setCurrentPhase('completed');
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
        console.log('✅ Exercice sportif enregistré avec succès');
        
        Alert.alert(
          '🏆 Entraînement terminé !',
          `Excellent travail ! Vous avez complété "${exercise.titre}". ${(exercise as any).calories || 0} calories brûlées estimées.`,
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
      console.error('💥 Erreur enregistrement exercice sportif:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentPhaseInfo = () => {
    if (currentPhase === 'completed') {
      return { duration: 0, label: 'Terminé !', color: Colors.agpGreen };
    }
    return phases[currentPhase];
  };

  const getProgress = () => {
    const phaseInfo = getCurrentPhaseInfo();
    if (phaseInfo.duration === 0) return 100;
    return ((phaseInfo.duration - timeLeft) / phaseInfo.duration) * 100;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentPhase('preparation');
    setTimeLeft(phases.preparation.duration);
    setCurrentRound(1);
    setIsCompleted(false);
  };

  const skipPhase = () => {
    handlePhaseComplete();
  };

  const phaseInfo = getCurrentPhaseInfo();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Circle */}
        <View style={styles.timerContainer}>
          <View style={styles.progressCircle}>
            <View style={[
              styles.progressFill, 
              { 
                backgroundColor: phaseInfo.color,
                transform: [{ rotate: `${(getProgress() * 3.6)}deg` }] 
              }
            ]} />
            <View style={styles.innerCircle}>
              <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
              <Text style={[styles.phaseLabel, { color: phaseInfo.color }]}>
                {phaseInfo.label}
              </Text>
              {currentPhase !== 'completed' && currentPhase !== 'preparation' && (
                <Text style={styles.roundText}>
                  Round {currentRound}/{totalRounds}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Phase Instructions */}
        <View style={styles.instructionsContainer}>
          <View style={[styles.instructionCard, { borderLeftColor: phaseInfo.color }]}>
            {currentPhase === 'preparation' && (
              <>
                <Timer size={24} color={phaseInfo.color} />
                <Text style={styles.instructionTitle}>Préparez-vous !</Text>
                <Text style={styles.instructionText}>
                  Échauffez-vous et préparez votre espace d'entraînement
                </Text>
              </>
            )}
            
            {currentPhase === 'exercise' && (
              <>
                <Zap size={24} color={phaseInfo.color} />
                <Text style={styles.instructionTitle}>C'est parti !</Text>
                <Text style={styles.instructionText}>
                  Donnez le maximum ! Suivez les instructions de l'exercice
                </Text>
              </>
            )}
            
            {currentPhase === 'rest' && (
              <>
                <CheckCircle size={24} color={phaseInfo.color} />
                <Text style={styles.instructionTitle}>Récupération</Text>
                <Text style={styles.instructionText}>
                  Respirez profondément et préparez-vous pour le prochain round
                </Text>
              </>
            )}
            
            {currentPhase === 'completed' && (
              <>
                <CheckCircle size={24} color={phaseInfo.color} />
                <Text style={styles.instructionTitle}>Félicitations !</Text>
                <Text style={styles.instructionText}>
                  Entraînement terminé ! Pensez à vous étirer
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Exercise Info */}
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseTitle}>{exercise.titre}</Text>
          <View style={styles.exerciseStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Durée totale</Text>
              <Text style={styles.statValue}>{exercise.duree} min</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Calories</Text>
              <Text style={styles.statValue}>{(exercise as any).calories || 'N/A'}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Niveau</Text>
              <Text style={styles.statValue}>{exercise.difficulte}</Text>
            </View>
          </View>
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
                  colors={isRunning ? [Colors.relaxation, '#FFB3BA'] : [phaseInfo.color, phaseInfo.color + '80']}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.border,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    transformOrigin: 'center',
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  timeText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  phaseLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 4,
  },
  roundText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  instructionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  exerciseInfo: {
    width: '100%',
    marginBottom: 20,
  },
  exerciseTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  exerciseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  controls: {
    gap: 12,
  },
  controlButton: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  controlButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  controlButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  secondaryControls: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.textSecondary,
  },
});
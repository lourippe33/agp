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
import { Play, Pause, Square, RotateCcw, CircleCheck as CheckCircle, Wind, Heart, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/types/Exercise';
import { useAuth } from '@/contexts/AuthContext';

interface BreathingTimerProps {
  exercise: Exercise;
  onComplete: () => void;
  onClose: () => void;
}

export default function BreathingTimer({ exercise, onComplete, onClose }: BreathingTimerProps) {
  const { addCompletedExercise, user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(exercise.duree * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const breathIntervalRef = useRef<number | null>(null);

  // Déterminer le rythme de respiration selon l'exercice
  const getBreathingPattern = () => {
    if (exercise.titre.includes('4-6')) {
      return { inhale: 4, exhale: 6 };
    } else if (exercise.titre.includes('2-4')) {
      return { inhale: 2, exhale: 4 };
    } else {
      return { inhale: 4, exhale: 4 }; // Par défaut
    }
  };

  const breathingPattern = getBreathingPattern();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      // Timer principal
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            handleExerciseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Timer de respiration
      breathIntervalRef.current = setInterval(() => {
        setBreathPhase(prev => {
          const newPhase = prev === 'inhale' ? 'exhale' : 'inhale';
          if (newPhase === 'inhale') {
            setBreathCount(count => count + 1);
          }
          return newPhase;
        });
      }, breathPhase === 'inhale' ? breathingPattern.inhale * 1000 : breathingPattern.exhale * 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as number);
      }
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current as number);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as number);
      }
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current as number);
      }
    };
  }, [isRunning, timeLeft, breathPhase]);

  const handleExerciseComplete = async () => {
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
          '🧘‍♀️ Respiration terminée !',
          `Parfait ! Vous avez complété "${exercise.titre}". ${breathCount} cycles de respiration effectués.`,
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
      console.error('💥 Erreur enregistrement respiration:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = exercise.duree * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(exercise.duree * 60);
    setIsCompleted(false);
    setBreathPhase('inhale');
    setBreathCount(0);
  };

  const skipToEnd = () => {
    Alert.alert(
      'Terminer l\'exercice',
      'Voulez-vous marquer cet exercice comme terminé ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Terminer',
          onPress: () => {
            setTimeLeft(0);
            setIsRunning(false);
            setIsCompleted(true);
            handleExerciseComplete();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Progress Circle avec animation de respiration */}
        <View style={styles.timerContainer}>
          <View style={styles.progressCircle}>
            <View style={[styles.progressFill, { 
              transform: [{ rotate: `${(getProgress() * 3.6)}deg` }] 
            }]} />
            <View style={[
              styles.innerCircle,
              isRunning && breathPhase === 'inhale' && styles.inhaleCircle,
              isRunning && breathPhase === 'exhale' && styles.exhaleCircle
            ]}>
              <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
              <Text style={[styles.breathLabel, { 
                color: breathPhase === 'inhale' ? Colors.agpBlue : Colors.agpGreen 
              }]}>
                {isRunning ? (breathPhase === 'inhale' ? 'Inspirez' : 'Expirez') : 'Prêt'}
              </Text>
              <Text style={styles.breathCount}>
                {breathCount} cycles
              </Text>
            </View>
          </View>
        </View>

        {/* Instructions de respiration */}
        <View style={styles.instructionsContainer}>
          <View style={[styles.instructionCard, { borderLeftColor: Colors.agpBlue }]}>
            <Wind size={24} color={Colors.agpBlue} />
            <Text style={styles.instructionTitle}>Rythme de respiration</Text>
            <Text style={styles.instructionText}>
              Inspirez {breathingPattern.inhale} secondes • Expirez {breathingPattern.exhale} secondes
            </Text>
            
            <View style={styles.breathingGuide}>
              <View style={[styles.breathPhaseIndicator, breathPhase === 'inhale' && styles.activePhase]}>
                <Text style={styles.breathPhaseText}>
                  Inspiration ({breathingPattern.inhale}s)
                </Text>
              </View>
              <View style={[styles.breathPhaseIndicator, breathPhase === 'exhale' && styles.activePhase]}>
                <Text style={styles.breathPhaseText}>
                  Expiration ({breathingPattern.exhale}s)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Étapes de l'exercice */}
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Étapes à suivre :</Text>
          {exercise.etapes.map((etape, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{etape}</Text>
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
                  colors={isRunning ? [Colors.relaxation, '#FFB3BA'] : [Colors.agpBlue, '#6BA3E8']}
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
                  onPress={skipToEnd}
                  activeOpacity={0.8}
                >
                  <Square size={20} color={Colors.textSecondary} />
                  <Text style={styles.secondaryButtonText}>Terminer</Text>
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
                <Text style={styles.controlButtonText}>Continuer</Text>
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
    marginVertical: 30,
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
    backgroundColor: Colors.agpBlue,
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
    transition: 'all 0.5s ease',
  },
  inhaleCircle: {
    transform: [{ scale: 1.1 }],
    backgroundColor: Colors.agpLightBlue,
  },
  exhaleCircle: {
    transform: [{ scale: 0.9 }],
    backgroundColor: Colors.agpLightGreen,
  },
  timeText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  breathLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 4,
  },
  breathCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginTop: 4,
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
    marginBottom: 16,
  },
  breathingGuide: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  breathPhaseIndicator: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  activePhase: {
    backgroundColor: Colors.agpLightBlue,
    borderColor: Colors.agpBlue,
  },
  breathPhaseText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    textAlign: 'center',
  },
  stepsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  stepsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.agpBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  stepText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
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
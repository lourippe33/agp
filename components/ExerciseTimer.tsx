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
import { Play, Pause, Square, RotateCcw, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/types/Exercise';
import { useAuth } from '@/contexts/AuthContext';

interface ExerciseTimerProps {
  exercise: Exercise;
  onComplete: () => void;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function ExerciseTimer({ exercise, onComplete, onClose }: ExerciseTimerProps) {
  const { addCompletedExercise, user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(exercise.duree * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
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
        console.log('✅ Exercice enregistré avec succès');
        
        Alert.alert(
          '🎉 Exercice terminé !',
          `Félicitations ! Vous avez complété "${exercise.titre}". Votre progression a été enregistrée.`,
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
      } else {
        console.error('❌ Erreur enregistrement:', result.error);
      }
    } catch (error) {
      console.error('💥 Erreur complète:', error);
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
    setCurrentStep(0);
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
        style={[
          styles.scrollContainer,
          Platform.OS === 'web' ? { className: 'scroll-container' } : undefined
        ]}
      >
        {/* Progress Circle */}
        <View style={styles.timerContainer}>
          <View style={styles.progressCircle}>
            <View style={[styles.progressFill, { 
              transform: [{ rotate: `${(getProgress() * 3.6)}deg` }] 
            }]} />
            <View style={styles.innerCircle}>
              <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timeLabel}>
                {isCompleted ? 'Terminé !' : isRunning ? 'En cours' : 'Prêt'}
              </Text>
            </View>
          </View>
        </View>

        {/* Exercise Steps */}
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Étapes à suivre :</Text>
          {exercise.etapes.map((etape, index) => (
            <View key={index} style={[
              styles.stepItem,
              index === currentStep && styles.currentStep,
              index < currentStep && styles.completedStep
            ]}>
              <View style={[
                styles.stepNumber,
                index === currentStep && styles.currentStepNumber,
                index < currentStep && styles.completedStepNumber
              ]}>
                {index < currentStep ? (
                  <CheckCircle size={16} color={Colors.textLight} />
                ) : (
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                )}
              </View>
              <Text style={[
                styles.stepText,
                index === currentStep && styles.currentStepText
              ]}>
                {etape}
              </Text>
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
                  colors={isRunning ? [Colors.relaxation, '#FFB3BA'] : [Colors.agpGreen, '#A5D6A7']}
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
    backgroundColor: Colors.agpGreen,
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
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginTop: 4,
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
  currentStep: {
    backgroundColor: Colors.agpLightBlue,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  completedStep: {
    backgroundColor: Colors.agpLightGreen,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpGreen,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  currentStepNumber: {
    backgroundColor: Colors.agpBlue,
  },
  completedStepNumber: {
    backgroundColor: Colors.agpGreen,
  },
  stepNumberText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: Colors.textSecondary,
  },
  stepText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  currentStepText: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.agpBlue,
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
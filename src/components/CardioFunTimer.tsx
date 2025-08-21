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
import { Play, Pause, Square, RotateCcw, CircleCheck as CheckCircle, Timer, Heart, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/types/Exercise';
import { useAuth } from '@/contexts/AuthContext';

interface CardioFunTimerProps {
  exercise: Exercise;
  onComplete: () => void;
  onClose: () => void;
}

// Phases Cardio Fun Sans Saut basées sur les étapes du JSON
const CARDIO_FUN_PHASES = [
  { name: 'Pas de côté + bras', duration: 120, description: 'Grand pas à droite/gauche, bras qui montent et descendent.', color: Colors.agpBlue },
  { name: 'Talons-fesses sans saut', duration: 120, description: 'Talon vers fesse en alternant, bras toniques.', color: Colors.agpGreen },
  { name: 'Torsions de buste', duration: 120, description: 'Pieds ancrés, fais des rotations lentes du buste avec bras ouverts.', color: Colors.relaxation },
  { name: 'Montées de genoux contrôlées', duration: 120, description: 'Genoux à hauteur de hanches, rythme soutenu.', color: Colors.morning },
  { name: 'Combo final', duration: 180, description: '30 s de chaque : pas de côté → talons-fesses → torsions → montées de genoux → pas de côté → talons-fesses.', color: Colors.agpBlue },
  { name: 'Retour au calme', duration: 60, description: 'Marche lente + étirement des épaules.', color: Colors.agpGreen },
];

const { width, height } = Dimensions.get('window');

export default function CardioFunTimer({ exercise, onComplete, onClose }: CardioFunTimerProps) {
  const { addCompletedExercise, user } = useAuth();
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CARDIO_FUN_PHASES[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const currentPhase = CARDIO_FUN_PHASES[currentPhaseIndex];
  const totalDuration = CARDIO_FUN_PHASES.reduce((sum, phase) => sum + phase.duration, 0);

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

    if (currentPhaseIndex < CARDIO_FUN_PHASES.length - 1) {
      const nextPhaseIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextPhaseIndex);
      setTimeLeft(CARDIO_FUN_PHASES[nextPhaseIndex].duration);
      
      const nextPhase = CARDIO_FUN_PHASES[nextPhaseIndex];
      
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
          '🏆 Cardio Fun terminé !',
          `Excellent ! Vous avez complété "${exercise.titre}". Votre corps vous remercie pour cette séance sans impact !`,
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
      console.error('💥 Erreur enregistrement Cardio Fun:', error);
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
    setTimeLeft(CARDIO_FUN_PHASES[0].duration);
    setTotalTimeElapsed(0);
    setIsCompleted(false);
  };

  const skipPhase = () => {
    if (currentPhaseIndex < CARDIO_FUN_PHASES.length - 1) {
      const nextPhaseIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextPhaseIndex);
      setTimeLeft(CARDIO_FUN_PHASES[nextPhaseIndex].duration);
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
                {currentPhaseIndex + 1}/{CARDIO_FUN_PHASES.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Phase actuelle */}
        <View style={styles.currentPhaseContainer}>
          <View style={[styles.phaseCard, { borderLeftColor: currentPhase.color }]}>
            <View style={styles.phaseHeader}>
              <Heart size={24} color={currentPhase.color} />
              <Text style={[styles.phaseTitle, { color: currentPhase.color }]}>
                {currentPhase.name}
              </Text>
            </View>
            <Text style={styles.phaseDescription}>
              {currentPhase.description}
            </Text>
            
            <View style={styles.cardioTip}>
              <Text style={styles.cardioTipText}>
                💪 Cardio sans impact ! Protégez vos articulations
              </Text>
            </View>
          </View>
        </View>

        {/* Progression générale */}
        <View style={styles.overallProgressContainer}>
          <Text style={styles.overallProgressTitle}>Progression Cardio Fun</Text>
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
          <Text style={styles.phasesListTitle}>Programme Cardio Fun complet :</Text>
          {CARDIO_FUN_PHASES.map((phase, index) => (
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
    textAlign: 'center',
  },
  phaseCounter: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  currentPhaseContainer: {
    width: '100%',
    marginBottom: 20,
  },
  phaseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  phaseTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  phaseDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardioTip: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.agpBlue,
  },
  cardioTipText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpBlue,
    textAlign: 'center',
  },
  overallProgressContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overallProgressTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: Colors.agpBlue,
    borderRadius: 4,
  },
  overallProgressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  phasesListContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  phasesListTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  phaseListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  currentPhaseListItem: {
    backgroundColor: Colors.agpLightBlue,
  },
  completedPhaseListItem: {
    backgroundColor: Colors.agpLightGreen,
  },
  phaseListNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  phaseListNumberText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
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
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
  phaseListDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
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
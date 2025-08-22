import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Heart, Play, Users } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import detenteData from '@/data/detente.json';


export default function DetenteDetailScreen() {
  const { id } = useLocalSearchParams();
  const [showTimer, setShowTimer] = useState(false);

  const exercice = detenteData.exercices.find(e => e.id === parseInt(id as string));
  
  if (!exercice) {
    return (
      <View style={styles.container}>
        <Text>Exercice non trouvé</Text>
      </View>
    );
  }

  const handleStartExercise = () => {
    setShowTimer(true);
  };

  if (showTimer) {
    return <TimerView exercice={exercice} onBack={() => setShowTimer(false)} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Image et header */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: exercice.image }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.textLight} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{exercice.titre}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{exercice.type}</Text>
            </View>
          </View>
        </View>

        {/* Infos rapides */}
        <View style={styles.quickInfo}>
          <View style={styles.infoItem}>
            <Clock size={20} color={Colors.relaxation} />
            <Text style={styles.infoText}>{exercice.duree} min</Text>
          </View>
          <View style={styles.infoItem}>
            <Heart size={20} color={Colors.relaxation} />
            <Text style={styles.infoText}>{exercice.type}</Text>
          </View>
          <View style={styles.infoItem}>
            <Users size={20} color={Colors.relaxation} />
            <Text style={styles.infoText}>Tous niveaux</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{exercice.description}</Text>
        </View>

        {/* Étapes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Étapes de l'exercice</Text>
          {exercice.etapes.map((etape, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{etape}</Text>
            </View>
          ))}
        </View>

        {/* Bénéfices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bénéfices</Text>
          {exercice.benefices.map((benefice, index) => (
            <View key={index} style={styles.benefitItem}>
              <Text style={styles.benefitBullet}>✓</Text>
              <Text style={styles.benefitText}>{benefice}</Text>
            </View>
          ))}
        </View>

        {/* Bouton d'action */}
        <TouchableOpacity style={styles.startButton} onPress={handleStartExercise}>
          <Play size={24} color={Colors.textLight} />
          <Text style={styles.startButtonText}>Commencer l'exercice</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Composant Timer pour la détente
function TimerView({ exercice, onBack }: { exercice: any, onBack: () => void }) {
  const [timeRemaining, setTimeRemaining] = useState(exercice.duree * 60); // Convertir en secondes
  const [isRunning, setIsRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(4);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            Alert.alert('Félicitations !', 'Exercice de détente terminé !');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  // Animation de respiration pour la cohérence cardiaque
  useEffect(() => {
    if (isRunning && exercice.titre.includes('Cohérence Cardiaque')) {
      const breathInterval = setInterval(() => {
        setBreathCount(prev => {
          if (breathPhase === 'inhale' && prev >= 4) {
            setBreathPhase('exhale');
            return 6;
          } else if (breathPhase === 'exhale' && prev <= 1) {
            setBreathPhase('inhale');
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(breathInterval);
    }
  }, [isRunning, breathPhase]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.timerContainer}>
      <View style={styles.timerHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.timerTitle}>Exercice de Détente</Text>
      </View>

      <View style={styles.timerContent}>
        <Text style={styles.exerciseTitle}>{exercice.titre}</Text>
        
        <Text style={styles.timerDisplay}>{formatTime(timeRemaining)}</Text>
        
        {/* Animation de respiration pour cohérence cardiaque */}
        {exercice.titre.includes('Cohérence Cardiaque') && (
          <View style={styles.breathingGuide}>
            <View style={[
              styles.breathingCircle,
              { 
                transform: [{ scale: breathPhase === 'inhale' ? 1.2 : 0.8 }],
                backgroundColor: breathPhase === 'inhale' ? Colors.agpBlue : Colors.relaxation
              }
            ]} />
            {exercice.titre.includes('Cohérence Cardiaque') && (
              <Text style={styles.breathingText}>
                {breathPhase === 'inhale' ? `Inspirez ${breathCount}` : `Expirez ${breathCount}`}
              </Text>
            )}
          </View>
        )}

        <Text style={styles.stepInstruction}>
          {exercice.description}
        </Text>

        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => setIsRunning(!isRunning)}
        >
          <Play size={32} color={Colors.textLight} />
          <Text style={styles.playButtonText}>
            {isRunning ? 'Pause' : 'Démarrer'}
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
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  searchButton: {
    padding: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
  },
  searchContainer: {
    marginTop: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    paddingVertical: 4,
  },
  filtersContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchResults: {
    marginBottom: 16,
  },
  searchResultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  exercicesGrid: {
    gap: 16,
  },
  exerciceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  exerciceImage: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.border,
  },
  exerciceContent: {
    padding: 16,
  },
  exerciceTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  exerciceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.relaxation,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textLight,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.relaxation,
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  // Styles pour le timer
  timerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginLeft: 16,
  },
  timerContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  timerDisplay: {
    fontSize: 64,
    fontFamily: 'Poppins-Bold',
    color: Colors.relaxation,
    marginBottom: 30,
  },
  breathingGuide: {
    alignItems: 'center',
    marginBottom: 30,
  },
  breathingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  breathingText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  stepInstruction: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.relaxation,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  playButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.relaxation,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.textLight,
  },
  stepText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  benefitBullet: {
    fontSize: 16,
    color: Colors.success,
    fontFamily: 'Inter-Bold',
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
});
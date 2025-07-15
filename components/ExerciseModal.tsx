import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Clock, Heart, Brain, Zap, Target, Calendar, Play, Video } from 'lucide-react-native';
import { Exercise } from '@/types/Exercise';
import { Colors } from '@/constants/Colors';
import AGPLogo from './AGPLogo';
import ExerciseTimer from './ExerciseTimer';
import ExerciseVideoModal from './ExerciseVideoModal';

interface ExerciseModalProps {
  exercise: Exercise | null;
  visible: boolean;
  onClose: () => void;
}

const { height } = Dimensions.get('window');

const getTypeIcon = (type: string, size: number = 16) => {
  switch (type) {
    case 'respiration':
      return <Zap size={size} color={Colors.textLight} />;
    case 'meditation':
      return <Brain size={size} color={Colors.textLight} />;
    case 'coherence':
      return <Heart size={size} color={Colors.textLight} />;
    default:
      return <Heart size={size} color={Colors.textLight} />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'respiration':
      return '#4A90E2';
    case 'meditation':
      return '#7CB342';
    case 'coherence':
      return '#FF6B6B';
    case 'relaxation':
      return '#9C27B0';
    default:
      return Colors.primary;
  }
};

export default function ExerciseModal({ exercise, visible, onClose }: ExerciseModalProps) {
  const [showTimer, setShowTimer] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  if (!exercise) return null;

  const typeColor = getTypeColor(exercise.type);

  const handleStartExercise = () => {
    setShowTimer(true);
  };

  const handleExerciseComplete = () => {
    setShowTimer(false);
  };

  const handleCloseTimer = () => {
    setShowTimer(false);
  };

  const handleOpenVideo = () => {
    setShowVideoModal(true);
  };

  const handleCloseVideo = () => {
    setShowVideoModal(false);
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          {showTimer ? (
            // Mode Timer
            <View style={styles.timerView}>
              <View style={styles.timerHeader}>
                <TouchableOpacity style={styles.closeButton} onPress={handleCloseTimer}>
                  <View style={styles.closeButtonBackground}>
                    <X size={24} color={Colors.text} />
                  </View>
                </TouchableOpacity>
                <Text style={styles.timerTitle}>{exercise.titre}</Text>
              </View>
              
              <ExerciseTimer
                exercise={exercise}
                onComplete={handleExerciseComplete}
                onClose={onClose}
              />
            </View>
          ) : (
            // Mode Information
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header Image */}
              <View style={styles.headerContainer}>
                <Image source={{ uri: exercise.image }} style={styles.headerImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.headerOverlay}
                />
                
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <View style={styles.closeButtonBackground}>
                    <X size={24} color={Colors.text} />
                  </View>
                </TouchableOpacity>

                <View style={styles.logoContainer}>
                  <AGPLogo size={40} />
                </View>

                <View style={styles.headerContent}>
                  <Text style={styles.headerTitle}>{exercise.titre}</Text>
                  <View style={styles.headerStats}>
                    <View style={styles.statItem}>
                      <Clock size={16} color={Colors.textLight} />
                      <Text style={styles.statText}>
                        {exercise.duree} min
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      {getTypeIcon(exercise.type, 16)}
                      <Text style={styles.statText}>{exercise.type}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Target size={16} color={Colors.textLight} />
                      <Text style={styles.statText}>
                        {exercise.difficulte}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Content */}
              <View style={styles.content}>
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={handleStartExercise}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[typeColor, typeColor + '80']}
                      style={styles.startButtonGradient}
                    >
                      <Play size={24} color={Colors.textLight} />
                      <Text style={styles.startButtonText}>
                        Commencer l'exercice ({exercise.duree} min)
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Bouton Vidéo si disponible */}
                  {exercise.hasVideo && (
                    <TouchableOpacity
                      style={styles.videoButton}
                      onPress={handleOpenVideo}
                      activeOpacity={0.8}
                    >
                      <Video size={20} color={Colors.agpBlue} />
                      <Text style={styles.videoButtonText}>
                        Voir les vidéos explicatives
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                  {exercise.tags.map((tag, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: typeColor }]}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                  {exercise.hasVideo && (
                    <View style={[styles.tag, styles.videoTag]}>
                      <Video size={12} color={Colors.agpBlue} />
                      <Text style={[styles.tagText, { color: Colors.agpBlue }]}>
                        Avec vidéos
                      </Text>
                    </View>
                  )}
                </View>

                {/* Description */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.description}>{exercise.description}</Text>
                </View>

                {/* Fréquence et Moments */}
                <View style={styles.infoGrid}>
                  <View style={styles.infoCard}>
                    <Calendar size={20} color={typeColor} />
                    <Text style={styles.infoCardTitle}>Fréquence</Text>
                    <Text style={styles.infoCardText}>{exercise.frequence}</Text>
                  </View>
                  <View style={styles.infoCard}>
                    <Target size={20} color={typeColor} />
                    <Text style={styles.infoCardTitle}>Moments idéaux</Text>
                    <Text style={styles.infoCardText}>
                      {exercise.momentIdeal.join(', ')}
                    </Text>
                  </View>
                </View>

                {/* Étapes */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Comment pratiquer</Text>
                  {exercise.etapes.map((etape, index) => (
                    <View key={index} style={styles.stepItem}>
                      <View style={[styles.stepNumber, { backgroundColor: typeColor }]}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{etape}</Text>
                    </View>
                  ))}
                </View>

                {/* Bénéfices */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Bénéfices</Text>
                  {exercise.benefices.map((benefice, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <View style={[styles.bullet, { backgroundColor: typeColor }]} />
                      <Text style={styles.benefitText}>{benefice}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Modal Vidéo séparée */}
      <ExerciseVideoModal
        exercise={exercise}
        visible={showVideoModal}
        onClose={handleCloseVideo}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  timerView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginLeft: 16,
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    height: height * 0.4,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
  },
  closeButtonBackground: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  logoContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 8,
  },
  headerContent: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 12,
    lineHeight: 34,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textLight,
  },
  content: {
    padding: 16,
  },
  actionButtons: {
    marginBottom: 24,
    gap: 12,
  },
  startButton: {
    borderRadius: 16,
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    gap: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.agpBlue,
  },
  videoButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpBlue,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  videoTag: {
    backgroundColor: Colors.agpLightBlue,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textLight,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  stepText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
  },
});
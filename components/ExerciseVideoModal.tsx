import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { X, Play, BookOpen, Video } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Exercise, VideoStep } from '@/types/Exercise';
import VideoPlayer from './VideoPlayer';

interface ExerciseVideoModalProps {
  exercise: Exercise | null;
  visible: boolean;
  onClose: () => void;
}

const { height } = Dimensions.get('window');

export default function ExerciseVideoModal({ exercise, visible, onClose }: ExerciseVideoModalProps) {
  const [selectedTab, setSelectedTab] = useState<'video' | 'steps'>('video');
  const [selectedStepVideo, setSelectedStepVideo] = useState<VideoStep | null>(null);

  if (!exercise || !exercise.hasVideo) return null;

  const TabButton = ({ 
    id, 
    label, 
    icon: IconComponent, 
    isActive 
  }: {
    id: 'video' | 'steps';
    label: string;
    icon: any;
    isActive: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={() => setSelectedTab(id)}
      activeOpacity={0.8}
    >
      <IconComponent size={16} color={isActive ? Colors.textLight : Colors.textSecondary} />
      <Text style={[
        styles.tabButtonText,
        isActive && styles.tabButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{exercise.titre}</Text>
          
          <View style={styles.headerRight}>
            <Video size={20} color={Colors.agpBlue} />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TabButton
            id="video"
            label="Vidéo principale"
            icon={Video}
            isActive={selectedTab === 'video'}
          />
          <TabButton
            id="steps"
            label="Étapes détaillées"
            icon={BookOpen}
            isActive={selectedTab === 'steps'}
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {selectedTab === 'video' && exercise.videoUrl && (
            <View style={styles.videoSection}>
              <VideoPlayer
                videoUrl={exercise.videoUrl}
                thumbnail={exercise.videoThumbnail || exercise.image}
                title={`Démonstration : ${exercise.titre}`}
                autoPlay={false}
                showControls={true}
                style={styles.mainVideo}
              />
              
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>Démonstration complète</Text>
                <Text style={styles.videoDescription}>
                  Suivez cette vidéo pour apprendre la technique correcte de l'exercice "{exercise.titre}".
                </Text>
                
                <View style={styles.videoStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Durée vidéo</Text>
                    <Text style={styles.statValue}>
                      {exercise.videoDuration ? `${Math.floor(exercise.videoDuration / 60)}:${(exercise.videoDuration % 60).toString().padStart(2, '0')}` : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Exercice</Text>
                    <Text style={styles.statValue}>{exercise.duree} min</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Niveau</Text>
                    <Text style={styles.statValue}>{exercise.difficulte}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {selectedTab === 'steps' && exercise.videoSteps && (
            <View style={styles.stepsSection}>
              <Text style={styles.sectionTitle}>Vidéos par étapes</Text>
              <Text style={styles.sectionSubtitle}>
                Chaque étape expliquée en détail avec sa propre vidéo
              </Text>
              
              {exercise.videoSteps.map((videoStep, index) => (
                <View key={index} style={styles.stepVideoCard}>
                  <View style={styles.stepHeader}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{videoStep.stepIndex}</Text>
                    </View>
                    <Text style={styles.stepTitle}>{videoStep.title}</Text>
                  </View>
                  
                  <VideoPlayer
                    videoUrl={videoStep.videoUrl}
                    thumbnail={videoStep.thumbnail}
                    title={videoStep.title}
                    autoPlay={false}
                    showControls={true}
                    style={styles.stepVideo}
                  />
                  
                  <View style={styles.stepInfo}>
                    <Text style={styles.stepDescription}>
                      {exercise.etapes[videoStep.stepIndex - 1] || 'Description de l\'étape'}
                    </Text>
                    <Text style={styles.stepDuration}>
                      Durée : {Math.floor(videoStep.duration / 60)}:{(videoStep.duration % 60).toString().padStart(2, '0')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Conseils généraux */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Conseils pour suivre les vidéos</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Regardez d'abord la vidéo complète avant de commencer</Text>
              <Text style={styles.tipItem}>• Adaptez le rythme à votre niveau</Text>
              <Text style={styles.tipItem}>• N'hésitez pas à mettre en pause pour bien comprendre</Text>
              <Text style={styles.tipItem}>• Écoutez votre corps et respectez vos limites</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.background,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: Colors.agpBlue,
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.textSecondary,
  },
  tabButtonTextActive: {
    color: Colors.textLight,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  videoSection: {
    marginBottom: 24,
  },
  mainVideo: {
    marginBottom: 16,
  },
  videoInfo: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  videoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  stepsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  stepVideoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.agpBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
  },
  stepVideo: {
    marginBottom: 12,
  },
  stepInfo: {
    gap: 8,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
  },
  stepDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.agpBlue,
  },
  tipsSection: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
  },
});
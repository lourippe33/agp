import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Zap, Target, Play, Users } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import exercicesData from '@/data/exercices_sport.json';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const exercice = exercicesData.exercices.find(ex => ex.id === parseInt(id as string));

  if (!exercice) {
    return (
      <View style={styles.container}>
        <Text>Exercice non trouvé</Text>
      </View>
    );
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
            <View style={[styles.typeBadge, { backgroundColor: Colors.sport }]}>
              <Text style={styles.typeText}>{exercice.type}</Text>
            </View>
          </View>
        </View>

        {/* Infos rapides */}
        <View style={styles.quickInfo}>
          <View style={styles.infoItem}>
            <Clock size={20} color={Colors.sport} />
            <Text style={styles.infoText}>{exercice.duree} min</Text>
          </View>
          <View style={styles.infoItem}>
            <Zap size={20} color={Colors.sport} />
            <Text style={styles.infoText}>{exercice.calories} kcal</Text>
          </View>
          <View style={styles.infoItem}>
            <Target size={20} color={Colors.sport} />
            <Text style={styles.infoText}>{exercice.difficulte}</Text>
          </View>
          <View style={styles.infoItem}>
            <Users size={20} color={Colors.sport} />
            <Text style={styles.infoText}>{exercice.niveau}</Text>
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
            <View key={index} style={styles.beneficeItem}>
              <Text style={styles.beneficeBullet}>✓</Text>
              <Text style={styles.beneficeText}>{benefice}</Text>
            </View>
          ))}
        </View>

        {/* Moment idéal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moment idéal</Text>
          <View style={styles.momentsContainer}>
            {exercice.momentIdeal.map((moment, index) => (
              <View key={index} style={styles.momentChip}>
                <Text style={styles.momentText}>{moment}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Fréquence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fréquence recommandée</Text>
          <View style={styles.frequenceCard}>
            <Text style={styles.frequenceText}>{exercice.frequence}</Text>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {exercice.tags.map((tag, index) => (
              <View key={index} style={styles.tagChip}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bouton d'action */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.startButton}>
            <Play size={20} color={Colors.textLight} />
            <Text style={styles.startButtonText}>Commencer l'exercice</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textLight,
    textTransform: 'capitalize',
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
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
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
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
    backgroundColor: Colors.sport,
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
  beneficeItem: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  beneficeBullet: {
    fontSize: 16,
    color: Colors.success,
    fontFamily: 'Inter-Bold',
  },
  beneficeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 18,
  },
  momentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  momentChip: {
    backgroundColor: Colors.sport,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  momentText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textLight,
  },
  frequenceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.sport,
  },
  frequenceText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  startButton: {
    backgroundColor: Colors.sport,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
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
});
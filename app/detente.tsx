import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Heart, Clock, Filter, Chrome as Home } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import exercicesData from '@/data/exercices_detente.json';

const types = [
  { id: 'tous', label: 'Tous' },
  { id: 'respiration', label: 'Respiration' },
  { id: 'meditation', label: 'Méditation' },
  { id: 'relaxation', label: 'Relaxation' },
];

export default function DetenteScreen() {
  const [selectedType, setSelectedType] = useState('tous');

  const filteredExercices = selectedType === 'tous' 
    ? exercicesData.exercices
    : exercicesData.exercices.filter(ex => ex.type === selectedType);

  const handleExercisePress = (exerciseId: number) => {
    router.push(`/detente/${exerciseId}` as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.relaxation, '#FFB3BA']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Exercices de Détente</Text>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => router.push('/(tabs)/home')}
          >
            <Home size={24} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Relaxation et gestion du stress
        </Text>
      </LinearGradient>

      {/* Filtres par type */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            {types.map((type) => {
              const isSelected = selectedType === type.id;
              
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.filterButton,
                    isSelected && { backgroundColor: Colors.relaxation }
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Filter size={16} color={isSelected ? Colors.textLight : Colors.relaxation} />
                  <Text style={[
                    styles.filterText,
                    isSelected && { color: Colors.textLight }
                  ]}>
                    {type.label}
        <TouchableOpacity 
          style={styles.homeButton}
              );
            })}
          <Text style={styles.homeButtonText}>Accueil</Text>
        </ScrollView>
      </View>

      {/* Liste des exercices */}
      <ScrollView style={styles.content}>
        <View style={styles.exercicesGrid}>
          {filteredExercices.map((exercice) => (
            <TouchableOpacity
              key={exercice.id}
              style={styles.exerciceCard}
              onPress={() => handleExercisePress(exercice.id)}
            >
              <Image source={{ uri: exercice.image }} style={styles.exerciceImage} />
              <View style={styles.exerciceContent}>
                <Text style={styles.exerciceTitle}>{exercice.titre}</Text>
                <View style={styles.exerciceInfo}>
                  <View style={styles.infoItem}>
                    <Clock size={14} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>{exercice.duree} min</Text>
                  </View>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{exercice.type}</Text>
                  </View>
                </View>
                <Text style={styles.description} numberOfLines={2}>
                  {exercice.description}
                </Text>
                <View style={styles.tagsContainer}>
                  {exercice.tags.slice(0, 2).map((tag, index) => (
                    <Text key={index} style={styles.tag}>#{tag}</Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  homeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  homeButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
  },
  filtersContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    gap: 6,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.relaxation,
  },
  typeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textLight,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
});
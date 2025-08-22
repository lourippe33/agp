import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Clock, Search, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

// Données d'exemple pour les exercices de détente
const exercicesData = [
  {
    id: 1,
    titre: "Cohérence Cardiaque Relax 4-6",
    type: "respiration",
    duree: 5,
    difficulte: "Très facile",
    tags: ["respiration", "relaxation", "coherence-cardiaque"],
    image: "https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?w=800&q=80",
    description: "Un exercice de respiration simple pour apaiser le corps et calmer l'esprit."
  },
  {
    id: 2,
    titre: "Méditation des 5 Sens",
    type: "meditation",
    duree: 5,
    difficulte: "Très facile",
    tags: ["meditation", "sens", "present"],
    image: "https://images.pexels.com/photos/3593811167562-9cef47bfc4d7/pexels-photo-3593811167562-9cef47bfc4d7.jpeg?w=800&q=80",
    description: "Exercice de pleine conscience qui utilise les 5 sens pour revenir au moment présent."
  },
  {
    id: 3,
    titre: "Respiration du Sourire",
    type: "respiration",
    duree: 2,
    difficulte: "Très facile",
    tags: ["respiration", "joie", "simple"],
    image: "https://images.pexels.com/photos/3544367567-0f2fcb009e0b/pexels-photo-3544367567-0f2fcb009e0b.jpeg?w=800&q=80",
    description: "Exercice très doux qui combine respiration et sourire pour libérer des endorphines."
  }
];

const types = [
  { id: 'tous', label: 'Tous' },
  { id: 'respiration', label: 'Respiration' },
  { id: 'meditation', label: 'Méditation' },
  { id: 'relaxation', label: 'Relaxation' },
];

export default function DetenteScreen() {
  const [selectedType, setSelectedType] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredExercices = exercicesData.filter(exercice => {
    const matchesType = selectedType === 'tous' || exercice.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      exercice.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercice.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.relaxation, '#FFB3BA']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Exercices de Détente</Text>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Search size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Relaxation et gestion du stress
        </Text>
        
        {/* Barre de recherche */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un exercice..."
                placeholderTextColor={Colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Filtres par type */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
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
                <Text style={[
                  styles.filterText,
                  isSelected && { color: Colors.textLight }
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Liste des exercices */}
      <ScrollView style={styles.content}>
        {searchQuery.length > 0 && (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsText}>
              {filteredExercices.length} résultat{filteredExercices.length > 1 ? 's' : ''} pour "{searchQuery}"
            </Text>
          </View>
        )}
        
        <View style={styles.exercicesGrid}>
          {filteredExercices.map((exercice) => (
            <TouchableOpacity
              key={exercice.id}
              style={styles.exerciceCard}
              onPress={() => router.push(`/(tabs)/detente/${exercice.id}` as any)}
            >
              <Image source={{ uri: exercice.image }} style={styles.exerciceImage} />
              <View style={styles.exerciceContent}>
                <Text style={styles.exerciceTitle}>{exercice.titre}</Text>
                <View style={styles.exerciceInfo}>
                  <View style={styles.infoItem}>
                    <Clock size={14} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>{exercice.duree} min</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Heart size={14} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>{exercice.type}</Text>
                  </View>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{exercice.type}</Text>
                </View>
                <Text style={styles.description} numberOfLines={2}>
                  {exercice.description}
                </Text>
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
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
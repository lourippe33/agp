import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dumbbell, Clock, Zap, Search, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

// Données d'exemple pour les exercices
const exercicesData = [
  {
    id: 1,
    titre: "Marche Active Débutant",
    niveau: "debutant",
    duree: 15,
    calories: 80,
    difficulte: "Très facile",
    tags: ["marche", "cardio", "extérieur"],
    image: "https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg?w=800&q=80"
  },
  {
    id: 2,
    titre: "Cardio Brûle-Graisse",
    niveau: "intermediaire",
    duree: 20,
    calories: 180,
    difficulte: "Moyen",
    tags: ["cardio", "perte-de-poids", "brule-graisse"],
    image: "https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?w=800&q=80"
  },
  {
    id: 3,
    titre: "Yoga Dynamique",
    niveau: "intermediaire",
    duree: 30,
    calories: 100,
    difficulte: "Moyen",
    tags: ["yoga", "souplesse", "zen"],
    image: "https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?w=800&q=80"
  }
];

const niveaux = [
  { id: 'tous', label: 'Tous' },
  { id: 'debutant', label: 'Débutant' },
  { id: 'intermediaire', label: 'Intermédiaire' },
  { id: 'avance', label: 'Avancé' },
];

export default function SportScreen() {
  const [selectedNiveau, setSelectedNiveau] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredExercices = exercicesData.filter(exercice => {
    const matchesNiveau = selectedNiveau === 'tous' || exercice.niveau === selectedNiveau;
    const matchesSearch = searchQuery === '' || 
      exercice.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercice.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesNiveau && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF5722', '#FF8A65']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Activités Sportives</Text>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Search size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Exercices adaptés à votre niveau
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

      {/* Filtres par niveau */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {niveaux.map((niveau) => {
            const isSelected = selectedNiveau === niveau.id;
            
            return (
              <TouchableOpacity
                key={niveau.id}
                style={[
                  styles.filterButton,
                  isSelected && { backgroundColor: Colors.sport }
                ]}
                onPress={() => setSelectedNiveau(niveau.id)}
              >
                <Text style={[
                  styles.filterText,
                  isSelected && { color: Colors.textLight }
                ]}>
                  {niveau.label}
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
              onPress={() => router.push(`/(tabs)/sport/${exercice.id}` as any)}
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
                    <Zap size={14} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>{exercice.calories} kcal</Text>
                  </View>
                </View>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{exercice.difficulte}</Text>
                </View>
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
    height: 180,
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
    gap: 16,
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
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.sport,
    marginBottom: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textLight,
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
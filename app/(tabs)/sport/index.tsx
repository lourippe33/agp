import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dumbbell, Clock, Zap, Search, X, Users, Heart, Target, Flame } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import exercicesData from '@/data/exercices.json';


const niveaux = [
  { id: 'tous', label: 'Tous', icon: Dumbbell, color: Colors.sport },
  { id: 'debutant', label: 'Débutant', icon: Users, color: '#4CAF50' },
  { id: 'intermediaire', label: 'Intermédiaire', icon: Heart, color: '#FF9800' },
  { id: 'avance', label: 'Avancé', icon: Flame, color: '#F44336' },
];

export default function SportScreen() {
  const [selectedNiveau, setSelectedNiveau] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredExercices = exercicesData.exercices.filter(exercice => {
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
        {/* Bouton "Tous" centré */}
        <View style={styles.allFilterContainer}>
          <TouchableOpacity
            style={[
              styles.allFilterButton,
              selectedNiveau === 'tous' && { backgroundColor: Colors.sport }
            ]}
            onPress={() => setSelectedNiveau('tous')}
          >
            <Dumbbell 
              size={20} 
              color={selectedNiveau === 'tous' ? Colors.textLight : Colors.sport} 
            />
            <Text style={[
              styles.allFilterText,
              selectedNiveau === 'tous' && { color: Colors.textLight }
            ]}>
              Tous
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Niveaux en ligne */}
        <View style={styles.niveauxGrid}>
          {niveaux.filter(n => n.id !== 'tous').map((niveau) => {
            const IconComponent = niveau.icon;
            const isSelected = selectedNiveau === niveau.id;
            
            return (
              <TouchableOpacity
                key={niveau.id}
                style={[
                  styles.niveauButton,
                  isSelected && { backgroundColor: niveau.color }
                ]}
                onPress={() => setSelectedNiveau(niveau.id)}
              >
                <IconComponent 
                  size={16} 
                  color={isSelected ? Colors.textLight : niveau.color} 
                />
                <Text style={[
                  styles.niveauText,
                  isSelected && { color: Colors.textLight }
                ]}>
                  {niveau.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  allFilterContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  allFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.background,
    gap: 6,
    minWidth: 100,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  allFilterText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  niveauxGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  niveauButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.background,
    gap: 4,
    flex: 1,
    maxWidth: 80,
    justifyContent: 'center',
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  niveauText: {
    fontSize: 10,
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
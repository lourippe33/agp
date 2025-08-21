import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Dumbbell, Clock, Zap, Filter, Chrome as Home, Search, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import exercicesData from '@/data/exercices_sport.json';

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
  const { returnTo } = useLocalSearchParams();

  const filteredExercices = exercicesData.exercices.filter(exercice => {
    const matchesNiveau = selectedNiveau === 'tous' || exercice.niveau === selectedNiveau;
    const matchesSearch = searchQuery === '' || 
      exercice.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercice.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      exercice.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNiveau && matchesSearch;
  });

  const handleExercisePress = (exerciseId: number) => {
    if (returnTo) {
      // Si on vient du programme, retourner au programme après sélection
      router.push(returnTo as string);
    } else {
      router.push(`/sport/${exerciseId}` as any);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient
          colors={['#FF5722', '#FF8A65']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => returnTo ? router.push(returnTo as string) : router.back()}
            >
              <ArrowLeft size={24} color={Colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Activités Sportives</Text>
            <TouchableOpacity 
              style={styles.homeButton}
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
                  placeholder="Rechercher un exercice, tag..."
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
        {/* Bouton Tous centré */}
        <View style={styles.tousButtonContainer}>
          <TouchableOpacity
            style={[
              styles.tousButton,
              selectedNiveau === 'tous' && { backgroundColor: Colors.sport }
            ]}
            onPress={() => setSelectedNiveau('tous')}
          >
            <Filter size={16} color={selectedNiveau === 'tous' ? Colors.textLight : Colors.sport} />
            <Text style={[
              styles.tousButtonText,
              selectedNiveau === 'tous' && { color: Colors.textLight }
            ]}>
              Tous
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Niveaux en dessous */}
        <View style={styles.niveauxContainer}>
          {niveaux.filter(n => n.id !== 'tous').map((niveau) => {
            const isSelected = selectedNiveau === niveau.id;
            
            return (
              <TouchableOpacity
                key={niveau.id}
                style={[
                  styles.niveauButton,
                  isSelected && { backgroundColor: Colors.sport }
                ]}
                onPress={() => setSelectedNiveau(niveau.id)}
              >
                <Text style={[
                  styles.niveauButtonText,
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
        {/* Résultats de recherche */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    minWidth: 40,
  },
  homeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    minWidth: 60,
  },
  homeButtonText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  filtersContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tousButtonContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  tousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    gap: 6,
  },
  tousButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  niveauxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  niveauButton: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    marginHorizontal: 4,
  },
  niveauButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    textAlign: 'center',
  },
  searchContainer: {
    marginTop: 16,
    paddingHorizontal: 0,
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
  searchResults: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  searchResultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
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
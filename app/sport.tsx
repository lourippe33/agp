import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ScrollView, Text, TextInput } from 'react-native';
import { Dumbbell, ArrowLeft, Search, Filter, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Exercise } from '@/types/Exercise';
import { Colors } from '@/constants/Colors';
import MomentHeader from '@/components/MomentHeader';
import SportMenuGrid from '@/components/SportMenuGrid';
import ExerciseModal from '@/components/ExerciseModal';
import PersistentTabBar from '@/components/PersistentTabBar';
import sportsData from '@/data/exercices_sport.json';

export default function SportScreen() {
  const params = useLocalSearchParams();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    duration: '',
    intensity: '',
    type: ''
  });
  const [filteredExercises, setFilteredExercises] = useState(sportsData.exercices);

  // Effet pour ouvrir automatiquement la modal si des paramètres sont fournis
  useEffect(() => {
    if (params.exerciseId && params.openModal === 'true') {
      const exerciseId = parseInt(params.exerciseId as string);
      const exercise = sportsData.exercices.find(ex => ex.id === exerciseId);
      
      console.log(`🎯 Recherche exercice sport ID: ${exerciseId}`);
      console.log(`💪 Exercice trouvé:`, exercise?.titre);
      
      if (exercise) {
        setSelectedExercise(exercise);
        setModalVisible(true);
      }
    }
  }, [params.exerciseId, params.openModal]);

  // Effet pour filtrer les exercices
  useEffect(() => {
    let filtered = [...sportsData.exercices];

    // Filtrage par recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(exercise =>
        exercise.titre.toLowerCase().includes(query) ||
        exercise.tags.some(tag => tag.toLowerCase().includes(query)) ||
        exercise.description.toLowerCase().includes(query) ||
        exercise.type.toLowerCase().includes(query)
      );
    }

    // Filtrage par durée
    if (selectedFilters.duration) {
      filtered = filtered.filter(exercise => {
        switch (selectedFilters.duration) {
          case 'court': return exercise.duree <= 15;
          case 'moyen': return exercise.duree > 15 && exercise.duree <= 30;
          case 'long': return exercise.duree > 30;
          default: return true;
        }
      });
    }

    // Filtrage par intensité
    if (selectedFilters.intensity) {
      filtered = filtered.filter(exercise => {
        const difficultyMap: { [key: string]: string } = {
          'facile': 'Très facile|Facile',
          'moyen': 'Moyen',
          'difficile': 'Difficile|Très difficile'
        };
        const pattern = difficultyMap[selectedFilters.intensity];
        return pattern && new RegExp(pattern).test(exercise.difficulte);
      });
    }

    // Filtrage par type
    if (selectedFilters.type) {
      filtered = filtered.filter(exercise =>
        exercise.tags.some(tag => tag.toLowerCase().includes(selectedFilters.type.toLowerCase())) ||
        exercise.type.toLowerCase().includes(selectedFilters.type.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  }, [searchQuery, selectedFilters]);
  const handleExerciseSelect = (exerciseId: number) => {
    const exercise = sportsData.exercices.find(ex => ex.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedExercise(null);
  };

  const goBack = () => {
    router.back();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearFilters = () => {
    setSelectedFilters({
      duration: '',
      intensity: '',
      type: ''
    });
  };

  const clearAll = () => {
    clearSearch();
    clearFilters();
  };

  const FilterButton = ({ 
    label, 
    value, 
    isSelected, 
    onPress 
  }: {
    label: string;
    value: string;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isSelected && styles.filterButtonSelected
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.filterButtonText,
        isSelected && styles.filterButtonTextSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={Colors.textLight} />
        </TouchableOpacity>
        <MomentHeader
          moment="sport"
          title="Activités Sportives"
          subtitle="Bougez selon votre niveau pour perdre du poids"
          icon={<Dumbbell size={32} color={Colors.textLight} />}
        />
      </View>
      
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un exercice..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtres */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Filter size={16} color={Colors.agpBlue} />
            <Text style={styles.filterTitle}>Filtres</Text>
            {(selectedFilters.duration || selectedFilters.intensity || selectedFilters.type) && (
              <TouchableOpacity onPress={clearFilters} style={styles.clearFiltersButton}>
                <Text style={styles.clearFiltersText}>Effacer</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Durée */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupTitle}>Durée :</Text>
            <View style={styles.filterButtons}>
              <FilterButton
                label="Court (≤15min)"
                value="court"
                isSelected={selectedFilters.duration === 'court'}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  duration: prev.duration === 'court' ? '' : 'court'
                }))}
              />
              <FilterButton
                label="Moyen (15-30min)"
                value="moyen"
                isSelected={selectedFilters.duration === 'moyen'}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  duration: prev.duration === 'moyen' ? '' : 'moyen'
                }))}
              />
              <FilterButton
                label="Long (>30min)"
                value="long"
                isSelected={selectedFilters.duration === 'long'}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  duration: prev.duration === 'long' ? '' : 'long'
                }))}
              />
            </View>
          </View>

          {/* Intensité */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupTitle}>Intensité :</Text>
            <View style={styles.filterButtons}>
              <FilterButton
                label="Facile"
                value="facile"
                isSelected={selectedFilters.intensity === 'facile'}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  intensity: prev.intensity === 'facile' ? '' : 'facile'
                }))}
              />
              <FilterButton
                label="Moyen"
                value="moyen"
                isSelected={selectedFilters.intensity === 'moyen'}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  intensity: prev.intensity === 'moyen' ? '' : 'moyen'
                }))}
              />
              <FilterButton
                label="Difficile"
                value="difficile"
                isSelected={selectedFilters.intensity === 'difficile'}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  intensity: prev.intensity === 'difficile' ? '' : 'difficile'
                }))}
              />
            </View>
          </View>

          {/* Type */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupTitle}>Type :</Text>
            <View style={styles.filterButtons}>
              <FilterButton
                label="Cardio"
                value="cardio"
                isSelected={selectedFilters.type === 'cardio'}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  type: prev.type === 'cardio' ? '' : 'cardio'
                }))}
              />
              <FilterButton
                label="Yoga"
                value="yoga"
                isSelected={selectedFilters.type === 'yoga'}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  type: prev.type === 'yoga' ? '' : 'yoga'
                }))}
              />
              <FilterButton
                label="HIIT"
                value="hiit"
                isSelected={selectedFilters.type === 'hiit'}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  type: prev.type === 'hiit' ? '' : 'hiit'
                }))}
              />
              <FilterButton
                label="Danse"
                value="danse"
                isSelected={selectedFilters.type === 'danse'}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  type: prev.type === 'danse' ? '' : 'danse'
                }))}
              />
            </View>
          </View>
        </View>

        {/* Résultats */}
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {filteredExercises.length} exercice{filteredExercises.length > 1 ? 's' : ''} trouvé{filteredExercises.length > 1 ? 's' : ''}
          </Text>
          {(searchQuery || selectedFilters.duration || selectedFilters.intensity || selectedFilters.type) && (
            <TouchableOpacity onPress={clearAll} style={styles.clearAllButton}>
              <Text style={styles.clearAllText}>Tout effacer</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView 
          style={[
            styles.scrollContainer,
            Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
          ]}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
        >
          <SportMenuGrid 
            onExerciseSelect={handleExerciseSelect} 
            filteredExercises={filteredExercises}
          />
        </ScrollView>
      </View>

      <ExerciseModal
        exercise={selectedExercise}
        visible={modalVisible}
        onClose={handleCloseModal}
      />

      <PersistentTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingBottom: 70, // Espace pour la tab bar
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
  },
  clearFiltersButton: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearFiltersText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpBlue,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterGroupTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterButtonSelected: {
    backgroundColor: Colors.agpBlue,
    borderColor: Colors.agpBlue,
  },
  filterButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  filterButtonTextSelected: {
    color: Colors.textLight,
  },
  resultsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  clearAllButton: {
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearAllText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpGreen,
  },
});
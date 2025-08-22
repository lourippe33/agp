import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sun, Utensils, Coffee, Moon, Search, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import recettesData from '@/data/recettes.json';


const moments = [
  { id: 'tous', label: 'Tous', icon: Utensils, color: Colors.agpBlue },
  { id: 'matin', label: 'Matin', icon: Sun, color: Colors.morning },
  { id: 'midi', label: 'Midi', icon: Utensils, color: Colors.agpGreen },
  { id: 'gouter', label: 'Goûter', icon: Coffee, color: Colors.snack },
  { id: 'soir', label: 'Soir', icon: Moon, color: Colors.agpBlue },
];

export default function RecettesScreen() {
  const [selectedMoment, setSelectedMoment] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredRecettes = recettesData.recettes.filter(recette => {
    const matchesMoment = selectedMoment === 'tous' || recette.moment === selectedMoment;
    const matchesSearch = searchQuery === '' || 
      recette.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recette.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMoment && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpGreen, Colors.agpBlue]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Recettes AGP</Text>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Search size={24} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Alimentation adaptée à votre chronobiologie
        </Text>
        
        {/* Barre de recherche */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une recette..."
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

      {/* Filtres par moment */}
      <View style={styles.filtersContainer}>
        {/* Bouton "Tous" centré */}
        <View style={styles.allFilterContainer}>
          <TouchableOpacity
            style={[
              styles.allFilterButton,
              selectedMoment === 'tous' && { backgroundColor: Colors.agpBlue }
            ]}
            onPress={() => setSelectedMoment('tous')}
          >
            <Utensils 
              size={20} 
              color={selectedMoment === 'tous' ? Colors.textLight : Colors.agpBlue} 
            />
            <Text style={[
              styles.allFilterText,
              selectedMoment === 'tous' && { color: Colors.textLight }
            ]}>
              Tous
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Moments de la journée en grille */}
        <View style={styles.momentsGrid}>
          {moments.filter(m => m.id !== 'tous').map((moment) => {
            const IconComponent = moment.icon;
            const isSelected = selectedMoment === moment.id;
            
            return (
              <TouchableOpacity
                key={moment.id}
                style={[
                  styles.momentButton,
                  isSelected && { backgroundColor: moment.color }
                ]}
                onPress={() => setSelectedMoment(moment.id)}
              >
                <IconComponent 
                  size={18} 
                  color={isSelected ? Colors.textLight : moment.color} 
                />
                <Text style={[
                  styles.momentText,
                  isSelected && { color: Colors.textLight }
                ]}>
                  {moment.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Liste des recettes */}
      <ScrollView style={styles.content}>
        {searchQuery.length > 0 && (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsText}>
              {filteredRecettes.length} résultat{filteredRecettes.length > 1 ? 's' : ''} pour "{searchQuery}"
            </Text>
          </View>
        )}
        
        <View style={styles.recipesGrid}>
          {filteredRecettes.map((recette) => (
            <TouchableOpacity
              key={recette.id}
              style={styles.recipeCard}
              onPress={() => router.push(`/(tabs)/recettes/${recette.id}` as any)}
            >
              <Image source={{ uri: recette.image }} style={styles.recipeImage} />
              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle}>{recette.titre}</Text>
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeTime}>{recette.tempsPreparation} min</Text>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>{recette.difficulte}</Text>
                  </View>
                </View>
                <View style={styles.tagsContainer}>
                  {recette.tags.slice(0, 2).map((tag, index) => (
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
  momentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  momentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.background,
    gap: 6,
    minWidth: '22%',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  momentText: {
    fontSize: 11,
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
  recipesGrid: {
    gap: 16,
  },
  recipeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.border,
  },
  recipeContent: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recipeTime: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.agpGreen,
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
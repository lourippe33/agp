import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sun, Utensils, Coffee, Moon, Search, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

// Données d'exemple pour les recettes
const recettesData = [
  {
    id: 1,
    titre: "Porridge aux fruits rouges",
    moment: "matin",
    tempsPreparation: 10,
    difficulte: "Très facile",
    tags: ["avoine", "fruits", "petit-déjeuner"],
    image: "https://images.pexels.com/photos/1172019/pexels-photo-1172019.jpeg?w=800&q=80"
  },
  {
    id: 2,
    titre: "Poke bowl saumon-avocat",
    moment: "midi",
    tempsPreparation: 15,
    difficulte: "Facile",
    tags: ["poke", "saumon", "avocat"],
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=800&q=80"
  },
  {
    id: 3,
    titre: "Energy balls dattes-amandes",
    moment: "gouter",
    tempsPreparation: 15,
    difficulte: "Facile",
    tags: ["energy-balls", "dattes", "amandes"],
    image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=800&q=80"
  }
];

const moments = [
  { id: 'matin', label: 'Matin', icon: Sun, color: Colors.morning },
  { id: 'midi', label: 'Midi', icon: Utensils, color: Colors.agpGreen },
  { id: 'gouter', label: 'Goûter', icon: Coffee, color: Colors.snack },
  { id: 'soir', label: 'Soir', icon: Moon, color: Colors.agpBlue },
];

export default function RecettesScreen() {
  const [selectedMoment, setSelectedMoment] = useState('matin');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredRecettes = recettesData.filter(recette => {
    const matchesMoment = recette.moment === selectedMoment;
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
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {moments.map((moment) => {
            const IconComponent = moment.icon;
            const isSelected = selectedMoment === moment.id;
            
            return (
              <TouchableOpacity
                key={moment.id}
                style={[
                  styles.filterButton,
                  isSelected && { backgroundColor: moment.color }
                ]}
                onPress={() => setSelectedMoment(moment.id)}
              >
                <IconComponent 
                  size={20} 
                  color={isSelected ? Colors.textLight : moment.color} 
                />
                <Text style={[
                  styles.filterText,
                  isSelected && { color: Colors.textLight }
                ]}>
                  {moment.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.background,
    gap: 6,
    marginRight: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 12,
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
import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Sun, Utensils, Coffee, Moon, Search, Chrome as Home } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, getMomentColor } from '@/constants/Colors';
import recettesData from '@/data/recettes_agp.json';

const moments = [
  { id: 'matin', label: 'Matin', icon: Sun, color: Colors.morning },
  { id: 'midi', label: 'Midi', icon: Utensils, color: Colors.agpGreen },
  { id: 'gouter', label: 'Goûter', icon: Coffee, color: Colors.snack },
  { id: 'soir', label: 'Soir', icon: Moon, color: Colors.agpBlue },
];

export default function RecettesScreen() {
  const [selectedMoment, setSelectedMoment] = useState('matin');
  const { moment, returnTo } = useLocalSearchParams();

  // Si on arrive avec un moment spécifique, le sélectionner
  useEffect(() => {
    if (moment && typeof moment === 'string') {
      setSelectedMoment(moment);
    }
  }, [moment]);

  const filteredRecettes = recettesData.recettes.filter(
    recette => recette.moment === selectedMoment
  );

  const handleRecipePress = (recipeId: number) => {
    if (returnTo) {
      // Si on vient du programme, retourner au programme après sélection
      // Ici on pourrait sauvegarder la sélection et retourner
      router.push(returnTo as string);
    } else {
      router.push(`/recettes/${recipeId}` as any);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpGreen, Colors.agpBlue]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => returnTo ? router.push(returnTo as string) : router.back()}
          >
            <ArrowLeft size={24} color={Colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recettes AGP</Text>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => router.push('/(tabs)/home')}
          >
            <Home size={24} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Alimentation adaptée à votre chronobiologie
        </Text>
      </LinearGradient>

      {/* Filtres par moment */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
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
          </View>
        </ScrollView>
      </View>

      {/* Liste des recettes */}
      <ScrollView style={styles.content}>
        <View style={styles.recipesGrid}>
          {filteredRecettes.map((recette) => (
            <TouchableOpacity
              key={recette.id}
              style={styles.recipeCard}
              onPress={() => handleRecipePress(recette.id)}
            >
              <Image source={{ uri: recette.image }} style={styles.recipeImage} />
              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle}>{recette.titre}</Text>
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeTime}>{recette.tempsPreparation} min</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: getMomentColor(recette.moment) }]}>
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
  backButton: {
    padding: 8,
    minWidth: 40,
  },
  searchButton: {
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
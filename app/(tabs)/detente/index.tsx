import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Clock, Search, X, Wind, Sparkles, Brain } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import detenteData from '@/data/detente.json';


const types = [
  { id: 'tous', label: 'Tous', icon: Heart, color: Colors.relaxation },
  { id: 'respiration', label: 'Respiration', icon: Wind, color: '#4FC3F7' },
  { id: 'meditation', label: 'Méditation', icon: Brain, color: '#9C27B0' },
  { id: 'relaxation', label: 'Relaxation', icon: Sparkles, color: '#FF9800' },
];

export default function DetenteScreen() {
  const [selectedType, setSelectedType] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredExercices = detenteData.exercices.filter(exercice => {
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
        {/* Bouton "Tous" centré */}
        <View style={styles.allFilterContainer}>
          <TouchableOpacity
            style={[
              styles.allFilterButton,
              selectedType === 'tous' && { backgroundColor: Colors.relaxation }
            ]}
            onPress={() => setSelectedType('tous')}
          >
            <Heart 
              size={20} 
              color={selectedType === 'tous' ? Colors.textLight : Colors.relaxation} 
            />
            <Text style={[
              styles.allFilterText,
              selectedType === 'tous' && { color: Colors.textLight }
            ]}>
              Tous
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Types en ligne */}
        <View style={styles.typesGrid}>
          {types.filter(t => t.id !== 'tous').map((type) => {
            const IconComponent = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  isSelected && { backgroundColor: type.color }
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <IconComponent 
                  size={16} 
                  color={isSelected ? Colors.textLight : type.color} 
                />
                <Text style={[
                  styles.typeText,
                  isSelected && { color: Colors.textLight }
                ]}>
                  {type.label}
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
  allFilterContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  allFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  typesGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  typeButton: {
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
  typeText: {
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
  typeBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textLight,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import { X, RefreshCw, Clock, Utensils, Dumbbell, Heart } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

// Import des données pour récupérer les bonnes images
import recipesData from '@/data/recettes_agp.json';
import huelRecipesData from '@/data/recettes_huel_matin.json';
import exercisesData from '@/data/exercices_detente.json';
import sportsData from '@/data/exercices_sport.json';

interface Choice {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  difficulty?: string;
  originalId?: number; // ID original dans les données
}

interface ProgramChoiceModalProps {
  visible: boolean;
  onClose: () => void;
  activityType: 'breakfast' | 'sport' | 'relaxation' | 'lunch' | 'snack' | 'dinner';
  currentChoice: string;
  onChoiceSelect: (choice: Choice) => void;
}

// Fonction pour générer les choix à partir des données réelles
const generateChoices = (activityType: string): Choice[] => {
  let choices: Choice[] = [];
  
  switch (activityType) {
    case 'breakfast':
      // Recettes du matin
      choices = recipesData.recettes
        .filter(recipe => recipe.moment === 'matin')
        .map(recipe => ({
          id: `recipe-${recipe.id}`,
          title: recipe.titre,
          description: recipe.tags.join(', '),
          duration: `${recipe.tempsPreparation + recipe.tempsCuisson} min`,
          image: recipe.image,
          originalId: recipe.id
        }));
      
      // Ajouter les recettes Huel si disponibles
      if (huelRecipesData && Array.isArray(huelRecipesData)) {
        const huelChoices = huelRecipesData.map(recipe => ({
          id: `huel-${recipe.id}`,
          title: recipe.titre,
          description: 'Recette Huel',
          duration: '5-10 min',
          image: recipe.image,
          originalId: recipe.id + 1000 // Offset pour les recettes Huel
        }));
        choices = [...choices, ...huelChoices];
      }
      break;
      
    case 'lunch':
      choices = recipesData.recettes
        .filter(recipe => recipe.moment === 'midi')
        .map(recipe => ({
          id: `recipe-${recipe.id}`,
          title: recipe.titre,
          description: recipe.tags.join(', '),
          duration: `${recipe.tempsPreparation + recipe.tempsCuisson} min`,
          image: recipe.image,
          originalId: recipe.id
        }));
      break;
      
    case 'snack':
      choices = recipesData.recettes
        .filter(recipe => recipe.moment === 'gouter')
        .map(recipe => ({
          id: `recipe-${recipe.id}`,
          title: recipe.titre,
          description: recipe.tags.join(', '),
          duration: `${recipe.tempsPreparation + recipe.tempsCuisson} min`,
          image: recipe.image,
          originalId: recipe.id
        }));
      break;
      
    case 'dinner':
      choices = recipesData.recettes
        .filter(recipe => recipe.moment === 'soir')
        .map(recipe => ({
          id: `recipe-${recipe.id}`,
          title: recipe.titre,
          description: recipe.tags.join(', '),
          duration: `${recipe.tempsPreparation + recipe.tempsCuisson} min`,
          image: recipe.image,
          originalId: recipe.id
        }));
      break;
      
    case 'sport':
      choices = sportsData.exercices.map(exercise => ({
        id: `sport-${exercise.id}`,
        title: exercise.titre,
        description: exercise.type,
        duration: `${exercise.duree} min`,
        difficulty: exercise.difficulte,
        image: exercise.image,
        originalId: exercise.id
      }));
      break;
      
    case 'relaxation':
      choices = exercisesData.exercices.map(exercise => ({
        id: `relaxation-${exercise.id}`,
        title: exercise.titre,
        description: exercise.type,
        duration: `${exercise.duree} min`,
        difficulty: exercise.difficulte,
        image: exercise.image,
        originalId: exercise.id
      }));
      break;
  }
  
  return choices;
};

const ACTIVITY_ICONS = {
  breakfast: Utensils,
  sport: Dumbbell,
  relaxation: Heart,
  lunch: Utensils,
  snack: Utensils,
  dinner: Utensils,
};

const ACTIVITY_TITLES = {
  breakfast: '🌅 Petit-déjeuner',
  sport: '💪 Activité Sportive',
  relaxation: '🧘 Détente',
  lunch: '🍽️ Déjeuner',
  snack: '🍪 Collation',
  dinner: '🌙 Dîner',
};

export default function ProgramChoiceModal({
  visible,
  onClose,
  activityType,
  currentChoice,
  onChoiceSelect,
}: ProgramChoiceModalProps) {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');

  // Fonction mémorisée pour éviter les re-renders
  const updateSearchQuery = useCallback((text: string) => setSearchQuery(text), []);
  
  const IconComponent = ACTIVITY_ICONS[activityType];
  const activityTitle = ACTIVITY_TITLES[activityType];

  // Générer les choix avec les bonnes images au chargement
  useEffect(() => {
    if (visible) {
      const generatedChoices = generateChoices(activityType);
      setChoices(generatedChoices);
      setSelectedChoice(null);
    }
  }, [visible, activityType]);

  // Filtrer les choix en fonction de la recherche
  const filteredChoices = useMemo(() => {
    if (!searchQuery.trim()) return choices;
    
    const query = searchQuery.toLowerCase().trim();
    return choices.filter(choice => 
      choice.title.toLowerCase().includes(query) || 
      choice.description.toLowerCase().includes(query)
    );
  }, [choices, searchQuery]);

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice);
  };

  const confirmChoice = () => {
    if (selectedChoice) {
      onChoiceSelect(selectedChoice);
      onClose();
    }
  };

  const ChoiceCard = ({ choice }: { choice: Choice }) => {
    const isSelected = selectedChoice?.id === choice.id;
    const isCurrent = currentChoice.includes(choice.title);

    return (
      <TouchableOpacity
        style={[
          styles.choiceCard,
          isSelected && styles.choiceCardSelected,
          isCurrent && styles.choiceCardCurrent
        ]}
        onPress={() => handleChoiceSelect(choice)}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: choice.image }} 
          style={styles.choiceImage}
          resizeMode="cover"
        />
        
        <View style={styles.choiceContent}>
          <View style={styles.choiceHeader}>
            <Text style={[
              styles.choiceTitle,
              isSelected && styles.choiceTitleSelected
            ]}>
              {choice.title}
            </Text>
            {isCurrent && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Actuel</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.choiceDescription}>{choice.description}</Text>
          
          <View style={styles.choiceFooter}>
            <View style={styles.durationContainer}>
              <Clock size={14} color={Colors.textSecondary} />
              <Text style={styles.durationText}>{choice.duration}</Text>
            </View>
            
            {choice.difficulty && (
              <View style={styles.difficultyContainer}>
                <Text style={styles.difficultyText}>{choice.difficulty}</Text>
              </View>
            )}
          </View>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedCheck}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <IconComponent size={24} color={Colors.agpBlue} />
            <Text style={styles.headerTitle}>{activityTitle}</Text>
          </View>
          
          <View style={styles.headerRight}>
            <RefreshCw size={20} color={Colors.agpBlue} />
          </View>
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            value={searchQuery}
           onChangeText={updateSearchQuery}
            placeholderTextColor={Colors.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <X size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Subtitle */}
        <View style={styles.subtitle}>
          <Text style={styles.subtitleText}>
            Choisissez l'option qui vous convient le mieux
          </Text>
        </View>

        {/* Choices List */}
        <ScrollView style={styles.choicesList} showsVerticalScrollIndicator={false}>
          {filteredChoices.length > 0 ? filteredChoices.map((choice) => (
            <ChoiceCard key={choice.id} choice={choice} />
          )) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Aucun résultat trouvé pour "{searchQuery}"
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Essayez avec d'autres termes ou effacez votre recherche
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedChoice && styles.confirmButtonDisabled
            ]}
            onPress={confirmChoice}
            disabled={!selectedChoice}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.confirmButtonText,
              !selectedChoice && styles.confirmButtonTextDisabled
            ]}>
              Confirmer le choix
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  headerRight: {
    padding: 8,
  },
  subtitle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.agpLightBlue,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
  clearButton: {
    padding: 4,
  },
  choicesList: {
    flex: 1,
    padding: 16,
  },
  choiceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  choiceCardSelected: {
    borderColor: Colors.agpBlue,
    backgroundColor: Colors.agpLightBlue,
  },
  choiceCardCurrent: {
    borderColor: Colors.agpGreen,
  },
  choiceImage: {
    width: '100%',
    height: 120,
  },
  choiceContent: {
    padding: 16,
  },
  choiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  choiceTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
  },
  choiceTitleSelected: {
    color: Colors.agpBlue,
  },
  currentBadge: {
    backgroundColor: Colors.agpGreen,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  currentBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  choiceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  choiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  difficultyContainer: {
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpGreen,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.agpBlue,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheck: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.textSecondary,
  },
  confirmButton: {
    flex: 2,
    backgroundColor: Colors.agpBlue,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.border,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  confirmButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
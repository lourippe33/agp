import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

// Import des données pour les choix
import recipesData from '@/data/recettes_agp.json';
import huelRecipesData from '@/data/recettes_huel_matin.json';
import exercisesData from '@/data/exercices_detente.json';
import sportsData from '@/data/exercices_sport.json';

interface ProgramChoiceModalProps {
  visible: boolean;
  onClose: () => void;
  activityType: 'breakfast' | 'sport' | 'relaxation' | 'lunch' | 'snack' | 'dinner';
  currentChoice: string;
  onChoiceSelect: (choice: { title: string; id?: number }) => void;
}

export default function ProgramChoiceModal({
  visible,
  onClose,
  activityType,
  currentChoice,
  onChoiceSelect,
}: ProgramChoiceModalProps) {
  const [choices, setChoices] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      loadChoices();
    }
  }, [visible, activityType]);

  const loadChoices = () => {
    let availableChoices: any[] = [];

    switch (activityType) {
      case 'breakfast':
        // Combiner recettes AGP matin + recettes Huel
        const agpBreakfast = recipesData.recettes
          .filter(recipe => recipe.moment === 'matin')
          .map(recipe => ({ ...recipe, source: 'agp' }));
        
        const huelBreakfast = huelRecipesData
          .map(recipe => ({ ...recipe, source: 'huel', id: recipe.id + 1000 }));
        
        availableChoices = [...agpBreakfast, ...huelBreakfast];
        break;

      case 'lunch':
        availableChoices = recipesData.recettes
          .filter(recipe => recipe.moment === 'midi')
          .map(recipe => ({ ...recipe, source: 'agp' }));
        break;

      case 'snack':
        availableChoices = recipesData.recettes
          .filter(recipe => recipe.moment === 'gouter')
          .map(recipe => ({ ...recipe, source: 'agp' }));
        break;

      case 'dinner':
        availableChoices = recipesData.recettes
          .filter(recipe => recipe.moment === 'soir')
          .map(recipe => ({ ...recipe, source: 'agp' }));
        break;

      case 'sport':
        availableChoices = sportsData.exercices
          .map(exercise => ({ ...exercise, source: 'sport' }));
        break;

      case 'relaxation':
        availableChoices = exercisesData.exercices
          .map(exercise => ({ ...exercise, source: 'relaxation' }));
        break;

      default:
        availableChoices = [];
    }

    setChoices(availableChoices);
  };

  const getModalTitle = () => {
    switch (activityType) {
      case 'breakfast': return '🌅 Choisir un petit-déjeuner';
      case 'lunch': return '☀️ Choisir un déjeuner';
      case 'snack': return '🍪 Choisir une collation';
      case 'dinner': return '🌙 Choisir un dîner';
      case 'sport': return '💪 Choisir un exercice sportif';
      case 'relaxation': return '🧘 Choisir un exercice de détente';
      default: return 'Faire un choix';
    }
  };

  const handleChoiceSelect = (choice: any) => {
    onChoiceSelect({
      title: choice.titre,
      id: choice.id
    });
    onClose();
  };

  const renderChoice = ({ item }: { item: any }) => {
    const isSelected = item.titre === currentChoice;
    
    return (
      <TouchableOpacity
        style={[
          styles.choiceCard,
          isSelected && styles.choiceCardSelected
        ]}
        onPress={() => handleChoiceSelect(item)}
        activeOpacity={0.8}
      >
        <View style={styles.choiceContent}>
          <Text style={[
            styles.choiceTitle,
            isSelected && styles.choiceTitleSelected
          ]}>
            {item.titre}
          </Text>
          
          {item.duree && (
            <Text style={styles.choiceDuration}>
              {item.duree} min
            </Text>
          )}
          
          {item.tempsPreparation && (
            <Text style={styles.choiceDuration}>
              {item.tempsPreparation + (item.tempsCuisson || 0)} min
            </Text>
          )}
          
          {item.difficulte && (
            <Text style={styles.choiceDifficulty}>
              {item.difficulte}
            </Text>
          )}
        </View>
        
        {isSelected && (
          <View style={styles.selectedIcon}>
            <Check size={20} color={Colors.textLight} />
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
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{getModalTitle()}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Sélectionnez une option pour personnaliser votre programme
          </Text>
          
          <FlatList
            data={choices}
            renderItem={renderChoice}
            keyExtractor={(item) => `${item.source}-${item.id}`}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={true}
          />
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  choiceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  choiceCardSelected: {
    backgroundColor: Colors.agpLightBlue,
    borderColor: Colors.agpBlue,
  },
  choiceContent: {
    flex: 1,
  },
  choiceTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    marginBottom: 4,
  },
  choiceTitleSelected: {
    color: Colors.agpBlue,
    fontFamily: 'Poppins-SemiBold',
  },
  choiceDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  choiceDifficulty: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.agpGreen,
  },
  selectedIcon: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
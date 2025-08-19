import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { X, Clock, Target, Utensils, Dumbbell, Heart, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export interface FilterOptions {
  moments: string[];
  durations: string[];
  levels: string[];
  types: string[];
  categories: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  contentType: 'recipes' | 'exercises' | 'all';
}

const { height } = Dimensions.get('window');

const MOMENT_OPTIONS = [
  { id: 'matin', label: 'Matin', icon: '🌅' },
  { id: 'midi', label: 'Midi', icon: '☀️' },
  { id: 'gouter', label: 'Goûter', icon: '🍪' },
  { id: 'soir', label: 'Soir', icon: '🌙' },
];

const DURATION_OPTIONS = [
  { id: '2-5', label: '2-5 min', icon: '⚡' },
  { id: '5-15', label: '5-15 min', icon: '⏰' },
  { id: '15-30', label: '15-30 min', icon: '🕐' },
  { id: '30+', label: '30+ min', icon: '⏳' },
];

const LEVEL_OPTIONS = [
  { id: 'debutant', label: 'Débutant', icon: '🌱', color: Colors.agpGreen },
  { id: 'intermediaire', label: 'Intermédiaire', icon: '🎯', color: Colors.morning },
  { id: 'avance', label: 'Avancé', icon: '🏆', color: Colors.relaxation },
];

const RECIPE_TYPES = [
  { id: 'healthy', label: 'Healthy', icon: '🥗' },
  { id: 'proteine', label: 'Protéiné', icon: '💪' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'detox', label: 'Détox', icon: '🍃' },
];

const EXERCISE_TYPES = [
  { id: 'respiration', label: 'Respiration', icon: '🫁' },
  { id: 'meditation', label: 'Méditation', icon: '🧘‍♀️' },
  { id: 'relaxation', label: 'Relaxation', icon: '😌' },
  { id: 'coherence', label: 'Cohérence', icon: '❤️' },
];

export default function FilterModal({ 
  visible, 
  onClose, 
  filters, 
  onApplyFilters, 
  contentType 
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const toggleFilter = (category: keyof FilterOptions, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearAllFilters = () => {
    setLocalFilters({
      moments: [],
      durations: [],
      levels: [],
      types: [],
      categories: [],
    });
  };

  const applyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).reduce((count, arr) => count + arr.length, 0);
  };

  const FilterSection = ({ 
    title, 
    options, 
    category, 
    icon: IconComponent 
  }: {
    title: string;
    options: any[];
    category: keyof FilterOptions;
    icon: any;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <IconComponent size={20} color={Colors.agpBlue} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.optionsGrid}>
        {options.map((option) => {
          const isSelected = localFilters[category].includes(option.id);
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
                option.color && isSelected && { backgroundColor: option.color }
              ]}
              onPress={() => toggleFilter(category, option.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionEmoji}>{option.icon}</Text>
              <Text style={[
                styles.optionText,
                isSelected && styles.optionTextSelected
              ]}>
                {option.label}
              </Text>
              {isSelected && (
                <CheckCircle size={16} color={Colors.textLight} style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

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
          
          <Text style={styles.headerTitle}>Filtres</Text>
          
          <TouchableOpacity onPress={clearAllFilters} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Effacer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={[
            styles.content,
            Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Moments */}
          <FilterSection
            title="Moments de la journée"
            options={MOMENT_OPTIONS}
            category="moments"
            icon={Clock}
          />

          {/* Durée */}
          <FilterSection
            title="Durée"
            options={DURATION_OPTIONS}
            category="durations"
            icon={Target}
          />

          {/* Niveau */}
          <FilterSection
            title="Niveau"
            options={LEVEL_OPTIONS}
            category="levels"
            icon={Target}
          />

          {/* Types spécifiques */}
          {(contentType === 'recipes' || contentType === 'all') && (
            <FilterSection
              title="Types de recettes"
              options={RECIPE_TYPES}
              category="types"
              icon={Utensils}
            />
          )}

          {(contentType === 'exercises' || contentType === 'all') && (
            <FilterSection
              title="Types d'exercices"
              options={EXERCISE_TYPES}
              category="categories"
              icon={Heart}
            />
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={applyFilters}
            activeOpacity={0.8}
          >
            <Text style={styles.applyButtonText}>
              Appliquer {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
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
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpBlue,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    position: 'relative',
  },
  optionButtonSelected: {
    backgroundColor: Colors.agpBlue,
    borderColor: Colors.agpBlue,
  },
  optionEmoji: {
    fontSize: 16,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.textLight,
  },
  checkIcon: {
    marginLeft: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  applyButton: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
});
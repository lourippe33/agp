import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { X, Camera, Droplets, Check, Plus, Clock, Heart } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { JournalEntry, MealEntry } from '@/types/Journal';
import { JournalService } from '@/services/JournalService';

interface DailyJournalModalProps {
  visible: boolean;
  onClose: () => void;
  date: string;
  onSave: (entry: JournalEntry) => void;
}

const MOOD_OPTIONS = [
  { id: 'very-good', label: 'Très bonne humeur', emoji: '😊' },
  { id: 'good', label: 'Bonne humeur', emoji: '🙂' },
  { id: 'average', label: 'Moyenne', emoji: '😐' },
  { id: 'tired', label: 'Fatigué(e)', emoji: '😕' },
  { id: 'bad', label: 'Mauvaise humeur', emoji: '😞' },
  { id: 'stressed', label: 'Stressé(e)', emoji: '😠' },
];

export default function DailyJournalModal({
  visible,
  onClose,
  date,
  onSave
}: DailyJournalModalProps) {
  const { user } = useAuth();
  const [journalEntry, setJournalEntry] = useState<JournalEntry>({
    id: '',
    userId: '',
    date: date,
    meals: [
      { id: '1', type: 'matin', consumed: false, time: '', photo: '' },
      { id: '2', type: 'midi', consumed: false, time: '', photo: '' },
      { id: '3', type: 'gouter', consumed: false, time: '', photo: '' },
      { id: '4', type: 'soir', consumed: false, time: '', photo: '' },
    ],
    waterIntake: 0,
    waterIntakeObjective: 8,
    mood: '',
  });

  useEffect(() => {
    if (visible && user) {
      loadExistingEntry();
    }
  }, [visible, date, user]);

  const loadExistingEntry = async () => {
    if (!user) return;
    
    try {
      const existingEntry = await JournalService.getJournalEntry(user.id, date);
      if (existingEntry) {
        setJournalEntry(existingEntry);
      } else {
        // Créer une nouvelle entrée
        setJournalEntry({
          id: JournalService.generateId(),
          userId: user.id,
          date: date,
          meals: [
            { id: '1', type: 'matin', consumed: false, time: '', photo: '' },
            { id: '2', type: 'midi', consumed: false, time: '', photo: '' },
            { id: '3', type: 'gouter', consumed: false, time: '', photo: '' },
            { id: '4', type: 'soir', consumed: false, time: '', photo: '' },
          ],
          waterIntake: 0,
          mood: '',
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du journal:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      await JournalService.saveJournalEntry(user.id, journalEntry);
      onSave(journalEntry);
      onClose();
      Alert.alert('✅ Journal sauvegardé', 'Votre journal a été enregistré avec succès !');
    } catch (error) {
      Alert.alert('❌ Erreur', 'Impossible de sauvegarder votre journal');
    }
  };

  // Fonctions mémorisées pour éviter les re-renders
  const updateMealTime = useCallback((mealId: string, time: string) => {
    updateMeal(mealId, { time });
  }, []);

  const updateMood = useCallback((mood: string) => {
    setJournalEntry(prev => ({ ...prev, mood }));
  }, []);

  const updateMeal = (mealId: string, updates: Partial<MealEntry>) => {
    setJournalEntry(prev => ({
      ...prev,
      meals: prev.meals.map(meal => 
        meal.id === mealId ? { ...meal, ...updates } : meal
      )
    }));
  };

  const takeMealPhoto = (mealId: string) => {
    // Simuler la prise de photo (dans une vraie app, utiliser expo-camera)
    Alert.alert(
      'Fonctionnalité photo',
      'Dans une version complète, cette fonction permettrait de prendre une photo de votre repas.',
      [
        { text: 'OK', onPress: () => {
          // Utiliser une image de placeholder pour la démo
          const placeholderImage = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&q=80';
          updateMeal(mealId, { photo: placeholderImage });
        }}
      ]
    );
  };

  const MealCard = ({ meal }: { meal: MealEntry }) => {
    const getMealTitle = (type: string) => {
      switch (type) {
        case 'matin': return '🌅 Petit-déjeuner';
        case 'midi': return '☀️ Déjeuner';
        case 'gouter': return '🍪 Collation';
        case 'soir': return '🌙 Dîner';
        default: return type;
      }
    };

    return (
      <View style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>{getMealTitle(meal.type)}</Text>
          <TouchableOpacity
            style={[
              styles.consumedButton,
              meal.consumed && styles.consumedButtonActive
            ]}
            onPress={() => updateMeal(meal.id, { consumed: !meal.consumed })}
          >
            {meal.consumed ? (
              <Check size={16} color={Colors.textLight} />
            ) : (
              <Plus size={16} color={Colors.textSecondary} />
            )}
            <Text style={[
              styles.consumedButtonText,
              meal.consumed && styles.consumedButtonTextActive
            ]}>
              {meal.consumed ? 'Repas pris' : 'Marquer comme pris'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mealContent}>
          <View style={styles.timeInput}>
            <Clock size={16} color={Colors.textSecondary} />
            <TextInput
              style={styles.timeTextInput}
              placeholder="Heure (ex: 12:30)"
              value={meal.time}
              onChangeText={(time) => updateMealTime(meal.id, time)}
            />
          </View>

          {meal.photo ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: meal.photo }} style={styles.mealPhoto} />
              <TouchableOpacity
                style={styles.changePhotoButton}
                onPress={() => takeMealPhoto(meal.id)}
              >
                <Camera size={16} color={Colors.textLight} />
                <Text style={styles.changePhotoText}>Changer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={() => takeMealPhoto(meal.id)}
            >
              <Camera size={20} color={Colors.agpBlue} />
              <Text style={styles.addPhotoText}>Ajouter une photo</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
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
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Journal du {new Date(date).toLocaleDateString('fr-FR')}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Sauvegarder</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={[
            styles.content,
            Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
          ]}
          showsVerticalScrollIndicator={true}
        >
          {/* Section Repas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🍽️ Repas de la journée</Text>
            {journalEntry.meals.map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </View>

          {/* Section Hydratation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💧 Hydratation</Text>
            <View style={styles.waterSection}>
              <Droplets size={24} color={Colors.agpBlue} />
              <View style={styles.waterLabelContainer}>
                <Text style={styles.waterLabel}>Verres d'eau bus :</Text>
                <View style={styles.waterObjectiveContainer}>
                  <View style={styles.waterObjectiveHeader}>
                    <Text style={styles.waterObjectiveLabel}>
                      Objectif : {journalEntry.waterIntakeObjective} verres
                    </Text>
                    <TouchableOpacity
                      style={styles.waterObjectiveEditButton}
                      onPress={() => setJournalEntry(prev => ({
                        ...prev,
                        waterIntakeObjective: prev.waterIntakeObjective === 8 ? 10 : 8
                      }))}
                    >
                      <Text style={styles.waterObjectiveEditText}>Changer</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.waterProgressBar}>
                    <View 
                      style={[
                        styles.waterProgressFill, 
                        { width: `${Math.min((journalEntry.waterIntake / journalEntry.waterIntakeObjective) * 100, 100)}%` }
                      ]} 
                    />
                  </View>
                </View>
              </View>
              <View style={styles.waterCounter}>
                <TouchableOpacity
                  style={styles.waterButton}
                  onPress={() => setJournalEntry(prev => ({ 
                    ...prev, 
                    waterIntake: Math.max(0, prev.waterIntake - 1) 
                  }))}
                >
                  <Text style={styles.waterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.waterCount}>{journalEntry.waterIntake}</Text>
                <TouchableOpacity
                  style={styles.waterButton}
                  onPress={() => setJournalEntry(prev => ({ 
                    ...prev, 
                    waterIntake: prev.waterIntake + 1 
                  }))}
                >
                  <Text style={styles.waterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Humeur du jour */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>😊 Humeur du jour</Text>
            <View style={styles.moodSection}>
              <Text style={styles.moodLabel}>Comment vous sentez-vous aujourd'hui ?</Text>
              <View style={styles.moodGrid}>
                {MOOD_OPTIONS.map((mood) => (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodButton,
                      journalEntry.mood === mood.id && styles.moodButtonSelected
                    ]}
                    onPress={() => updateMood(mood.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={[
                      styles.moodText,
                      journalEntry.mood === mood.id && styles.moodTextSelected
                    ]}>
                      {mood.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
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
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: Colors.agpGreen,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  consumedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  consumedButtonActive: {
    backgroundColor: Colors.agpGreen,
  },
  consumedButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textSecondary,
  },
  consumedButtonTextActive: {
    color: Colors.textLight,
  },
  mealContent: {
    gap: 12,
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  timeTextInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  addPhotoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpBlue,
  },
  photoContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mealPhoto: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  changePhotoText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textLight,
  },
  waterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  waterLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    flex: 1,
  },
  waterLabelContainer: {
    flex: 1,
  },
  waterObjectiveContainer: {
    marginTop: 8,
  },
  waterObjectiveLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary
  },
  waterObjectiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  waterObjectiveEditButton: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  waterObjectiveEditText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpBlue
  },
  waterProgressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    width: '100%',
  },
  waterProgressFill: {
    height: '100%',
    backgroundColor: Colors.agpBlue,
    borderRadius: 2,
  },
  waterCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  waterButton: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterButtonText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  waterCount: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    minWidth: 40,
    textAlign: 'center',
  },
  moodSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moodLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  moodButton: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: Colors.border,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  moodButtonSelected: {
    backgroundColor: Colors.agpLightBlue,
    borderColor: Colors.agpBlue,
    elevation: 3,
    shadowOpacity: 0.15,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  moodText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  moodTextSelected: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.agpBlue,
  },
});
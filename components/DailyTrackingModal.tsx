import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { X, Camera, Clock, Droplets, Heart, Brain, Utensils, Dumbbell } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { DailyTracking, DailyMeal, PhysicalActivity } from '@/types/Tracking';
import { TrackingService } from '@/services/TrackingService';
import { useAuth } from '@/contexts/AuthContext';

interface DailyTrackingModalProps {
  visible: boolean;
  onClose: () => void;
  date: string;
  onSave: (tracking: DailyTracking) => void;
}

const EMOTIONS = [
  { id: 'joie', label: 'Joie', emoji: '😊' },
  { id: 'stress', label: 'Stress', emoji: '😰' },
  { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
  { id: 'motivation', label: 'Motivation', emoji: '💪' },
  { id: 'frustration', label: 'Frustration', emoji: '😤' },
  { id: 'sérénité', label: 'Sérénité', emoji: '😌' },
];

const ACTIVITY_TYPES = [
  'Marche', 'Course', 'Vélo', 'Natation', 'Musculation', 
  'Yoga', 'Danse', 'Football', 'Tennis', 'Autre'
];

export default function DailyTrackingModal({ 
  visible, 
  onClose, 
  date, 
  onSave 
}: DailyTrackingModalProps) {
  const { user } = useAuth();
  const [tracking, setTracking] = useState<DailyTracking>({
    id: TrackingService.generateId(),
    date,
    meals: [
      { id: '1', moment: 'matin', respected: false, hungerBefore: 3, hungerAfter: 3, satiety: 3 },
      { id: '2', moment: 'midi', respected: false, hungerBefore: 3, hungerAfter: 3, satiety: 3 },
      { id: '3', moment: 'gouter', respected: false, hungerBefore: 3, hungerAfter: 3, satiety: 3 },
      { id: '4', moment: 'soir', respected: false, hungerBefore: 3, hungerAfter: 3, satiety: 3 },
    ],
    waterIntake: 0,
    stressLevel: 3,
    energyLevel: 3,
    sleepQuality: 3,
    waterIntakeObjective: 8,
    snackingTemptation: false,
    emotion: '',
  });

  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activityForm, setActivityForm] = useState<PhysicalActivity>({
    type: '',
    duration: 0,
    intensity: 'moyenne',
    notes: '',
  });

  useEffect(() => {
    if (visible && user) {
      loadExistingTracking();
    }
  }, [visible, date, user]);

  const loadExistingTracking = async () => {
    if (!user) return;
    
    const existingTracking = await TrackingService.getDailyTracking(user.id, date);
    if (existingTracking) {
      setTracking(existingTracking);
      if (existingTracking.physicalActivity) {
        setActivityForm(existingTracking.physicalActivity);
      }
    }
  };

  // Fonctions mémorisées pour éviter les re-renders
  const updateMealTime = useCallback((mealId: string, time: string) => {
    updateMeal(mealId, { time });
  }, []);

  const updateMealNotes = useCallback((mealId: string, notes: string) => {
    updateMeal(mealId, { notes });
  }, []);

  const updateActivityType = useCallback((type: string) => {
    setActivityForm(prev => ({ ...prev, type }));
  }, []);

  const updateActivityDuration = useCallback((text: string) => {
    setActivityForm(prev => ({ ...prev, duration: parseInt(text) || 0 }));
  }, []);

  const updateActivityNotes = useCallback((notes: string) => {
    setActivityForm(prev => ({ ...prev, notes }));
  }, []);

  const updateWeight = useCallback((text: string) => {
    setTracking(prev => ({ ...prev, weight: parseFloat(text) || undefined }));
  }, []);

  const updateTrackingNotes = useCallback((notes: string) => {
    setTracking(prev => ({ ...prev, notes }));
  }, []);

  const updateMeal = (mealId: string, updates: Partial<DailyMeal>) => {
    setTracking(prev => ({
      ...prev,
      meals: prev.meals.map(meal => 
        meal.id === mealId ? { ...meal, ...updates } : meal
      )
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    const finalTracking = {
      ...tracking,
      physicalActivity: showActivityForm && activityForm.type ? activityForm : undefined,
    };

    try {
      await TrackingService.saveDailyTracking(user.id, finalTracking);
      onSave(finalTracking);
      onClose();
      Alert.alert('✅ Suivi sauvegardé', 'Vos données ont été enregistrées avec succès !');
    } catch (error) {
      Alert.alert('❌ Erreur', 'Impossible de sauvegarder vos données');
    }
  };

  const RatingSlider = ({ 
    value, 
    onValueChange, 
    label, 
    icon: IconComponent,
    color = Colors.agpBlue 
  }: {
    value: number;
    onValueChange: (value: number) => void;
    label: string;
    icon: any;
    color?: string;
  }) => (
    <View style={styles.ratingContainer}>
      <View style={styles.ratingHeader}>
        <IconComponent size={20} color={color} />
        <Text style={styles.ratingLabel}>{label}</Text>
      </View>
      <View style={styles.ratingSlider}>
        {[1, 2, 3, 4, 5].map(rating => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingButton,
              value === rating && { backgroundColor: color }
            ]}
            onPress={() => onValueChange(rating)}
          >
            <Text style={[
              styles.ratingButtonText,
              value === rating && { color: Colors.textLight }
            ]}>
              {rating}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const MealSection = ({ meal }: { meal: DailyMeal }) => {
    const getMomentLabel = (moment: string) => {
      switch (moment) {
        case 'matin': return '🌅 Petit-déjeuner';
        case 'midi': return '☀️ Déjeuner';
        case 'gouter': return '🍪 Collation';
        case 'soir': return '🌙 Dîner';
        default: return moment;
      }
    };

    return (
      <View style={styles.mealSection}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>{getMomentLabel(meal.moment)}</Text>
          <TouchableOpacity
            style={[
              styles.respectButton,
              meal.respected && styles.respectButtonActive
            ]}
            onPress={() => updateMeal(meal.id, { respected: !meal.respected })}
          >
            <Text style={[
              styles.respectButtonText,
              meal.respected && styles.respectButtonTextActive
            ]}>
              {meal.respected ? '✅ Respecté' : '⏸️ Non respecté'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mealDetails}>
          <View style={styles.timeInput}>
            <Clock size={16} color={Colors.textSecondary} />
            <TextInput
              style={styles.timeTextInput}
              placeholder="Heure (ex: 12:30)"
              value={meal.time || ''}
              onChangeText={(time) => updateMealTime(meal.id, time)}
            />
          </View>

          <RatingSlider
            value={meal.hungerBefore}
            onValueChange={(value) => updateMeal(meal.id, { hungerBefore: value })}
            label="Faim avant"
            icon={Heart}
            color={Colors.relaxation}
          />

          <RatingSlider
            value={meal.satiety}
            onValueChange={(value) => updateMeal(meal.id, { satiety: value })}
            label="Satiété après"
            icon={Heart}
            color={Colors.agpGreen}
          />

          <TextInput
            style={styles.notesInput}
            placeholder="Notes (optionnel)"
            value={meal.notes || ''}
            onChangeText={(notes) => updateMealNotes(meal.id, notes)}
            multiline
            numberOfLines={2}
          />
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
            Suivi du {new Date(date).toLocaleDateString('fr-FR')}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Sauvegarder</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Section Repas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🍽️ Repas de la journée</Text>
            {tracking.meals.map(meal => (
              <MealSection key={meal.id} meal={meal} />
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
                  <Text style={styles.waterObjectiveLabel}>Objectif : {tracking.waterIntakeObjective} verres</Text>
                  <View style={styles.waterProgressBar}>
                    <View 
                      style={[
                        styles.waterProgressFill, 
                        { width: `${Math.min((tracking.waterIntake / tracking.waterIntakeObjective) * 100, 100)}%` }
                      ]} 
                    />
                  </View>
                </View>
              </View>
              <View style={styles.waterCounter}>
                <TouchableOpacity
                  style={styles.waterButton}
                  onPress={() => setTracking(prev => ({ 
                    ...prev, 
                    waterIntake: Math.max(0, prev.waterIntake - 1) 
                  }))}
                >
                  <Text style={styles.waterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.waterCount}>{tracking.waterIntake}</Text>
                <TouchableOpacity
                  style={styles.waterButton}
                  onPress={() => setTracking(prev => ({ 
                    ...prev, 
                    waterIntake: prev.waterIntake + 1 
                  }))}
                >
                  <Text style={styles.waterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Objectif d'eau */}
            <View style={styles.waterObjectiveSection}>
              <Text style={styles.waterObjectiveTitle}>Objectif quotidien d'eau</Text>
              <View style={styles.waterObjectiveControls}>
                <View style={styles.waterObjectiveCounter}>
                  <TouchableOpacity
                    style={styles.waterObjectiveButton}
                    onPress={() => setTracking(prev => ({ 
                      ...prev, 
                      waterIntakeObjective: Math.max(1, prev.waterIntakeObjective - 1) 
                    }))}
                  >
                    <Text style={styles.waterObjectiveButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.waterObjectiveCount}>{tracking.waterIntakeObjective}</Text>
                  <TouchableOpacity
                    style={styles.waterObjectiveButton}
                    onPress={() => setTracking(prev => ({ 
                      ...prev,
                      waterIntakeObjective: prev.waterIntakeObjective + 1
                    }))}
                  >
                    <Text style={styles.waterObjectiveButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.waterObjectiveUnit}>verres</Text>
                <Text style={styles.waterObjectiveHelp}>
                  Recommandation : 8 verres (2L) par jour
                </Text>
              </View>
            </View>
          </View>

          {/* Section État général */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧠 État général</Text>
            
            <RatingSlider
              value={tracking.stressLevel}
              onValueChange={(value) => setTracking(prev => ({ ...prev, stressLevel: value }))}
              label="Niveau de stress"
              icon={Brain}
              color={Colors.relaxation}
            />

            <RatingSlider
              value={tracking.energyLevel}
              onValueChange={(value) => setTracking(prev => ({ ...prev, energyLevel: value }))}
              label="Niveau d'énergie"
              icon={Heart}
              color={Colors.morning}
            />

            <RatingSlider
              value={tracking.sleepQuality}
              onValueChange={(value) => setTracking(prev => ({ ...prev, sleepQuality: value }))}
              label="Qualité du sommeil"
              icon={Brain}
              color={Colors.agpBlue}
            />

            <View style={styles.snackingSection}>
              <Text style={styles.snackingLabel}>Tentation de grignotage ?</Text>
              <View style={styles.snackingButtons}>
                <TouchableOpacity
                  style={[
                    styles.snackingButton,
                    !tracking.snackingTemptation && styles.snackingButtonActive
                  ]}
                  onPress={() => setTracking(prev => ({ ...prev, snackingTemptation: false }))}
                >
                  <Text style={[
                    styles.snackingButtonText,
                    !tracking.snackingTemptation && styles.snackingButtonTextActive
                  ]}>
                    Non
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.snackingButton,
                    tracking.snackingTemptation && styles.snackingButtonActive
                  ]}
                  onPress={() => setTracking(prev => ({ ...prev, snackingTemptation: true }))}
                >
                  <Text style={[
                    styles.snackingButtonText,
                    tracking.snackingTemptation && styles.snackingButtonTextActive
                  ]}>
                    Oui
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Section Émotion */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>😊 Émotion du jour</Text>
            <View style={styles.emotionsGrid}>
              {EMOTIONS.map(emotion => (
                <TouchableOpacity
                  key={emotion.id}
                  style={[
                    styles.emotionButton,
                    tracking.emotion === emotion.id && styles.emotionButtonActive
                  ]}
                  onPress={() => setTracking(prev => ({ ...prev, emotion: emotion.id }))}
                >
                  <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
                  <Text style={[
                    styles.emotionLabel,
                    tracking.emotion === emotion.id && styles.emotionLabelActive
                  ]}>
                    {emotion.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Section Activité physique */}
          <View style={styles.section}>
            <View style={styles.activityHeader}>
              <Text style={styles.sectionTitle}>🏃‍♀️ Activité physique</Text>
              <TouchableOpacity
                style={styles.toggleActivityButton}
                onPress={() => setShowActivityForm(!showActivityForm)}
              >
                <Dumbbell size={16} color={Colors.agpBlue} />
                <Text style={styles.toggleActivityText}>
                  {showActivityForm ? 'Masquer' : 'Ajouter'}
                </Text>
              </TouchableOpacity>
            </View>

            {showActivityForm && (
              <View style={styles.activityForm}>
                <View style={styles.activityTypeSection}>
                  <Text style={styles.activityLabel}>Type d'activité :</Text>
                  <View style={styles.activityTypes}>
                    {ACTIVITY_TYPES.map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.activityTypeButton,
                          activityForm.type === type && styles.activityTypeButtonActive
                        ]}
                        onPress={() => updateActivityType(type)}
                      >
                        <Text style={[
                          styles.activityTypeText,
                          activityForm.type === type && styles.activityTypeTextActive
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.durationSection}>
                  <Text style={styles.activityLabel}>Durée (minutes) :</Text>
                  <TextInput
                    style={styles.durationInput}
                    placeholder="30"
                    value={activityForm.duration.toString()}
                   onChangeText={updateActivityDuration}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.intensitySection}>
                  <Text style={styles.activityLabel}>Intensité :</Text>
                  <View style={styles.intensityButtons}>
                    {['faible', 'moyenne', 'forte'].map(intensity => (
                      <TouchableOpacity
                        key={intensity}
                        style={[
                          styles.intensityButton,
                          activityForm.intensity === intensity && styles.intensityButtonActive
                        ]}
                        onPress={() => setActivityForm(prev => ({ 
                          ...prev, 
                          intensity: intensity as 'faible' | 'moyenne' | 'forte' 
                        }))}
                      >
                        <Text style={[
                          styles.intensityButtonText,
                          activityForm.intensity === intensity && styles.intensityButtonTextActive
                        ]}>
                          {intensity}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TextInput
                  style={styles.activityNotesInput}
                  placeholder="Remarques (optionnel)"
                  value={activityForm.notes || ''}
                  onChangeText={updateActivityNotes}
                  multiline
                  numberOfLines={2}
                />
              </View>
            )}
          </View>

          {/* Poids du jour */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚖️ Poids du jour (optionnel)</Text>
            <TextInput
              style={styles.weightInput}
              placeholder="Ex: 70.5"
              value={tracking.weight?.toString() || ''}
              onChangeText={updateWeight}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Notes générales */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Notes générales</Text>
            <TextInput
              style={styles.generalNotesInput}
              placeholder="Comment s'est passée votre journée ?"
              value={tracking.notes || ''}
              onChangeText={updateTrackingNotes}
              multiline
              numberOfLines={3}
            />
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
  mealSection: {
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
  respectButton: {
    backgroundColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  respectButtonActive: {
    backgroundColor: Colors.agpGreen,
  },
  respectButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textSecondary,
  },
  respectButtonTextActive: {
    color: Colors.textLight,
  },
  mealDetails: {
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
  ratingContainer: {
    marginBottom: 8,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  ratingSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  ratingButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ratingButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textSecondary,
  },
  notesInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    textAlignVertical: 'top',
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
  waterProgressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    width: '100%',
    marginTop: 4,
  },
  waterProgressFill: {
    height: '100%',
    backgroundColor: Colors.agpBlue,
    borderRadius: 2,
  },
  waterObjectiveLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  waterObjectiveCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  waterObjectiveSection: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  waterObjectiveTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  waterObjectiveControls: {
    alignItems: 'center',
  },
  waterObjectiveUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  waterObjectiveHelp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  waterObjectiveButton: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterObjectiveButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpBlue,
  },
  waterObjectiveCount: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpBlue,
    minWidth: 20,
    textAlign: 'center',
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
  snackingSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  snackingLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    marginBottom: 12,
  },
  snackingButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  snackingButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  snackingButtonActive: {
    backgroundColor: Colors.agpGreen,
    borderColor: Colors.agpGreen,
  },
  snackingButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textSecondary,
  },
  snackingButtonTextActive: {
    color: Colors.textLight,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emotionButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emotionButtonActive: {
    borderColor: Colors.agpBlue,
    backgroundColor: Colors.agpLightBlue,
  },
  emotionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  emotionLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textSecondary,
  },
  emotionLabelActive: {
    color: Colors.agpBlue,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleActivityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  toggleActivityText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpBlue,
  },
  activityForm: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  activityTypeSection: {
    gap: 8,
  },
  activityLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  activityTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityTypeButton: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activityTypeButtonActive: {
    backgroundColor: Colors.agpBlue,
    borderColor: Colors.agpBlue,
  },
  activityTypeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textSecondary,
  },
  activityTypeTextActive: {
    color: Colors.textLight,
  },
  durationSection: {
    gap: 8,
  },
  durationInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
  intensitySection: {
    gap: 8,
  },
  intensityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  intensityButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  intensityButtonActive: {
    backgroundColor: Colors.agpGreen,
    borderColor: Colors.agpGreen,
  },
  intensityButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textSecondary,
  },
  intensityButtonTextActive: {
    color: Colors.textLight,
  },
  activityNotesInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    textAlignVertical: 'top',
  },
  weightInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
  generalNotesInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    textAlignVertical: 'top',
  },
});
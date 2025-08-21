import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { X, Plus, Minus, Camera, Clock, Save } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { JournalEntry, Meal } from '@/types/Journal';
import { JournalService } from '@/services/JournalService';
import { useAuth } from '@/contexts/AuthContext';

interface DailyJournalModalProps {
  visible: boolean;
  onClose: () => void;
  date: string;
  onSave: (entry: JournalEntry) => void;
}

export default function DailyJournalModal({
  visible,
  onClose,
  date,
  onSave,
}: DailyJournalModalProps) {
  const { user } = useAuth();
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterObjective, setWaterObjective] = useState(8);
  const [meals, setMeals] = useState<Meal[]>([
    { id: '1', type: 'matin', consumed: false, time: '', photo: '', notes: '' },
    { id: '2', type: 'midi', consumed: false, time: '', photo: '', notes: '' },
    { id: '3', type: 'gouter', consumed: false, time: '', photo: '', notes: '' },
    { id: '4', type: 'soir', consumed: false, time: '', photo: '', notes: '' },
  ]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && user) {
      loadExistingEntry();
    }
  }, [visible, date, user]);

  const loadExistingEntry = async () => {
    if (!user) return;

    try {
      const entries = await JournalService.getJournalEntries(user.id, date, date);
      const existingEntry = entries.find(e => e.date === date);
      
      if (existingEntry) {
        setWaterIntake(existingEntry.waterIntake);
        setWaterObjective(existingEntry.waterIntakeObjective || 8);
        setMeals(existingEntry.meals);
        setNotes(existingEntry.notes || '');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'entrée:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        userId: user.id,
        date,
        waterIntake,
        waterIntakeObjective: waterObjective,
        meals,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await JournalService.saveJournalEntry(entry);
      onSave(entry);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'entrée');
    } finally {
      setLoading(false);
    }
  };

  const updateMeal = (mealId: string, updates: Partial<Meal>) => {
    setMeals(prev => prev.map(meal => 
      meal.id === mealId ? { ...meal, ...updates } : meal
    ));
  };

  const getMealTitle = (type: string) => {
    switch (type) {
      case 'matin': return '🌅 Petit-déjeuner';
      case 'midi': return '☀️ Déjeuner';
      case 'gouter': return '🍪 Goûter';
      case 'soir': return '🌙 Dîner';
      default: return type;
    }
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
          <Text style={styles.title}>
            Journal du {new Date(date).toLocaleDateString('fr-FR')}
          </Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={styles.saveButton}
            disabled={loading}
          >
            <Save size={20} color={Colors.textLight} />
            <Text style={styles.saveButtonText}>
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Section Hydratation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💧 Hydratation</Text>
            <View style={styles.waterSection}>
              <View style={styles.waterControls}>
                <TouchableOpacity
                  onPress={() => setWaterIntake(Math.max(0, waterIntake - 1))}
                  style={styles.waterButton}
                >
                  <Minus size={20} color={Colors.agpBlue} />
                </TouchableOpacity>
                <Text style={styles.waterCount}>{waterIntake} verres</Text>
                <TouchableOpacity
                  onPress={() => setWaterIntake(waterIntake + 1)}
                  style={styles.waterButton}
                >
                  <Plus size={20} color={Colors.agpBlue} />
                </TouchableOpacity>
              </View>
              <Text style={styles.waterObjective}>
                Objectif : {waterObjective} verres
              </Text>
            </View>
          </View>

          {/* Section Repas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🍽️ Repas</Text>
            {meals.map(meal => (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>{getMealTitle(meal.type)}</Text>
                  <TouchableOpacity
                    onPress={() => updateMeal(meal.id, { consumed: !meal.consumed })}
                    style={[
                      styles.consumedButton,
                      meal.consumed && styles.consumedButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.consumedButtonText,
                      meal.consumed && styles.consumedButtonTextActive
                    ]}>
                      {meal.consumed ? 'Pris' : 'Non pris'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.mealDetails}>
                  <View style={styles.timeInput}>
                    <Clock size={16} color={Colors.textSecondary} />
                    <TextInput
                      style={styles.timeTextInput}
                      placeholder="Heure (ex: 08:30)"
                      value={meal.time}
                      onChangeText={(time) => updateMeal(meal.id, { time })}
                    />
                  </View>

                  <TextInput
                    style={styles.notesInput}
                    placeholder="Notes sur le repas..."
                    value={meal.notes}
                    onChangeText={(notes) => updateMeal(meal.id, { notes })}
                    multiline
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Section Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Notes générales</Text>
            <TextInput
              style={styles.generalNotesInput}
              placeholder="Comment s'est passée votre journée ?"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
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
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.agpBlue,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  saveButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textLight,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  waterSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 8,
  },
  waterButton: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterCount: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    minWidth: 100,
    textAlign: 'center',
  },
  waterObjective: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  mealCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  consumedButton: {
    backgroundColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  consumedButtonActive: {
    backgroundColor: Colors.agpLightGreen,
  },
  consumedButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textSecondary,
  },
  consumedButtonTextActive: {
    color: Colors.agpGreen,
  },
  mealDetails: {
    gap: 8,
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeTextInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notesInput: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  generalNotesInput: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
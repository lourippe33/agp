import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Droplets, Utensils, Plus, ChevronLeft, ChevronRight, Check, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import DailyJournalModal from '@/components/DailyJournalModal';
import { JournalEntry } from '@/types/Journal';
import { JournalService } from '@/services/JournalService';
import AGPLogo from '@/components/AGPLogo';

const { width } = Dimensions.get('window');

export default function JournalScreen() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalModalVisible, setJournalModalVisible] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (user) {
      loadJournalData();
    }
  }, [user, selectedDate]);

  const loadJournalData = async () => {
    if (!user) return;

    try {
      // Calculer les dates pour la semaine en cours
      const currentDate = new Date(selectedDate);
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startDateStr = startOfWeek.toISOString().split('T')[0];
      const endDateStr = endOfWeek.toISOString().split('T')[0];

      // Récupérer les données de journal pour la semaine
      const entries = await JournalService.getJournalEntries(
        user.id,
        startDateStr,
        endDateStr
      );

      setJournalEntries(entries);

      // Vérifier si une entrée existe pour la date sélectionnée
      const dateStr = selectedDate.toISOString().split('T')[0];
      const entry = entries.find(e => e.date === dateStr);
      setSelectedEntry(entry || null);
    } catch (error) {
      console.error('Erreur lors du chargement des données de journal:', error);
    }
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    const entry = journalEntries.find(e => e.date === dateStr);
    setSelectedEntry(entry || null);
  };

  const handleAddJournal = () => {
    setJournalModalVisible(true);
  };

  const handleSaveJournal = (entry: JournalEntry) => {
    // Mettre à jour la liste des entrées
    setJournalEntries(prev => {
      const existingIndex = prev.findIndex(e => e.date === entry.date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = entry;
        return updated;
      } else {
        return [...prev, entry];
      }
    });

    // Mettre à jour l'entrée sélectionnée si c'est la date actuelle
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    if (entry.date === selectedDateStr) {
      setSelectedEntry(entry);
    }
  };

  const WeekCalendar = () => {
    // Générer les jours de la semaine
    const days = [];
    const currentDate = new Date(selectedDate);
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }

    return (
      <View style={styles.weekCalendar}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={handlePreviousWeek} style={styles.calendarArrow}>
            <ChevronLeft size={24} color={Colors.agpBlue} />
          </TouchableOpacity>
          
          <Text style={styles.calendarTitle}>
            {startOfWeek.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </Text>
          
          <TouchableOpacity onPress={handleNextWeek} style={styles.calendarArrow}>
            <ChevronRight size={24} color={Colors.agpBlue} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.daysContainer}>
          {days.map((day, index) => {
            const dateStr = day.toISOString().split('T')[0];
            const isSelected = selectedDate.toDateString() === day.toDateString();
            const hasEntry = journalEntries.some(entry => entry.date === dateStr);
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  isSelected && styles.dayButtonSelected
                ]}
                onPress={() => handleDateSelect(day)}
              >
                <Text style={styles.dayName}>
                  {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                </Text>
                <Text style={[
                  styles.dayNumber,
                  isSelected && styles.dayNumberSelected
                ]}>
                  {day.getDate()}
                </Text>
                {hasEntry && (
                  <View style={styles.entryIndicator} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const DailyOverview = () => {
    if (!selectedEntry) {
      return (
        <View style={styles.emptyState}>
          <Calendar size={48} color={Colors.textSecondary} />
          <Text style={styles.emptyStateTitle}>Aucune entrée pour cette date</Text>
          <Text style={styles.emptyStateText}>
            Ajoutez votre journal pour le {selectedDate.toLocaleDateString('fr-FR')}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddJournal}
          >
            <Plus size={20} color={Colors.textLight} />
            <Text style={styles.addButtonText}>Ajouter une entrée</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.dailyOverview}>
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>
            Journal du {new Date(selectedEntry.date).toLocaleDateString('fr-FR')}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleAddJournal}
          >
            <Text style={styles.editButtonText}>Modifier</Text>
          </TouchableOpacity>
        </View>

        {/* Repas */}
        <View style={styles.mealsOverview}>
          <Text style={styles.overviewSectionTitle}>🍽️ Repas</Text>
          {selectedEntry.meals.map(meal => {
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
              <View key={meal.id} style={styles.mealOverviewCard}>
                <View style={styles.mealOverviewHeader}>
                  <Text style={styles.mealOverviewTitle}>{getMealTitle(meal.type)}</Text>
                  <View style={[
                    styles.mealStatusBadge,
                    meal.consumed ? styles.mealStatusBadgeConsumed : styles.mealStatusBadgeSkipped
                  ]}>
                    <Text style={[
                      styles.mealStatusText,
                      meal.consumed ? styles.mealStatusTextConsumed : styles.mealStatusTextSkipped
                    ]}>
                      {meal.consumed ? 'Pris' : 'Non pris'}
                    </Text>
                  </View>
                </View>
                
                {meal.time && (
                  <View style={styles.mealDetailRow}>
                    <Clock size={16} color={Colors.textSecondary} />
                    <Text style={styles.mealDetailText}>{meal.time}</Text>
                  </View>
                )}
                
                {meal.photo && (
                  <Image 
                    source={{ uri: meal.photo }} 
                    style={styles.mealOverviewPhoto}
                    resizeMode="cover"
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* Hydratation */}
        <View style={styles.waterOverview}>
          <Text style={styles.overviewSectionTitle}>💧 Hydratation</Text>
          <View style={styles.waterCard}>
            <Droplets size={24} color={Colors.agpBlue} />
            <View style={styles.waterTextContainer}>
              <View style={styles.waterTextHeader}>
                <Text style={styles.waterOverviewText}>
                  {selectedEntry.waterIntake} / {selectedEntry.waterIntakeObjective || 8} verre{selectedEntry.waterIntake > 1 ? 's' : ''} d'eau
                </Text>
                <View style={[
                  styles.waterStatusBadge,
                  selectedEntry.waterIntake >= (selectedEntry.waterIntakeObjective || 8) ? 
                    styles.waterStatusBadgeComplete : 
                    styles.waterStatusBadgeIncomplete
                ]}>
                  <Text style={[
                    styles.waterStatusText,
                    selectedEntry.waterIntake >= (selectedEntry.waterIntakeObjective || 8) ?
                      styles.waterStatusTextComplete :
                      styles.waterStatusTextIncomplete
                  ]}>
                    {selectedEntry.waterIntake >= (selectedEntry.waterIntakeObjective || 8) ? 
                      'Objectif atteint' : 
                      `${Math.round((selectedEntry.waterIntake / (selectedEntry.waterIntakeObjective || 8)) * 100)}%`
                    }
                  </Text>
                </View>
              </View>
              <View style={styles.waterObjectiveInfo}>
                <Text style={styles.waterObjectiveText}>
                  Objectif : {selectedEntry.waterIntakeObjective || 8} verres
                </Text>
                <Text style={styles.waterTipText}>
                  {selectedEntry.waterIntake < (selectedEntry.waterIntakeObjective || 8) / 2 ? 
                    "N'oubliez pas de vous hydrater régulièrement !" : 
                    "Bonne hydratation, continuez ainsi !"
                  }
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <AGPLogo size={50} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Journal Quotidien</Text>
            <Text style={styles.headerSubtitle}>
              Suivez vos repas et votre hydratation
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Calendar size={32} color={Colors.textLight} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={[
          styles.content,
          Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
        ]}
        showsVerticalScrollIndicator={true}
      >
        <DailyOverview />

        {/* Bouton d'ajout flottant */}
        {!selectedEntry && (
          <TouchableOpacity
            style={styles.floatingAddButton}
            onPress={handleAddJournal}
          >
            <Plus size={24} color={Colors.textLight} />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal de journal quotidien */}
      <DailyJournalModal
        visible={journalModalVisible}
        onClose={() => setJournalModalVisible(false)}
        date={selectedDate.toISOString().split('T')[0]}
        onSave={handleSaveJournal}
      />
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    padding: 8,
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
  },
  headerIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  weekCalendar: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarArrow: {
    padding: 8,
  },
  calendarTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    textTransform: 'capitalize',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    alignItems: 'center',
    width: (width - 72) / 7,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dayButtonSelected: {
    backgroundColor: Colors.agpLightBlue,
  },
  dayName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  dayNumberSelected: {
    color: Colors.agpBlue,
  },
  entryIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.agpGreen,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.agpBlue,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  dailyOverview: {
    gap: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  editButton: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpBlue,
  },
  overviewSectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  mealsOverview: {
    marginBottom: 16,
  },
  mealOverviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealOverviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealOverviewTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  mealStatusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mealStatusBadgeConsumed: {
    backgroundColor: Colors.agpLightGreen,
  },
  mealStatusBadgeSkipped: {
    backgroundColor: Colors.agpLightBlue,
  },
  mealStatusText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },
  mealStatusTextConsumed: {
    color: Colors.agpGreen,
  },
  mealStatusTextSkipped: {
    color: Colors.agpBlue,
  },
  mealDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  mealDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  mealOverviewPhoto: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  mealNotes: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  waterOverview: {
    marginBottom: 16,
  },
  waterCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  waterTextContainer: {
    flex: 1,
  },
  waterTextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  waterObjectiveInfo: {
    marginTop: 4,
  },
  waterOverviewText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  waterStatusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  waterStatusBadgeComplete: {
    backgroundColor: Colors.agpLightGreen,
  },
  waterStatusBadgeIncomplete: {
    backgroundColor: Colors.agpLightBlue,
  },
  waterStatusText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },
  waterStatusTextComplete: {
    color: Colors.agpGreen,
  },
  waterStatusTextIncomplete: {
    color: Colors.agpBlue,
  },
  waterObjectiveText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  waterTipText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: Colors.agpBlue,
    fontStyle: 'italic',
    marginTop: 2,
  },
  waterProgress: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginTop: 8,
  },
  waterProgressFill: {
    height: '100%',
    backgroundColor: Colors.agpBlue,
    borderRadius: 3,
  },
  notesOverview: {
    marginBottom: 16,
  },
  notesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.agpBlue,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
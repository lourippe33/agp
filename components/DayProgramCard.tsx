import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Zap, Flame, Lock, Clock } from 'lucide-react-native'; 
import { Colors } from '@/constants/Colors';
import { isPastDay } from '@/utils/dateUtils';

interface DayProgram {
  day: number;
  date: Date;
  isCompleted: boolean;
  isToday: boolean;
  isPartiallyCompleted?: boolean;
  activities: {
    breakfast: { name: string; completed: boolean };
    sport: { name: string; completed: boolean };
    relaxation: { name: string; completed: boolean };
    lunch: { name: string; completed: boolean };
    snack: { name: string; completed: boolean };
    dinner: { name: string; completed: boolean };
  };
  totalDuration: number;
  badges?: string[];
}

interface DayCardProps {
  day: DayProgram;
  onPress: (day: DayProgram) => void;
}

export default function DayProgramCard({ day, onPress }: DayCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.dayCard,
        day.isCompleted && styles.dayCardCompleted, // Vert pour les jours complétés
        day.isPartiallyCompleted && styles.dayCardPartiallyCompleted, // Rouge pour les jours partiellement complétés
        day.isToday && styles.dayCardToday // Bleu pour le jour actuel
      ]}
      onPress={() => onPress(day)}
      activeOpacity={0.8}
    >
      <View style={styles.dayHeader}>
        <Text style={[
          styles.dayNumber,
          day.isCompleted && styles.dayNumberCompleted, // Texte vert
          day.isPartiallyCompleted && styles.dayNumberPartiallyCompleted, // Texte rouge
          day.isToday && styles.dayNumberToday // Texte bleu
        ]}>
          {day.day}
        </Text>
        {day.isCompleted && (
          <Zap size={16} color={Colors.agpGreen} strokeWidth={2} />
        )}
        {day.isPartiallyCompleted && (
          <Flame size={16} color={Colors.relaxation} strokeWidth={2} />
        )}
        {isPastDay(day.date) && !day.isCompleted && !day.isPartiallyCompleted && !day.isToday && (
          <Lock size={14} color={Colors.textSecondary} strokeWidth={2} />
        )}
        {day.badges && (
          <View style={styles.badgeContainer}>
            {day.badges.map((badge, index) => (
              <Text key={index} style={styles.badge}>{badge}</Text>
            ))}
          </View>
        )}
      </View>
      
      <Text style={styles.dayDate}>
        {day.date.toLocaleDateString('fr-FR', { 
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        })}
      </Text>
      
      <View style={styles.dayDuration}>
        <Clock size={12} color={Colors.textSecondary} strokeWidth={2} />
        <Text style={styles.durationText}>{day.totalDuration}min</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dayCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: Colors.relaxation, // Rouge par défaut pour les jours non complétés
    marginHorizontal: 2,
    width: 45, // Largeur fixe pour assurer que tous les jours sont visibles
  },
  dayCardCompleted: {
    backgroundColor: Colors.agpLightGreen,
    borderColor: Colors.agpGreen,
  },
  dayCardPartiallyCompleted: {
    backgroundColor: '#FFE0E6',
    borderColor: Colors.relaxation,
  },
  dayCardToday: {
    borderColor: Colors.agpBlue,
    backgroundColor: Colors.agpLightBlue,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    minHeight: 20,
  },
  dayNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  dayNumberCompleted: {
    color: Colors.agpGreen,
  },
  dayNumberPartiallyCompleted: {
    color: Colors.relaxation,
  },
  dayNumberToday: {
    color: Colors.agpBlue,
  },
  badgeContainer: {
    marginLeft: 4,
  },
  badge: {
    fontSize: 12,
  },
  dayDate: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  dayDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  durationText: {
    fontSize: 9,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  }
});
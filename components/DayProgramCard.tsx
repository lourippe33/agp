import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';

interface DayProgram {
  day: number;
  date: Date;
  isCompleted: boolean;
  isToday: boolean;
  isBlocked?: boolean;
  activities: any;
  totalDuration: number;
  badges?: string[];
}

interface DayProgramCardProps {
  day: DayProgram;
  onPress: (day: DayProgram) => void;
}

const { width } = Dimensions.get('window');
const dayCardWidth = (width - 100) / 7;

export default function DayProgramCard({ day, onPress }: DayProgramCardProps) {
  const getStatusColor = () => {
    if (day.isBlocked) return Colors.border;
    if (day.isToday) return Colors.agpBlue;
    if (day.isCompleted) return Colors.agpGreen;
    return Colors.surface;
  };

  const getStatusTextColor = () => {
    if (day.isBlocked) return Colors.textSecondary;
    if (day.isToday) return Colors.textLight;
    if (day.isCompleted) return Colors.textLight;
    return Colors.text;
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { 
          backgroundColor: getStatusColor(),
          width: dayCardWidth 
        }
      ]}
      onPress={() => onPress(day)}
      disabled={day.isBlocked}
      activeOpacity={0.8}
    >
      <Text style={[styles.dayNumber, { color: getStatusTextColor() }]}>
        {day.day}
      </Text>
      
      <Text style={[styles.dayLabel, { color: getStatusTextColor() }]}>
        {day.isToday ? 'Aujourd\'hui' : 
         day.isCompleted ? 'Terminé' : 
         day.isBlocked ? 'Bloqué' : 'À faire'}
      </Text>
      
      {day.badges && day.badges.length > 0 && (
        <Text style={styles.badge}>{day.badges[0]}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    minHeight: 60,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  dayLabel: {
    fontSize: 8,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 10,
  },
  badge: {
    fontSize: 12,
    marginTop: 2,
  },
});
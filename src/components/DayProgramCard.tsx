import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface DayProgramCardProps {
  day: string;
  program: string;
  isCompleted: boolean;
  onPress: () => void;
}

export default function DayProgramCard({ day, program, isCompleted, onPress }: DayProgramCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.day}>{day}</Text>
        <Text style={styles.program}>{program}</Text>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  day: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  program: {
    color: Colors.textSecondary,
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
  },
  completedBadge: {
    backgroundColor: Colors.success,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
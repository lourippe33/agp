import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors } from '@/constants/Colors';

interface ChoiceButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const ChoiceButton = ({ label, selected, onPress }: ChoiceButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.choiceButton,
      selected && styles.choiceButtonSelected,
    ]}
  >
    <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function SuiviPoids() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [waist, setWaist] = useState(85);
  const [progress, setProgress] = useState('');
  const [shape, setShape] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🎯 Mon point de départ</Text>

      <Text style={styles.label}>Taille (cm)</Text>
      <Slider
        value={height}
        onValueChange={v => setHeight(Math.round(v))}
        minimumValue={140}
        maximumValue={200}
        step={1}
        style={styles.slider}
        minimumTrackTintColor={Colors.agpBlue}
      />
      <Text style={styles.valueText}>{height} cm</Text>

      <Text style={styles.label}>Poids (kg)</Text>
      <Slider
        value={weight}
        onValueChange={v => setWeight(Math.round(v))}
        minimumValue={40}
        maximumValue={150}
        step={1}
        style={styles.slider}
        minimumTrackTintColor={Colors.agpGreen}
      />
      <Text style={styles.valueText}>{weight} kg</Text>

      <Text style={styles.label}>Tour de taille (cm)</Text>
      <Slider
        value={waist}
        onValueChange={v => setWaist(Math.round(v))}
        minimumValue={60}
        maximumValue={140}
        step={1}
        style={styles.slider}
        minimumTrackTintColor={Colors.morning}
      />
      <Text style={styles.valueText}>{waist} cm</Text>

      <Text style={styles.sectionTitle}>📆 Évolution à 1 mois</Text>

      <Text style={styles.label}>Évolution du poids</Text>
      <View style={styles.choicesRow}>
        <ChoiceButton label="📉 J'ai perdu" selected={progress === 'perdu'} onPress={() => setProgress('perdu')} />
        <ChoiceButton label="➖ Stable" selected={progress === 'stable'} onPress={() => setProgress('stable')} />
        <ChoiceButton label="📈 J'ai repris" selected={progress === 'repris'} onPress={() => setProgress('repris')} />
      </View>

      <Text style={styles.label}>Silhouette</Text>
      <View style={styles.choicesRow}>
        <ChoiceButton label="👖 Plus ample" selected={shape === 'ample'} onPress={() => setShape('ample')} />
        <ChoiceButton label="🎯 Inchangée" selected={shape === 'identique'} onPress={() => setShape('identique')} />
        <ChoiceButton label="📏 Plus serrée" selected={shape === 'serrée'} onPress={() => setShape('serrée')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    marginTop: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  valueText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  choicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 20,
  },
  choiceButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  choiceButtonSelected: {
    backgroundColor: Colors.agpLightBlue,
    borderColor: Colors.agpBlue,
  },
  choiceText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: Colors.text,
  },
  choiceTextSelected: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpBlue,
  },
});
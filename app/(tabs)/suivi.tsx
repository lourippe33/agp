import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChartBar as BarChart3 } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function SuiviScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mon Suivi</Text>
        <Text style={styles.headerSubtitle}>
          Suivez vos progrès et mensurations
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.comingSoonCard}>
          <BarChart3 size={48} color={Colors.agpBlue} />
          <Text style={styles.comingSoonTitle}>Suivi en développement</Text>
          <Text style={styles.comingSoonText}>
            Bientôt vous pourrez suivre votre poids, vos mensurations et 
            vos objectifs de transformation.
          </Text>
        </View>
      </ScrollView>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  comingSoonCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
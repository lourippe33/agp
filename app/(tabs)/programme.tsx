import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, TrendingUp, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function ProgrammeScreen() {
  const [currentDay, setCurrentDay] = React.useState(1);
  const totalDays = 28;
  const remainingDays = totalDays - currentDay;
  const progressPercentage = Math.round((currentDay / totalDays) * 100);

  React.useEffect(() => {
    loadCurrentDay();
  }, []);

  const loadCurrentDay = async () => {
    try {
      const savedDay = await AsyncStorage.getItem('programDay');
      if (savedDay) {
        setCurrentDay(parseInt(savedDay));
      }
    } catch (error) {
      console.log('Erreur lors du chargement du jour:', error);
    }
  };

  const incrementDay = async () => {
    if (currentDay < totalDays) {
      const newDay = currentDay + 1;
      setCurrentDay(newDay);
      try {
        await AsyncStorage.setItem('programDay', newDay.toString());
      } catch (error) {
        console.log('Erreur lors de la sauvegarde:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Programme 28 Jours</Text>
        <Text style={styles.headerSubtitle}>
          Votre transformation chronobiologique
        </Text>
      </LinearGradient>

      {/* Boutons de progression */}
      <View style={styles.progressSection}>
        <TouchableOpacity style={styles.progressButton}>
          <TrendingUp size={24} color={Colors.agpBlue} />
          <View style={styles.progressContent}>
            <Text style={styles.progressTitle}>Progression</Text>
            <Text style={styles.progressValue}>Jour {currentDay}/{totalDays}</Text>
            <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.remainingButton}>
          <Clock size={24} color={Colors.agpGreen} />
          <View style={styles.remainingContent}>
            <Text style={styles.remainingTitle}>Jours restants</Text>
            <Text style={styles.remainingValue}>{remainingDays}</Text>
            <Text style={styles.remainingSubtitle}>jours</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.comingSoonCard}>
          <Calendar size={48} color={Colors.agpBlue} />
          <Text style={styles.comingSoonTitle}>Programme en développement</Text>
          <Text style={styles.comingSoonText}>
            Votre programme personnalisé de 28 jours sera bientôt disponible.
          </Text>
        </View>

        {/* Bouton temporaire pour tester l'incrémentation */}
        <TouchableOpacity style={styles.testButton} onPress={incrementDay}>
          <Text style={styles.testButtonText}>
            Valider le jour {currentDay} (Test)
          </Text>
        </TouchableOpacity>
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
  progressSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContent: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  progressValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.agpBlue,
  },
  remainingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  remainingContent: {
    flex: 1,
  },
  remainingTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  remainingValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpGreen,
    marginBottom: 2,
  },
  remainingSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
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
  testButton: {
    backgroundColor: Colors.agpBlue,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
});
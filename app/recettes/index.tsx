import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sun, Utensils, Coffee, Moon, ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import AGPLogo from '@/components/AGPLogo';

export default function RecettesIndexScreen() {
  const goBack = () => {
    router.back();
  };

  const navigateToMoment = (moment: string) => {
    router.push(`/recettes/${moment}`);
  };

  const moments = [
    {
      id: 'matin',
      title: 'Petit-déjeuner',
      subtitle: 'Commencez votre journée avec énergie',
      icon: Sun,
      gradient: Colors.gradientMorning,
    },
    {
      id: 'midi',
      title: 'Déjeuner',
      subtitle: 'Nourrissez votre corps avec équilibre',
      icon: Utensils,
      gradient: Colors.gradientNoon,
    },
    {
      id: 'gouter',
      title: 'Goûter',
      subtitle: 'Une pause plaisir et énergisante',
      icon: Coffee,
      gradient: Colors.gradientSnack,
    },
    {
      id: 'soir',
      title: 'Dîner',
      subtitle: 'Terminez la journée en douceur',
      icon: Moon,
      gradient: Colors.gradientEvening,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.agpGreen, '#A5D6A7']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={24} color={Colors.textLight} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <AGPLogo size={40} />
            </View>
          </View>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Recettes AGP</Text>
            <Text style={styles.headerSubtitle}>
              Choisissez le moment de la journée
            </Text>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Moments de la journée</Text>
          
          <View style={styles.momentsContainer}>
            {moments.map((moment) => {
              const IconComponent = moment.icon;
              return (
                <TouchableOpacity
                  key={moment.id}
                  style={styles.momentButton}
                  onPress={() => navigateToMoment(moment.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={moment.gradient}
                    style={styles.momentGradient}
                  >
                    <View style={styles.momentIconContainer}>
                      <IconComponent size={32} color={Colors.textLight} strokeWidth={2} />
                    </View>
                    <Text style={styles.momentTitle}>{moment.title}</Text>
                    <Text style={styles.momentSubtitle}>{moment.subtitle}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>🍽️ Chronobiologie Alimentaire</Text>
            <Text style={styles.infoText}>
              Nos recettes sont conçues selon les principes de la chronobiologie pour optimiser 
              votre digestion et votre énergie tout au long de la journée.
            </Text>
            
            <View style={styles.principlesContainer}>
              <View style={styles.principleItem}>
                <Text style={styles.principleIcon}>🌅</Text>
                <Text style={styles.principleText}>Matin : Énergie</Text>
              </View>
              <View style={styles.principleItem}>
                <Text style={styles.principleIcon}>☀️</Text>
                <Text style={styles.principleText}>Midi : Équilibre</Text>
              </View>
              <View style={styles.principleItem}>
                <Text style={styles.principleIcon}>🌙</Text>
                <Text style={styles.principleText}>Soir : Légèreté</Text>
              </View>
            </View>
          </View>
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
  scrollContent: {
    paddingBottom: 70, // Espace pour la tab bar
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  momentsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  momentButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  momentGradient: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
  },
  momentIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 12,
    marginRight: 16,
  },
  momentTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 4,
    flex: 1,
  },
  momentSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    flex: 2,
  },
  infoSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  principlesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  principleItem: {
    alignItems: 'center',
    flex: 1,
  },
  principleIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  principleText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    textAlign: 'center',
  },
});
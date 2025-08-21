import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sun, Utensils, Coffee, Moon, ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function RecettesScreen() {
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
      title: 'Collation',
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recettes AGP</Text>
      </View>

      <ScrollView 
        style={[
          styles.content,
          Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
        ]}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Choisissez le moment de la journée</Text>
        
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
                  <View style={styles.momentTextContainer}>
                    <Text style={styles.momentTitle}>{moment.title}</Text>
                    <Text style={styles.momentSubtitle}>{moment.subtitle}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>🍽️ Chronobiologie Alimentaire</Text>
          <Text style={styles.infoText}>
            Nos recettes sont conçues selon les principes de la chronobiologie pour optimiser 
            votre digestion et votre énergie tout au long de la journée.
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
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
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
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
  momentTextContainer: {
    flex: 1,
  },
  momentTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 4,
  },
  momentSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
  },
  infoSection: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
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
  },
});
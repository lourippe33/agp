import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calendar, Target, CircleCheck as CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function Programme28JoursScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Programme 28 Jours</Text>
          <View style={styles.placeholder} />
        </View>
        <Text style={styles.headerSubtitle}>
          Votre transformation AGP personnalisée
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Vue d'ensemble */}
        <View style={styles.overviewCard}>
          <Calendar size={32} color={Colors.agpBlue} />
          <Text style={styles.overviewTitle}>Votre Programme Personnalisé</Text>
          <Text style={styles.overviewText}>
            Un programme de 28 jours adapté à votre chronobiologie pour optimiser 
            votre alimentation, votre activité physique et votre bien-être.
          </Text>
        </View>

        {/* Phases du programme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Les 4 Phases</Text>
          
          <View style={styles.phaseCard}>
            <View style={styles.phaseHeader}>
              <Text style={styles.phaseNumber}>1</Text>
              <Text style={styles.phaseTitle}>Adaptation (Jours 1-7)</Text>
            </View>
            <Text style={styles.phaseDescription}>
              Découverte de votre rythme naturel et mise en place des bases
            </Text>
          </View>

          <View style={styles.phaseCard}>
            <View style={styles.phaseHeader}>
              <Text style={styles.phaseNumber}>2</Text>
              <Text style={styles.phaseTitle}>Optimisation (Jours 8-14)</Text>
            </View>
            <Text style={styles.phaseDescription}>
              Ajustement des habitudes alimentaires selon votre chronobiologie
            </Text>
          </View>

          <View style={styles.phaseCard}>
            <View style={styles.phaseHeader}>
              <Text style={styles.phaseNumber}>3</Text>
              <Text style={styles.phaseTitle}>Intensification (Jours 15-21)</Text>
            </View>
            <Text style={styles.phaseDescription}>
              Intégration des exercices et renforcement des acquis
            </Text>
          </View>

          <View style={styles.phaseCard}>
            <View style={styles.phaseHeader}>
              <Text style={styles.phaseNumber}>4</Text>
              <Text style={styles.phaseTitle}>Consolidation (Jours 22-28)</Text>
            </View>
            <Text style={styles.phaseDescription}>
              Autonomie complète et préparation à la suite
            </Text>
          </View>
        </View>

        {/* Objectifs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vos Objectifs</Text>
          
          <View style={styles.objectiveItem}>
            <Target size={20} color={Colors.agpGreen} />
            <Text style={styles.objectiveText}>Perte de poids durable</Text>
          </View>
          
          <View style={styles.objectiveItem}>
            <Target size={20} color={Colors.agpGreen} />
            <Text style={styles.objectiveText}>Amélioration de l'énergie</Text>
          </View>
          
          <View style={styles.objectiveItem}>
            <Target size={20} color={Colors.agpGreen} />
            <Text style={styles.objectiveText}>Meilleure gestion du stress</Text>
          </View>
          
          <View style={styles.objectiveItem}>
            <Target size={20} color={Colors.agpGreen} />
            <Text style={styles.objectiveText}>Habitudes alimentaires saines</Text>
          </View>
        </View>

        {/* Statut */}
        <View style={styles.statusCard}>
          <CheckCircle size={32} color={Colors.warning} />
          <Text style={styles.statusTitle}>Programme en développement</Text>
          <Text style={styles.statusText}>
            Le programme 28 jours sera bientôt disponible avec un suivi quotidien 
            personnalisé et des recommandations adaptées à votre profil.
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
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  overviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overviewTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  overviewText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  phaseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  phaseNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    backgroundColor: Colors.agpBlue,
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  phaseTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  phaseDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  objectiveText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
  },
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
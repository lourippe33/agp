import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, Users, ExternalLink, Heart, Star } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/src/context/AuthContext';
import AGPLogo from '@/components/AGPLogo';

export default function CommunauteScreen() {
  const { user } = useAuth();
  const [hasJoined, setHasJoined] = useState(false);

  // Lien WhatsApp principal
  const mainWhatsAppGroup = {
    name: 'Communauté AGP',
    description: 'Rejoignez notre communauté bienveillante pour partager votre parcours bien-être, échanger des conseils et vous motiver mutuellement.',
    link: 'https://chat.whatsapp.com/HYXDiwAFdlk6K4GMAAxwc3',
    icon: '🌟',
  };

  const handleJoinGroup = async () => {
    try {
      const supported = await Linking.canOpenURL(mainWhatsAppGroup.link);
      
      if (supported) {
        await Linking.openURL(mainWhatsAppGroup.link);
        setHasJoined(true);
      } else {
        Alert.alert(
          'WhatsApp non disponible',
          'Veuillez installer WhatsApp pour rejoindre notre communauté.',
          [
            { text: 'Annuler', style: 'cancel' },
            { 
              text: 'Installer WhatsApp', 
              onPress: () => Linking.openURL('https://whatsapp.com/download')
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le lien WhatsApp');
    }
  };

  const MainGroupCard = () => (
    <View style={styles.mainGroupCard}>
      <View style={styles.groupHeader}>
        <View style={styles.groupIcon}>
          <Text style={styles.groupEmoji}>{mainWhatsAppGroup.icon}</Text>
        </View>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{mainWhatsAppGroup.name}</Text>
          <View style={styles.groupMembers}>
            <Users size={16} color={Colors.textSecondary} />
            <Text style={styles.membersCount}>Communauté active</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.groupDescription}>{mainWhatsAppGroup.description}</Text>
      
      <TouchableOpacity
        style={[styles.joinButton, hasJoined && styles.joinedButton]}
        onPress={handleJoinGroup}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={hasJoined ? [Colors.agpLightGreen, Colors.agpLightGreen] : [Colors.agpGreen, '#A5D6A7']}
          style={styles.joinButtonGradient}
        >
          <MessageCircle size={20} color={hasJoined ? Colors.agpGreen : Colors.textLight} />
          <Text style={[styles.joinButtonText, hasJoined && styles.joinedButtonText]}>
            {hasJoined ? 'Groupe rejoint ✓' : 'Rejoindre la communauté'}
          </Text>
          <ExternalLink size={16} color={hasJoined ? Colors.agpGreen : Colors.textLight} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const CommunityRules = () => (
    <View style={styles.rulesSection}>
      <Text style={styles.sectionTitle}>📋 Règles de la Communauté</Text>
      <View style={styles.rulesList}>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>1.</Text>
          <Text style={styles.ruleText}>Respectez les autres membres et leurs opinions</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>2.</Text>
          <Text style={styles.ruleText}>Partagez des contenus liés au bien-être et à l'AGP</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>3.</Text>
          <Text style={styles.ruleText}>Pas de spam ou de publicité non autorisée</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>4.</Text>
          <Text style={styles.ruleText}>Encouragez et motivez les autres membres</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>5.</Text>
          <Text style={styles.ruleText}>Maintenez un environnement bienveillant et positif</Text>
        </View>
      </View>
    </View>
  );

  const CommunityBenefits = () => (
    <View style={styles.benefitsSection}>
      <Text style={styles.sectionTitle}>🎯 Pourquoi Rejoindre ?</Text>
      
      <View style={styles.benefitsList}>
        <View style={styles.benefitItem}>
          <View style={styles.benefitIcon}>
            <Heart size={20} color={Colors.relaxation} />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Soutien mutuel</Text>
            <Text style={styles.benefitText}>Une communauté bienveillante qui vous accompagne dans votre parcours</Text>
          </View>
        </View>

        <View style={styles.benefitItem}>
          <View style={styles.benefitIcon}>
            <Star size={20} color={Colors.morning} />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Conseils d'experts</Text>
            <Text style={styles.benefitText}>Échangez avec des passionnés et des experts en chronobiologie</Text>
          </View>
        </View>

        <View style={styles.benefitItem}>
          <View style={styles.benefitIcon}>
            <Users size={20} color={Colors.agpBlue} />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Motivation collective</Text>
            <Text style={styles.benefitText}>Restez motivé grâce aux succès et encouragements des autres membres</Text>
          </View>
        </View>

        <View style={styles.benefitItem}>
          <View style={styles.benefitIcon}>
            <MessageCircle size={20} color={Colors.agpGreen} />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Partage d'expériences</Text>
            <Text style={styles.benefitText}>Découvrez de nouvelles astuces et partagez vos propres découvertes</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const TipsSection = () => (
    <View style={styles.tipsSection}>
      <Text style={styles.sectionTitle}>💡 Conseils pour Bien Commencer</Text>
      
      <View style={styles.tipCard}>
        <Star size={20} color={Colors.morning} />
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Présentez-vous !</Text>
          <Text style={styles.tipText}>
            N'hésitez pas à vous présenter en quelques mots quand vous rejoignez le groupe.
          </Text>
        </View>
      </View>
      
      <View style={styles.tipCard}>
        <Heart size={20} color={Colors.relaxation} />
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Partagez vos réussites</Text>
          <Text style={styles.tipText}>
            Vos victoires, même petites, inspirent et motivent les autres membres.
          </Text>
        </View>
      </View>

      <View style={styles.tipCard}>
        <MessageCircle size={20} color={Colors.agpGreen} />
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Posez vos questions</Text>
          <Text style={styles.tipText}>
            La communauté est là pour vous aider. N'hésitez pas à demander des conseils !
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={[
        styles.container,
        Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
      ]} 
      showsVerticalScrollIndicator={true}
    >
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
            <Text style={styles.headerTitle}>Communauté AGP</Text>
            <Text style={styles.headerSubtitle}>
              Connectez-vous avec d'autres passionnés
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Users size={32} color={Colors.textLight} />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Message de bienvenue */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Bienvenue dans la communauté AGP ! 🎉
          </Text>
          <Text style={styles.welcomeText}>
            Rejoignez notre groupe WhatsApp pour échanger, partager vos expériences 
            et vous motiver mutuellement dans votre parcours bien-être.
          </Text>
          {user && (
            <Text style={styles.userWelcome}>
              Salut {user.firstName || user.username} ! 👋
            </Text>
          )}
        </View>

        {/* Groupe WhatsApp principal */}
        <View style={styles.groupsSection}>
          <Text style={styles.sectionTitle}>💬 Notre Communauté WhatsApp</Text>
          <MainGroupCard />
        </View>

        {/* Pourquoi rejoindre */}
        <CommunityBenefits />

        {/* Règles de la communauté */}
        <CommunityRules />

        {/* Section conseils */}
        <TipsSection />
      </View>
    </ScrollView>
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
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpGreen,
  },
  welcomeTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  userWelcome: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpGreen,
  },
  groupsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  mainGroupCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpGreen,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.agpLightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupEmoji: {
    fontSize: 24,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  groupMembers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  membersCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textSecondary,
  },
  groupDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  joinButton: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  joinedButton: {
    elevation: 2,
    shadowOpacity: 0.1,
  },
  joinButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 12,
  },
  joinButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
    flex: 1,
    textAlign: 'center',
  },
  joinedButtonText: {
    color: Colors.agpGreen,
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  benefitIcon: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 20,
    padding: 8,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  rulesSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rulesList: {
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ruleNumber: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpBlue,
    marginRight: 12,
    minWidth: 20,
  },
  ruleText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  tipsSection: {
    marginBottom: 24,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
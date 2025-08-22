import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, MessageCircle, ExternalLink, Heart, Star } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function CommunauteScreen() {
  const handleJoinWhatsApp = async () => {
    // URL du groupe WhatsApp (à remplacer par le vrai lien)
    const whatsappGroupUrl = 'https://chat.whatsapp.com/XXXXXXXXXXXXXXXXX';
    
    try {
      const supported = await Linking.canOpenURL(whatsappGroupUrl);
      if (supported) {
        await Linking.openURL(whatsappGroupUrl);
      } else {
        Alert.alert(
          'WhatsApp non disponible',
          'Veuillez installer WhatsApp pour rejoindre la communauté.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Impossible d\'ouvrir le lien WhatsApp. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <Users size={32} color={Colors.textLight} />
        <Text style={styles.headerTitle}>Communauté AGP</Text>
        <Text style={styles.headerSubtitle}>
          Échangez avec d'autres membres sur votre parcours
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Section principale WhatsApp */}
        <View style={styles.mainSection}>
          <View style={styles.whatsappCard}>
            <MessageCircle size={48} color="#25D366" />
            <Text style={styles.whatsappTitle}>Rejoignez notre groupe WhatsApp</Text>
            <Text style={styles.whatsappDescription}>
              Échangez avec d'autres membres AGP, partagez vos progrès, posez vos questions 
              et trouvez la motivation dans notre communauté bienveillante.
            </Text>
            
            <TouchableOpacity style={styles.joinButton} onPress={handleJoinWhatsApp}>
              <MessageCircle size={24} color={Colors.textLight} />
              <Text style={styles.joinButtonText}>Rejoindre le groupe</Text>
              <ExternalLink size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Avantages de la communauté */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Pourquoi rejoindre la communauté ?</Text>
          
          <View style={styles.benefitCard}>
            <Heart size={24} color={Colors.agpBlue} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Motivation mutuelle</Text>
              <Text style={styles.benefitText}>
                Partagez vos réussites et trouvez du soutien dans les moments difficiles
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <MessageCircle size={24} color={Colors.agpGreen} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Conseils pratiques</Text>
              <Text style={styles.benefitText}>
                Échangez des astuces, recettes et conseils d'entraînement
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <Star size={24} color={Colors.sport} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Expériences partagées</Text>
              <Text style={styles.benefitText}>
                Apprenez des expériences des autres membres de la communauté
              </Text>
            </View>
          </View>
        </View>

        {/* Règles de la communauté */}
        <View style={styles.rulesSection}>
          <Text style={styles.sectionTitle}>Règles de la communauté</Text>
          <View style={styles.rulesCard}>
            <Text style={styles.ruleItem}>• Respectez tous les membres</Text>
            <Text style={styles.ruleItem}>• Partagez des contenus constructifs</Text>
            <Text style={styles.ruleItem}>• Pas de spam ou de publicité</Text>
            <Text style={styles.ruleItem}>• Encouragez et soutenez les autres</Text>
            <Text style={styles.ruleItem}>• Gardez un esprit positif et bienveillant</Text>
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
    marginTop: 12,
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
  mainSection: {
    marginBottom: 30,
  },
  whatsappCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  whatsappTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  whatsappDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  joinButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
    flex: 1,
    textAlign: 'center',
  },
  benefitsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    gap: 16,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  rulesSection: {
    marginBottom: 20,
  },
  rulesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  ruleItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});
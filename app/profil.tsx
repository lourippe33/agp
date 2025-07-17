import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, CreditCard as Edit3, Save, Bell, Target, Activity, Heart, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import AGPLogo from '@/components/AGPLogo';

export default function ProfilScreen() {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // États individuels pour chaque champ
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [height, setHeight] = useState('');
  const [notifications, setNotifications] = useState(true);

  const handleSave = async () => {
    if (!user) return;

    try {
      // Collecter les données du formulaire
      const formData = {
        firstName,
        lastName,
        username,
      };
      
      // Sauvegarder les informations de base
      const result = await updateProfile(user.id, formData);
      
      if (result.success) {
        setIsEditing(false);
        Alert.alert('Succès', 'Profil mis à jour avec succès !');
      } else {
        Alert.alert('Erreur', result.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();
              router.replace('/login');
            } catch (error) {
              setIsLoggingOut(false);
              Alert.alert('Erreur', 'Problème lors de la déconnexion');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="always"
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
            <Text style={styles.headerTitle}>Mon Profil</Text>
            <Text style={styles.headerSubtitle}>
              Personnalisez votre expérience AGP
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? (
              <Save size={24} color={Colors.textLight} />
            ) : (
              <Edit3 size={24} color={Colors.textLight} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Informations personnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Informations personnelles</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Prénom</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Votre prénom"
                placeholderTextColor={Colors.textSecondary}
              />
            ) : (
              <Text style={styles.fieldValue}>{firstName || 'Non renseigné'}</Text>
            )}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nom</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Votre nom"
                placeholderTextColor={Colors.textSecondary}
              />
            ) : (
              <Text style={styles.fieldValue}>{lastName || 'Non renseigné'}</Text>
            )}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nom d'utilisateur</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={username}
                onChangeText={setUsername}
                placeholder="Votre nom d'utilisateur"
                placeholderTextColor={Colors.textSecondary}
              />
            ) : (
              <Text style={styles.fieldValue}>{username || 'Non renseigné'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>{user?.email}</Text>
          </View>
        </View>

        {/* Mesures corporelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚖️ Mesures corporelles</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Poids actuel (kg)</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={currentWeight}
                onChangeText={setCurrentWeight}
                placeholder="Ex: 70.5"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.fieldValue}>{currentWeight || 'Non renseigné'}</Text>
            )}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Poids cible (kg)</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={targetWeight}
                onChangeText={setTargetWeight}
                placeholder="Ex: 65"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.fieldValue}>{targetWeight || 'Non renseigné'}</Text>
            )}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Taille (cm)</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={height}
                onChangeText={setHeight}
                placeholder="Ex: 175"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.fieldValue}>{height || 'Non renseigné'}</Text>
            )}
          </View>
        </View>

        {/* Paramètres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Paramètres</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={Colors.agpBlue} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.agpLightBlue }}
              thumbColor={notifications ? Colors.agpBlue : Colors.textSecondary}
            />
          </View>
        </View>

        {/* Statistiques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Activity size={24} color={Colors.agpGreen} />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Exercices</Text>
            </View>
            
            <View style={styles.statItem}>
              <Heart size={24} color={Colors.relaxation} />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
            
            <View style={styles.statItem}>
              <Target size={24} color={Colors.morning} />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Jours actifs</Text>
            </View>
          </View>
        </View>

        {/* Déconnexion */}
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          {isLoggingOut ? (
            <ActivityIndicator size="small" color={Colors.relaxation} />
          ) : (
            <LogOut size={24} color={Colors.relaxation} />
          )}
          <Text style={[styles.actionButtonText, { color: Colors.relaxation }]}>
            Déconnexion
          </Text>
        </TouchableOpacity>

        {/* Informations de compte */}
        <View style={styles.accountInfo}>
          <Text style={styles.accountInfoTitle}>Informations du compte</Text>
          <Text style={styles.accountInfoText}>
            Membre depuis : {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 40,
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
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 12,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    paddingVertical: 8,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    gap: 16,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: Colors.relaxation,
  },
  actionButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
  },
  accountInfo: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  accountInfoTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  accountInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
});
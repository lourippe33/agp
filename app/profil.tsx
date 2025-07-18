import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Switch,
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
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [niveauSport, setNiveauSport] = useState(user?.niveauSport || 'debutant');
  const [notifications, setNotifications] = useState(true);
  const [waterNotifications, setWaterNotifications] = useState(true);
  
  // États pour les champs IMC - approche simplifiée
  const [weightText, setWeightText] = useState('');
  const [heightText, setHeightText] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setUsername(user.username || '');
      setNiveauSport(user.niveauSport || 'debutant');
    }
  }, [user]);

  // Calcul IMC avec useMemo pour éviter les re-calculs inutiles
  const imcData = useMemo(() => {
    const weight = parseFloat(weightText);
    const heightInM = parseFloat(heightText) / 100;
    
    if (weight > 0 && heightInM > 0) {
      const imc = weight / (heightInM * heightInM);
      const imcRounded = Math.round(imc * 10) / 10;
      
      let category = '';
      if (imcRounded < 18.5) category = 'Insuffisance pondérale';
      else if (imcRounded < 25) category = 'Corpulence normale';
      else if (imcRounded < 30) category = 'Surpoids';
      else if (imcRounded < 35) category = 'Obésité modérée';
      else if (imcRounded < 40) category = 'Obésité sévère';
      else category = 'Obésité morbide';
      
      return { value: imcRounded, category };
    }
    return null;
  }, [weightText, heightText]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const result = await updateProfile(user.id, { firstName, lastName, username, niveauSport });
      
      if (result.success) {
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

  const TextField = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          keyboardType={keyboardType}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'Non renseigné'}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.agpBlue, Colors.agpGreen]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <AGPLogo size={50} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Mon Profil</Text>
            <Text style={styles.headerSubtitle}>Personnalisez votre expérience AGP</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}>
            {isEditing ? (
              <Save size={24} color={Colors.textLight} />
            ) : (
              <Edit3 size={24} color={Colors.textLight} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Informations personnelles</Text>
          <TextField 
            label="Prénom" 
            value={firstName} 
            onChangeText={setFirstName} 
            placeholder="Votre prénom" 
          />
          <TextField 
            label="Nom" 
            value={lastName} 
            onChangeText={setLastName} 
            placeholder="Votre nom" 
          />
          <TextField 
            label="Nom d'utilisateur" 
            value={username} 
            onChangeText={setUsername} 
            placeholder="Votre nom d'utilisateur" 
          />
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>{user?.email}</Text>
          </View>
        </View>

        {/* Section IMC séparée */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚖️ Calcul IMC</Text>
          
          {/* Champ Poids - recréé proprement */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Poids (kg)</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={weightText}
                onChangeText={setWeightText}
                placeholder="Ex: 70.5"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="decimal-pad"
                autoCorrect={false}
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.fieldValue}>{weightText || 'Non renseigné'}</Text>
            )}
          </View>

          {/* Champ Taille - recréé proprement */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Taille (cm)</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={heightText}
                onChangeText={setHeightText}
                placeholder="Ex: 175"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                autoCorrect={false}
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.fieldValue}>{heightText || 'Non renseigné'}</Text>
            )}
          </View>

          {/* Affichage IMC - calcul passif avec useMemo */}
          {!isEditing && imcData && (
            <View style={styles.imcDisplay}>
              <View style={styles.imcHeader}>
                <Text style={styles.imcTitle}>Votre IMC</Text>
              </View>
              <View style={styles.imcContent}>
                <Text style={styles.imcValue}>{imcData.value}</Text>
                <Text style={styles.imcUnit}>kg/m²</Text>
              </View>
              <Text style={styles.imcCategory}>{imcData.category}</Text>
              <Text style={styles.imcNote}>
                Consultez un professionnel de santé pour une évaluation personnalisée.
              </Text>
            </View>
          )}
        </View>

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

        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <LogOut size={24} color={Colors.relaxation} />
          <Text style={[styles.actionButtonText, { color: Colors.relaxation }]}>
            Déconnexion
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: Colors.morning }]}
            onPress={() => setIsEditing(false)}
          >
            <Text style={[styles.actionButtonText, { color: Colors.textLight }]}>
              Terminer l'édition
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.accountInfo}>
          <Text style={styles.accountInfoTitle}>Informations du compte</Text>
          <Text style={styles.accountInfoText}>
            Membre depuis : {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.9,
  },
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: Colors.textSecondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInput: {
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bmiContainer: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  bmiHeader: {
    marginBottom: 12,
  },
  bmiLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    textAlign: 'center',
  },
  bmiContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bmiValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bmiValue: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpBlue,
  },
  bmiUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  bmiCategoryContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bmiCategory: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  bmiInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 12,
  },
  bmiInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  // Nouveaux styles pour l'affichage IMC simplifié
  imcDisplay: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  imcHeader: {
    marginBottom: 12,
  },
  imcTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  imcContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  imcValue: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpBlue,
  },
  imcUnit: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  imcCategory: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  imcNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
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
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  accountInfo: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  accountInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  accountInfoText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
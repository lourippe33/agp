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
  
  // États pour les champs IMC (en tant que strings pour éviter les problèmes de focus)
  const [currentWeightText, setCurrentWeightText] = useState('');
  const [targetWeightText, setTargetWeightText] = useState('');
  const [heightText, setHeightText] = useState('');
  const [waistMeasurementText, setWaistMeasurementText] = useState('');
  
  const [notifications, setNotifications] = useState(true);
  const [waterNotifications, setWaterNotifications] = useState(true);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setUsername(user.username || '');
      setNiveauSport(user.niveauSport || 'debutant');
    }
    
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // Initialiser les champs IMC quand le profil est chargé
  useEffect(() => {
    if (userProfile) {
      setCurrentWeightText(userProfile.currentWeight ? userProfile.currentWeight.toString() : '');
      setTargetWeightText(userProfile.targetWeight ? userProfile.targetWeight.toString() : '');
      setHeightText(userProfile.height ? userProfile.height.toString() : '');
      setWaistMeasurementText(userProfile.waistMeasurement ? userProfile.waistMeasurement.toString() : '');
    }
  }, [userProfile]);

  const loadUserProfile = async () => {

  const handleSave = async () => {
    if (!user) return;

    try {
      const result = await updateProfile(user.id, { firstName, lastName, username, niveauSport });
      
      // Convertir les valeurs texte en nombres pour la sauvegarde
      const weightValue = parseFloat(currentWeightText) || 0;
      const targetValue = parseFloat(targetWeightText) || 0;
      const heightValue = parseFloat(heightText) || 0;
      const waistValue = parseFloat(waistMeasurementText) || 0;
      
      if (weightValue > 0) {
        const profileToSave: UserProfile = {
          id: userProfile?.id || TrackingService.generateId(),
          currentWeight: weightValue,
          targetWeight: targetValue,
          height: heightValue,
          waistMeasurement: waistValue,
          startDate: userProfile?.startDate || new Date().toISOString().split('T')[0],
        };
        
        await TrackingService.saveUserProfile(user.id, profileToSave);
        setUserProfile(profileToSave);
      }
      
      if (result.success) {
        Alert.alert('Succès', 'Profil mis à jour avec succès !');
        // Suppression de setIsEditing(false) ici
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

  // Fonction pour calculer l'IMC de manière sécurisée
  const calculateBMI = () => {
    const weight = parseFloat(currentWeightText);
    const heightInM = parseFloat(heightText);
    
    if (weight > 0 && heightInM > 0) {
      return TrackingService.calculateBMI(weight, heightInM);
    }
    return null;
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
          <View style={styles.logoContainer}><AGPLogo size={50} /></View>
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
          <TextField label="Prénom" value={firstName} onChangeText={setFirstName} placeholder="Votre prénom" />
          <TextField label="Nom" value={lastName} onChangeText={setLastName} placeholder="Votre nom" />
          <TextField label="Nom d'utilisateur" value={username} onChangeText={setUsername} placeholder="Votre nom d'utilisateur" />
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>{user?.email}</Text>
          </View>
          
          <TextField
            label="Poids actuel (kg)"
            value={currentWeightText}
            onChangeText={setCurrentWeightText}
            placeholder="Ex: 70.5"
            keyboardType="decimal-pad"
          />
          
          <TextField
            label="Poids cible (kg)"
            value={targetWeightText}
            onChangeText={setTargetWeightText}
            placeholder="Ex: 65"
            keyboardType="decimal-pad"
          />
          
          <TextField
            label="Taille (cm)"
            value={heightText}
            onChangeText={setHeightText}
            placeholder="Ex: 175"
            keyboardType="numeric"
          />
          
          <TextField
            label="Tour de taille (cm)"
            value={waistMeasurementText}
            onChangeText={setWaistMeasurementText}
            placeholder="Ex: 80"
            keyboardType="numeric"
          />
          
          {!isEditing && calculateBMI() && (
            <View style={styles.bmiContainer}>
              <Text style={styles.bmiLabel}>IMC :</Text>
              <Text style={styles.bmiValue}>
                {calculateBMI()}
              </Text>
              <Text style={styles.bmiCategory}>
                {getBMICategory(calculateBMI()!)}
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

// Les styles restent inchangés : tu peux garder ceux que tu avais déjà
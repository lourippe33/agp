import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import AGPLogo from '@/components/AGPLogo';

// Styles CSS pour forcer l'affichage des barres de défilement sur PC
const webScrollStyles = `
  .scroll-container {
    overflow-y: auto !important;
    scrollbar-width: thin;
    scrollbar-color: #4A90E2 #f1f1f1;
  }
  
  .scroll-container::-webkit-scrollbar {
    width: 8px;
  }
  
  .scroll-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  .scroll-container::-webkit-scrollbar-thumb {
    background: #4A90E2;
    border-radius: 4px;
  }
  
  .scroll-container::-webkit-scrollbar-thumb:hover {
    background: #357ABD;
  }
`;

// Injecter les styles CSS pour le web
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = webScrollStyles;
  document.head.appendChild(styleElement);
}

export default function LoginScreen() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register } = useAuth();

  // Fonctions mémorisées pour éviter les re-renders
  const updateEmail = useCallback((text: string) => setEmail(text), []);
  const updatePassword = useCallback((text: string) => setPassword(text), []);
  const updateUsername = useCallback((text: string) => setUsername(text), []);
  const updateFirstName = useCallback((text: string) => setFirstName(text), []);
  const updateLastName = useCallback((text: string) => setLastName(text), []);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!isLoginMode && (!username.trim() || !firstName.trim() || !lastName.trim())) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (isLoginMode) {
        result = await login({ email: email.trim(), password });
      } else {
        result = await register({
          email: email.trim(),
          password,
          username: username.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        });
      }
      
      if (result.success) {
        router.navigate('/(tabs)/home');
      } else {
        setError(result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    // Réinitialiser les champs
    setEmail('');
    setPassword('');
    setUsername('');
    setFirstName('');
    setLastName('');
    setShowPassword(false);
    setError(null);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        style={Platform.OS === 'web' ? { className: 'scroll-container' } : undefined}
      >
        {/* Header */}
        <LinearGradient
          colors={[Colors.agpBlue, Colors.agpGreen]}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <AGPLogo size={80} />
          </View>
          <Text style={styles.appTitle}>AGP Chronobiologie</Text>
          <Text style={styles.subtitle}>
            {isLoginMode ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {isLoginMode ? 'Connexion' : 'Inscription'}
            </Text>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor={Colors.textSecondary}
                  value={email}
                  onChangeText={updateEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Registration fields */}
            {!isLoginMode && (
              <>
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Nom d'utilisateur"
                      placeholderTextColor={Colors.textSecondary}
                      value={username}
                      onChangeText={updateUsername}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Prénom"
                        placeholderTextColor={Colors.textSecondary}
                        value={firstName}
                        onChangeText={updateFirstName}
                        autoCapitalize="words"
                        editable={!isLoading}
                      />
                    </View>
                  </View>

                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Nom"
                        placeholderTextColor={Colors.textSecondary}
                        value={lastName}
                        onChangeText={updateLastName}
                        autoCapitalize="words"
                        editable={!isLoading}
                      />
                    </View>
                  </View>
                </View>
              </>
            )}

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="Mot de passe"
                  placeholderTextColor={Colors.textSecondary}
                  value={password}
                  onChangeText={updatePassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={Colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isLoading ? [Colors.textSecondary, Colors.textSecondary] : [Colors.agpBlue, Colors.agpGreen]}
                style={styles.submitButtonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.textLight} />
                ) : (
                  <>
                    {isLoginMode ? (
                      <LogIn size={20} color={Colors.textLight} />
                    ) : (
                      <UserPlus size={20} color={Colors.textLight} />
                    )}
                    <Text style={styles.submitButtonText}>
                      {isLoginMode ? 'Se connecter' : 'Créer le compte'}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Toggle Mode */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleMode}
              disabled={isLoading}
            >
              <Text style={styles.toggleText}>
                {isLoginMode 
                  ? "Pas encore de compte ? " 
                  : "Déjà un compte ? "
                }
                <Text style={styles.toggleLink}>
                  {isLoginMode ? "S'inscrire" : "Se connecter"}
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>📱 Stockage Local Sécurisé</Text>
              <Text style={styles.infoText}>
                Vos données sont stockées localement sur votre appareil de manière sécurisée. 
                Aucune information personnelle n'est envoyée sur internet.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 20,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    height: '100%',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  submitButton: {
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 24,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    elevation: 1,
    shadowOpacity: 0.1,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  toggleButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  toggleLink: {
    color: Colors.agpBlue,
    fontFamily: 'Inter-SemiBold',
  },
  infoSection: {
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpGreen,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
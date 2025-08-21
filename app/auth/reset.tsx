import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Mail, ArrowLeft, Send } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { resetPassword } from '@/lib/auth';
import AGPLogo from '@/components/AGPLogo';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre adresse email');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await resetPassword(email.trim());
      
      if (error) {
        Alert.alert('Erreur', error.message);
      } else {
        setSent(true);
        Alert.alert(
          'Email envoyé',
          'Un email de réinitialisation a été envoyé à votre adresse. Vérifiez votre boîte de réception.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/auth/login')
            }
          ]
        );
      }
    } catch (err) {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
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
      >
        {/* Header */}
        <LinearGradient
          colors={[Colors.agpBlue, Colors.agpGreen]}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ArrowLeft size={24} color={Colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <AGPLogo size={80} />
          </View>
          <Text style={styles.appTitle}>AGP Chronobiologie</Text>
          <Text style={styles.subtitle}>
            Réinitialiser votre mot de passe
          </Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <Text style={styles.formTitle}>Mot de passe oublié</Text>
            
            <Text style={styles.description}>
              Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor={Colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  editable={!loading && !sent}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, (loading || sent) && styles.submitButtonDisabled]}
              onPress={handleReset}
              disabled={loading || sent}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={(loading || sent) ? [Colors.textSecondary, Colors.textSecondary] : [Colors.agpBlue, Colors.agpGreen]}
                style={styles.submitButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.textLight} />
                ) : (
                  <>
                    <Send size={20} color={Colors.textLight} />
                    <Text style={styles.submitButtonText}>
                      {sent ? 'Email envoyé' : 'Envoyer le lien'}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => router.push('/auth/login')}
              disabled={loading}
            >
              <Text style={styles.toggleText}>
                Retour à la 
                <Text style={styles.toggleLink}> connexion</Text>
              </Text>
            </TouchableOpacity>
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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
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
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
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
});
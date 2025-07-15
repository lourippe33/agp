import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import AGPLogo from '@/components/AGPLogo';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <AGPLogo size={80} />
        </View>
        
        <Text style={styles.title}>Cette page n'existe pas</Text>
        <Text style={styles.subtitle}>
          Retournez à l'application AGP pour découvrir nos recettes
        </Text>
        <Link href="/(tabs)/matin" style={styles.link}>
          <Text style={styles.linkText}>Retour à l'accueil</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  logoContainer: {
    marginBottom: 32,
    backgroundColor: Colors.surface,
    borderRadius: 50,
    padding: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  link: {
    backgroundColor: Colors.agpBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  linkText: {
    color: Colors.textLight,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, getMomentGradient } from '@/constants/Colors';
import AGPLogo from './AGPLogo';

interface MomentHeaderProps {
  moment: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export default function MomentHeader({ moment, title, subtitle, icon }: MomentHeaderProps) {
  const gradient = getMomentGradient(moment);

  return (
    <LinearGradient colors={gradient} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.logoContainer}>
          <AGPLogo size={50} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  logoContainer: {
    marginLeft: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
  },
});
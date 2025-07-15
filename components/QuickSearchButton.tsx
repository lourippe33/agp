import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface QuickSearchButtonProps {
  style?: any;
  placeholder?: string;
}

export default function QuickSearchButton({ 
  style, 
  placeholder = "Rechercher..." 
}: QuickSearchButtonProps) {
  const navigateToSearch = () => {
    router.push('/search');
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={navigateToSearch}
      activeOpacity={0.8}
    >
      <Search size={20} color={Colors.textSecondary} />
      <Text style={styles.placeholder}>{placeholder}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  placeholder: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    flex: 1,
  },
});
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface QuickSearchButtonProps {
  style?: any;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function QuickSearchButton({ 
  style, 
  placeholder = "Rechercher...",
  onSearch
}: QuickSearchButtonProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        // Naviguer vers la page de recherche avec la requête
        router.push({
          pathname: '/search',
          params: { q: searchQuery.trim() }
        });
      }
    }
  };

  const handleSubmit = () => {
    handleSearch();
  };

  return (
    <View style={[styles.container, style]}>
      <Search size={20} color={Colors.textSecondary} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
      )}
    </View>
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
  searchInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular', 
    color: Colors.text,
    flex: 1,
  },
  searchButton: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
});
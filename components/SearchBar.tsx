import React, { useState, useEffect } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Search, X, Filter, Clock, Target, Utensils, Dumbbell } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterPress: () => void;
  placeholder?: string;
  showFilters?: boolean;
  activeFiltersCount?: number;
}

const { width } = Dimensions.get('window');

export default function SearchBar({ 
  onSearch, 
  onFilterPress, 
  placeholder = "Rechercher...",
  showFilters = true,
  activeFiltersCount = 0
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Fonction mémorisée pour éviter les re-renders
  const updateQuery = useCallback((text: string) => setQuery(text), []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(query);
    }, 300); // Délai pour éviter trop de requêtes

    return () => clearTimeout(delayedSearch);
  }, [query, onSearch]);

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
        <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          value={query}
          onChangeText={updateQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {showFilters && (
        <TouchableOpacity 
          style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]}
          onPress={onFilterPress}
          activeOpacity={0.8}
        >
          <Filter size={20} color={activeFiltersCount > 0 ? Colors.textLight : Colors.textSecondary} />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  searchContainerFocused: {
    borderColor: Colors.agpBlue,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: Colors.agpBlue,
    borderColor: Colors.agpBlue,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.relaxation,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
});
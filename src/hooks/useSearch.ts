import { useState, useMemo } from 'react';
import { Recipe } from '@/types/Recipe';
import { Exercise } from '@/types/Exercise';
import { FilterOptions } from '@/components/FilterModal';

interface UseSearchProps {
  recipes?: Recipe[];
  exercises?: Exercise[];
}

interface SearchResult {
  recipes: Recipe[];
  exercises: Exercise[];
  totalResults: number;
}

export function useSearch({ recipes = [], exercises = [] }: UseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    moments: [],
    durations: [],
    levels: [],
    types: [],
    categories: [],
  });

  const searchResults = useMemo((): SearchResult => {
    let filteredRecipes = [...recipes];
    let filteredExercises = [...exercises];

    // Filtrage par recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.titre.toLowerCase().includes(query) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(query)) ||
        recipe.ingredients.some(ing => ing.nom.toLowerCase().includes(query))
      );

      filteredExercises = filteredExercises.filter(exercise =>
        exercise.titre.toLowerCase().includes(query) ||
        exercise.tags.some(tag => tag.toLowerCase().includes(query)) ||
        exercise.description.toLowerCase().includes(query) ||
        exercise.benefices.some(benefice => benefice.toLowerCase().includes(query))
      );
    }

    // Filtrage par moments
    if (filters.moments.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        filters.moments.includes(recipe.moment)
      );

      filteredExercises = filteredExercises.filter(exercise =>
        exercise.momentIdeal.some(moment => 
          filters.moments.some(filterMoment => 
            moment.toLowerCase().includes(filterMoment.toLowerCase())
          )
        )
      );
    }

    // Filtrage par durée
    if (filters.durations.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const totalTime = recipe.tempsPreparation + recipe.tempsCuisson;
        return filters.durations.some(duration => {
          switch (duration) {
            case '2-5': return totalTime <= 5;
            case '5-15': return totalTime > 5 && totalTime <= 15;
            case '15-30': return totalTime > 15 && totalTime <= 30;
            case '30+': return totalTime > 30;
            default: return false;
          }
        });
      });

      filteredExercises = filteredExercises.filter(exercise => {
        return filters.durations.some(duration => {
          switch (duration) {
            case '2-5': return exercise.duree <= 5;
            case '5-15': return exercise.duree > 5 && exercise.duree <= 15;
            case '15-30': return exercise.duree > 15 && exercise.duree <= 30;
            case '30+': return exercise.duree > 30;
            default: return false;
          }
        });
      });
    }

    // Filtrage par niveau (pour les exercices)
    if (filters.levels.length > 0) {
      filteredExercises = filteredExercises.filter(exercise => {
        const difficultyMap: { [key: string]: string } = {
          'Très facile': 'debutant',
          'Facile': 'debutant',
          'Moyen': 'intermediaire',
          'Difficile': 'avance',
        };
        const exerciseLevel = difficultyMap[exercise.difficulte] || 'debutant';
        return filters.levels.includes(exerciseLevel);
      });
    }

    // Filtrage par types (pour les recettes)
    if (filters.types.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.tags.some(tag => 
          filters.types.some(type => 
            tag.toLowerCase().includes(type.toLowerCase())
          )
        )
      );
    }

    // Filtrage par catégories (pour les exercices)
    if (filters.categories.length > 0) {
      filteredExercises = filteredExercises.filter(exercise =>
        filters.categories.includes(exercise.type)
      );
    }

    return {
      recipes: filteredRecipes,
      exercises: filteredExercises,
      totalResults: filteredRecipes.length + filteredExercises.length,
    };
  }, [recipes, exercises, searchQuery, filters]);

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, arr) => count + arr.length, 0);
  };

  const clearFilters = () => {
    setFilters({
      moments: [],
      durations: [],
      levels: [],
      types: [],
      categories: [],
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearAll = () => {
    clearSearch();
    clearFilters();
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    searchResults,
    getActiveFiltersCount,
    clearFilters,
    clearSearch,
    clearAll,
  };
}
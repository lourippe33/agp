import { useState } from 'react';
import { Clock, Users, ChefHat, Heart, Search } from 'lucide-react';
import recipesData from './recettes.json';

interface RecipeIngredient {
  nom: string;
  quantite: string;
}

interface RecipeFromJson {
  id: number;
  titre: string;
  moment: string;
  image: string;
  tempsPreparation: number;
  tempsCuisson: number;
  difficulte: string;
  tags: string[];
  ingredients: RecipeIngredient[];
  etapes: string[];
  nutritionPour100g: {
    calories: number;
    proteines: number;
    glucides: number;
    lipides: number;
  };
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  calories: number;
  category: string;
  difficulty: string;
}

const convertJsonRecipes = (jsonRecipes: RecipeFromJson[]): Recipe[] => {
  return jsonRecipes.map(recipe => ({
    id: recipe.id.toString(),
    title: recipe.titre,
    description: recipe.tags.join(', '),
    imageUrl: recipe.image,
    prepTime: recipe.tempsPreparation,
    cookTime: recipe.tempsCuisson,
    servings: 2,
    ingredients: recipe.ingredients.map(i => `${i.quantite} ${i.nom}`),
    instructions: recipe.etapes,
    calories: recipe.nutritionPour100g.calories,
    category: recipe.moment === 'matin' ? 'Petit-déjeuner' : recipe.moment === 'midi' ? 'Déjeuner' : recipe.moment === 'gouter' ? 'Goûter' : 'Dîner',
    difficulty: recipe.difficulte === 'Très facile' ? 'easy' : recipe.difficulte === 'Facile' ? 'easy' : recipe.difficulte === 'Moyen' ? 'medium' : 'hard',
  }));
};

const allRecipes = convertJsonRecipes(recipesData.recettes);

export function RecipesSection() {
  const [recipes] = useState<Recipe[]>(allRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'Petit-déjeuner', 'Déjeuner', 'Goûter', 'Dîner'];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || recipe.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Facile';
      case 'medium':
        return 'Moyen';
      case 'hard':
        return 'Difficile';
      default:
        return difficulty;
    }
  };

  if (selectedRecipe) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedRecipe(null)}
          className="text-[#4A7729] hover:text-[#7AC943] font-semibold"
        >
          ← Retour aux recettes
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <img
            src={selectedRecipe.imageUrl}
            alt={selectedRecipe.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-[#333333] mb-2">{selectedRecipe.title}</h2>
                <p className="text-gray-600">{selectedRecipe.description}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>{selectedRecipe.prepTime + selectedRecipe.cookTime} min</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-5 h-5" />
                <span>{selectedRecipe.servings} personnes</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <ChefHat className="w-5 h-5" />
                <span>{selectedRecipe.calories} cal</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                {getDifficultyLabel(selectedRecipe.difficulty)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">Ingrédients</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#7AC943] rounded-full" />
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#7AC943] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#333333]">Recettes</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une recette..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterCategory === category
                    ? 'bg-[#7AC943] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Toutes' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="relative overflow-hidden">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-[#333333] mb-2 group-hover:text-[#4A7729] transition-colors">
                {recipe.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.prepTime + recipe.cookTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{recipe.servings}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                  {getDifficultyLabel(recipe.difficulty)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

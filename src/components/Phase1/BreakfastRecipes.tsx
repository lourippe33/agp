import { useState } from 'react';
import { ChefHat, Clock, TrendingUp, Heart } from 'lucide-react';
import recipesData from '../Recipes/recettes.json';

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

interface BreakfastRecipe {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  prep_time_minutes: number;
  calories: number;
  protein_grams: number;
  healthy_fats: string[];
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
}

const getMealPeriod = (): string => {
  const hour = new Date().getHours();
  if (hour < 11) return 'matin';
  if (hour < 16) return 'midi';
  if (hour < 19) return 'gouter';
  return 'soir';
};

const getMealTitle = (period: string): { title: string; description: string } => {
  switch (period) {
    case 'matin':
      return {
        title: 'Petits-déjeuners équilibrés',
        description: 'Recettes riches en bons gras pour bien démarrer la journée'
      };
    case 'midi':
      return {
        title: 'Déjeuners équilibrés',
        description: 'Repas complets et nutritifs pour le milieu de journée'
      };
    case 'gouter':
      return {
        title: 'Goûters sains',
        description: 'Collations équilibrées pour recharger vos batteries'
      };
    case 'soir':
      return {
        title: 'Dîners légers',
        description: 'Repas du soir pour une bonne digestion'
      };
    default:
      return {
        title: 'Recettes équilibrées',
        description: 'Recettes saines pour tous les moments'
      };
  }
};

const convertToBreakfastRecipes = (jsonRecipes: RecipeFromJson[], period: string): BreakfastRecipe[] => {
  return jsonRecipes
    .filter(recipe => recipe.moment === period)
    .map(recipe => ({
      id: recipe.id.toString(),
      title: recipe.titre,
      description: recipe.tags.join(', '),
      difficulty: recipe.difficulte,
      prep_time_minutes: recipe.tempsPreparation,
      calories: recipe.nutritionPour100g.calories,
      protein_grams: recipe.nutritionPour100g.proteines,
      healthy_fats: recipe.tags.filter(tag =>
        ['avocat', 'amandes', 'noix', 'graines', 'saumon', 'huile-olive'].includes(tag)
      ),
      ingredients: recipe.ingredients.map(i => `${i.quantite} ${i.nom}`),
      instructions: recipe.etapes,
      imageUrl: recipe.image,
    }));
};

export function BreakfastRecipes() {
  const currentPeriod = getMealPeriod();
  const mealInfo = getMealTitle(currentPeriod);
  const breakfastRecipes = convertToBreakfastRecipes(recipesData.recettes, currentPeriod);
  const [selectedRecipe, setSelectedRecipe] = useState<BreakfastRecipe | null>(null);

  if (selectedRecipe) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedRecipe(null)}
          className="text-[#2B7BBE] font-medium flex items-center space-x-2 hover:underline"
        >
          <span>←</span>
          <span>Retour aux recettes</span>
        </button>

        <RecipeDetail recipe={selectedRecipe} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#5FA84D] to-[#2B7BBE] rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <ChefHat className="w-8 h-8" />
          <h2 className="text-2xl font-bold">{mealInfo.title}</h2>
        </div>
        <p className="text-white text-opacity-90">
          {mealInfo.description}
        </p>
      </div>

      <div className="grid gap-4">
        {breakfastRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => setSelectedRecipe(recipe)}
          />
        ))}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onClick }: { recipe: BreakfastRecipe; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all text-left w-full group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#333333] mb-2 group-hover:text-[#2B7BBE] transition-colors">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
        </div>
        <div className="bg-[#5FA84D] bg-opacity-10 px-3 py-1 rounded-lg ml-4">
          <span className="text-xs font-semibold text-[#5FA84D] uppercase">
            {recipe.difficulty}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{recipe.prep_time_minutes} min</span>
        </div>
        {recipe.calories && (
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>{recipe.calories} kcal</span>
          </div>
        )}
        {recipe.protein_grams && (
          <div className="flex items-center space-x-1">
            <span className="font-semibold">{recipe.protein_grams}g</span>
            <span>protéines</span>
          </div>
        )}
      </div>

      {recipe.healthy_fats.length > 0 && (
        <div className="mt-3 flex items-center space-x-2">
          <Heart className="w-4 h-4 text-[#2B7BBE]" />
          <div className="flex flex-wrap gap-2">
            {recipe.healthy_fats.map((fat, index) => (
              <span
                key={index}
                className="text-xs bg-blue-50 text-[#2B7BBE] px-2 py-1 rounded-full"
              >
                {fat}
              </span>
            ))}
          </div>
        </div>
      )}
    </button>
  );
}

function RecipeDetail({ recipe }: { recipe: BreakfastRecipe }) {
  return (
    <div className="space-y-6">
      {recipe.imageUrl && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#333333] mb-2">{recipe.title}</h2>
            <p className="text-gray-600">{recipe.description}</p>
          </div>
          <div className="bg-[#5FA84D] bg-opacity-10 px-4 py-2 rounded-lg">
            <span className="text-sm font-semibold text-[#5FA84D] uppercase">
              {recipe.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6 py-4 border-t border-b border-gray-100 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#2B7BBE]" />
            <span className="font-medium">{recipe.prep_time_minutes} minutes</span>
          </div>
          {recipe.calories && (
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#2B7BBE]" />
              <span className="font-medium">{recipe.calories} kcal</span>
            </div>
          )}
          {recipe.protein_grams && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-[#2B7BBE]">{recipe.protein_grams}g</span>
              <span className="text-gray-600">protéines</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#333333] mb-4">Ingrédients</h3>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="text-[#5FA84D] mt-1">•</span>
              <span className="text-gray-700">{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#333333] mb-4">Préparation</h3>
        <ol className="space-y-3">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#2B7BBE] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>
              <span className="text-gray-700 flex-1">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {recipe.healthy_fats.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Heart className="w-6 h-6 text-[#2B7BBE]" />
            <h3 className="text-lg font-bold text-[#333333]">Bons gras de cette recette</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recipe.healthy_fats.map((fat, index) => (
              <span
                key={index}
                className="bg-white text-[#2B7BBE] px-4 py-2 rounded-lg font-medium shadow-sm"
              >
                {fat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

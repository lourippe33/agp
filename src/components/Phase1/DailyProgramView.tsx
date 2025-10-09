import { useState, useEffect } from 'react';
import { Coffee, Sun, Cookie, Moon, Dumbbell, ChevronRight, ArrowLeft, RefreshCw } from 'lucide-react';
import recettesData from '../Recipes/recettes.json';
import exercicesData from '../Sports/exercices.json';

interface DailyProgramViewProps {
  currentDay: number;
  onBack: () => void;
}

interface Recipe {
  id: number;
  titre: string;
  moment: string;
  image: string;
  tempsPreparation: number;
  difficulte: string;
  ingredients: { nom: string; quantite: string }[];
  etapes: string[];
  nutritionPour100g: {
    calories: number;
    proteines: number;
    glucides: number;
    lipides: number;
  };
}

interface Exercise {
  id: number;
  titre: string;
  type: string;
  niveau: string;
  image: string;
  duree: number;
  difficulte: string;
  calories: number;
  description: string;
  etapes: string[];
  benefices: string[];
}

export function DailyProgramView({ currentDay, onBack }: DailyProgramViewProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const [dailyMeals, setDailyMeals] = useState({
    breakfast: null as Recipe | null,
    lunch: null as Recipe | null,
    snack: null as Recipe | null,
    dinner: null as Recipe | null,
  });

  const [dailyActivity, setDailyActivity] = useState<Exercise | null>(null);

  const getRandomRecipe = (moment: string, excludeId?: number): Recipe => {
    const recipes = recettesData.recettes as Recipe[];
    const filtered = recipes.filter(r => r.moment === moment && r.id !== excludeId);
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const getRandomExercise = (excludeId?: number): Exercise => {
    const exercises = exercicesData.exercices as Exercise[];
    const filtered = exercises.filter(e => e.id !== excludeId);
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const changeBreakfast = () => {
    setDailyMeals(prev => ({
      ...prev,
      breakfast: getRandomRecipe('matin', prev.breakfast?.id)
    }));
  };

  const changeLunch = () => {
    setDailyMeals(prev => ({
      ...prev,
      lunch: getRandomRecipe('midi', prev.lunch?.id)
    }));
  };

  const changeSnack = () => {
    setDailyMeals(prev => ({
      ...prev,
      snack: getRandomRecipe('gouter', prev.snack?.id)
    }));
  };

  const changeDinner = () => {
    setDailyMeals(prev => ({
      ...prev,
      dinner: getRandomRecipe('soir', prev.dinner?.id)
    }));
  };

  const changeActivity = () => {
    setDailyActivity(prev => getRandomExercise(prev?.id));
  };

  useEffect(() => {
    const recipes = recettesData.recettes as Recipe[];
    const exercises = exercicesData.exercices as Exercise[];

    const seed = currentDay;
    const random = (index: number) => {
      const x = Math.sin(seed * index) * 10000;
      return x - Math.floor(x);
    };

    const breakfastRecipes = recipes.filter(r => r.moment === 'matin');
    const lunchRecipes = recipes.filter(r => r.moment === 'midi');
    const snackRecipes = recipes.filter(r => r.moment === 'gouter');
    const dinnerRecipes = recipes.filter(r => r.moment === 'soir');

    const breakfast = breakfastRecipes[Math.floor(random(1) * breakfastRecipes.length)];
    const lunch = lunchRecipes[Math.floor(random(2) * lunchRecipes.length)];
    const snack = snackRecipes[Math.floor(random(3) * snackRecipes.length)];
    const dinner = dinnerRecipes[Math.floor(random(4) * dinnerRecipes.length)];
    const activity = exercises[Math.floor(random(5) * exercises.length)];

    setDailyMeals({ breakfast, lunch, snack, dinner });
    setDailyActivity(activity);
  }, [currentDay]);

  if (selectedRecipe) {
    return (
      <div className="pb-24 px-6">
        <button
          onClick={() => setSelectedRecipe(null)}
          className="flex items-center space-x-2 text-[#2B7BBE] mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <img src={selectedRecipe.image} alt={selectedRecipe.titre} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#333333] mb-2">{selectedRecipe.titre}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span>{selectedRecipe.tempsPreparation} min</span>
              <span>•</span>
              <span>{selectedRecipe.difficulte}</span>
              <span>•</span>
              <span>{selectedRecipe.nutritionPour100g.calories} kcal/100g</span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-3">Ingrédients</h3>
              <ul className="space-y-2">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#5FA84D] rounded-full"></div>
                    <span className="text-gray-700">{ing.nom} - {ing.quantite}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#333333] mb-3">Préparation</h3>
              <ol className="space-y-3">
                {selectedRecipe.etapes.map((etape, idx) => (
                  <li key={idx} className="flex space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#2B7BBE] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{etape}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedExercise) {
    return (
      <div className="pb-24 px-6">
        <button
          onClick={() => setSelectedExercise(null)}
          className="flex items-center space-x-2 text-[#2B7BBE] mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <img src={selectedExercise.image} alt={selectedExercise.titre} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#333333] mb-2">{selectedExercise.titre}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span>{selectedExercise.duree} min</span>
              <span>•</span>
              <span>{selectedExercise.difficulte}</span>
              <span>•</span>
              <span>{selectedExercise.calories} kcal</span>
            </div>

            <p className="text-gray-700 mb-6">{selectedExercise.description}</p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-3">Étapes</h3>
              <ol className="space-y-3">
                {selectedExercise.etapes.map((etape, idx) => (
                  <li key={idx} className="flex space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#5FA84D] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{etape}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#333333] mb-3">Bénéfices</h3>
              <ul className="space-y-2">
                {selectedExercise.benefices.map((benefice, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#5FA84D] rounded-full"></div>
                    <span className="text-gray-700">{benefice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-[#2B7BBE] via-[#4A9CD9] to-[#5FA84D] pt-8 pb-12 px-6 rounded-b-3xl mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour au programme</span>
        </button>
        <h1 className="text-2xl font-bold text-white mb-2">
          Jour {currentDay}
        </h1>
        <p className="text-white text-opacity-90">
          Votre programme personnalisé du jour
        </p>
      </div>

      <div className="px-6 space-y-4">
        <h2 className="text-xl font-bold text-[#333333] mb-3">Vos repas du jour</h2>

        {dailyMeals.breakfast && (
          <MealCard
            icon={Coffee}
            title="Petit-déjeuner"
            recipe={dailyMeals.breakfast}
            color="bg-[#FFB84D]"
            onClick={() => setSelectedRecipe(dailyMeals.breakfast)}
            onRefresh={changeBreakfast}
          />
        )}

        {dailyMeals.lunch && (
          <MealCard
            icon={Sun}
            title="Déjeuner"
            recipe={dailyMeals.lunch}
            color="bg-[#F97316]"
            onClick={() => setSelectedRecipe(dailyMeals.lunch)}
            onRefresh={changeLunch}
          />
        )}

        {dailyMeals.snack && (
          <MealCard
            icon={Cookie}
            title="Collation"
            recipe={dailyMeals.snack}
            color="bg-[#8B5CF6]"
            onClick={() => setSelectedRecipe(dailyMeals.snack)}
            onRefresh={changeSnack}
          />
        )}

        {dailyMeals.dinner && (
          <MealCard
            icon={Moon}
            title="Dîner"
            recipe={dailyMeals.dinner}
            color="bg-[#6366F1]"
            onClick={() => setSelectedRecipe(dailyMeals.dinner)}
            onRefresh={changeDinner}
          />
        )}

        <h2 className="text-xl font-bold text-[#333333] mb-3 mt-8">Votre activité du jour</h2>

        {dailyActivity && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div
              onClick={() => setSelectedExercise(dailyActivity)}
              className="cursor-pointer"
            >
              <div className="relative h-40">
                <img
                  src={dailyActivity.image}
                  alt={dailyActivity.titre}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-[#5FA84D] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {dailyActivity.duree} min
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#5FA84D] p-2 rounded-lg">
                      <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#333333]">{dailyActivity.titre}</h3>
                      <p className="text-sm text-gray-600">{dailyActivity.difficulte} • {dailyActivity.calories} kcal</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="px-4 pb-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  changeActivity();
                }}
                className="w-full bg-gradient-to-r from-[#2B7BBE] to-[#5FA84D] text-white py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Changer l'activité</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MealCardProps {
  icon: any;
  title: string;
  recipe: Recipe;
  color: string;
  onClick: () => void;
  onRefresh: () => void;
}

function MealCard({ icon: Icon, title, recipe, color, onClick, onRefresh }: MealCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div
        onClick={onClick}
        className="cursor-pointer"
      >
        <div className="relative h-32">
          <img
            src={recipe.image}
            alt={recipe.titre}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
            {recipe.tempsPreparation} min
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${color} p-2 rounded-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">{title}</p>
                <h3 className="font-bold text-[#333333]">{recipe.titre}</h3>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRefresh();
          }}
          className="w-full bg-gradient-to-r from-[#2B7BBE] to-[#5FA84D] text-white py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Changer le repas</span>
        </button>
      </div>
    </div>
  );
}

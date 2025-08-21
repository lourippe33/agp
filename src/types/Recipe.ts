export interface Ingredient {
  nom: string;
  quantite: string;
}

export interface Recipe {
  id: number;
  titre: string;
  moment: 'matin' | 'midi' | 'gouter' | 'soir';
  image: string;
  tempsPreparation: number;
  tempsCuisson: number;
  difficulte: 'Très facile' | 'Facile' | 'Moyen' | 'Difficile';
  tags: string[];
  ingredients: Ingredient[];
  etapes: string[];
  nutritionPour100g: {
    calories: number;
    proteines: number;
    glucides: number;
    lipides: number;
    fibres?: number;
  };
}

export interface RecipeData {
  recettes: Recipe[];
}
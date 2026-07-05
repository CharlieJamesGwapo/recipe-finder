// Recipe types from Spoonacular API
export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  missedIngredients?: Ingredient[];
  usedIngredients?: Ingredient[];
  nutrition?: Nutrition;
  cuisines?: string[];
  diets?: string[];
  dishTypes?: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  spoonacularScore?: number;
  analyzedInstructions?: Instruction[];
  extendedIngredients?: ExtendedIngredient[];
  summary?: string;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  ketogenic?: boolean;
  paleo?: boolean;
}

export interface Ingredient {
  id: number;
  name: string;
  amount?: number;
  unit?: string;
  original?: string;
  aisle?: string;
}

export interface ExtendedIngredient extends Ingredient {
  measures?: {
    metric?: {
      value: number;
      unit: string;
    };
    us?: {
      value: number;
      unit: string;
    };
  };
  meta?: string[];
}

export interface Instruction {
  name?: string;
  steps: CookingStep[];
}

export interface CookingStep {
  number: number;
  step: string;
  ingredients: {
    id: number;
    name: string;
    localizedName: string;
  }[];
  equipment: {
    id: number;
    name: string;
    localizedName: string;
  }[];
  length?: {
    number: number;
    unit: string;
  };
}

export interface Nutrition {
  nutrients: Nutrient[];
  caloricBreakdown?: {
    percentProtein: number;
    percentFat: number;
    percentCarbs: number;
  };
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds?: number;
}

// User data types
export interface UserPreferences {
  apiKey: string;
  theme: 'light' | 'dark' | 'system';
  dietaryRestrictions: string[];
  allergens: string[];
  servingsDefault: number;
}

export interface FavoriteRecipe {
  recipeId: number;
  addedAt: number;
}

export interface MealPlanEntry {
  date: string; // YYYY-MM-DD
  recipeId: number;
  servings: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  checked: boolean;
  recipes: number[]; // recipe IDs this came from
}

export interface RecipeNote {
  recipeId: number;
  text: string;
  updatedAt: number;
}

// Search filters
export interface SearchFilters {
  cuisine?: string[];
  diet?: string[];
  intolerance?: string[];
  type?: string;
}

// API response types
export interface RecipeSearchResult {
  results: Recipe[];
  offset: number;
  number: number;
  totalResults: number;
}

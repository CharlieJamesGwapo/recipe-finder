import { Recipe, RecipeSearchResult, SearchFilters } from './types';

const SPOONACULAR_BASE = 'https://api.spoonacular.com/recipes';

interface SearchParams {
  apiKey: string;
  query: string;
  number?: number;
  offset?: number;
  filters?: SearchFilters;
}

interface RecipesParams {
  ids: number[];
  apiKey: string;
}

export async function searchRecipes({
  apiKey,
  query,
  number = 12,
  offset = 0,
  filters,
}: SearchParams): Promise<RecipeSearchResult> {
  if (!apiKey) {
    throw new Error('API key is required. Please set it in settings.');
  }

  const params = new URLSearchParams({
    apiKey,
    query,
    number: String(number),
    offset: String(offset),
    addRecipeInformation: 'true',
    fillIngredients: 'true',
  });

  if (filters?.cuisine && filters.cuisine.length > 0) {
    params.append('cuisine', filters.cuisine.join(','));
  }
  if (filters?.diet && filters.diet.length > 0) {
    params.append('diet', filters.diet.join(','));
  }
  if (filters?.intolerance && filters.intolerance.length > 0) {
    params.append('intolerances', filters.intolerance.join(','));
  }
  if (filters?.type) {
    params.append('type', filters.type);
  }

  const response = await fetch(
    `${SPOONACULAR_BASE}/complexSearch?${params.toString()}`
  );

  if (!response.ok) {
    if (response.status === 402) {
      throw new Error('API quota exceeded. Please check your Spoonacular API plan.');
    }
    throw new Error('Failed to search recipes');
  }

  return response.json();
}

export async function getRecipeDetails(id: number, apiKey: string): Promise<Recipe> {
  if (!apiKey) {
    throw new Error('API key is required. Please set it in settings.');
  }

  const params = new URLSearchParams({
    apiKey,
    includeNutrition: 'true',
  });

  const response = await fetch(`${SPOONACULAR_BASE}/${id}/information?${params.toString()}`);

  if (!response.ok) {
    if (response.status === 402) {
      throw new Error('API quota exceeded. Please check your Spoonacular API plan.');
    }
    throw new Error('Failed to fetch recipe details');
  }

  return response.json();
}

export async function getRecipesByIds({ ids, apiKey }: RecipesParams): Promise<Recipe[]> {
  if (!apiKey) {
    throw new Error('API key is required. Please set it in settings.');
  }

  const params = new URLSearchParams({
    apiKey,
    includeNutrition: 'true',
  });

  const response = await fetch(
    `${SPOONACULAR_BASE}/informationBulk?ids=${ids.join(',')}&${params.toString()}`
  );

  if (!response.ok) {
    if (response.status === 402) {
      throw new Error('API quota exceeded. Please check your Spoonacular API plan.');
    }
    throw new Error('Failed to fetch recipes');
  }

  return response.json();
}

export const CUISINES = [
  'African',
  'Asian',
  'American',
  'British',
  'Cajun',
  'Caribbean',
  'Chinese',
  'Eastern European',
  'European',
  'French',
  'German',
  'Greek',
  'Indian',
  'Irish',
  'Italian',
  'Japanese',
  'Jewish',
  'Korean',
  'Latin American',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Nordic',
  'Southern',
  'Spanish',
  'Thai',
  'Vietnamese',
];

export const DIETS = [
  'Gluten Free',
  'Ketogenic',
  'Vegetarian',
  'Lacto-Vegetarian',
  'Ovo-Vegetarian',
  'Vegan',
  'Paleo',
  'Primal',
  'Low FODMAP',
  'Whole30',
  'Pescatarian',
];

export const INTOLERANCES = [
  'Dairy',
  'Egg',
  'Gluten',
  'Grain',
  'Peanut',
  'Seafood',
  'Sesame',
  'Shellfish',
  'Soy',
  'Tree Nut',
  'Wheat',
];

export const MEAL_TYPES = ['main course', 'side dish', 'dessert', 'appetizer', 'soup', 'salad', 'bread', 'beverage', 'breakfast', 'snack'];

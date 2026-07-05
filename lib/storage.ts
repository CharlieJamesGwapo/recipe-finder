import {
  UserPreferences,
  FavoriteRecipe,
  MealPlanEntry,
  ShoppingItem,
  RecipeNote,
} from './types';

const STORAGE_KEYS = {
  PREFERENCES: 'rf_preferences',
  FAVORITES: 'rf_favorites',
  MEAL_PLAN: 'rf_meal_plan',
  SHOPPING_LIST: 'rf_shopping_list',
  NOTES: 'rf_notes',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  apiKey: '',
  theme: 'system',
  dietaryRestrictions: [],
  allergens: [],
  servingsDefault: 4,
};

// Preferences
export const getPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
  return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
};

export const savePreferences = (prefs: UserPreferences): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
};

// Favorites
export const getFavorites = (): FavoriteRecipe[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  return stored ? JSON.parse(stored) : [];
};

export const addFavorite = (recipeId: number): void => {
  if (typeof window === 'undefined') return;
  const favorites = getFavorites();
  if (!favorites.find((f) => f.recipeId === recipeId)) {
    favorites.push({ recipeId, addedAt: Date.now() });
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }
};

export const removeFavorite = (recipeId: number): void => {
  if (typeof window === 'undefined') return;
  const favorites = getFavorites().filter((f) => f.recipeId !== recipeId);
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
};

export const isFavorite = (recipeId: number): boolean => {
  return getFavorites().some((f) => f.recipeId === recipeId);
};

// Meal Plan
export const getMealPlan = (): MealPlanEntry[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.MEAL_PLAN);
  return stored ? JSON.parse(stored) : [];
};

export const addMealPlanEntry = (entry: MealPlanEntry): void => {
  if (typeof window === 'undefined') return;
  const plan = getMealPlan();
  // Remove existing entry for same date
  const filtered = plan.filter((e) => e.date !== entry.date);
  filtered.push(entry);
  localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(filtered));
};

export const removeMealPlanEntry = (date: string): void => {
  if (typeof window === 'undefined') return;
  const plan = getMealPlan().filter((e) => e.date !== date);
  localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(plan));
};

export const getMealPlanForDateRange = (startDate: string, endDate: string): MealPlanEntry[] => {
  const plan = getMealPlan();
  return plan.filter((entry) => entry.date >= startDate && entry.date <= endDate);
};

// Shopping List
export const getShoppingList = (): ShoppingItem[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
  return stored ? JSON.parse(stored) : [];
};

export const saveShoppingList = (items: ShoppingItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(items));
};

export const addShoppingItem = (item: ShoppingItem): void => {
  if (typeof window === 'undefined') return;
  const items = getShoppingList();
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    existing.amount += item.amount;
    existing.recipes = [...new Set([...existing.recipes, ...item.recipes])];
  } else {
    items.push(item);
  }
  saveShoppingList(items);
};

export const toggleShoppingItemCheck = (itemId: string): void => {
  if (typeof window === 'undefined') return;
  const items = getShoppingList();
  const item = items.find((i) => i.id === itemId);
  if (item) {
    item.checked = !item.checked;
    saveShoppingList(items);
  }
};

export const clearShoppingList = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify([]));
};

// Notes
export const getNotes = (): RecipeNote[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
  return stored ? JSON.parse(stored) : [];
};

export const saveNote = (recipeId: number, text: string): void => {
  if (typeof window === 'undefined') return;
  const notes = getNotes();
  const existing = notes.find((n) => n.recipeId === recipeId);
  if (existing) {
    existing.text = text;
    existing.updatedAt = Date.now();
  } else {
    notes.push({ recipeId, text, updatedAt: Date.now() });
  }
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
};

export const getNote = (recipeId: number): string => {
  const notes = getNotes();
  return notes.find((n) => n.recipeId === recipeId)?.text || '';
};

export const deleteNote = (recipeId: number): void => {
  if (typeof window === 'undefined') return;
  const notes = getNotes().filter((n) => n.recipeId !== recipeId);
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
};

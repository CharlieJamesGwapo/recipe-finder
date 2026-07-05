'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { ServingsScaler } from '@/components/ServingsScaler';
import { IngredientsList } from '@/components/IngredientsList';
import { NutritionPanel } from '@/components/NutritionPanel';
import { CookingSteps } from '@/components/CookingSteps';
import { NotesSection } from '@/components/NotesSection';
import { getPreferences, isFavorite, addFavorite, removeFavorite } from '@/lib/storage';
import { getRecipeDetails } from '@/lib/api';
import { Recipe } from '@/lib/types';

interface RecipePageProps {
  params: {
    id: string;
  };
}

export default function RecipePage({ params }: RecipePageProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [servings, setServings] = useState(4);
  const [isFav, setIsFav] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'nutrition' | 'steps' | 'notes'>('ingredients');

  useEffect(() => {
    setMounted(true);
    loadRecipe();
  }, [params.id]);

  useEffect(() => {
    if (recipe) {
      setIsFav(isFavorite(recipe.id));
      setServings(recipe.servings || 4);
    }
  }, [recipe]);

  const loadRecipe = async () => {
    setLoading(true);
    setError('');

    try {
      const prefs = getPreferences();
      if (!prefs.apiKey) {
        throw new Error('API key not configured. Please set it in Settings.');
      }

      const data = await getRecipeDetails(parseInt(params.id), prefs.apiKey);
      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = () => {
    if (recipe) {
      if (isFav) {
        removeFavorite(recipe.id);
        setIsFav(false);
      } else {
        addFavorite(recipe.id);
        setIsFav(true);
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors">
            🍳 Recipe Finder
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/" className="font-medium text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors">
              Home
            </Link>
            <Link href="/favorites" className="font-medium text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors">
              ❤️ Favorites
            </Link>
            <Link href="/meal-plan" className="font-medium text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors">
              📅 Meal Plan
            </Link>
            <Link href="/shopping-list" className="font-medium text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors">
              🛒 Shopping List
            </Link>
            <Link href="/settings" className="font-medium text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors">
              ⚙️ Settings
            </Link>
          </div>
          <DarkModeToggle />
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <p className="text-2xl mb-2">⏳</p>
              <p className="text-slate-600 dark:text-slate-400">Loading recipe...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1 mb-4">{error}</p>
            <Link href="/" className="text-sm font-medium hover:underline">
              ← Back to home
            </Link>
          </div>
        ) : recipe ? (
          <>
            {/* Header Section */}
            <div className="mb-8">
              <Link href="/search?q=" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4 inline-block">
                ← Back to search
              </Link>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {recipe.image && (
                  <div className="md:col-span-1">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    {recipe.title}
                  </h1>

                  {recipe.spoonacularScore && (
                    <p className="text-lg text-orange-600 dark:text-orange-400 font-semibold mb-4">
                      ⭐ {recipe.spoonacularScore.toFixed(1)} / 100
                    </p>
                  )}

                  {/* Tags */}
                  {(recipe.cuisines || recipe.diets) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {recipe.cuisines && recipe.cuisines.length > 0 && (
                        <>
                          {recipe.cuisines.map((cuisine) => (
                            <span
                              key={cuisine}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm font-medium"
                            >
                              {cuisine}
                            </span>
                          ))}
                        </>
                      )}
                      {recipe.diets && recipe.diets.length > 0 && (
                        <>
                          {recipe.diets.map((diet) => (
                            <span
                              key={diet}
                              className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full text-sm font-medium"
                            >
                              {diet}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                  )}

                  {/* Summary */}
                  {recipe.summary && (
                    <div
                      className="mb-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: recipe.summary }}
                    />
                  )}

                  {/* Quick Info */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {recipe.prepTime && (
                      <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Prep Time</p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {recipe.prepTime} min
                        </p>
                      </div>
                    )}
                    {recipe.cookTime && (
                      <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Cook Time</p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {recipe.cookTime} min
                        </p>
                      </div>
                    )}
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Servings</p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {recipe.servings || 4}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleFavorite}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isFav
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      {isFav ? '❤️ Favorited' : '🤍 Add to Favorites'}
                    </button>
                    <Link
                      href="/meal-plan"
                      className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-center"
                    >
                      📅 Add to Meal Plan
                    </Link>
                  </div>
                </div>
              </div>

              {/* Servings Scaler */}
              <ServingsScaler
                defaultServings={servings}
                onServingsChange={setServings}
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
              {['ingredients', 'nutrition', 'steps', 'notes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {tab === 'ingredients' && '🥘 Ingredients'}
                  {tab === 'nutrition' && '💪 Nutrition'}
                  {tab === 'steps' && '👨‍🍳 Steps'}
                  {tab === 'notes' && '📝 Notes'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'ingredients' && recipe.extendedIngredients && (
              <IngredientsList
                ingredients={recipe.extendedIngredients}
                recipeId={recipe.id}
                servings={servings}
              />
            )}

            {activeTab === 'nutrition' && (
              <NutritionPanel nutrition={recipe.nutrition} servings={servings} />
            )}

            {activeTab === 'steps' && (
              <CookingSteps instructions={recipe.analyzedInstructions} />
            )}

            {activeTab === 'notes' && (
              <NotesSection recipeId={recipe.id} />
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}

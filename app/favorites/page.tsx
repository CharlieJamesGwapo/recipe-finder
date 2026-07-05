'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { RecipeCard } from '@/components/RecipeCard';
import { getFavorites, getPreferences } from '@/lib/storage';
import { getRecipesByIds } from '@/lib/api';
import { Recipe } from '@/lib/types';

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    setError('');

    try {
      const favorites = getFavorites();
      if (favorites.length === 0) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      const prefs = getPreferences();
      if (!prefs.apiKey) {
        throw new Error('API key not configured. Please set it in Settings.');
      }

      const data = await getRecipesByIds({
        ids: favorites.map((f) => f.recipeId),
        apiKey: prefs.apiKey,
      });

      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          ❤️ Favorite Recipes
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Your saved and bookmarked recipes
        </p>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200 mb-6">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <p className="text-2xl mb-2">⏳</p>
              <p className="text-slate-600 dark:text-slate-400">Loading favorites...</p>
            </div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <p className="text-2xl mb-2">📭</p>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                You haven't favorited any recipes yet
              </p>
              <Link
                href="/"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors inline-block"
              >
                Search Recipes
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

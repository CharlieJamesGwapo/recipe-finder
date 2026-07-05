'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { RecipeCard } from '@/components/RecipeCard';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { getPreferences } from '@/lib/storage';
import { searchRecipes } from '@/lib/api';
import { Recipe, SearchFilters } from '@/lib/types';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [mounted, setMounted] = useState(false);

  const query = searchParams.get('q') || '';
  const cuisineParam = searchParams.get('cuisine') || '';
  const dietParam = searchParams.get('diet') || '';
  const intoleranceParam = searchParams.get('intolerance') || '';
  const typeParam = searchParams.get('type') || '';

  const filters: SearchFilters = {
    cuisine: cuisineParam ? cuisineParam.split(',') : [],
    diet: dietParam ? dietParam.split(',') : [],
    intolerance: intoleranceParam ? intoleranceParam.split(',') : [],
    type: typeParam || undefined,
  };

  const performSearch = useCallback(
    async (searchOffset: number = 0) => {
      if (!query.trim()) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const prefs = getPreferences();
        if (!prefs.apiKey) {
          throw new Error('API key not configured. Please set it in Settings.');
        }

        const result = await searchRecipes({
          apiKey: prefs.apiKey,
          query,
          number: 12,
          offset: searchOffset,
          filters,
        });

        if (searchOffset === 0) {
          setRecipes(result.results);
        } else {
          setRecipes((prev) => [...prev, ...result.results]);
        }

        setHasMore(result.results.length === 12);
        setOffset(searchOffset);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search recipes');
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    },
    [query, filters]
  );

  useEffect(() => {
    setMounted(true);
    performSearch(0);
  }, [query, filters, performSearch]);

  const handleLoadMore = () => {
    performSearch(offset + 12);
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
        <div className="mb-8">
          <SearchBar showFilters={true} />
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200 mb-6">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {loading && recipes.length === 0 ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <p className="text-2xl mb-2">⏳</p>
              <p className="text-slate-600 dark:text-slate-400">Loading recipes...</p>
            </div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-slate-600 dark:text-slate-400">
                {query ? 'No recipes found. Try a different search.' : 'Enter a recipe name to search.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
              {recipes.length} recipes found for "{query}"
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Loading...' : 'Load More Recipes'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}

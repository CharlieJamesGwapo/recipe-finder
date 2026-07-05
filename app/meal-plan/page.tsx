'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { MealPlannerWeek } from '@/components/MealPlannerWeek';
import { SearchBar } from '@/components/SearchBar';
import { getPreferences } from '@/lib/storage';
import { searchRecipes } from '@/lib/api';
import { Recipe } from '@/lib/types';

export default function MealPlanPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = async (query: string) => {
    try {
      const prefs = getPreferences();
      if (!prefs.apiKey) {
        alert('API key not configured. Please set it in Settings.');
        return;
      }

      const result = await searchRecipes({
        apiKey: prefs.apiKey,
        query,
        number: 20,
      });

      setRecipes(result.results);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to search recipes');
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
          📅 Weekly Meal Planner
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Plan your meals for the week. Search for recipes below to add them to your meal plan.
        </p>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Search Recipes</h2>
          <SearchBar showFilters={false} onSearch={handleSearch} />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold mb-6">This Week</h2>
          <MealPlannerWeek recipes={recipes} />
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Tip</h3>
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            Once you've planned your meals, head to the{' '}
            <Link href="/shopping-list" className="font-semibold hover:underline">
              Shopping List
            </Link>{' '}
            page to automatically generate a consolidated shopping list with all ingredients from your planned meals.
          </p>
        </div>
      </main>
    </div>
  );
}

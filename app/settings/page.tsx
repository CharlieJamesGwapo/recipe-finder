'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { getPreferences, savePreferences } from '@/lib/storage';
import { CUISINES, DIETS, INTOLERANCES } from '@/lib/api';
import { UserPreferences } from '@/lib/types';

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<UserPreferences>({
    apiKey: '',
    theme: 'system',
    dietaryRestrictions: [],
    allergens: [],
    servingsDefault: 4,
  });
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPrefs(getPreferences());
  }, []);

  const handleSave = () => {
    savePreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleDietaryRestriction = (diet: string) => {
    setPrefs((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(diet)
        ? prev.dietaryRestrictions.filter((d) => d !== diet)
        : [...prev.dietaryRestrictions, diet],
    }));
  };

  const toggleAllergen = (allergen: string) => {
    setPrefs((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen],
    }));
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
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-8">
          ⚙️ Settings
        </h1>

        {saved && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-200 mb-6">
            ✓ Settings saved successfully
          </div>
        )}

        <div className="space-y-8">
          {/* API Key Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              🔑 Spoonacular API Key
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
              You need a Spoonacular API key to search recipes. Get a free one at{' '}
              <a
                href="https://spoonacular.com/food-api"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-orange-500 hover:text-orange-600"
              >
                spoonacular.com/food-api
              </a>
              . The free plan includes 150 API calls per day.
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={prefs.apiKey}
                onChange={(e) => setPrefs((prev) => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Paste your API key here"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              🥗 Dietary Restrictions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
              Select any dietary restrictions you follow. These can be used to filter recipes.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DIETS.map((diet) => (
                <label key={diet} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.dietaryRestrictions.includes(diet)}
                    onChange={() => toggleDietaryRestriction(diet)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm">{diet}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              ⚠️ Allergies & Intolerances
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
              Select any allergies or intolerances you have. These will be used to filter out recipes containing these allergens.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {INTOLERANCES.map((allergen) => (
                <label key={allergen} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.allergens.includes(allergen)}
                    onChange={() => toggleAllergen(allergen)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm">{allergen}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Servings Default */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              🍽️ Default Servings
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
              Set the default serving size when viewing recipes.
            </p>

            <input
              type="number"
              min="1"
              max="20"
              value={prefs.servingsDefault}
              onChange={(e) =>
                setPrefs((prev) => ({
                  ...prev,
                  servingsDefault: parseInt(e.target.value) || 4,
                }))
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-lg transition-colors"
          >
            💾 Save Settings
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">ℹ️ About Recipe Finder</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Recipe Finder is a client-side application that stores all your data locally in your browser. No data is sent to external servers except API requests to Spoonacular. This means your favorites, meal plans, and shopping lists remain private and persist across sessions.
          </p>
        </div>
      </main>
    </div>
  );
}

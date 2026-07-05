'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { DarkModeToggle } from '@/components/DarkModeToggle';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
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
          </div>
          <DarkModeToggle />
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Find Your Perfect Recipe
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Search millions of recipes, plan your meals, and generate shopping lists. All powered by Spoonacular API and stored locally on your device.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-950/20 p-8 rounded-lg mb-12 border border-orange-200 dark:border-orange-800">
          <SearchBar />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
            <p className="text-3xl mb-2">🔍</p>
            <h3 className="font-semibold text-lg mb-2">Smart Search</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Search by recipe name or ingredients. Filter by cuisine, diet type, and allergies.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
            <p className="text-3xl mb-2">❤️</p>
            <h3 className="font-semibold text-lg mb-2">Save Favorites</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Bookmark your favorite recipes and access them anytime from your favorites page.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
            <p className="text-3xl mb-2">📅</p>
            <h3 className="font-semibold text-lg mb-2">Meal Planning</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Plan your meals for the week and automatically generate shopping lists.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
            <p className="text-3xl mb-2">🛒</p>
            <h3 className="font-semibold text-lg mb-2">Shopping Lists</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Aggregate ingredients from multiple recipes and organize by category.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
            <p className="text-3xl mb-2">📏</p>
            <h3 className="font-semibold text-lg mb-2">Scale Recipes</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Adjust serving sizes and all ingredient quantities update automatically.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
            <p className="text-3xl mb-2">📝</p>
            <h3 className="font-semibold text-lg mb-2">Add Notes</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Save custom notes and tips for each recipe to personalize your cooking experience.
            </p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-16 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">Getting Started</h2>
          <ol className="space-y-2 text-blue-800 dark:text-blue-200">
            <li className="flex gap-3">
              <span className="font-bold">1.</span>
              <span>Go to <Link href="/settings" className="font-semibold hover:underline">Settings</Link> and add your Spoonacular API key (get a free one at <a href="https://spoonacular.com/food-api" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">spoonacular.com</a>)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">2.</span>
              <span>Search for recipes using the search bar above</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">3.</span>
              <span>Click on a recipe to view details, ingredients, and cooking instructions</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">4.</span>
              <span>Favorite recipes, plan meals, and generate shopping lists</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">5.</span>
              <span>All your data is saved locally on your device—no account needed!</span>
            </li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-600 dark:text-slate-400 text-sm">
          <p>Recipe Finder • Built with Next.js • Data powered by Spoonacular API</p>
          <p className="mt-2">Created by Charlie James</p>
        </div>
      </footer>
    </div>
  );
}

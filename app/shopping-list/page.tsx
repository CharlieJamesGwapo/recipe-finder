'use client';

import Link from 'next/link';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { ShoppingListGenerator } from '@/components/ShoppingListGenerator';

export default function ShoppingListPage() {
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
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          🛒 Shopping List
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Add ingredients from recipes to build your shopping list. You can also add items from your{' '}
          <Link href="/meal-plan" className="font-semibold hover:underline text-orange-500">
            meal plan
          </Link>
          .
        </p>

        <ShoppingListGenerator />
      </main>
    </div>
  );
}

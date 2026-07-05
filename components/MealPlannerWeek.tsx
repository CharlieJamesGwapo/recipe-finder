'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recipe, MealPlanEntry } from '@/lib/types';
import { getMealPlanForDateRange, addMealPlanEntry, removeMealPlanEntry } from '@/lib/storage';

interface MealPlannerWeekProps {
  recipes?: Recipe[];
}

export function MealPlannerWeek({ recipes = [] }: MealPlannerWeekProps) {
  const [mealPlan, setMealPlan] = useState<MealPlanEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    loadMealPlan();
  }, []);

  const loadMealPlan = () => {
    const today = new Date();
    const startDate = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    const plan = getMealPlanForDateRange(start, end);
    setMealPlan(plan);
  };

  const handleAddMeal = (recipe: Recipe, date: string) => {
    addMealPlanEntry({
      date,
      recipeId: recipe.id,
      servings: recipe.servings || 4,
    });
    loadMealPlan();
    setSelectedRecipe(null);
    setSelectedDate('');
  };

  const handleRemoveMeal = (date: string) => {
    removeMealPlanEntry(date);
    loadMealPlan();
  };

  const getDaysOfWeek = () => {
    const today = new Date();
    const startDate = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateStr: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    }

    return days;
  };

  if (!mounted) {
    return null;
  }

  const days = getDaysOfWeek();
  const recipeMap = new Map(recipes.map((r) => [r.id, r]));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayPlan = mealPlan.find((m) => m.date === day.date);
          const recipe = dayPlan ? recipeMap.get(dayPlan.recipeId) : null;

          return (
            <div
              key={day.date}
              className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 h-40 overflow-hidden flex flex-col"
            >
              <p className="font-semibold text-sm text-center mb-2">{day.day}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center mb-2">
                {day.dateStr}
              </p>

              {recipe ? (
                <div className="flex-1 flex flex-col justify-between">
                  <Link href={`/recipe/${recipe.id}`}>
                    <p className="text-xs font-medium line-clamp-2 hover:text-orange-500 transition-colors">
                      {recipe.title}
                    </p>
                  </Link>
                  <button
                    onClick={() => handleRemoveMeal(day.date)}
                    className="mt-2 w-full px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedDate(day.date)}
                  className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded text-sm font-medium text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  + Add
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && recipes.length > 0 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Select a recipe for {selectedDate}</h3>
            <button
              onClick={() => setSelectedDate('')}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {recipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => handleAddMeal(recipe, selectedDate)}
                className="p-2 text-left text-sm font-medium bg-white dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-900 rounded border border-slate-200 dark:border-slate-600 transition-colors line-clamp-2"
              >
                {recipe.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {recipes.length === 0 && (
        <p className="text-center text-slate-600 dark:text-slate-400 py-4">
          Search for recipes first to add them to your meal plan
        </p>
      )}
    </div>
  );
}

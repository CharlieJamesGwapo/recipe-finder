'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recipe } from '@/lib/types';
import { isFavorite, addFavorite, removeFavorite } from '@/lib/storage';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [isFav, setIsFav] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsFav(isFavorite(recipe.id));
  }, [recipe.id]);

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFavorite(recipe.id);
      setIsFav(false);
    } else {
      addFavorite(recipe.id);
      setIsFav(true);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
      <Link href={`/recipe/${recipe.id}`}>
        <div className="relative w-full h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          )}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/recipe/${recipe.id}`}>
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-orange-500 transition-colors mb-2">
            {recipe.title}
          </h3>
        </Link>

        {recipe.cuisines && recipe.cuisines.length > 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {recipe.cuisines.slice(0, 2).join(', ')}
          </p>
        )}

        {recipe.spoonacularScore && (
          <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-3">
            ⭐ {recipe.spoonacularScore.toFixed(1)} / 100
          </p>
        )}

        <div className="mt-auto flex gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
              isFav
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {isFav ? '❤️ Favorited' : '🤍 Favorite'}
          </button>
          <Link href={`/recipe/${recipe.id}`} className="flex-1">
            <button className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors">
              View Recipe
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

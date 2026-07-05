'use client';

import { useState, useEffect } from 'react';
import { ExtendedIngredient, ShoppingItem } from '@/lib/types';
import { addShoppingItem, getShoppingList } from '@/lib/storage';

interface IngredientsListProps {
  ingredients: ExtendedIngredient[];
  recipeId: number;
  servings?: number;
  onAddToShoppingList?: (items: ShoppingItem[]) => void;
}

export function IngredientsList({
  ingredients,
  recipeId,
  servings = 1,
  onAddToShoppingList,
}: IngredientsListProps) {
  const [addedItems, setAddedItems] = useState<number[]>([]);

  const handleAddToList = (ingredient: ExtendedIngredient) => {
    const amount = (ingredient.measures?.metric?.value || ingredient.amount || 0) * servings;
    const unit = ingredient.measures?.metric?.unit || ingredient.unit || '';

    const item: ShoppingItem = {
      id: `${recipeId}-${ingredient.id}`,
      name: ingredient.name,
      amount,
      unit,
      category: ingredient.aisle || 'Other',
      checked: false,
      recipes: [recipeId],
    };

    addShoppingItem(item);
    setAddedItems((prev) => [...new Set([...prev, ingredient.id])]);

    // Call callback if provided
    if (onAddToShoppingList) {
      onAddToShoppingList([item]);
    }
  };

  const handleAddAll = () => {
    ingredients.forEach((ing) => handleAddToList(ing));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Ingredients</h3>
        <button
          onClick={handleAddAll}
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          📋 Add All to Shopping List
        </button>
      </div>

      <div className="space-y-2">
        {ingredients.map((ingredient) => {
          const amount =
            (ingredient.measures?.metric?.value || ingredient.amount || 0) * servings;
          const unit = ingredient.measures?.metric?.unit || ingredient.unit || '';
          const isAdded = addedItems.includes(ingredient.id);

          return (
            <div
              key={ingredient.id}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium capitalize">{ingredient.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {amount.toFixed(2)} {unit}
                </p>
              </div>
              <button
                onClick={() => handleAddToList(ingredient)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  isAdded
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
                }`}
              >
                {isAdded ? '✓ Added' : '+ Add'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

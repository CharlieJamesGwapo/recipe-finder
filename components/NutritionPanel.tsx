'use client';

import { Nutrition, Nutrient } from '@/lib/types';

interface NutritionPanelProps {
  nutrition?: Nutrition;
  servings?: number;
}

export function NutritionPanel({ nutrition, servings = 1 }: NutritionPanelProps) {
  if (!nutrition?.nutrients || nutrition.nutrients.length === 0) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-center text-slate-600 dark:text-slate-400">
        Nutritional information not available
      </div>
    );
  }

  const caloriesNutrient = nutrition.nutrients.find((n) => n.name === 'Calories');
  const proteinNutrient = nutrition.nutrients.find((n) => n.name === 'Protein');
  const fatNutrient = nutrition.nutrients.find((n) => n.name === 'Fat');
  const carbsNutrient = nutrition.nutrients.find((n) => n.name === 'Carbohydrates');

  const macroNutrients = nutrition.nutrients.filter((n) =>
    [
      'Fiber',
      'Sugar',
      'Saturated Fat',
      'Cholesterol',
      'Sodium',
      'Vitamin C',
      'Iron',
      'Calcium',
    ].includes(n.name)
  );

  return (
    <div className="space-y-4">
      {/* Main Macros */}
      {caloriesNutrient && (
        <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {(caloriesNutrient.amount / servings).toFixed(0)}
          </p>
          <p className="text-sm text-orange-700 dark:text-orange-300">Calories per serving</p>
        </div>
      )}

      {/* Macronutrient Breakdown */}
      {(proteinNutrient || fatNutrient || carbsNutrient) && (
        <div className="grid grid-cols-3 gap-3">
          {proteinNutrient && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {(proteinNutrient.amount / servings).toFixed(1)}g
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">Protein</p>
            </div>
          )}
          {fatNutrient && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {(fatNutrient.amount / servings).toFixed(1)}g
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">Fat</p>
            </div>
          )}
          {carbsNutrient && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {(carbsNutrient.amount / servings).toFixed(1)}g
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">Carbs</p>
            </div>
          )}
        </div>
      )}

      {/* Other Nutrients */}
      {macroNutrients.length > 0 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h4 className="font-semibold mb-3 text-sm">Other Nutrients</h4>
          <div className="grid grid-cols-2 gap-3">
            {macroNutrients.slice(0, 8).map((nutrient) => (
              <div key={nutrient.name} className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {nutrient.name}
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {(nutrient.amount / servings).toFixed(1)}
                  {nutrient.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

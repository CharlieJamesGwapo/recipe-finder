'use client';

import { useState } from 'react';
import { Instruction, CookingStep } from '@/lib/types';

interface CookingStepsProps {
  instructions?: Instruction[];
  title?: string;
}

export function CookingSteps({ instructions, title = 'Cooking Instructions' }: CookingStepsProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!instructions || instructions.length === 0) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-center text-slate-600 dark:text-slate-400">
        No cooking instructions available
      </div>
    );
  }

  const allSteps: (CookingStep & { sectionName?: string })[] = [];
  instructions.forEach((instruction) => {
    instruction.steps.forEach((step) => {
      allSteps.push({
        ...step,
        sectionName: instruction.name,
      });
    });
  });

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>

      <div className="space-y-3">
        {allSteps.map((step) => (
          <div
            key={step.number}
            className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
              completedSteps.includes(step.number)
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-500'
            }`}
            onClick={() => toggleStep(step.number)}
          >
            <div className="flex gap-4 items-start">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full font-bold flex items-center justify-center ${
                  completedSteps.includes(step.number)
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {completedSteps.includes(step.number) ? '✓' : step.number}
              </div>
              <div className="flex-1">
                {step.sectionName && (
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase">
                    {step.sectionName}
                  </p>
                )}
                <p
                  className={`${
                    completedSteps.includes(step.number)
                      ? 'text-slate-500 dark:text-slate-400 line-through'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {step.step}
                </p>

                {/* Ingredients and Equipment */}
                {(step.ingredients?.length > 0 || step.equipment?.length > 0) && (
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {step.ingredients && step.ingredients.length > 0 && (
                      <p>
                        <strong>Ingredients:</strong> {step.ingredients.map((i) => i.name).join(', ')}
                      </p>
                    )}
                    {step.equipment && step.equipment.length > 0 && (
                      <p>
                        <strong>Equipment:</strong> {step.equipment.map((e) => e.name).join(', ')}
                      </p>
                    )}
                  </div>
                )}

                {/* Time */}
                {step.length && (
                  <p className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
                    ⏱️ {step.length.number} {step.length.unit}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-4">
        Click steps to mark them as complete
      </p>
    </div>
  );
}

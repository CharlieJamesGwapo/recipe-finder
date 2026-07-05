'use client';

interface ServingsScalerProps {
  defaultServings: number;
  onServingsChange: (servings: number) => void;
}

export function ServingsScaler({ defaultServings, onServingsChange }: ServingsScalerProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
      <span className="font-semibold">Servings:</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onServingsChange(Math.max(1, defaultServings - 1))}
          className="px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg font-bold text-lg transition-colors"
        >
          −
        </button>
        <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg font-semibold min-w-16 text-center">
          {defaultServings}
        </span>
        <button
          onClick={() => onServingsChange(defaultServings + 1)}
          className="px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg font-bold text-lg transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

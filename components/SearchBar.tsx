'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CUISINES, DIETS, INTOLERANCES, MEAL_TYPES } from '@/lib/api';
import { SearchFilters } from '@/lib/types';

interface SearchBarProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  showFilters?: boolean;
}

export function SearchBar({ onSearch, showFilters = true }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    cuisine: [],
    diet: [],
    intolerance: [],
    type: '',
  });
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;

      // Only read URL params on client side
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        setQuery(params.get('q') || '');
        setFilters({
          cuisine: params.get('cuisine')?.split(',').filter(Boolean) || [],
          diet: params.get('diet')?.split(',').filter(Boolean) || [],
          intolerance: params.get('intolerance')?.split(',').filter(Boolean) || [],
          type: params.get('type') || '',
        });
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set('q', query);
    if (filters.cuisine?.length) params.set('cuisine', filters.cuisine.join(','));
    if (filters.diet?.length) params.set('diet', filters.diet.join(','));
    if (filters.intolerance?.length) params.set('intolerance', filters.intolerance.join(','));
    if (filters.type) params.set('type', filters.type);

    router.push(`/search?${params.toString()}`);
    if (onSearch) onSearch(query, filters);
  };

  const toggleCuisine = (cuisine: string) => {
    setFilters((prev) => ({
      ...prev,
      cuisine: prev.cuisine?.includes(cuisine)
        ? prev.cuisine.filter((c) => c !== cuisine)
        : [...(prev.cuisine || []), cuisine],
    }));
  };

  const toggleDiet = (diet: string) => {
    setFilters((prev) => ({
      ...prev,
      diet: prev.diet?.includes(diet)
        ? prev.diet.filter((d) => d !== diet)
        : [...(prev.diet || []), diet],
    }));
  };

  const toggleIntolerance = (intolerance: string) => {
    setFilters((prev) => ({
      ...prev,
      intolerance: prev.intolerance?.includes(intolerance)
        ? prev.intolerance.filter((i) => i !== intolerance)
        : [...(prev.intolerance || []), intolerance],
    }));
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
          className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          Search
        </button>
        {showFilters && (
          <button
            type="button"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            🔧 Filters
          </button>
        )}
      </form>

      {showFilterPanel && showFilters && (
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mb-4 border border-slate-200 dark:border-slate-700">
          {/* Meal Type */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-sm">Meal Type</h3>
            <select
              value={filters.type || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">Any</option>
              {MEAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Cuisines */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-sm">Cuisines</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CUISINES.map((cuisine) => (
                <label key={cuisine} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.cuisine?.includes(cuisine) || false}
                    onChange={() => toggleCuisine(cuisine)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm">{cuisine}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Diets */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-sm">Diet Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {DIETS.map((diet) => (
                <label key={diet} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.diet?.includes(diet) || false}
                    onChange={() => toggleDiet(diet)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm">{diet}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Intolerances/Allergies */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-sm">Allergies & Intolerances</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {INTOLERANCES.map((intolerance) => (
                <label key={intolerance} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.intolerance?.includes(intolerance) || false}
                    onChange={() => toggleIntolerance(intolerance)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm">{intolerance}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setFilters({ cuisine: [], diet: [], intolerance: [], type: '' })
            }
            className="mt-4 w-full px-4 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

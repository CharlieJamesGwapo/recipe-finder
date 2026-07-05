'use client';

import { useState, useEffect } from 'react';
import {
  getShoppingList,
  saveShoppingList,
  toggleShoppingItemCheck,
  clearShoppingList,
} from '@/lib/storage';
import { ShoppingItem } from '@/lib/types';

export function ShoppingListGenerator() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [groupBy, setGroupBy] = useState<'category' | 'recipe'>('category');

  useEffect(() => {
    setMounted(true);
    loadItems();
  }, []);

  const loadItems = () => {
    const list = getShoppingList();
    setItems(list);
  };

  const handleToggleItem = (itemId: string) => {
    toggleShoppingItemCheck(itemId);
    loadItems();
  };

  const handleDeleteItem = (itemId: string) => {
    const filtered = items.filter((i) => i.id !== itemId);
    saveShoppingList(filtered);
    setItems(filtered);
  };

  const handleClearList = () => {
    if (window.confirm('Clear all items from shopping list?')) {
      clearShoppingList();
      setItems([]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="p-8 bg-slate-50 dark:bg-slate-700 rounded-lg text-center">
        <p className="text-slate-600 dark:text-slate-400 mb-2">📭 Your shopping list is empty</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Add ingredients from recipes to build your shopping list
        </p>
      </div>
    );
  }

  const groupedByCategory = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, ShoppingItem[]>
  );

  const uncheckedCount = items.filter((i) => !i.checked).length;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setGroupBy('category')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              groupBy === 'category'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setGroupBy('recipe')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              groupBy === 'recipe'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            By Recipe
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            🖨️ Print
          </button>
          <button
            onClick={handleClearList}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm font-medium">
          {items.filter((i) => i.checked).length} of {items.length} items checked
        </p>
        <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all"
            style={{
              width: `${((items.filter((i) => i.checked).length / items.length) * 100).toFixed(0)}%`,
            }}
          />
        </div>
      </div>

      {/* Items */}
      {groupBy === 'category' ? (
        <div className="space-y-4">
          {Object.entries(groupedByCategory).map(([category, categoryItems]) => (
            <div key={category} className="space-y-2">
              <h3 className="font-semibold text-sm uppercase text-slate-700 dark:text-slate-300">
                {category}
              </h3>
              <div className="space-y-1">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      item.checked
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleToggleItem(item.id)}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          item.checked
                            ? 'text-slate-500 dark:text-slate-400 line-through'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {item.amount.toFixed(2)} {item.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                item.checked
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleToggleItem(item.id)}
                className="w-5 h-5 rounded cursor-pointer"
              />
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    item.checked
                      ? 'text-slate-500 dark:text-slate-400 line-through'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {item.name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {item.amount.toFixed(2)} {item.unit} • {item.category}
                </p>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { getNote, saveNote, deleteNote } from '@/lib/storage';

interface NotesSectionProps {
  recipeId: number;
}

export function NotesSection({ recipeId }: NotesSectionProps) {
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNote(getNote(recipeId));
  }, [recipeId]);

  const handleSave = () => {
    saveNote(recipeId, note);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteNote(recipeId);
    setNote('');
    setIsEditing(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">📝 Notes</h3>
        {note && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm px-2 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add notes about this recipe..."
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setNote(getNote(recipeId));
              }}
              className="flex-1 px-3 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
            {note && (
              <button
                onClick={handleDelete}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ) : note ? (
        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{note}</p>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium transition-colors"
        >
          + Add a note
        </button>
      )}
    </div>
  );
}

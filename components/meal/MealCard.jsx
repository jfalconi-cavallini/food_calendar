'use client'
import { useState } from 'react'
import MealForm from './MealForm'

export default function MealCard({ meal, mealType, mealLabel, date, dayLabel, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)

  return (
    <>
      <div
        className={`group relative rounded-xl border px-3 py-2.5 transition-all duration-200 ${
          meal.completed
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
        }`}
      >
        <div className="flex items-start gap-2.5">
          {/* Completion toggle */}
          <button
            onClick={onToggle}
            className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              meal.completed
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
            }`}
            aria-label={meal.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {meal.completed && (
              <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 12 12" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2 6l3 3 5-5" />
              </svg>
            )}
          </button>

          {/* Meal name */}
          <span
            className={`text-sm font-medium leading-snug flex-1 min-w-0 break-words ${
              meal.completed
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-800 dark:text-gray-100'
            }`}
          >
            {meal.name}
          </span>
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 justify-end">
          <button
            onClick={() => setEditing(true)}
            className="rounded-md px-2 py-0.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded-md px-2 py-0.5 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <MealForm
        open={editing}
        onClose={() => setEditing(false)}
        onSave={(name) => onUpdate(name)}
        initialName={meal.name}
        mealType={mealLabel}
        dayLabel={dayLabel}
      />
    </>
  )
}

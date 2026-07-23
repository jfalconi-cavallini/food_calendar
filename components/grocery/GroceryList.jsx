'use client'
import { useState } from 'react'
import { useMealPlan } from '../../hooks/useMealPlan'
import { aggregateGroceryList, countGroceryItems } from '../../utils/groceryUtils'
import { formatDateKey } from '../../utils/dateUtils'
import { GROCERY_CATEGORIES } from '../../lib/constants'

export default function GroceryList({ weekDates }) {
  const { meals } = useMealPlan()
  const [checked, setChecked] = useState({})
  const [owned, setOwned]     = useState({})

  const grouped = aggregateGroceryList(meals, weekDates, formatDateKey)
  const total   = countGroceryItems(grouped)
  const checkedCount = Object.values(checked).filter(Boolean).length

  const toggleChecked = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleOwned   = (id) => setOwned(prev =>   ({ ...prev, [id]: !prev[id] }))

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-4xl">🛒</span>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No ingredients found for this week.
        </p>
        <p className="text-gray-400 dark:text-gray-600 text-xs">
          Add ingredients to your meals on the Plan page.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header stats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {checkedCount} of {total} items checked
        </p>
        <button
          onClick={() => setChecked({})}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
            style={{ width: `${Math.round((checkedCount / total) * 100)}%` }}
          />
        </div>
      )}

      {/* Categories */}
      {GROCERY_CATEGORIES.map(cat => {
        const items = grouped[cat] || []
        if (!items.length) return null

        return (
          <div key={cat} className="flex flex-col gap-2">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-600">
              {cat} ({items.length})
            </h3>
            <div className="flex flex-col gap-1">
              {items.map(item => {
                const isChecked = !!checked[item.id]
                const isOwned   = !!owned[item.id]
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                      isChecked
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 opacity-60'
                        : isOwned
                          ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleChecked(item.id)}
                      className={`flex-shrink-0 w-4 h-4 rounded border-2 transition-all ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'
                      }`}
                      aria-label={isChecked ? 'Uncheck' : 'Check off'}
                    >
                      {isChecked && (
                        <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 12 12" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2 6l3 3 5-5" />
                        </svg>
                      )}
                    </button>

                    {/* Item details */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium ${isChecked ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
                        {item.name}
                      </span>
                      <span className="ml-2 text-xs text-gray-400 dark:text-gray-600">
                        {item.quantity} {item.unit}
                      </span>
                    </div>

                    {/* "Already have" toggle */}
                    <button
                      onClick={() => toggleOwned(item.id)}
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium transition-colors ${
                        isOwned
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : 'text-gray-300 dark:text-gray-700 hover:text-blue-400'
                      }`}
                      title="Already have this?"
                    >
                      {isOwned ? 'Have it' : '✓ Have'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

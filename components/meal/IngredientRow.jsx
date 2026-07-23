'use client'
import { MEASUREMENT_UNITS, GROCERY_CATEGORIES } from '../../lib/constants'

export default function IngredientRow({ ingredient, onChange, onRemove }) {
  const set = (key, value) => onChange({ ...ingredient, [key]: value })

  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: '1fr 60px 90px 70px 100px 28px' }}>
      <input
        type="text"
        value={ingredient.name}
        onChange={e => set('name', e.target.value)}
        placeholder="Ingredient"
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2.5 py-1.5 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="number"
        min="0"
        step="0.25"
        value={ingredient.quantity}
        onChange={e => set('quantity', e.target.value)}
        placeholder="Qty"
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <select
        value={ingredient.unit}
        onChange={e => set('unit', e.target.value)}
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-1.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {MEASUREMENT_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
      <input
        type="number"
        min="0"
        value={ingredient.calories}
        onChange={e => set('calories', e.target.value)}
        placeholder="Cal"
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <select
        value={ingredient.category}
        onChange={e => set('category', e.target.value)}
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-1.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {GROCERY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

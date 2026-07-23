'use client'
import { useState } from 'react'
import MealForm from './MealForm'

export default function EmptyMealSlot({ mealTypeId, mealLabel, dayLabel, onAdd }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-gray-200 dark:border-gray-700 px-3 py-2.5 text-left text-xs text-gray-400 dark:text-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        + Add meal
      </button>

      <MealForm
        open={open}
        onClose={() => setOpen(false)}
        onSave={onAdd}
        mealTypeId={mealTypeId}
        dayLabel={dayLabel}
      />
    </>
  )
}

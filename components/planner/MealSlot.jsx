'use client'
import MealCard from '../meal/MealCard'
import EmptyMealSlot from '../meal/EmptyMealSlot'

export default function MealSlot({ mealType, meal, dateKey, dayLabel, onAdd, onToggle, onUpdate, onDelete }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-600 px-0.5">
        {mealType.emoji} {mealType.label}
      </span>

      {meal ? (
        <MealCard
          meal={meal}
          mealTypeId={mealType.id}
          mealLabel={mealType.label}
          dateKey={dateKey}
          dayLabel={dayLabel}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ) : (
        <EmptyMealSlot
          mealTypeId={mealType.id}
          mealLabel={mealType.label}
          dayLabel={dayLabel}
          onAdd={onAdd}
        />
      )}
    </div>
  )
}

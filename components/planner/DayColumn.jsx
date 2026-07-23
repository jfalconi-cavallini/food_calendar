'use client'
import { MEAL_TYPES } from '../../lib/constants'
import { formatDateKey, isToday, formatDayLabel, formatShortDate } from '../../utils/dateUtils'
import { useMealPlan } from '../../hooks/useMealPlan'
import MealSlot from './MealSlot'

export default function DayColumn({ date }) {
  const { meals, addMeal, updateMeal, deleteMeal, toggleMeal } = useMealPlan()
  const dateKey  = formatDateKey(date)
  const today    = isToday(date)
  const dayMeals = meals[dateKey] || {}
  const dayLabel = `${formatDayLabel(date)}, ${formatShortDate(date)}`

  const completedCount = MEAL_TYPES.filter(t => dayMeals[t.id]?.completed).length
  const totalCount     = MEAL_TYPES.filter(t => dayMeals[t.id]).length

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl p-3 border transition-all duration-200 min-w-[175px] ${
        today
          ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/30 shadow-sm shadow-indigo-100 dark:shadow-indigo-950'
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60'
      }`}
    >
      {/* Day header */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold tracking-widest uppercase ${
            today ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-600'
          }`}>
            {formatDayLabel(date).slice(0, 3)}
            {today && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-indigo-500 text-white text-[9px] font-bold tracking-normal normal-case">
                Today
              </span>
            )}
          </span>
          {totalCount > 0 && (
            <span className="text-[10px] text-gray-400 dark:text-gray-600">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>
        <span className={`text-xl font-bold leading-none ${
          today ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-100'
        }`}>
          {date.getDate()}
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-600">
          {date.toLocaleDateString('en-US', { month: 'short' })}
        </span>
      </div>

      {/* Divider */}
      <div className={`h-px ${today ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-gray-100 dark:bg-gray-800'}`} />

      {/* Meal slots */}
      <div className="flex flex-col gap-3">
        {MEAL_TYPES.map(mealType => (
          <MealSlot
            key={mealType.id}
            mealType={mealType}
            meal={dayMeals[mealType.id] || null}
            dateKey={dateKey}
            dayLabel={dayLabel}
            onAdd={(name)    => addMeal(dateKey, mealType.id, name)}
            onToggle={()     => toggleMeal(dateKey, mealType.id)}
            onUpdate={(name) => updateMeal(dateKey, mealType.id, name)}
            onDelete={()     => deleteMeal(dateKey, mealType.id)}
          />
        ))}
      </div>
    </div>
  )
}

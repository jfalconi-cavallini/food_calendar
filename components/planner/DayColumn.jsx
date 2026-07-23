'use client'
import { getMealTypesForPerson } from '../../lib/constants'
import { formatDateKey, isToday, formatDayLabel } from '../../utils/dateUtils'
import { computeDayCaloriesForPerson } from '../../utils/calorieUtils'
import { useMealPlan } from '../../hooks/useMealPlan'
import { useProfiles } from '../../hooks/useProfiles'
import { usePerson } from '../../lib/personContext'
import MealSlot from './MealSlot'

export default function DayColumn({ date }) {
  const { meals, addMeal, updateMeal, deleteMeal, toggleMeal } = useMealPlan()
  const { activePerson, cfg } = usePerson()
  const { getTarget } = useProfiles()

  const dateKey    = formatDateKey(date)
  const today      = isToday(date)
  const dayMeals   = meals[dateKey] || {}
  const dayLabel   = `${formatDayLabel(date)}, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  const mealTypes  = getMealTypesForPerson(activePerson)
  const dayCal     = computeDayCaloriesForPerson(dayMeals, activePerson)
  const target     = getTarget(activePerson, dateKey)
  const calPct     = target && dayCal > 0 ? Math.min(100, Math.round((dayCal / target) * 100)) : 0

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl p-3 border transition-all duration-200 min-w-[175px] ${
        today
          ? `${cfg.todayBorder} ${cfg.todayBg} shadow-sm`
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60'
      }`}
    >
      {/* Day header */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold tracking-widest uppercase ${
            today ? cfg.todayText : 'text-gray-400 dark:text-gray-600'
          }`}>
            {formatDayLabel(date).slice(0, 3)}
            {today && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full ${cfg.todayBadge} text-white text-[9px] font-bold tracking-normal normal-case`}>
                Today
              </span>
            )}
          </span>
        </div>
        <span className={`text-xl font-bold leading-none ${
          today ? cfg.todayText : 'text-gray-800 dark:text-gray-100'
        }`}>
          {date.getDate()}
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-600">
          {date.toLocaleDateString('en-US', { month: 'short' })}
        </span>
      </div>

      {/* Divider */}
      <div className={`h-px ${today ? cfg.todayDivider : 'bg-gray-100 dark:bg-gray-800'}`} />

      {/* Meal slots */}
      <div className="flex flex-col gap-3">
        {mealTypes.map(mealType => (
          <MealSlot
            key={mealType.id}
            mealType={mealType}
            meal={dayMeals[mealType.id] || null}
            dateKey={dateKey}
            dayLabel={dayLabel}
            onAdd={(mealData)    => addMeal(dateKey, mealType.id, mealData)}
            onToggle={()         => toggleMeal(dateKey, mealType.id)}
            onUpdate={(mealData) => updateMeal(dateKey, mealType.id, mealData)}
            onDelete={()         => deleteMeal(dateKey, mealType.id)}
          />
        ))}
      </div>

      {/* Calorie footer */}
      {(dayCal > 0 || target) && (
        <>
          <div className="h-px bg-gray-100 dark:bg-gray-800" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className={`font-medium ${cfg.accentText}`}>
                {dayCal > 0 ? `${dayCal.toLocaleString()} cal` : '0 cal'}
              </span>
              {target && (
                <span className="text-gray-400 dark:text-gray-600">
                  / {target.toLocaleString()}
                </span>
              )}
            </div>
            {target && (
              <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${cfg.trackingBg} transition-all duration-300`}
                  style={{ width: `${calPct}%` }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

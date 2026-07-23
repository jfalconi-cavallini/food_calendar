'use client'
import { useMealPlan } from '../../hooks/useMealPlan'
import { useProfiles } from '../../hooks/useProfiles'
import { usePerson } from '../../lib/personContext'
import { computeDayCaloriesForPerson, computeAdjustedTarget, computeDailyTarget } from '../../utils/calorieUtils'
import { formatDateKey, isToday } from '../../utils/dateUtils'
import { PERSON_CONFIG } from '../../lib/constants'
import { useExercises } from '../../hooks/useExercises'

function DayBar({ date, dayMeals, personId, profile, exercises }) {
  const cfg       = PERSON_CONFIG[personId]
  const dateKey   = formatDateKey(date)
  const today     = isToday(date)
  const dayCal    = computeDayCaloriesForPerson(dayMeals, personId)
  const exCal     = (exercises || [])
    .filter(e => e.date === dateKey && e.personId === personId)
    .reduce((s, e) => s + (e.caloriesBurned || 0), 0)
  const base      = computeDailyTarget(profile)
  const target    = base ? computeAdjustedTarget(base, exCal, profile?.exerciseAdjustmentMode) : null
  const pct       = target && dayCal > 0 ? Math.min(110, Math.round((dayCal / target) * 100)) : 0
  const over      = target && dayCal > target + 100
  const under     = target && dayCal > 0 && dayCal < target - 100
  const dayLabel  = date.toLocaleDateString('en-US', { weekday: 'short' })

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-[10px] font-bold ${today ? cfg.accentText : 'text-gray-400 dark:text-gray-600'}`}>
        {dayLabel}
      </span>
      {/* Bar */}
      <div className="relative w-10 h-28 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-end">
        {dayCal > 0 && (
          <div
            className={`w-full rounded-t-lg transition-all duration-500 ${
              over ? 'bg-red-400' : under ? 'bg-yellow-400' : cfg.trackingBg
            }`}
            style={{ height: `${pct}%` }}
          />
        )}
        {target && (
          <div className="absolute inset-x-0 border-t border-dashed border-gray-400 dark:border-gray-600"
               style={{ bottom: '91%' }} />
        )}
      </div>
      {/* Cal label */}
      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
        {dayCal > 0 ? `${Math.round(dayCal / 100) * 100}` : '—'}
      </span>
      {exCal > 0 && (
        <span className="text-[10px] text-emerald-500">+{exCal}</span>
      )}
    </div>
  )
}

function PersonSection({ personId, meals, weekDates, profiles, exercises }) {
  const cfg     = PERSON_CONFIG[personId]
  const profile = profiles?.[personId]
  const target  = computeDailyTarget(profile)

  let totalCal = 0
  for (const d of weekDates) totalCal += computeDayCaloriesForPerson(meals[formatDateKey(d)] || {}, personId)
  const avgCal = weekDates.length ? Math.round(totalCal / weekDates.length) : 0

  return (
    <div className={`flex flex-col gap-4 p-4 rounded-2xl border ${cfg.statAccent}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cfg.emoji}</span>
          <span className={`font-bold text-sm ${cfg.calText}`}>{cfg.name}</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg/day</p>
          <p className={`text-lg font-bold ${cfg.accentText}`}>
            {avgCal > 0 ? avgCal.toLocaleString() : '—'}
            {target && <span className="text-xs font-normal text-gray-400 dark:text-gray-600"> / {target.toLocaleString()}</span>}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-1">
        {weekDates.map(date => (
          <DayBar
            key={date.toISOString()}
            date={date}
            dayMeals={meals[formatDateKey(date)] || {}}
            personId={personId}
            profile={profile}
            exercises={exercises}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-600">
        <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-sm ${cfg.trackingBg}`} /> On target</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400" /> Over</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-400" /> Under</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-400" /> Exercise</span>
      </div>
    </div>
  )
}

export default function WeeklyCaloriesSummary({ weekDates }) {
  const { meals }     = useMealPlan()
  const { profiles }  = useProfiles()
  const { exercises } = useExercises()

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white">Weekly Calories</h2>
      <PersonSection personId="jose" meals={meals} weekDates={weekDates} profiles={profiles} exercises={exercises} />
      <PersonSection personId="emma" meals={meals} weekDates={weekDates} profiles={profiles} exercises={exercises} />
    </div>
  )
}

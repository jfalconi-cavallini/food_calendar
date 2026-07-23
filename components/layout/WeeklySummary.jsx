'use client'
import { useMealPlan } from '../../hooks/useMealPlan'
import { useProfiles } from '../../hooks/useProfiles'
import { usePerson } from '../../lib/personContext'
import { computeWeekStats } from '../../utils/statsUtils'
import { computeDayCaloriesForPerson, computeDailyTarget } from '../../utils/calorieUtils'
import { formatDateKey } from '../../utils/dateUtils'
import { PERSON_CONFIG } from '../../lib/constants'

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`flex flex-col gap-0.5 px-4 py-3 rounded-xl border ${accent || 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
      <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</span>
      {sub && <span className="text-[10px] text-gray-400 dark:text-gray-600">{sub}</span>}
    </div>
  )
}

function PersonCalCard({ personId, meals, weekDates, profiles }) {
  const cfg = PERSON_CONFIG[personId]
  const profile = profiles?.[personId]

  let totalCal = 0
  for (const date of weekDates) {
    const key = formatDateKey(date)
    totalCal += computeDayCaloriesForPerson(meals[key] || {}, personId)
  }

  const target = computeDailyTarget(profile)
  const weeklyTarget = target ? target * 7 : null

  return (
    <div className={`flex flex-col gap-0.5 px-4 py-3 rounded-xl border ${cfg.statAccent}`}>
      <span className={`text-xs font-bold ${cfg.calText}`}>{cfg.emoji} {cfg.name}</span>
      <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
        {totalCal > 0 ? totalCal.toLocaleString() : '—'}
      </span>
      <span className="text-[10px] text-gray-400 dark:text-gray-600">
        {weeklyTarget ? `/ ${weeklyTarget.toLocaleString()} cal target` : 'cal this week'}
      </span>
    </div>
  )
}

export default function WeeklySummary({ weekDates }) {
  const { meals } = useMealPlan()
  const { cfg } = usePerson()
  const { profiles } = useProfiles()
  const { filled, total, remaining, pct } = computeWeekStats(meals, weekDates)

  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Progress bar */}
      {total > 0 && (
        <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${cfg.progressFrom} ${cfg.progressTo} transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard
          label="Meals planned"
          value={filled}
          sub={`of ${total} slots`}
          accent="border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30"
        />
        <StatCard
          label="Remaining"
          value={remaining}
          sub={`${pct}% complete`}
        />
        <PersonCalCard personId="jose" meals={meals} weekDates={weekDates} profiles={profiles} />
        <PersonCalCard personId="emma" meals={meals} weekDates={weekDates} profiles={profiles} />
      </div>
    </div>
  )
}

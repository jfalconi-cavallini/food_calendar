'use client'
import { useMealPlan } from '../../hooks/useMealPlan'
import { computeWeekStats } from '../../utils/statsUtils'
import { formatWeekRange } from '../../utils/dateUtils'

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`flex flex-col gap-0.5 px-4 py-3 rounded-xl border ${accent || 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
      <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</span>
      {sub && <span className="text-[10px] text-gray-400 dark:text-gray-600">{sub}</span>}
    </div>
  )
}

export default function WeeklySummary({ weekDates }) {
  const { meals } = useMealPlan()
  const { completed, remaining, total } = computeWeekStats(meals, weekDates)

  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Week of {formatWeekRange(weekDates)}
          </h2>
          {total > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {pct}% complete
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard
          label="Completed"
          value={completed}
          sub={`of ${total} meals`}
          accent="border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30"
        />
        <StatCard
          label="Remaining"
          value={remaining}
          sub="meals to go"
        />
        <StatCard
          label="Calories"
          value="—"
          sub="Coming soon"
        />
        <StatCard
          label="Protein"
          value="—"
          sub="Coming soon"
        />
      </div>
    </div>
  )
}

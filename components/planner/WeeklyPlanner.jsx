'use client'
import DayColumn from './DayColumn'
import { useMealPlan } from '../../hooks/useMealPlan'

function SkeletonColumn() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl p-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 min-w-[175px] animate-pulse">
      <div className="flex flex-col gap-1">
        <div className="h-2.5 w-8 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-6 rounded bg-gray-200 dark:bg-gray-700 mt-1" />
        <div className="h-2 w-6 rounded bg-gray-200 dark:bg-gray-700 mt-0.5" />
      </div>
      <div className="h-px bg-gray-100 dark:bg-gray-800" />
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="flex flex-col gap-1">
          <div className="h-2 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 rounded-xl bg-gray-100 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  )
}

export default function WeeklyPlanner({ weekDates }) {
  const { loading } = useMealPlan()

  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4">
      <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
        {loading
          ? Array.from({ length: 7 }, (_, i) => <SkeletonColumn key={i} />)
          : weekDates.map(date => <DayColumn key={date.toISOString()} date={date} />)
        }
      </div>
    </div>
  )
}

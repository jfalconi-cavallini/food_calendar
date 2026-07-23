'use client'
import { useWeek } from '../hooks/useWeek'
import Header from '../components/layout/Header'
import WeeklySummary from '../components/layout/WeeklySummary'
import WeeklyPlanner from '../components/planner/WeeklyPlanner'

export default function HomePage() {
  const { weekDates, offset, prevWeek, nextWeek, goToToday } = useWeek()

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        weekDates={weekDates}
        offset={offset}
        onPrevWeek={prevWeek}
        onNextWeek={nextWeek}
        onToday={goToToday}
      />

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-6">
        <WeeklySummary weekDates={weekDates} />
        <WeeklyPlanner weekDates={weekDates} />
      </main>

      <footer className="py-4 text-center text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-gray-900">
        Meal Planner — Jose & Emma
      </footer>
    </div>
  )
}

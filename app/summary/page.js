'use client'
import { useWeek } from '../../hooks/useWeek'
import Header from '../../components/layout/Header'
import WeeklyCaloriesSummary from '../../components/summary/WeeklyCaloriesSummary'
import ExerciseLog from '../../components/summary/ExerciseLog'

export default function SummaryPage() {
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

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Summary</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Calorie tracking and exercise log for this week.
          </p>
        </div>
        <div className="flex flex-col gap-8">
          <WeeklyCaloriesSummary weekDates={weekDates} />
          <ExerciseLog weekDates={weekDates} />
        </div>
      </main>
    </div>
  )
}

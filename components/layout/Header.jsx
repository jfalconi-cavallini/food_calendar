'use client'
import { useTheme } from '../../hooks/useTheme'
import { formatWeekRange } from '../../utils/dateUtils'
import { usePerson } from '../../lib/personContext'
import Nav from './Nav'

export default function Header({ weekDates, onPrevWeek, onNextWeek, onToday, offset }) {
  const { dark, toggle: toggleTheme } = useTheme()
  const { activePerson, toggle: togglePerson, cfg } = usePerson()

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥗</span>
            <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">
              Meal Planner
            </span>
          </div>
          <Nav />
        </div>

        {/* Center: Week navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevWeek}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Previous week"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex flex-col items-center min-w-[140px]">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
              {formatWeekRange(weekDates)}
            </span>
            {offset !== 0 && (
              <button
                onClick={onToday}
                className="mt-0.5 text-[10px] text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 font-medium"
              >
                Back to this week
              </button>
            )}
          </div>

          <button
            onClick={onNextWeek}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Next week"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Right: Person toggle + dark mode */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Person toggle */}
          <button
            onClick={togglePerson}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all duration-300 shadow-sm ${cfg.btnBg}`}
            aria-label={`Switch to ${activePerson === 'jose' ? 'Emma' : 'Jose'}`}
          >
            <span>{cfg.emoji}</span>
            <span className="hidden sm:block">{cfg.name}</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

'use client'
import { useState } from 'react'
import { useExercises } from '../../hooks/useExercises'
import { usePerson } from '../../lib/personContext'
import { formatDateKey, isToday } from '../../utils/dateUtils'
import { PERSON_CONFIG } from '../../lib/constants'

function ExerciseForm({ date, personId, onAdd, onClose }) {
  const cfg = PERSON_CONFIG[personId]
  const [name,     setName]     = useState('')
  const [duration, setDuration] = useState('')
  const [calories, setCalories] = useState('')
  const [notes,    setNotes]    = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      date,
      personId,
      name: name.trim(),
      durationMinutes: Number(duration) || 0,
      caloriesBurned:  Number(calories) || 0,
      notes,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-bold ${cfg.calText}`}>{cfg.emoji} {cfg.name}</span>
        <span className="text-xs text-gray-400">· {date}</span>
      </div>
      <input
        type="text" value={name} onChange={e => setName(e.target.value)}
        placeholder="Exercise name (e.g. Running)"
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-500 mb-0.5">Duration (min)</label>
          <input
            type="number" min="0" value={duration} onChange={e => setDuration(e.target.value)}
            placeholder="30"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 mb-0.5">Calories burned</label>
          <input
            type="number" min="0" value={calories} onChange={e => setCalories(e.target.value)}
            placeholder="250"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <input
        type="text" value={notes} onChange={e => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex gap-2">
        <button
          type="button" onClick={onClose}
          className="flex-1 px-3 py-2 text-xs text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit" disabled={!name.trim()}
          className={`flex-1 px-3 py-2 text-xs text-white rounded-lg font-medium disabled:opacity-40 ${cfg.btnBg}`}
        >
          Log exercise
        </button>
      </div>
    </form>
  )
}

export default function ExerciseLog({ weekDates }) {
  const { exercises, addExercise, deleteExercise } = useExercises()
  const { activePerson, cfg } = usePerson()
  const [addingFor, setAddingFor] = useState(null) // { date, personId } | null

  const weekKeys = weekDates.map(d => formatDateKey(d))
  const weekExercises = exercises.filter(e => weekKeys.includes(e.date))

  const totalBurned = weekExercises
    .filter(e => e.personId === activePerson)
    .reduce((s, e) => s + (e.caloriesBurned || 0), 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Exercise Log</h2>
        {totalBurned > 0 && (
          <span className={`text-xs font-medium ${cfg.accentText}`}>
            {totalBurned.toLocaleString()} cal burned this week
          </span>
        )}
      </div>

      {/* Per-day list */}
      <div className="flex flex-col gap-3">
        {weekDates.map(date => {
          const dateKey  = formatDateKey(date)
          const today    = isToday(date)
          const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

          return (
            <div key={dateKey} className={`rounded-xl border p-3 ${
              today ? `${cfg.todayBorder} ${cfg.todayBg}` : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${today ? cfg.todayText : 'text-gray-500 dark:text-gray-400'}`}>
                  {dayLabel}
                  {today && <span className="ml-1.5 text-[10px]">· Today</span>}
                </span>
                <div className="flex items-center gap-1.5">
                  {['jose', 'emma'].map(pid => (
                    <button
                      key={pid}
                      onClick={() => setAddingFor({ date: dateKey, personId: pid })}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium text-white transition-colors ${PERSON_CONFIG[pid].btnBg}`}
                    >
                      {PERSON_CONFIG[pid].emoji} + Log
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercise entries */}
              {['jose', 'emma'].map(pid => {
                const dayExercises = exercises.filter(e => e.date === dateKey && e.personId === pid)
                if (!dayExercises.length) return null
                const pcfg = PERSON_CONFIG[pid]
                return (
                  <div key={pid} className="flex flex-col gap-1 mt-1">
                    {dayExercises.map(ex => (
                      <div key={ex.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 group">
                        <span className={`text-[10px] font-bold ${pcfg.accentText}`}>{pcfg.emoji}</span>
                        <span className="text-xs text-gray-700 dark:text-gray-200 flex-1">{ex.name}</span>
                        {ex.durationMinutes > 0 && (
                          <span className="text-[10px] text-gray-400">{ex.durationMinutes}min</span>
                        )}
                        {ex.caloriesBurned > 0 && (
                          <span className={`text-[10px] font-medium ${pcfg.accentText}`}>{ex.caloriesBurned} cal</span>
                        )}
                        <button
                          onClick={() => deleteExercise(ex.id)}
                          className="text-gray-300 dark:text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 2l8 8M10 2l-8 8" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )
              })}

              {/* Add form */}
              {addingFor?.date === dateKey && (
                <div className="mt-2">
                  <ExerciseForm
                    date={dateKey}
                    personId={addingFor.personId}
                    onAdd={addExercise}
                    onClose={() => setAddingFor(null)}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

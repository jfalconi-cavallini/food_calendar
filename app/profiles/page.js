'use client'
import { useState } from 'react'
import { useWeek } from '../../hooks/useWeek'
import Header from '../../components/layout/Header'
import ProfileForm from '../../components/profiles/ProfileForm'
import { useProfiles } from '../../hooks/useProfiles'
import { PERSON_CONFIG } from '../../lib/constants'

export default function ProfilesPage() {
  const { weekDates, offset, prevWeek, nextWeek, goToToday } = useWeek()
  const { profiles, loading, updateProfile } = useProfiles()
  const [saving, setSaving] = useState({ jose: false, emma: false })

  const handleSave = async (personId, data) => {
    setSaving(prev => ({ ...prev, [personId]: true }))
    await updateProfile(personId, data)
    setSaving(prev => ({ ...prev, [personId]: false }))
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header weekDates={weekDates} offset={offset} onPrevWeek={prevWeek} onNextWeek={nextWeek} onToday={goToToday} />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-6 h-6 rounded-full border-2 border-gray-200 border-t-indigo-500" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        weekDates={weekDates}
        offset={offset}
        onPrevWeek={prevWeek}
        onNextWeek={nextWeek}
        onToday={goToToday}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profiles</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Set your stats to get personalized calorie targets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {['jose', 'emma'].map(personId => {
            const cfg = PERSON_CONFIG[personId]
            return (
              <div key={personId} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cfg.emoji}</span>
                  <h2 className={`text-lg font-bold ${cfg.calText}`}>{cfg.name}</h2>
                </div>
                <ProfileForm
                  personId={personId}
                  initialProfile={profiles[personId]}
                  onSave={(data) => handleSave(personId, data)}
                  saving={saving[personId]}
                />
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, rowsToProfiles } from './supabase'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const [profiles, setProfiles]   = useState({ jose: null, emma: null })
  const [exercises, setExercises] = useState([])
  const [loading, setLoading]     = useState(true)

  const fetchProfiles = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('*')
    if (data) setProfiles(rowsToProfiles(data))
  }, [])

  const fetchExercises = useCallback(async () => {
    const { data } = await supabase.from('exercises').select('*').order('created_at', { ascending: false })
    if (data) {
      setExercises(data.map(e => ({
        id:              e.id,
        date:            e.date,
        personId:        e.person_id,
        name:            e.name,
        durationMinutes: e.duration_minutes ?? 0,
        caloriesBurned:  e.calories_burned ?? 0,
        notes:           e.notes ?? '',
      })))
    }
  }, [])

  useEffect(() => {
    Promise.all([fetchProfiles(), fetchExercises()]).finally(() => setLoading(false))

    const channel = supabase
      .channel('profile-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchProfiles)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exercises' }, fetchExercises)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchProfiles, fetchExercises])

  return (
    <ProfileContext.Provider value={{ profiles, exercises, loading, setProfiles, setExercises }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfileContext must be inside ProfileProvider')
  return ctx
}

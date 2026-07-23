'use client'
import { useProfileContext } from '../lib/profileContext'
import { supabase } from '../lib/supabase'

function newId() { return Math.random().toString(36).slice(2, 11) }

export function useExercises() {
  const { exercises, setExercises } = useProfileContext()

  const addExercise = async (exerciseData) => {
    const id  = newId()
    const row = {
      id,
      date:             exerciseData.date,
      person_id:        exerciseData.personId,
      name:             exerciseData.name,
      duration_minutes: Number(exerciseData.durationMinutes) || 0,
      calories_burned:  Number(exerciseData.caloriesBurned) || 0,
      notes:            exerciseData.notes || '',
    }
    setExercises(prev => [{ ...exerciseData, id }, ...prev])
    await supabase.from('exercises').insert(row)
  }

  const deleteExercise = async (id) => {
    setExercises(prev => prev.filter(e => e.id !== id))
    await supabase.from('exercises').delete().eq('id', id)
  }

  const getExercisesForDay = (date, personId) =>
    exercises.filter(e => e.date === date && e.personId === personId)

  const getDayExerciseCalories = (date, personId) =>
    getExercisesForDay(date, personId).reduce((s, e) => s + (e.caloriesBurned || 0), 0)

  return { exercises, addExercise, deleteExercise, getExercisesForDay, getDayExerciseCalories }
}

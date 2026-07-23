'use client'
import { useProfileContext } from '../lib/profileContext'
import { supabase } from '../lib/supabase'
import { computeDailyTarget, computeTDEE, computeBMR, computeAdjustedTarget } from '../utils/calorieUtils'
import { formatDateKey } from '../utils/dateUtils'

export function useProfiles() {
  const { profiles, exercises, loading } = useProfileContext()

  const updateProfile = async (personId, data) => {
    const row = {
      id:                      personId,
      name:                    data.name,
      age:                     data.age ? Number(data.age) : null,
      sex:                     data.sex || null,
      height_cm:               data.heightCm ? Number(data.heightCm) : null,
      weight_kg:               data.weightKg ? Number(data.weightKg) : null,
      goal_weight_kg:          data.goalWeightKg ? Number(data.goalWeightKg) : null,
      activity_level:          data.activityLevel || 'moderate',
      fitness_goal:            data.fitnessGoal || 'maintain',
      weekly_weight_change:    Number(data.weeklyWeightChange ?? 0),
      estimated_calorie_target: data.estimatedCalorieTarget ? Number(data.estimatedCalorieTarget) : null,
      manual_calorie_target:   data.manualCalorieTarget ? Number(data.manualCalorieTarget) : null,
      exercise_adjustment_mode: data.exerciseAdjustmentMode || 'none',
      dietary_preferences:     data.dietaryPreferences || [],
      allergies:               data.allergies || [],
      disliked_foods:          data.dislikedFoods || [],
      updated_at:              new Date().toISOString(),
    }
    await supabase.from('profiles').upsert(row, { onConflict: 'id' })
  }

  const getTarget = (personId, date) => {
    const profile = profiles[personId]
    if (!profile) return null
    const dayExerciseCal = exercises
      .filter(e => e.personId === personId && e.date === date)
      .reduce((s, e) => s + (e.caloriesBurned || 0), 0)
    const base = computeDailyTarget(profile)
    return computeAdjustedTarget(base, dayExerciseCal, profile.exerciseAdjustmentMode)
  }

  return {
    profiles,
    exercises,
    loading,
    updateProfile,
    getTarget,
    getBMR:  (personId) => computeBMR(profiles[personId]),
    getTDEE: (personId) => computeTDEE(profiles[personId]),
    getDailyTarget: (personId) => computeDailyTarget(profiles[personId]),
  }
}

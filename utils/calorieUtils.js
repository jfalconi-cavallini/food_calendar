import { ACTIVITY_LEVELS, WEEKLY_WEIGHT_OPTIONS } from '../lib/constants'

// ─── Unit Conversions ─────────────────────────────────────────────────────────
export function cmToFeetInches(cm) {
  if (!cm) return { feet: '', inches: '' }
  const totalInches = cm / 2.54
  return { feet: Math.floor(totalInches / 12), inches: Math.round(totalInches % 12) }
}

export function feetInchesToCm(feet, inches) {
  const f = Number(feet) || 0
  const i = Number(inches) || 0
  return Math.round(((f * 12) + i) * 2.54 * 10) / 10
}

export function kgToLbs(kg) {
  if (!kg) return ''
  return Math.round(kg * 2.20462 * 10) / 10
}

export function lbsToKg(lbs) {
  if (!lbs) return null
  return Math.round((Number(lbs) / 2.20462) * 100) / 100
}

// ─── BMR (Mifflin-St Jeor) ────────────────────────────────────────────────────
export function computeBMR(profile) {
  const { age, sex, heightCm, weightKg } = profile || {}
  if (!age || !sex || !heightCm || !weightKg) return null
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? Math.round(base + 5) : Math.round(base - 161)
}

// ─── TDEE ─────────────────────────────────────────────────────────────────────
export function computeTDEE(profile) {
  const bmr = computeBMR(profile)
  if (!bmr) return null
  const level = ACTIVITY_LEVELS.find(l => l.id === (profile.activityLevel || 'moderate'))
  return Math.round(bmr * (level?.multiplier ?? 1.55))
}

// ─── Daily Calorie Target ─────────────────────────────────────────────────────
export function computeDailyTarget(profile) {
  if (!profile) return null
  if (profile.manualCalorieTarget) return profile.manualCalorieTarget
  const tdee = computeTDEE(profile)
  if (!tdee) return null
  const opt = WEEKLY_WEIGHT_OPTIONS.find(o => o.value === Number(profile.weeklyWeightChange ?? 0))
  const adjustment = opt?.adjustment ?? 0
  return Math.max(1200, Math.round(tdee + adjustment))
}

// ─── Exercise-adjusted Target ─────────────────────────────────────────────────
export function computeAdjustedTarget(baseTarget, exerciseCalories, mode) {
  if (!baseTarget) return null
  const cal = Number(exerciseCalories) || 0
  if (mode === 'half') return Math.round(baseTarget + cal * 0.5)
  if (mode === 'full') return Math.round(baseTarget + cal)
  return baseTarget
}

// ─── Day Calorie Totals ───────────────────────────────────────────────────────
export function computeDayCaloriesForPerson(dayMeals, personId) {
  if (!dayMeals) return 0
  return Object.values(dayMeals).reduce((sum, meal) => {
    if (!meal) return sum
    const cal = personId === 'jose' ? (meal.joseCalories || 0) : (meal.emmaCalories || 0)
    return sum + cal
  }, 0)
}

// ─── Week Calorie Stats ───────────────────────────────────────────────────────
export function computeWeeklyCalorieStats(meals, weekDates, profile, exercises) {
  if (!profile) return null

  const { formatDateKey } = require('./dateUtils')
  const dailyTarget = computeDailyTarget(profile)
  const personId = profile.id

  let totalCal = 0
  let daysUnder = 0
  let daysOver = 0
  let daysOnTarget = 0
  const THRESHOLD = 100

  for (const date of weekDates) {
    const key = formatDateKey(date)
    const dayMeals = meals[key] || {}
    const dayExerciseCal = (exercises || [])
      .filter(e => e.date === key && e.personId === personId)
      .reduce((s, e) => s + (e.caloriesBurned || 0), 0)

    const dayCal = computeDayCaloriesForPerson(dayMeals, personId)
    totalCal += dayCal

    if (dailyTarget && dayCal > 0) {
      const adjustedTarget = computeAdjustedTarget(dailyTarget, dayExerciseCal, profile.exerciseAdjustmentMode)
      const diff = dayCal - adjustedTarget
      if (diff > THRESHOLD) daysOver++
      else if (diff < -THRESHOLD) daysUnder++
      else daysOnTarget++
    }
  }

  const avgCal = weekDates.length > 0 ? Math.round(totalCal / weekDates.length) : 0

  return { totalCal, avgCal, dailyTarget, daysUnder, daysOver, daysOnTarget }
}

// ─── Ingredient Calorie Total ─────────────────────────────────────────────────
export function computeIngredientCalories(ingredients) {
  if (!ingredients?.length) return 0
  return ingredients.reduce((sum, i) => sum + (Number(i.calories) || 0), 0)
}

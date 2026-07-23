import { REQUIRED_MEAL_IDS } from '../lib/constants'
import { formatDateKey } from './dateUtils'

/**
 * Completion is based on how much of the REQUIRED meal plan has been filled.
 * Breakfast, Lunch, Dinner = required (7 × 3 = 21 total).
 * Snacks are optional and do not count against completion.
 */
export function computeWeekStats(meals, weekDates) {
  let filled = 0
  const total = weekDates.length * REQUIRED_MEAL_IDS.length // 21

  for (const date of weekDates) {
    const key = formatDateKey(date)
    for (const mealId of REQUIRED_MEAL_IDS) {
      if (meals[key]?.[mealId]) filled++
    }
  }

  return {
    filled,
    total,
    remaining: total - filled,
    pct: total > 0 ? Math.round((filled / total) * 100) : 0,
  }
}

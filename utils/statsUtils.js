import { MEAL_TYPES } from '../lib/constants'
import { formatDateKey } from './dateUtils'

export function computeWeekStats(meals, weekDates) {
  let completed = 0
  let total = 0

  for (const date of weekDates) {
    const key = formatDateKey(date)
    for (const { id } of MEAL_TYPES) {
      const meal = meals[key]?.[id]
      if (meal) {
        total++
        if (meal.completed) completed++
      }
    }
  }

  return { completed, remaining: total - completed, total }
}

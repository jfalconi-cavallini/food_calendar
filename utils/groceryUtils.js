import { GROCERY_CATEGORIES } from '../lib/constants'

/**
 * Aggregates ingredients across all meals for a given set of dates.
 * Returns an object keyed by GROCERY_CATEGORIES with arrays of items.
 */
export function aggregateGroceryList(meals, weekDates, formatDateKey) {
  const map = {} // `${name_lower}_${unit}` → aggregated item

  for (const date of weekDates) {
    const key = formatDateKey(date)
    const dayMeals = meals[key] || {}

    for (const [mealType, meal] of Object.entries(dayMeals)) {
      if (!meal?.ingredients?.length) continue

      for (const ing of meal.ingredients) {
        if (!ing.name?.trim()) continue
        const mapKey = `${ing.name.trim().toLowerCase()}_${ing.unit || 'item'}`

        if (map[mapKey]) {
          map[mapKey].quantity += Number(ing.quantity) || 0
          map[mapKey].meals.push({ date: key, mealType, mealName: meal.name })
        } else {
          map[mapKey] = {
            id: mapKey,
            name: ing.name.trim(),
            quantity: Number(ing.quantity) || 0,
            unit: ing.unit || 'item',
            category: ing.category || 'Other',
            calories: Number(ing.calories) || 0,
            meals: [{ date: key, mealType, mealName: meal.name }],
            purchased: false,
            owned: false,
          }
        }
      }
    }
  }

  // Group by category
  const grouped = {}
  for (const cat of GROCERY_CATEGORIES) grouped[cat] = []

  for (const item of Object.values(map)) {
    const cat = GROCERY_CATEGORIES.includes(item.category) ? item.category : 'Other'
    grouped[cat].push(item)
  }

  // Sort items within each category
  for (const cat of GROCERY_CATEGORIES) {
    grouped[cat].sort((a, b) => a.name.localeCompare(b.name))
  }

  return grouped
}

export function countGroceryItems(grouped) {
  return Object.values(grouped).reduce((sum, items) => sum + items.length, 0)
}

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL     || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
)

export function rowsToMeals(rows) {
  const meals = {}
  for (const row of rows) {
    if (!meals[row.date]) meals[row.date] = {}
    meals[row.date][row.meal_type] = {
      id:                       row.id,
      name:                     row.name,
      completed:                row.completed ?? false,
      notes:                    row.notes ?? '',
      recipeInstructions:       row.recipe_instructions ?? '',
      joseCalories:             row.jose_calories ?? 0,
      emmaCalories:             row.emma_calories ?? 0,
      joseServings:             row.jose_servings ?? 1,
      emmaServings:             row.emma_servings ?? 1,
      totalCalories:            row.total_calories ?? 0,
      manuallyOverriddenCalories: row.manually_overridden_calories ?? false,
      ingredients: (row.ingredients ?? [])
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map(ing => ({
          id:       ing.id,
          name:     ing.name,
          quantity: ing.quantity ?? 1,
          unit:     ing.unit ?? 'item',
          calories: ing.calories ?? 0,
          category: ing.category ?? 'Other',
          notes:    ing.notes ?? '',
          sortOrder: ing.sort_order ?? 0,
        })),
    }
  }
  return meals
}

export function rowsToProfiles(rows) {
  const profiles = {}
  for (const row of rows) {
    profiles[row.id] = {
      id:                     row.id,
      name:                   row.name,
      age:                    row.age ?? null,
      sex:                    row.sex ?? null,
      heightCm:               row.height_cm ?? null,
      weightKg:               row.weight_kg ?? null,
      goalWeightKg:           row.goal_weight_kg ?? null,
      activityLevel:          row.activity_level ?? 'moderate',
      fitnessGoal:            row.fitness_goal ?? 'maintain',
      weeklyWeightChange:     row.weekly_weight_change ?? 0,
      estimatedCalorieTarget: row.estimated_calorie_target ?? null,
      manualCalorieTarget:    row.manual_calorie_target ?? null,
      exerciseAdjustmentMode: row.exercise_adjustment_mode ?? 'none',
      dietaryPreferences:     row.dietary_preferences ?? [],
      allergies:              row.allergies ?? [],
      dislikedFoods:          row.disliked_foods ?? [],
    }
  }
  return profiles
}

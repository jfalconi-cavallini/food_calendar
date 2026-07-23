import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL    || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
)

export function rowsToMeals(rows) {
  const meals = {}
  for (const row of rows) {
    if (!meals[row.date]) meals[row.date] = {}
    meals[row.date][row.meal_type] = {
      id: row.id,
      name: row.name,
      completed: row.completed,
    }
  }
  return meals
}

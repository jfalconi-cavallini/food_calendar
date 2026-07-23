'use client'
import { useMealPlanContext } from '../lib/mealPlanContext'
import { supabase } from '../lib/supabase'

function newId() { return Math.random().toString(36).slice(2, 11) }

function toMealRow(id, date, mealType, mealData) {
  return {
    id, date, meal_type: mealType,
    name:                          mealData.name || '',
    completed:                     mealData.completed ?? false,
    notes:                         mealData.notes || '',
    recipe_instructions:           mealData.recipeInstructions || '',
    jose_calories:                 Number(mealData.joseCalories) || 0,
    emma_calories:                 Number(mealData.emmaCalories) || 0,
    jose_servings:                 Number(mealData.joseServings) || 1,
    emma_servings:                 Number(mealData.emmaServings) || 1,
    total_calories:                Number(mealData.totalCalories) || 0,
    manually_overridden_calories:  mealData.manuallyOverriddenCalories ?? false,
  }
}

async function saveIngredients(mealId, ingredients) {
  // Delete existing and re-insert (simplest reliable approach)
  await supabase.from('ingredients').delete().eq('meal_id', mealId)
  const valid = (ingredients || []).filter(i => i.name?.trim())
  if (!valid.length) return
  await supabase.from('ingredients').insert(
    valid.map((ing, idx) => ({
      id:         newId(),
      meal_id:    mealId,
      name:       ing.name.trim(),
      quantity:   Number(ing.quantity) || 1,
      unit:       ing.unit || 'item',
      calories:   Number(ing.calories) || 0,
      category:   ing.category || 'Other',
      notes:      ing.notes || '',
      sort_order: idx,
    }))
  )
}

export function useMealPlan() {
  const { state, dispatch, loading } = useMealPlanContext()

  const addMeal = async (date, mealType, mealData) => {
    const id   = newId()
    const meal = { id, completed: false, ingredients: [], ...mealData }
    dispatch({ type: 'ADD_MEAL', date, mealType, meal })
    await supabase.from('meals').insert(toMealRow(id, date, mealType, meal))
    await saveIngredients(id, meal.ingredients)
  }

  const updateMeal = async (date, mealType, mealData) => {
    const existing = state.meals[date]?.[mealType]
    if (!existing) return
    const updated = { ...existing, ...mealData }
    dispatch({ type: 'UPDATE_MEAL', date, mealType, meal: updated })
    const { ingredients, ...rest } = updated
    await supabase.from('meals').update(toMealRow(existing.id, date, mealType, rest)).eq('id', existing.id)
    if (mealData.ingredients !== undefined) await saveIngredients(existing.id, mealData.ingredients)
  }

  const deleteMeal = async (date, mealType) => {
    const meal = state.meals[date]?.[mealType]
    if (!meal) return
    dispatch({ type: 'DELETE_MEAL', date, mealType })
    await supabase.from('meals').delete().eq('id', meal.id)
  }

  const toggleMeal = async (date, mealType) => {
    const meal = state.meals[date]?.[mealType]
    if (!meal) return
    dispatch({ type: 'TOGGLE_MEAL', date, mealType })
    await supabase.from('meals').update({ completed: !meal.completed }).eq('id', meal.id)
  }

  return { meals: state.meals, loading, addMeal, updateMeal, deleteMeal, toggleMeal }
}

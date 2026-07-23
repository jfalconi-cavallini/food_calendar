'use client'
import { useMealPlanContext } from '../lib/mealPlanContext'
import { supabase } from '../lib/supabase'

function newId() {
  return Math.random().toString(36).slice(2, 11)
}

export function useMealPlan() {
  const { state, dispatch, loading } = useMealPlanContext()

  const addMeal = async (date, mealType, name) => {
    const id = newId()
    dispatch({ type: 'ADD_MEAL', date, mealType, name, id })
    await supabase.from('meals').insert({ id, date, meal_type: mealType, name, completed: false })
  }

  const updateMeal = async (date, mealType, name) => {
    const meal = state.meals[date]?.[mealType]
    if (!meal) return
    dispatch({ type: 'UPDATE_MEAL', date, mealType, name })
    await supabase.from('meals').update({ name }).eq('id', meal.id)
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

  return {
    meals:      state.meals,
    loading,
    addMeal,
    updateMeal,
    deleteMeal,
    toggleMeal,
  }
}

'use client'
import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react'
import { supabase, rowsToMeals } from './supabase'
import { generateDefaultMeals } from '../data/defaultMeals'

const MealPlanContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, meals: action.meals }

    case 'ADD_MEAL': {
      const { date, mealType, meal } = action
      return {
        ...state,
        meals: {
          ...state.meals,
          [date]: { ...state.meals[date], [mealType]: meal },
        },
      }
    }

    case 'UPDATE_MEAL': {
      const { date, mealType, meal } = action
      return {
        ...state,
        meals: {
          ...state.meals,
          [date]: {
            ...state.meals[date],
            [mealType]: { ...state.meals[date]?.[mealType], ...meal },
          },
        },
      }
    }

    case 'DELETE_MEAL': {
      const { date, mealType } = action
      const day = { ...state.meals[date] }
      delete day[mealType]
      return { ...state, meals: { ...state.meals, [date]: day } }
    }

    case 'TOGGLE_MEAL': {
      const { date, mealType } = action
      const meal = state.meals[date]?.[mealType]
      if (!meal) return state
      return {
        ...state,
        meals: {
          ...state.meals,
          [date]: {
            ...state.meals[date],
            [mealType]: { ...meal, completed: !meal.completed },
          },
        },
      }
    }

    default:
      return state
  }
}

export function MealPlanProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { meals: {} })
  const [loading, setLoading] = useState(true)

  const fetchAndLoad = useCallback(async () => {
    const { data, error } = await supabase.from('meals').select('*, ingredients(*)')
    if (error) { setLoading(false); return }

    if (data.length === 0) {
      const defaults = generateDefaultMeals()
      const rows = Object.entries(defaults).flatMap(([date, dayMeals]) =>
        Object.entries(dayMeals).map(([meal_type, meal]) => ({
          id: meal.id, date, meal_type,
          name: meal.name,
          completed: meal.completed,
          notes: meal.notes || '',
          recipe_instructions: meal.recipeInstructions || '',
          jose_calories: meal.joseCalories || 0,
          emma_calories: meal.emmaCalories || 0,
          jose_servings: meal.joseServings || 1,
          emma_servings: meal.emmaServings || 1,
          total_calories: meal.totalCalories || 0,
          manually_overridden_calories: false,
        }))
      )
      await supabase.from('meals').upsert(rows, { onConflict: 'date,meal_type' })
      dispatch({ type: 'LOAD', meals: defaults })
    } else {
      dispatch({ type: 'LOAD', meals: rowsToMeals(data) })
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAndLoad()
    const channel = supabase
      .channel('meals-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meals' }, fetchAndLoad)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ingredients' }, fetchAndLoad)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [fetchAndLoad])

  return (
    <MealPlanContext.Provider value={{ state, dispatch, loading }}>
      {children}
    </MealPlanContext.Provider>
  )
}

export function useMealPlanContext() {
  const ctx = useContext(MealPlanContext)
  if (!ctx) throw new Error('useMealPlanContext must be inside MealPlanProvider')
  return ctx
}

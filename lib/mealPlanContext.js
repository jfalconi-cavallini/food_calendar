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
      const { date, mealType, name, id } = action
      return {
        ...state,
        meals: {
          ...state.meals,
          [date]: {
            ...state.meals[date],
            [mealType]: { id, name, completed: false },
          },
        },
      }
    }

    case 'UPDATE_MEAL': {
      const { date, mealType, name } = action
      return {
        ...state,
        meals: {
          ...state.meals,
          [date]: {
            ...state.meals[date],
            [mealType]: { ...state.meals[date]?.[mealType], name },
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
    const { data, error } = await supabase.from('meals').select('*')
    if (error) { setLoading(false); return }

    if (data.length === 0) {
      // Seed sample data on first use
      const defaults = generateDefaultMeals()
      const rows = Object.entries(defaults).flatMap(([date, dayMeals]) =>
        Object.entries(dayMeals).map(([meal_type, meal]) => ({
          id: meal.id, date, meal_type, name: meal.name, completed: meal.completed,
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

    // Realtime: re-fetch whenever any row changes so both users stay in sync
    const channel = supabase
      .channel('meals-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meals' }, fetchAndLoad)
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

'use client'
import { createContext, useContext, useReducer, useEffect } from 'react'
import { STORAGE_KEY } from './constants'
import { generateDefaultMeals } from '../data/defaultMeals'

const MealPlanContext = createContext(null)

function id() {
  return Math.random().toString(36).slice(2, 11)
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, meals: action.meals }

    case 'ADD_MEAL': {
      const { date, mealType, name } = action
      return {
        ...state,
        meals: {
          ...state.meals,
          [date]: {
            ...state.meals[date],
            [mealType]: { id: id(), name, completed: false },
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        dispatch({ type: 'LOAD', meals: JSON.parse(stored) })
      } else {
        // Seed sample data on first visit
        const defaults = generateDefaultMeals()
        dispatch({ type: 'LOAD', meals: defaults })
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.meals))
    } catch {}
  }, [state.meals])

  return (
    <MealPlanContext.Provider value={{ state, dispatch }}>
      {children}
    </MealPlanContext.Provider>
  )
}

export function useMealPlanContext() {
  const ctx = useContext(MealPlanContext)
  if (!ctx) throw new Error('useMealPlanContext must be inside MealPlanProvider')
  return ctx
}

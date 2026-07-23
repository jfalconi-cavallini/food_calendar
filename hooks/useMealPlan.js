'use client'
import { useMealPlanContext } from '../lib/mealPlanContext'

export function useMealPlan() {
  const { state, dispatch } = useMealPlanContext()

  return {
    meals:      state.meals,
    addMeal:    (date, mealType, name) => dispatch({ type: 'ADD_MEAL',    date, mealType, name }),
    updateMeal: (date, mealType, name) => dispatch({ type: 'UPDATE_MEAL', date, mealType, name }),
    deleteMeal: (date, mealType)       => dispatch({ type: 'DELETE_MEAL', date, mealType }),
    toggleMeal: (date, mealType)       => dispatch({ type: 'TOGGLE_MEAL', date, mealType }),
  }
}

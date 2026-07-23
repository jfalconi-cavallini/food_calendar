import { getWeekDates, formatDateKey } from '../utils/dateUtils'

function id() { return Math.random().toString(36).slice(2, 11) }

const SAMPLES = {
  breakfast: [
    'Oatmeal & Berries', 'Avocado Toast', 'Greek Yogurt Parfait',
    'Scrambled Eggs', 'Smoothie Bowl', 'Pancakes', 'French Toast',
  ],
  lunch: [
    'Chicken Caesar Salad', 'Turkey Wrap', 'Quinoa Power Bowl',
    'Grilled Cheese & Tomato Soup', 'Sushi Rolls', null, 'Burrito Bowl',
  ],
  dinner: [
    'Salmon & Roasted Veggies', 'Pasta Bolognese', 'Chicken Stir Fry',
    'Beef Tacos', 'Grilled Chicken & Rice', 'Homemade Pizza', 'Roast Chicken',
  ],
  snacks_jose: [
    'Apple & Peanut Butter', 'Protein Bar', null,
    'Hummus & Veggies', null, 'Trail Mix', 'Greek Yogurt',
  ],
  snacks_emma: [
    'Fruit Salad', null, 'Rice Cakes',
    null, 'Dark Chocolate', 'Almonds', null,
  ],
}

// Sample calorie data for seed meals
const SAMPLE_CALORIES = {
  breakfast: [350, 400, 300, 450, 380, 500, 480],
  lunch:     [500, 450, 550, 600, 650, 0, 580],
  dinner:    [650, 700, 600, 550, 620, 800, 750],
  snacks_jose: [200, 220, 0, 150, 0, 180, 200],
  snacks_emma: [120, 0, 100, 0, 150, 160, 0],
}

export function generateDefaultMeals() {
  const dates = getWeekDates(0)
  const meals = {}

  dates.forEach((date, i) => {
    const key = formatDateKey(date)
    meals[key] = {}

    for (const [type, options] of Object.entries(SAMPLES)) {
      if (!options[i]) continue
      const joseCal = type === 'snacks_emma' ? 0 : (SAMPLE_CALORIES[type]?.[i] ?? 0)
      const emmaCal = type === 'snacks_jose' ? 0 : (SAMPLE_CALORIES[type]?.[i] ?? 0)
      // Emma typically eats about 80% of Jose's portions for shared meals
      const emmaAdjusted = ['breakfast','lunch','dinner'].includes(type)
        ? Math.round(emmaCal * 0.8)
        : emmaCal

      meals[key][type] = {
        id: id(),
        name: options[i],
        completed: i < 2,
        notes: '',
        recipeInstructions: '',
        joseCalories: joseCal,
        emmaCalories: emmaAdjusted,
        joseServings: 1,
        emmaServings: ['breakfast','lunch','dinner'].includes(type) ? 0.8 : 1,
        totalCalories: joseCal,
        manuallyOverriddenCalories: false,
        ingredients: [],
      }
    }
  })

  return meals
}

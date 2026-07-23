import { getWeekDates, formatDateKey } from '../utils/dateUtils'

function id() {
  return Math.random().toString(36).slice(2, 11)
}

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
  snacks: [
    'Apple & Peanut Butter', 'Protein Bar', null,
    'Hummus & Veggies', null, 'Trail Mix', 'Greek Yogurt',
  ],
}

export function generateDefaultMeals() {
  const dates = getWeekDates(0)
  const meals = {}

  dates.forEach((date, i) => {
    const key = formatDateKey(date)
    meals[key] = {}
    for (const [type, options] of Object.entries(SAMPLES)) {
      if (options[i]) {
        meals[key][type] = {
          id: id(),
          name: options[i],
          completed: i < 2, // Mon & Tue seeded as done
        }
      }
    }
  })

  return meals
}

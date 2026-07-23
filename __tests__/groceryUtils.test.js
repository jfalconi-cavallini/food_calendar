import { aggregateGroceryList, countGroceryItems } from '../utils/groceryUtils'
import { formatDateKey } from '../utils/dateUtils'

function makeDate(offset) {
  const d = new Date(2026, 6, 21) // July 21 2026, local midnight
  d.setDate(d.getDate() + offset)
  return d
}

const weekDates = [makeDate(0), makeDate(1)]

describe('aggregateGroceryList', () => {
  test('returns empty grouped object for no ingredients', () => {
    const meals = {}
    const grouped = aggregateGroceryList(meals, weekDates, formatDateKey)
    expect(countGroceryItems(grouped)).toBe(0)
  })

  test('groups single ingredient correctly', () => {
    const meals = {
      '2026-07-21': {
        dinner: {
          name: 'Pasta',
          ingredients: [{ name: 'Pasta', quantity: 200, unit: 'gram', calories: 300, category: 'Pantry' }],
        },
      },
    }
    const grouped = aggregateGroceryList(meals, weekDates, formatDateKey)
    expect(grouped['Pantry']).toHaveLength(1)
    expect(grouped['Pantry'][0].name).toBe('Pasta')
    expect(grouped['Pantry'][0].quantity).toBe(200)
  })

  test('aggregates same ingredient across multiple days', () => {
    const [d1, d2] = weekDates.map(formatDateKey)
    const meals = {
      [d1]: {
        dinner: {
          name: 'Chicken Bowl',
          ingredients: [{ name: 'Chicken', quantity: 150, unit: 'gram', calories: 200, category: 'Meat & Seafood' }],
        },
      },
      [d2]: {
        lunch: {
          name: 'Chicken Salad',
          ingredients: [{ name: 'Chicken', quantity: 100, unit: 'gram', calories: 130, category: 'Meat & Seafood' }],
        },
      },
    }
    const grouped = aggregateGroceryList(meals, weekDates, formatDateKey)
    expect(grouped['Meat & Seafood']).toHaveLength(1)
    expect(grouped['Meat & Seafood'][0].quantity).toBe(250)
  })

  test('does NOT aggregate same ingredient with different units', () => {
    const meals = {
      '2026-07-21': {
        breakfast: {
          name: 'Eggs',
          ingredients: [
            { name: 'egg', quantity: 2, unit: 'item', calories: 70, category: 'Dairy & Eggs' },
            { name: 'egg', quantity: 100, unit: 'gram', calories: 70, category: 'Dairy & Eggs' },
          ],
        },
      },
    }
    const grouped = aggregateGroceryList(meals, weekDates, formatDateKey)
    expect(grouped['Dairy & Eggs']).toHaveLength(2)
  })

  test('falls back to Other for unknown category', () => {
    const meals = {
      '2026-07-21': {
        lunch: {
          name: 'Meal',
          ingredients: [{ name: 'Mystery Food', quantity: 1, unit: 'item', calories: 0, category: 'Unknown Category' }],
        },
      },
    }
    const grouped = aggregateGroceryList(meals, weekDates, formatDateKey)
    expect(grouped['Other']).toHaveLength(1)
  })

  test('skips ingredients with empty names', () => {
    const meals = {
      '2026-07-21': {
        breakfast: {
          name: 'Oats',
          ingredients: [
            { name: '', quantity: 1, unit: 'item', calories: 0, category: 'Other' },
            { name: 'Oats', quantity: 100, unit: 'gram', calories: 370, category: 'Pantry' },
          ],
        },
      },
    }
    const grouped = aggregateGroceryList(meals, weekDates, formatDateKey)
    expect(countGroceryItems(grouped)).toBe(1)
  })

  test('countGroceryItems sums all categories', () => {
    const meals = {
      '2026-07-21': {
        breakfast: {
          name: 'Breakfast',
          ingredients: [
            { name: 'Eggs',   quantity: 2, unit: 'item', calories: 70, category: 'Dairy & Eggs' },
            { name: 'Butter', quantity: 1, unit: 'tablespoon', calories: 100, category: 'Dairy & Eggs' },
            { name: 'Bread',  quantity: 2, unit: 'slice', calories: 140, category: 'Bakery' },
          ],
        },
      },
    }
    const grouped = aggregateGroceryList(meals, weekDates, formatDateKey)
    expect(countGroceryItems(grouped)).toBe(3)
  })
})

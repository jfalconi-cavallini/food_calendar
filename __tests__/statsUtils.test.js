import { computeWeekStats } from '../utils/statsUtils'

function makeDate(dayOffset) {
  const d = new Date(2026, 6, 21) // July 21 2026, local midnight
  d.setDate(d.getDate() + dayOffset)
  return d
}

const weekDates = Array.from({ length: 7 }, (_, i) => makeDate(i))

describe('computeWeekStats', () => {
  test('empty meals = 0 filled, 21 total', () => {
    const { filled, total, remaining, pct } = computeWeekStats({}, weekDates)
    expect(filled).toBe(0)
    expect(total).toBe(21)
    expect(remaining).toBe(21)
    expect(pct).toBe(0)
  })

  test('counts filled required slots (breakfast/lunch/dinner)', () => {
    const meals = {
      '2026-07-21': {
        breakfast: { name: 'Oats' },
        lunch:     { name: 'Sandwich' },
        dinner:    { name: 'Pasta' },
        snacks_jose: { name: 'Apple' },
      },
    }
    const { filled } = computeWeekStats(meals, weekDates)
    expect(filled).toBe(3) // snack doesn't count
  })

  test('snacks do not count toward completion', () => {
    const meals = {
      '2026-07-21': {
        snacks_jose: { name: 'Chips' },
        snacks_emma: { name: 'Grapes' },
      },
    }
    const { filled } = computeWeekStats(meals, weekDates)
    expect(filled).toBe(0)
  })

  test('partial fill across multiple days', () => {
    const meals = {
      '2026-07-21': { breakfast: { name: 'A' }, lunch: { name: 'B' } },
      '2026-07-22': { dinner: { name: 'C' } },
    }
    const { filled, pct } = computeWeekStats(meals, weekDates)
    expect(filled).toBe(3)
    expect(pct).toBe(14) // 3/21 ≈ 14%
  })

  test('full week = 100%', () => {
    const mealNames = ['breakfast', 'lunch', 'dinner']
    const { formatDateKey: fdk } = require('../utils/dateUtils')
    const meals = {}
    for (const d of weekDates) {
      const key = fdk(d)
      meals[key] = {}
      for (const m of mealNames) meals[key][m] = { name: 'Food' }
    }
    const { filled, total, pct } = computeWeekStats(meals, weekDates)
    expect(filled).toBe(21)
    expect(total).toBe(21)
    expect(pct).toBe(100)
  })
})

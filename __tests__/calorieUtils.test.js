import {
  computeBMR, computeTDEE, computeDailyTarget,
  computeAdjustedTarget, computeDayCaloriesForPerson,
  computeIngredientCalories, cmToFeetInches, feetInchesToCm, kgToLbs, lbsToKg,
} from '../utils/calorieUtils'

const joseMale = { age: 28, sex: 'male', heightCm: 178, weightKg: 82, activityLevel: 'moderate' }
const emmaFemale = { age: 26, sex: 'female', heightCm: 163, weightKg: 58, activityLevel: 'light' }

describe('computeBMR', () => {
  test('male formula', () => {
    // 10*82 + 6.25*178 - 5*28 + 5 = 820 + 1112.5 - 140 + 5 = 1797.5 → 1798
    expect(computeBMR(joseMale)).toBe(1798)
  })
  test('female formula', () => {
    // 10*58 + 6.25*163 - 5*26 - 161 = 580 + 1018.75 - 130 - 161 = 1307.75 → 1308
    expect(computeBMR(emmaFemale)).toBe(1308)
  })
  test('returns null when missing fields', () => {
    expect(computeBMR({})).toBeNull()
    expect(computeBMR({ age: 25, sex: 'male' })).toBeNull()
  })
})

describe('computeTDEE', () => {
  test('moderate activity (×1.55)', () => {
    const bmr = computeBMR(joseMale)
    expect(computeTDEE(joseMale)).toBe(Math.round(bmr * 1.55))
  })
  test('returns null when BMR is null', () => {
    expect(computeTDEE({})).toBeNull()
  })
})

describe('computeDailyTarget', () => {
  test('uses manual target when set', () => {
    expect(computeDailyTarget({ manualCalorieTarget: 1500 })).toBe(1500)
  })
  test('applies weight loss adjustment', () => {
    const profile = { ...joseMale, weeklyWeightChange: -1 }
    const tdee = computeTDEE(joseMale)
    expect(computeDailyTarget(profile)).toBe(Math.max(1200, Math.round(tdee - 500)))
  })
  test('floors at 1200', () => {
    const tinyProfile = { age: 30, sex: 'female', heightCm: 150, weightKg: 40, activityLevel: 'sedentary', weeklyWeightChange: -2 }
    expect(computeDailyTarget(tinyProfile)).toBeGreaterThanOrEqual(1200)
  })
  test('returns null for empty profile', () => {
    expect(computeDailyTarget(null)).toBeNull()
  })
})

describe('computeAdjustedTarget', () => {
  test('none mode: no adjustment', () => {
    expect(computeAdjustedTarget(2000, 300, 'none')).toBe(2000)
  })
  test('half mode: adds 50%', () => {
    expect(computeAdjustedTarget(2000, 300, 'half')).toBe(2150)
  })
  test('full mode: adds 100%', () => {
    expect(computeAdjustedTarget(2000, 300, 'full')).toBe(2300)
  })
  test('returns null when base is null', () => {
    expect(computeAdjustedTarget(null, 300, 'full')).toBeNull()
  })
})

describe('computeDayCaloriesForPerson', () => {
  const dayMeals = {
    breakfast: { joseCalories: 400, emmaCalories: 300 },
    lunch:     { joseCalories: 600, emmaCalories: 500 },
    dinner:    { joseCalories: 700, emmaCalories: 550 },
  }
  test('sums jose calories', () => {
    expect(computeDayCaloriesForPerson(dayMeals, 'jose')).toBe(1700)
  })
  test('sums emma calories', () => {
    expect(computeDayCaloriesForPerson(dayMeals, 'emma')).toBe(1350)
  })
  test('returns 0 for null dayMeals', () => {
    expect(computeDayCaloriesForPerson(null, 'jose')).toBe(0)
  })
})

describe('computeIngredientCalories', () => {
  test('sums calories', () => {
    expect(computeIngredientCalories([{ calories: 100 }, { calories: 250 }, { calories: 0 }])).toBe(350)
  })
  test('returns 0 for empty list', () => {
    expect(computeIngredientCalories([])).toBe(0)
    expect(computeIngredientCalories(null)).toBe(0)
  })
})

describe('unit conversions', () => {
  test('cmToFeetInches', () => {
    const { feet, inches } = cmToFeetInches(180)
    expect(feet).toBe(5)
    expect(inches).toBe(11)
  })
  test('feetInchesToCm round-trip', () => {
    expect(feetInchesToCm(5, 11)).toBe(180.3)
  })
  test('kgToLbs', () => {
    expect(kgToLbs(70)).toBeCloseTo(154.3, 0)
  })
  test('lbsToKg', () => {
    expect(lbsToKg(154)).toBeCloseTo(69.85, 1)
  })
})

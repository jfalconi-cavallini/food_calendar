export const STORAGE_KEY = 'meal-planner-meals'
export const THEME_KEY   = 'meal-planner-theme'
export const PERSON_KEY  = 'meal-planner-active-person'

// ─── People ──────────────────────────────────────────────────────────────────
export const PEOPLE = ['jose', 'emma']

export const PERSON_CONFIG = {
  jose: {
    id: 'jose', name: 'Jose', emoji: '👨',
    caloriesKey: 'joseCalories', servingsKey: 'joseServings',
    snackType: 'snacks_jose',
    btnBg:           'bg-red-500 hover:bg-red-600',
    todayBg:         'bg-red-50/60 dark:bg-red-950/30',
    todayBorder:     'border-red-300 dark:border-red-700',
    todayText:       'text-red-600 dark:text-red-300',
    todayDivider:    'bg-red-200 dark:bg-red-800',
    todayBadge:      'bg-red-500',
    accentText:      'text-red-500 dark:text-red-400',
    progressFrom:    'from-red-500',
    progressTo:      'to-orange-400',
    calBg:           'bg-red-50 dark:bg-red-950/30',
    calBorder:       'border-red-200 dark:border-red-800',
    calText:         'text-red-600 dark:text-red-400',
    statAccent:      'border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/30',
    trackingBg:      'bg-red-500',
  },
  emma: {
    id: 'emma', name: 'Emma', emoji: '👩',
    caloriesKey: 'emmaCalories', servingsKey: 'emmaServings',
    snackType: 'snacks_emma',
    btnBg:           'bg-purple-500 hover:bg-purple-600',
    todayBg:         'bg-purple-50/60 dark:bg-purple-950/30',
    todayBorder:     'border-purple-300 dark:border-purple-700',
    todayText:       'text-purple-600 dark:text-purple-300',
    todayDivider:    'bg-purple-200 dark:bg-purple-800',
    todayBadge:      'bg-purple-500',
    accentText:      'text-purple-500 dark:text-purple-400',
    progressFrom:    'from-purple-500',
    progressTo:      'to-pink-400',
    calBg:           'bg-purple-50 dark:bg-purple-950/30',
    calBorder:       'border-purple-200 dark:border-purple-800',
    calText:         'text-purple-600 dark:text-purple-400',
    statAccent:      'border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/30',
    trackingBg:      'bg-purple-500',
  },
}

// ─── Meal Types ───────────────────────────────────────────────────────────────
// Shared meals (both people eat these, may have different serving sizes)
export const SHARED_MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', emoji: '🌅', required: true },
  { id: 'lunch',     label: 'Lunch',     emoji: '☀️',  required: true },
  { id: 'dinner',    label: 'Dinner',    emoji: '🌙',  required: true },
]

// Returns the 4 meal type slots for a given person's view
export function getMealTypesForPerson(personId) {
  const cfg = PERSON_CONFIG[personId]
  return [
    ...SHARED_MEAL_TYPES,
    { id: cfg.snackType, label: 'Snacks', emoji: '🍎', required: false },
  ]
}

// Required meal IDs for completion calculation (snacks are optional)
export const REQUIRED_MEAL_IDS = ['breakfast', 'lunch', 'dinner']

// ─── Grocery Categories ───────────────────────────────────────────────────────
export const GROCERY_CATEGORIES = [
  'Produce',
  'Meat & Seafood',
  'Dairy & Eggs',
  'Frozen',
  'Pantry',
  'Bakery',
  'Beverages',
  'Snacks',
  'Household',
  'Other',
]

// ─── Ingredient Units ─────────────────────────────────────────────────────────
export const MEASUREMENT_UNITS = [
  'item', 'ounce', 'pound', 'gram', 'kilogram',
  'cup', 'tablespoon', 'teaspoon',
  'package', 'can', 'bottle', 'bag', 'slice', 'serving',
]

// ─── Activity Levels ──────────────────────────────────────────────────────────
export const ACTIVITY_LEVELS = [
  { id: 'sedentary',  label: 'Sedentary',        multiplier: 1.2,   desc: 'Little or no regular exercise' },
  { id: 'light',      label: 'Lightly Active',   multiplier: 1.375, desc: 'Exercise 1–3 days per week' },
  { id: 'moderate',   label: 'Moderately Active', multiplier: 1.55,  desc: 'Exercise 3–5 days per week' },
  { id: 'very',       label: 'Very Active',       multiplier: 1.725, desc: 'Hard exercise 6–7 days per week' },
  { id: 'extra',      label: 'Extra Active',      multiplier: 1.9,   desc: 'Very intense training or physical job' },
]

// ─── Fitness Goals ────────────────────────────────────────────────────────────
export const FITNESS_GOALS = [
  { id: 'lose',     label: 'Lose weight' },
  { id: 'maintain', label: 'Maintain weight' },
  { id: 'gain',     label: 'Gain weight' },
]

export const WEEKLY_WEIGHT_OPTIONS = [
  { value: -2,   label: 'Lose 2 lbs / week',     adjustment: -1000 },
  { value: -1.5, label: 'Lose 1.5 lbs / week',   adjustment: -750  },
  { value: -1,   label: 'Lose 1 lb / week',       adjustment: -500  },
  { value: -0.5, label: 'Lose 0.5 lbs / week',   adjustment: -250  },
  { value: 0,    label: 'Maintain',               adjustment: 0     },
  { value: 0.5,  label: 'Gain 0.5 lbs / week',   adjustment: 250   },
  { value: 1,    label: 'Gain 1 lb / week',       adjustment: 500   },
]

export const EXERCISE_ADJUSTMENT_MODES = [
  { id: 'none', label: 'Do not add exercise calories back' },
  { id: 'half', label: 'Add 50% of exercise calories back' },
  { id: 'full', label: 'Add 100% of exercise calories back' },
]

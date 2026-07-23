# Meal Planner — Claude Skill

This skill gives future Claude sessions instant context on the Meal Planner project located at `C:\Software Engineering\food_calendar`.

---

## Project Identity
A production-quality Meal Planner web app built with Next.js (App Router), React, Tailwind CSS v4, and JavaScript. MVP uses LocalStorage. Future phases add Supabase, recipe APIs, grocery store APIs, and AI nutrition.

---

## Architecture

### Tech Stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 App Router |
| Language | JavaScript (no TypeScript ever) |
| Styling | Tailwind CSS v4 |
| State | React Context + useReducer |
| Persistence (MVP) | LocalStorage |
| Deployment | Vercel |

### Critical Files
| File | Purpose |
|------|---------|
| `lib/mealPlanContext.js` | Single source of truth — Context, Reducer, localStorage sync |
| `lib/constants.js` | MEAL_TYPES, STORAGE_KEY, THEME_KEY |
| `hooks/useMealPlan.js` | The ONLY way components read/write meals |
| `hooks/useWeek.js` | Week offset and date array |
| `hooks/useTheme.js` | Dark mode toggle |
| `utils/dateUtils.js` | `formatDateKey`, `getWeekDates`, `isToday` |
| `utils/statsUtils.js` | `computeWeekStats` |
| `data/defaultMeals.js` | Seed data for first-time visitors |

---

## Coding Standards

### Always
- `'use client'` on any file using hooks or browser APIs
- `formatDateKey(date)` for all LocalStorage keys (returns `YYYY-MM-DD`)
- Dispatch through `useMealPlan()` — never directly touch localStorage
- Tailwind utility classes only — no CSS modules, no inline `style=` unless animation
- Kebab-case file names for non-components, PascalCase for components

### Never
- TypeScript
- External icon libraries (use SVG inline or emoji)
- LocalStorage access outside `mealPlanContext.js`
- `any` patterns that make future DB migration harder
- Wrapping existing components in new abstractions unless the feature requires it

---

## Folder Conventions
```
components/
  layout/     # App-level: Header, WeeklySummary
  planner/    # Week grid: WeeklyPlanner → DayColumn → MealSlot
  meal/       # Meal primitives: MealCard, MealForm, EmptyMealSlot
  ui/         # Generic: Button, Modal
```

---

## UI Philosophy
- **Apple-like**: rounded cards, generous whitespace, minimal chrome
- **Dark mode first**: every component must have `dark:` variants
- **Today is special**: indigo accent on today's DayColumn
- **Hover to act**: MealCard shows Edit/Delete on hover — always accessible, never cluttered
- **Smooth transitions**: `transition-all duration-200` on interactive elements
- **Progress feedback**: completion toggle turns cards green, progress bar in WeeklySummary

---

## Design System
| Token | Light | Dark |
|-------|-------|------|
| Background | `bg-gray-50` | `dark:bg-gray-950` |
| Surface | `bg-white` | `dark:bg-gray-900` |
| Border | `border-gray-200` | `dark:border-gray-800` |
| Text primary | `text-gray-900` | `dark:text-white` |
| Text secondary | `text-gray-500` | `dark:text-gray-400` |
| Accent | `indigo-500/600` | `dark:indigo-400` |
| Today highlight | `indigo-50 border-indigo-300` | `dark:bg-indigo-950/30 dark:border-indigo-700` |
| Completed meal | `emerald-50 border-emerald-200` | `dark:bg-emerald-950/40 dark:border-emerald-800` |

---

## Meal Planning Domain
- **Meal types** (always lowercase): `breakfast | lunch | dinner | snacks`
- **Week starts Monday** (ISO week standard)
- **Date keys** are always `YYYY-MM-DD` strings — never store Date objects
- **Snacks are optional** — the UI allows adding or leaving empty without penalty
- **Completion** is per-meal, not per-day

### State Shape
```json
{
  "2026-07-22": {
    "breakfast": { "id": "abc123", "name": "Oatmeal", "completed": false },
    "lunch":     { "id": "def456", "name": "Chicken Salad", "completed": true },
    "dinner":    null,
    "snacks":    null
  }
}
```

---

## Feature Roadmap

| Phase | Features |
|-------|---------|
| **MVP** | Weekly planner grid, CRUD meals, complete toggle, dark mode, LocalStorage, today highlight, week navigation, stats summary |
| **2** | Calorie tracking, macros (protein/carbs/fat/fiber), water tracker, meal notes, weight tracker, favorites |
| **3** | Recipe Builder — custom recipes, ingredient lists, scaling, cooking time, difficulty |
| **4** | Auto Grocery List — grouped by produce/meat/dairy/pantry etc. from planned meals |
| **5** | Store Integration — Costco, HEB, Walmart, Target, Amazon Fresh; compare prices, optimize basket |
| **6** | AI Nutrition — generate week plans for dietary goals (keto, high-protein, vegan, etc.) |
| **7** | Smart Adjustments — "I only have chicken and rice", "I hate onions", learn preferences |
| **8** | Health Dashboard — weight graph, calorie trends, macro charts, body measurements |
| **9** | Pantry/Inventory — track food on hand, expiration dates, reduce waste |
| **10** | AI Chat — conversational assistant for meal planning and grocery lists |

---

## Grocery List Generation Rules (Phase 4)
When building grocery lists from planned meals:
1. Aggregate all ingredients across the week
2. Deduplicate and sum quantities
3. Group by category: Produce, Meat & Seafood, Dairy & Eggs, Frozen, Bakery, Pantry, Household
4. Remove items already in pantry inventory (Phase 9 dependency)
5. Allow substitutions (e.g. chicken ↔ tofu)

---

## Nutrition Terminology
- **Macros**: protein, carbohydrates, fat (the big three)
- **Micros**: vitamins, minerals (Phase 2+ only)
- **TDEE**: Total Daily Energy Expenditure — baseline calorie target
- **Deficit/Surplus**: negative or positive delta from TDEE for cut/bulk
- **Macros ratio**: e.g. 40% protein / 30% carbs / 30% fat

---

## Future API Integrations
| Integration | Purpose | Phase |
|-------------|---------|-------|
| USDA FoodData Central | Nutrition lookup | 2 |
| Spoonacular / Edamam | Recipe search | 3 |
| Walmart Affiliates / Kroger | Grocery pricing | 5 |
| Instacart API | Cart building | 5 |
| OpenAI / Claude API | Meal generation, chat | 6, 10 |
| Apple Health / Google Fit | Activity sync | 8 |

---

## Migration: LocalStorage → Supabase
The migration is designed to be a single-file change:
1. Replace `useEffect` localStorage blocks in `mealPlanContext.js` with `fetch('/api/meals')` calls
2. Add `app/api/meals/route.js` server routes
3. No component or hook signature changes

### Future DB Schema (reference)
```sql
users         (id, email, name, created_at)
meal_plans    (id, user_id, week_start_date)
meal_slots    (id, meal_plan_id, day, meal_type)
meals         (id, meal_slot_id, name, notes, calories, protein, carbs, fat, fiber, completed)
recipes       (id, user_id, name, servings, prep_time, cook_time, difficulty)
ingredients   (id, recipe_id, name, amount, unit, category)
grocery_lists (id, user_id, meal_plan_id, created_at)
grocery_items (id, grocery_list_id, ingredient_id, amount, purchased)
```

---

## Testing Philosophy
- Unit test pure functions in `utils/` (dateUtils, statsUtils)
- Integration test the Reducer in `mealPlanContext.js` with all action types
- Component tests: render + interact (not snapshot tests)
- No mocking localStorage — use a real `localStorage` polyfill in tests
- E2E: full add/edit/delete/complete flow on the weekly planner

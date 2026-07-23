@AGENTS.md

# Meal Planner — Project Reference

## Stack
- **Next.js 16** (App Router, JavaScript only — no TypeScript)
- **React 19**
- **Tailwind CSS v4** — uses `@custom-variant dark` in globals.css for class-based dark mode
- **LocalStorage** for MVP persistence (no backend yet)
- **Vercel** deployment target

## Architecture Rules
- Never break existing functionality when adding features — refactor, don't rewrite
- Prefer editing existing files over creating new ones
- Keep components small and single-purpose
- All state lives in `MealPlanContext` (Context + useReducer) — hooks are the only access layer
- LocalStorage is written only inside the context provider; components never touch it directly

## Folder Structure
```
app/              Next.js pages and layouts
components/
  layout/         Header, WeeklySummary
  meal/           MealCard, MealForm, EmptyMealSlot
  planner/        WeeklyPlanner, DayColumn, MealSlot
  ui/             Button, Modal (generic, reusable)
hooks/            useMealPlan, useWeek, useTheme
lib/              mealPlanContext.js, constants.js
utils/            dateUtils.js, statsUtils.js
data/             defaultMeals.js (seed data)
```

## State Shape (LocalStorage key: `meal-planner-meals`)
```json
{
  "2026-07-22": {
    "breakfast": { "id": "abc123", "name": "Oatmeal", "completed": false },
    "lunch":     null,
    "dinner":    { "id": "def456", "name": "Salmon", "completed": true },
    "snacks":    null
  }
}
```
Date keys are always `YYYY-MM-DD` strings produced by `formatDateKey(date)` in `utils/dateUtils.js`.

## Data Flow
```
MealPlanContext (useReducer)
  └── useMealPlan hook  ←  all components
        addMeal / updateMeal / deleteMeal / toggleMeal
```
Reducer actions: `ADD_MEAL | UPDATE_MEAL | DELETE_MEAL | TOGGLE_MEAL | LOAD`

## Naming Conventions
- React components: `PascalCase.jsx`
- Hooks: `useX.js` in `hooks/`
- Utilities: `camelCase.js` in `utils/`
- Constants: `SCREAMING_SNAKE_CASE`
- Date keys: always `YYYY-MM-DD` via `formatDateKey()`
- Meal types: always lowercase strings `breakfast | lunch | dinner | snacks`

## Dark Mode
Tailwind v4 class-based dark mode. `@custom-variant dark (&:where(.dark, .dark *))` is declared in `globals.css`. The `useTheme` hook toggles the `.dark` class on `document.documentElement` and persists preference to LocalStorage under key `meal-planner-theme`.

## Do Not
- Add TypeScript
- Add authentication, payments, or external APIs (Phase 5+ only)
- Touch LocalStorage outside of `mealPlanContext.js`
- Use `any` patterns that would make the Supabase migration harder
- Add icon libraries — use inline SVG or emoji for MVP

## Migration Path (LocalStorage → Supabase)
The `useMealPlan` hook is the only interface components use. When migrating:
1. Replace the `useEffect` blocks in `mealPlanContext.js` with `fetch` calls
2. No component changes required
3. DB schema is documented in the architecture notes

## Phase Roadmap
| Phase | Feature |
|-------|---------|
| MVP   | Weekly planner, CRUD meals, dark mode, LocalStorage |
| 2     | Calories, macros, water tracker, favorites |
| 3     | Recipe Builder |
| 4     | Auto Grocery List |
| 5     | Store Integration (Costco, HEB, Walmart…) |
| 6     | AI Nutrition planning |
| 7     | Smart meal adjustments |
| 8     | Health Dashboard |
| 9     | Pantry / inventory tracking |
| 10    | AI chat assistant |

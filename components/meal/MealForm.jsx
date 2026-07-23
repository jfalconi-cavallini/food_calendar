'use client'
import { useState, useEffect, useRef } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import IngredientRow from './IngredientRow'
import { computeIngredientCalories } from '../../utils/calorieUtils'
import { PERSON_CONFIG, SHARED_MEAL_TYPES } from '../../lib/constants'

const TABS = ['Details', 'Calories', 'Ingredients']

function newIngredient() {
  return { name: '', quantity: 1, unit: 'item', calories: 0, category: 'Other', notes: '' }
}

function isSharedMealType(mealTypeId) {
  return SHARED_MEAL_TYPES.some(t => t.id === mealTypeId)
}

export default function MealForm({ open, onClose, onSave, initialMeal = null, mealTypeId, dayLabel }) {
  const [tab,         setTab]         = useState('Details')
  const [name,        setName]        = useState('')
  const [notes,       setNotes]       = useState('')
  const [recipe,      setRecipe]      = useState('')
  const [joseCal,     setJoseCal]     = useState(0)
  const [emmaCal,     setEmmaCal]     = useState(0)
  const [joseSrv,     setJoseSrv]     = useState(1)
  const [emmaSrv,     setEmmaSrv]     = useState(1)
  const [ingredients, setIngredients] = useState([])
  const nameRef = useRef(null)

  const shared   = isSharedMealType(mealTypeId)
  const isEditing = Boolean(initialMeal?.name)
  const ingCalTotal = computeIngredientCalories(ingredients)

  useEffect(() => {
    if (!open) return
    setTab('Details')
    setName(initialMeal?.name || '')
    setNotes(initialMeal?.notes || '')
    setRecipe(initialMeal?.recipeInstructions || '')
    setJoseCal(initialMeal?.joseCalories || 0)
    setEmmaCal(initialMeal?.emmaCalories || 0)
    setJoseSrv(initialMeal?.joseServings || 1)
    setEmmaSrv(initialMeal?.emmaServings || 1)
    setIngredients(
      initialMeal?.ingredients?.length
        ? initialMeal.ingredients.map(i => ({ ...i }))
        : []
    )
    setTimeout(() => nameRef.current?.focus(), 80)
  }, [open, initialMeal])

  const addIngredient    = () => setIngredients(prev => [...prev, newIngredient()])
  const removeIngredient = (idx) => setIngredients(prev => prev.filter((_, i) => i !== idx))
  const updateIngredient = (idx, updated) =>
    setIngredients(prev => prev.map((ing, i) => i === idx ? updated : ing))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      notes,
      recipeInstructions: recipe,
      joseCalories:    Number(joseCal) || 0,
      emmaCalories:    Number(emmaCal) || 0,
      joseServings:    Number(joseSrv) || 1,
      emmaServings:    Number(emmaSrv) || 1,
      totalCalories:   ingCalTotal || Number(joseCal) || 0,
      manuallyOverriddenCalories: ingCalTotal > 0 && (Number(joseCal) !== ingCalTotal),
      ingredients:     ingredients.filter(i => i.name.trim()),
    })
    onClose()
  }

  // For personal snack slots, show only the relevant person's calories
  const snackPerson = !shared
    ? (mealTypeId?.includes('jose') ? PERSON_CONFIG.jose : PERSON_CONFIG.emma)
    : null

  return (
    <Modal open={open} onClose={onClose} size="lg"
      title={`${isEditing ? 'Edit' : 'Add'} ${
        mealTypeId?.replace('snacks_jose','Snacks').replace('snacks_emma','Snacks') || ''
      } · ${dayLabel}`}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 -mx-6 px-6">
        {TABS.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t}
            {t === 'Ingredients' && ingredients.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px]">
                {ingredients.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* ── Details tab ─────────────────────────────────────────── */}
        {tab === 'Details' && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Meal name <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Grilled Salmon & Rice"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any notes, substitutions, or reminders..."
                rows={2}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Recipe instructions <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={recipe}
                onChange={e => setRecipe(e.target.value)}
                placeholder="Step-by-step instructions..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* ── Calories tab ─────────────────────────────────────────── */}
        {tab === 'Calories' && (
          <div className="flex flex-col gap-4">
            {ingCalTotal > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
                <span>🧮</span>
                <span>Ingredient total: <strong className="text-gray-900 dark:text-white">{ingCalTotal.toLocaleString()} cal</strong></span>
              </div>
            )}

            {shared ? (
              /* Shared meal: show both Jose and Emma */
              <div className="grid grid-cols-2 gap-3">
                {[
                  { cfg: PERSON_CONFIG.jose, cal: joseCal, setCal: setJoseCal, srv: joseSrv, setSrv: setJoseSrv },
                  { cfg: PERSON_CONFIG.emma, cal: emmaCal, setCal: setEmmaCal, srv: emmaSrv, setSrv: setEmmaSrv },
                ].map(({ cfg, cal, setCal, srv, setSrv }) => (
                  <div key={cfg.id} className={`flex flex-col gap-2 p-3 rounded-xl border ${cfg.calBorder} ${cfg.calBg}`}>
                    <span className={`text-xs font-bold ${cfg.calText}`}>{cfg.emoji} {cfg.name}</span>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5">Servings</label>
                      <input
                        type="number" min="0.25" step="0.25"
                        value={srv}
                        onChange={e => setSrv(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5">Calories</label>
                      <input
                        type="number" min="0"
                        value={cal}
                        onChange={e => setCal(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Personal snack: show only this person */
              <div className={`flex flex-col gap-2 p-3 rounded-xl border ${snackPerson.calBorder} ${snackPerson.calBg}`}>
                <span className={`text-xs font-bold ${snackPerson.calText}`}>{snackPerson.emoji} {snackPerson.name}'s Snack</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Servings</label>
                    <input
                      type="number" min="0.25" step="0.25"
                      value={snackPerson.id === 'jose' ? joseSrv : emmaSrv}
                      onChange={e => snackPerson.id === 'jose' ? setJoseSrv(e.target.value) : setEmmaSrv(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Calories</label>
                    <input
                      type="number" min="0"
                      value={snackPerson.id === 'jose' ? joseCal : emmaCal}
                      onChange={e => snackPerson.id === 'jose' ? setJoseCal(e.target.value) : setEmmaCal(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center">
              Calorie estimates are for meal planning purposes only.
            </p>
          </div>
        )}

        {/* ── Ingredients tab ──────────────────────────────────────── */}
        {tab === 'Ingredients' && (
          <div className="flex flex-col gap-3">
            {ingredients.length > 0 && (
              <div className="grid text-[10px] font-medium text-gray-400 uppercase tracking-wide px-0.5"
                   style={{ gridTemplateColumns: '1fr 60px 90px 70px 100px 28px' }}>
                <span>Name</span><span>Qty</span><span>Unit</span><span>Cal</span><span>Category</span><span />
              </div>
            )}
            <div className="flex flex-col gap-2">
              {ingredients.map((ing, idx) => (
                <IngredientRow
                  key={idx}
                  ingredient={ing}
                  onChange={(updated) => updateIngredient(idx, updated)}
                  onRemove={() => removeIngredient(idx)}
                />
              ))}
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={addIngredient} className="self-start">
              + Add ingredient
            </Button>
            {ingCalTotal > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total ingredient calories: <strong>{ingCalTotal.toLocaleString()}</strong>
              </div>
            )}
          </div>
        )}

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div className="flex gap-2 justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={!name.trim()}>
            {isEditing ? 'Save changes' : 'Add meal'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

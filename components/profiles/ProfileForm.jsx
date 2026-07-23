'use client'
import { useState, useEffect } from 'react'
import Button from '../ui/Button'
import {
  ACTIVITY_LEVELS, FITNESS_GOALS, WEEKLY_WEIGHT_OPTIONS, EXERCISE_ADJUSTMENT_MODES, PERSON_CONFIG
} from '../../lib/constants'
import {
  computeBMR, computeTDEE, computeDailyTarget,
  cmToFeetInches, feetInchesToCm, kgToLbs, lbsToKg
} from '../../utils/calorieUtils'

function Field({ label, children, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      {children}
      {hint && <span className="text-[10px] text-gray-400 dark:text-gray-600">{hint}</span>}
    </div>
  )
}

function Input(props) {
  return (
    <input
      {...props}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  )
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {children}
    </select>
  )
}

export default function ProfileForm({ personId, initialProfile, onSave, saving }) {
  const cfg = PERSON_CONFIG[personId]

  const [form, setForm] = useState({
    age: '', sex: '', heightFt: '', heightIn: '', weightLbs: '',
    goalWeightLbs: '', activityLevel: 'moderate', fitnessGoal: 'maintain',
    weeklyWeightChange: '0', exerciseAdjustmentMode: 'none', manualCalorieTarget: '',
  })

  useEffect(() => {
    if (!initialProfile) return
    const { feet, inches } = cmToFeetInches(initialProfile.heightCm)
    setForm({
      age:                    initialProfile.age || '',
      sex:                    initialProfile.sex || '',
      heightFt:               feet || '',
      heightIn:               inches || '',
      weightLbs:              kgToLbs(initialProfile.weightKg) || '',
      goalWeightLbs:          kgToLbs(initialProfile.goalWeightKg) || '',
      activityLevel:          initialProfile.activityLevel || 'moderate',
      fitnessGoal:            initialProfile.fitnessGoal || 'maintain',
      weeklyWeightChange:     String(initialProfile.weeklyWeightChange ?? 0),
      exerciseAdjustmentMode: initialProfile.exerciseAdjustmentMode || 'none',
      manualCalorieTarget:    initialProfile.manualCalorieTarget || '',
    })
  }, [initialProfile])

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const derivedProfile = {
    age:         Number(form.age) || null,
    sex:         form.sex || null,
    heightCm:    feetInchesToCm(form.heightFt, form.heightIn) || null,
    weightKg:    lbsToKg(form.weightLbs),
    activityLevel:       form.activityLevel,
    weeklyWeightChange:  Number(form.weeklyWeightChange),
    manualCalorieTarget: form.manualCalorieTarget ? Number(form.manualCalorieTarget) : null,
    exerciseAdjustmentMode: form.exerciseAdjustmentMode,
  }
  const bmr    = computeBMR(derivedProfile)
  const tdee   = computeTDEE(derivedProfile)
  const target = computeDailyTarget(derivedProfile)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id:                      personId,
      name:                    cfg.name,
      age:                     form.age ? Number(form.age) : null,
      sex:                     form.sex || null,
      heightCm:                feetInchesToCm(form.heightFt, form.heightIn) || null,
      weightKg:                lbsToKg(form.weightLbs),
      goalWeightKg:            lbsToKg(form.goalWeightLbs),
      activityLevel:           form.activityLevel,
      fitnessGoal:             form.fitnessGoal,
      weeklyWeightChange:      Number(form.weeklyWeightChange),
      exerciseAdjustmentMode:  form.exerciseAdjustmentMode,
      manualCalorieTarget:     form.manualCalorieTarget ? Number(form.manualCalorieTarget) : null,
      estimatedCalorieTarget:  target,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Person header */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${cfg.calBorder} ${cfg.calBg}`}>
        <span className="text-2xl">{cfg.emoji}</span>
        <div>
          <p className={`font-bold text-sm ${cfg.calText}`}>{cfg.name}</p>
          {(bmr || tdee || target) && (
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              {bmr    && `BMR ${bmr.toLocaleString()}`}
              {tdee   && ` · TDEE ${tdee.toLocaleString()}`}
              {target && ` · Target ${target.toLocaleString()} cal/day`}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Age">
          <Input type="number" min="10" max="120" placeholder="e.g. 28" value={form.age} onChange={set('age')} />
        </Field>
        <Field label="Sex (for BMR)">
          <Select value={form.sex} onChange={set('sex')}>
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Height">
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <Input
                type="number" min="0" max="9" placeholder="ft"
                value={form.heightFt} onChange={set('heightFt')}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="relative flex-1">
              <Input
                type="number" min="0" max="11" placeholder="in"
                value={form.heightIn} onChange={set('heightIn')}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </Field>
        <Field label="Weight (lbs)">
          <Input type="number" min="0" step="0.1" placeholder="e.g. 160" value={form.weightLbs} onChange={set('weightLbs')} />
        </Field>
      </div>

      <Field label="Goal weight (lbs)" hint="Optional — for tracking progress">
        <Input type="number" min="0" step="0.1" placeholder="e.g. 150" value={form.goalWeightLbs} onChange={set('goalWeightLbs')} />
      </Field>

      <Field label="Activity level">
        <Select value={form.activityLevel} onChange={set('activityLevel')}>
          {ACTIVITY_LEVELS.map(l => (
            <option key={l.id} value={l.id}>{l.label} — {l.desc}</option>
          ))}
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Fitness goal">
          <Select value={form.fitnessGoal} onChange={set('fitnessGoal')}>
            {FITNESS_GOALS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
          </Select>
        </Field>
        <Field label="Weekly pace">
          <Select value={form.weeklyWeightChange} onChange={set('weeklyWeightChange')}>
            {WEEKLY_WEIGHT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Exercise calories" hint="How to handle calories burned from exercise">
        <Select value={form.exerciseAdjustmentMode} onChange={set('exerciseAdjustmentMode')}>
          {EXERCISE_ADJUSTMENT_MODES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
        </Select>
      </Field>

      <Field label="Manual calorie override" hint="Leave blank to use the calculated target above">
        <Input
          type="number" min="0" step="50" placeholder="e.g. 1800"
          value={form.manualCalorieTarget} onChange={set('manualCalorieTarget')}
        />
      </Field>

      <Button type="submit" disabled={saving} className="self-end">
        {saving ? 'Saving…' : 'Save profile'}
      </Button>
    </form>
  )
}

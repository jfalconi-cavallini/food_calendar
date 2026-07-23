'use client'
import { useState, useEffect, useRef } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function MealForm({ open, onClose, onSave, initialName = '', mealType, dayLabel }) {
  const [name, setName] = useState(initialName)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setName(initialName)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, initialName])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed)
    onClose()
  }

  const isEditing = Boolean(initialName)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${isEditing ? 'Edit' : 'Add'} ${mealType} · ${dayLabel}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            Meal name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Grilled Salmon & Rice"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!name.trim()}>
            {isEditing ? 'Save changes' : 'Add meal'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

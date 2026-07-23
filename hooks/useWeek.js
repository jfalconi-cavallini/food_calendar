'use client'
import { useState } from 'react'
import { getWeekDates } from '../utils/dateUtils'

export function useWeek() {
  const [offset, setOffset] = useState(0)
  const weekDates = getWeekDates(offset)

  return {
    weekDates,
    offset,
    prevWeek:  () => setOffset(o => o - 1),
    nextWeek:  () => setOffset(o => o + 1),
    goToToday: () => setOffset(0),
  }
}

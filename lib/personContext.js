'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { PERSON_KEY, PERSON_CONFIG } from './constants'

const PersonContext = createContext(null)

export function PersonProvider({ children }) {
  const [activePerson, setActivePerson] = useState('jose')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PERSON_KEY)
      if (stored && PERSON_CONFIG[stored]) setActivePerson(stored)
    } catch {}
  }, [])

  const toggle = () => {
    setActivePerson(prev => {
      const next = prev === 'jose' ? 'emma' : 'jose'
      try { localStorage.setItem(PERSON_KEY, next) } catch {}
      return next
    })
  }

  const cfg = PERSON_CONFIG[activePerson]

  return (
    <PersonContext.Provider value={{ activePerson, toggle, cfg }}>
      {children}
    </PersonContext.Provider>
  )
}

export function usePerson() {
  const ctx = useContext(PersonContext)
  if (!ctx) throw new Error('usePerson must be inside PersonProvider')
  return ctx
}

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

export interface AccentColor {
  name: string
  hsl: string
  lightHsl: string
  hex: string
}

export const ACCENT_COLORS: AccentColor[] = [
  { name: 'Mauve', hsl: '267 84% 81%', lightHsl: '266 85% 58%', hex: '#cba6f7' },
  { name: 'Blue', hsl: '217 92% 76%', lightHsl: '220 91% 54%', hex: '#89b4fa' },
  { name: 'Teal', hsl: '170 57% 73%', lightHsl: '183 74% 35%', hex: '#94e2d5' },
  { name: 'Green', hsl: '115 54% 76%', lightHsl: '109 58% 40%', hex: '#a6e3a1' },
  { name: 'Peach', hsl: '23 92% 75%', lightHsl: '22 99% 52%', hex: '#fab387' },
]

const STORAGE_KEY = 'illustration-accent'
const DEFAULT = ACCENT_COLORS[0]

interface AccentContextValue {
  accent: AccentColor
  setAccent: (a: AccentColor) => void
}

const AccentContext = createContext<AccentContextValue>({
  accent: DEFAULT,
  setAccent: () => {},
})

function applyAccent(accent: AccentColor) {
  document.documentElement.style.setProperty('--accent-dark', accent.hsl)
  document.documentElement.style.setProperty('--accent-light', accent.lightHsl)
}

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentColor>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return ACCENT_COLORS.find((c) => c.name === stored) ?? DEFAULT
  })

  useEffect(() => {
    applyAccent(accent)
  }, [accent])

  function setAccent(a: AccentColor) {
    setAccentState(a)
    localStorage.setItem(STORAGE_KEY, a.name)
  }

  return <AccentContext.Provider value={{ accent, setAccent }}>{children}</AccentContext.Provider>
}

export function useAccent() {
  return useContext(AccentContext)
}

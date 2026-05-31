import { useRef, useState, useEffect } from 'react'
import { Palette, Sun, Moon } from 'lucide-react'
import { useAccent, ACCENT_COLORS } from '@/context/AccentContext'
import { useTheme } from '@/context/ThemeContext'
import { strings as t } from '@/locales/en'

export default function AccentPicker() {
  const { accent, setAccent } = useAccent()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative inline-flex items-center ml-2">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.header.themeColor(accent.name)}
        title={t.header.themeColor(accent.name)}
        className="relative h-8 w-8 flex items-center justify-center rounded-md hover:bg-ctp-surface0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ctp-mantle text-ctp-subtext1 hover:text-ctp-text"
      >
        <Palette size={16} />
        <span
          className="absolute bottom-1 right-1 w-2 h-2 rounded-full ring-1 ring-ctp-mantle"
          style={{ backgroundColor: accent.hex }}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-56 rounded-xl border border-ctp-surface1 bg-ctp-mantle shadow-lg overflow-hidden">
          <div className="px-3.5 py-3 border-b border-ctp-surface0">
            <p className="text-xs font-medium text-ctp-text mb-0.5">{t.header.themeColorLabel}</p>
            <p className="text-xs text-ctp-overlay1 leading-relaxed">{t.header.themeColorDesc}</p>
          </div>
          <div className="flex gap-2.5 p-3.5">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => {
                  setAccent(color)
                  setOpen(false)
                }}
                aria-label={color.name}
                title={color.name}
                className="w-5 h-5 rounded-full transition-transform hover:scale-110 focus-visible:outline-none"
                style={{
                  backgroundColor: color.hex,
                  outline: accent.name === color.name ? `2px solid ${color.hex}` : undefined,
                  outlineOffset: '3px',
                }}
              />
            ))}
          </div>
          <div className="px-3.5 pb-3.5 pt-0.5 border-t border-ctp-surface0">
            <div className="inline-flex w-full divide-x divide-ctp-surface1 rounded-lg border border-ctp-surface1 overflow-hidden mt-3">
              <button
                onClick={() => {
                  if (theme !== 'light') toggleTheme()
                }}
                aria-label={t.header.switchToLight}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs transition-colors ${
                  theme === 'light'
                    ? 'bg-ctp-surface1 text-ctp-text'
                    : 'bg-ctp-surface0 text-ctp-subtext0 hover:bg-ctp-surface1/60 hover:text-ctp-text'
                }`}
              >
                <Sun size={12} /> {t.header.lightTheme}
              </button>
              <button
                onClick={() => {
                  if (theme !== 'dark') toggleTheme()
                }}
                aria-label={t.header.switchToDark}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs transition-colors ${
                  theme === 'dark'
                    ? 'bg-ctp-surface1 text-ctp-text'
                    : 'bg-ctp-surface0 text-ctp-subtext0 hover:bg-ctp-surface1/60 hover:text-ctp-text'
                }`}
              >
                <Moon size={12} /> {t.header.darkTheme}
              </button>
            </div>
            <p className="mt-2 text-xs text-ctp-overlay0 text-center">{t.header.darkRecommended}</p>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CircleHelp, Menu, X } from 'lucide-react'
import AccentPicker from './AccentPicker'
import { useHelp } from '@/context/HelpContext'
import { strings as t } from '@/locales/en'

export default function Header() {
  const { helpOpen, toggleHelp } = useHelp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const NAV_LINKS = [
    { to: '/', label: t.nav.gallery },
    { to: '/about', label: t.nav.about },
    { to: '/faq', label: t.nav.faq },
    { to: '/contribute', label: t.nav.contribute },
  ]

  return (
    <header className="sticky top-0 z-[65] border-b border-ctp-surface0 bg-ctp-mantle/90 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-baseline gap-2">
          <Link
            to="/"
            className="text-lg font-semibold text-accent hover:opacity-80 transition-opacity"
          >
            Claybase
          </Link>
          {window.location.hostname === 'localhost' && (
            <span className="hidden sm:block text-xs font-semibold px-1.5 py-0.5 rounded bg-ctp-yellow/20 text-ctp-yellow border border-ctp-yellow/30">
              local
            </span>
          )}
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-ctp-surface0 text-ctp-text'
                    : 'text-ctp-subtext1 hover:bg-ctp-surface0 hover:text-ctp-text'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={toggleHelp}
            aria-label={t.header.help}
            className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors ${
              helpOpen
                ? 'bg-ctp-surface0 text-accent'
                : 'text-ctp-subtext1 hover:bg-ctp-surface0 hover:text-ctp-text'
            }`}
          >
            <CircleHelp size={16} />
          </button>
          <a
            href="https://github.com/feustpat/claybase"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="ml-2 h-8 w-8 flex items-center justify-center rounded-md text-ctp-subtext0 hover:bg-ctp-surface0 hover:text-ctp-text transition-colors"
          >
            <GitHubIcon />
          </a>
          <AccentPicker />
        </nav>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-1">
          <AccentPicker />
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label={mobileMenuOpen ? t.header.closeMenu : t.header.openMenu}
            className="h-8 w-8 flex items-center justify-center rounded-md text-ctp-subtext1 hover:bg-ctp-surface0 hover:text-ctp-text transition-colors"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ctp-surface0 bg-ctp-mantle px-4 py-3 flex flex-col gap-0.5">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-ctp-surface0 text-ctp-text'
                    : 'text-ctp-subtext1 hover:bg-ctp-surface0 hover:text-ctp-text'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="flex items-center gap-1 pt-2 mt-1 border-t border-ctp-surface0">
            <button
              onClick={() => {
                toggleHelp()
                setMobileMenuOpen(false)
              }}
              aria-label={t.header.help}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                helpOpen
                  ? 'bg-ctp-surface0 text-accent'
                  : 'text-ctp-subtext1 hover:bg-ctp-surface0 hover:text-ctp-text'
              }`}
            >
              <CircleHelp size={15} />
              {t.header.help}
            </button>
            <a
              href="https://github.com/feustpat/claybase"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-ctp-subtext1 hover:bg-ctp-surface0 hover:text-ctp-text transition-colors"
            >
              <GitHubIcon />
              GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

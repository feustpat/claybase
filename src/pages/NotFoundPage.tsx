import { Link } from 'react-router-dom'
import { strings as t } from '@/locales/en'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-5xl font-bold text-ctp-surface2 mb-6">404</p>
      <h1 className="text-2xl font-semibold text-ctp-text mb-3">{t.pages.notFoundTitle}</h1>
      <p className="text-ctp-subtext1 mb-8">{t.pages.notFoundDesc}</p>
      <Link to="/" className="text-accent underline underline-offset-2 hover:opacity-80">
        {t.pages.notFoundBack}
      </Link>
    </div>
  )
}

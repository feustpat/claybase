import { Link } from 'react-router-dom'
import { strings as t } from '@/locales/en'
import { useHelp } from '@/context/HelpContext'
import { SITE_TITLE } from '@/utils/siteTitle'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function AboutPage() {
  const { toggleHelp } = useHelp()

  usePageMeta({
    title: `${SITE_TITLE} | ${t.pages.aboutTitle}`,
    description:
      'Learn about Claybase — a growing library of AI-generated 3D clay render illustrations for note-taking apps, dashboards, and more.',
  })
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-accent mb-3">{t.pages.aboutTitle}</h1>
      <p className="text-lg text-ctp-subtext0 italic mb-8">
        A curated library of AI-generated 3D clay render illustrations.
      </p>
      <div className="prose prose-invert max-w-none text-ctp-subtext1">
        <p className="mb-4">
          {t.pages.aboutDesc}{' '}
          <a
            href="https://catppuccin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:opacity-80"
          >
            Catppuccin Mocha ↗
          </a>{' '}
          {t.pages.aboutDescPost}
        </p>
        <p>
          {t.pages.aboutDesc2}{' '}
          <a
            href="https://obsidian.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:opacity-80"
          >
            Obsidian ↗
          </a>
          {t.pages.aboutDesc2Post}
        </p>
        <h2 className="text-xl font-semibold text-ctp-text mt-10 mb-3">
          {t.pages.aboutHowToTitle}
        </h2>
        <p className="mb-4">{t.pages.aboutHowToText}</p>
        <p>
          {t.pages.aboutHowToSeeAlsoPrefix}{' '}
          <button
            onClick={toggleHelp}
            className="text-accent underline underline-offset-2 hover:opacity-80"
          >
            {t.pages.aboutHowToHelpLabel}
          </button>{' '}
          {t.pages.aboutHowToSeeAlsoOr}{' '}
          <Link to="/faq" className="text-accent underline underline-offset-2 hover:opacity-80">
            {t.pages.aboutHowToFaqLabel}
          </Link>
          {t.pages.aboutHowToSeeAlsoSuffix}
        </p>
        <h2 className="text-xl font-semibold text-ctp-text mt-10 mb-3">
          {t.pages.aboutQualityTitle}
        </h2>
        <p>{t.pages.aboutBgText2}</p>
        <h2 className="text-xl font-semibold text-ctp-text mt-10 mb-3">{t.pages.aboutBiasTitle}</h2>
        <p>{t.pages.aboutBiasText}</p>
        <p className="text-xs text-ctp-overlay1 mt-12">{t.pages.aboutFooter}</p>
        <p className="text-xs text-ctp-overlay0 font-mono mt-1">
          {__GIT_COMMIT__} &middot; built {new Date(__BUILD_DATE__).toLocaleString('sv-SE')}
        </p>
      </div>
    </div>
  )
}

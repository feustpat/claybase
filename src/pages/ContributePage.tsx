import { strings as t } from '@/locales/en'
import { SITE_TITLE } from '@/utils/siteTitle'
import { usePageMeta } from '@/hooks/usePageMeta'

const ISSUES_URL = 'https://github.com/feustpat/claybase/issues/new/choose'

// Rendered with " at " / " dot " rather than a mailto link to keep the address
// out of reach of naive email scrapers. GitHub issues are the primary channel.
const emailUser = 'hello.claybase'
const emailDomain = 'gmail.com'

export default function ContributePage() {
  usePageMeta({
    title: `${SITE_TITLE} | ${t.pages.contributeTitle}`,
    description:
      'Suggest a new illustration or send feedback for Claybase, the 3D clay render illustration library.',
  })
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-accent mb-6">{t.pages.contributeTitle}</h1>
      <div className="prose prose-invert max-w-none text-ctp-subtext1">
        <p className="mb-4">
          {t.pages.contributeIntro}{' '}
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            {t.pages.contributeIssueLink}
          </a>
          {t.pages.contributeIntroPost}
        </p>
        <p className="text-sm text-ctp-subtext0">
          {t.pages.contributeFallback}{' '}
          <span className="text-ctp-subtext1">
            {emailUser} at {emailDomain.replace('.', ' dot ')}
          </span>
        </p>
      </div>
    </div>
  )
}

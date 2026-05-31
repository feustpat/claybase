import { useState } from 'react'
import { SITE_TITLE } from '@/utils/siteTitle'
import { usePageMeta } from '@/hooks/usePageMeta'
import { ChevronDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import faqContentEn from '@/content/faq.md?raw'
import { strings as t } from '@/locales/en'

const answerComponents: Components = {
  p: ({ children }) => <p className="text-ctp-subtext1 leading-relaxed">{children}</p>,
  ul: ({ children }) => (
    <ul className="flex flex-col gap-1 pl-5 list-disc text-ctp-subtext1">{children}</ul>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-medium text-ctp-text">{children}</strong>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-2 hover:opacity-80"
    >
      {children}
    </a>
  ),
}

function parseEntries(content: string) {
  return content
    .trim()
    .split(/\n?## /)
    .filter(Boolean)
    .map((block) => {
      const newline = block.indexOf('\n')
      return {
        question: block.slice(0, newline).trim(),
        answer: block.slice(newline + 1).trim(),
      }
    })
}

export default function FaqPage() {
  const entries = parseEntries(faqContentEn)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  usePageMeta({
    title: `${SITE_TITLE} | ${t.pages.faqTitle}`,
    description:
      'Frequently asked questions about Claybase — how to use the illustration library, download images, and more.',
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-accent mb-8">{t.pages.faqTitle}</h1>
      <div className="flex flex-col divide-y divide-ctp-surface0">
        {entries.map(({ question, answer }, i) => {
          const isOpen = openIndex === i
          return (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold text-ctp-text hover:text-accent transition-colors"
              >
                {question}
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-ctp-overlay1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className="grid transition-all duration-200 ease-in-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="pb-4 flex flex-col gap-2">
                    <ReactMarkdown components={answerComponents}>{answer}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import helpContentEn from '@/content/gallery-help.md?raw'
import { strings as t } from '@/locales/en'

interface Props {
  onClose: () => void
}

const md: Components = {
  h2: ({ children }) => (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-ctp-overlay1 mt-6 mb-2 first:mt-0">
      {children}
    </h2>
  ),
  p: ({ children }) => <p className="text-sm text-ctp-subtext1 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="flex flex-col gap-1 pl-4">{children}</ul>,
  li: ({ children }) => (
    <li className="text-sm text-ctp-subtext1 leading-relaxed list-disc">{children}</li>
  ),
  strong: ({ children }) => <strong className="font-medium text-ctp-text">{children}</strong>,
  code: ({ children }) => (
    <code className="text-xs font-mono bg-ctp-surface0 text-ctp-text px-1.5 py-0.5 rounded">
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-ctp-surface0 last:border-0">{children}</tr>,
  th: ({ children }) => (
    <th className="text-left text-xs font-medium uppercase tracking-wide text-ctp-overlay1 py-2 pr-4 first:pl-0">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="py-1.5 pr-4 first:pl-0 text-ctp-subtext1">{children}</td>,
}

export default function HelpPanel({ onClose }: Props) {
  const helpContent = helpContentEn

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label={t.help.title}
      className="fixed right-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-full max-w-md bg-ctp-mantle border-l border-ctp-surface0 shadow-2xl overflow-y-auto flex flex-col"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-ctp-surface0">
        <h2 className="text-sm font-semibold text-ctp-text">{t.help.title}</h2>
        <button
          onClick={onClose}
          aria-label={t.help.close}
          className="text-ctp-subtext0 hover:text-ctp-text transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-5 py-5">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
          {helpContent}
        </ReactMarkdown>
      </div>
    </aside>
  )
}

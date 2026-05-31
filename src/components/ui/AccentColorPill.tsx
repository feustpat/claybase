import { ctpColorHex, ctpColorName } from '@/utils/ctpColors'

interface Props {
  label: string
  active?: boolean
  onClick?: () => void
  count?: number
}

export default function AccentColorPill({ label, active = false, onClick, count }: Props) {
  const color = ctpColorHex(label)
  const name = ctpColorName(label)

  const base =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors'
  const style = onClick
    ? active
      ? `${base} border border-accent text-accent cursor-pointer`
      : `${base} border border-ctp-surface1 text-ctp-subtext1 hover:border-ctp-surface2 hover:text-ctp-text cursor-pointer`
    : `${base} border border-ctp-surface1 text-ctp-subtext1`

  const dot = color && (
    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
  )

  const content = (
    <>
      {dot}
      {name}
      {count !== undefined && (
        <span className="text-[10px] font-semibold text-ctp-overlay2">{count}</span>
      )}
    </>
  )

  if (onClick)
    return (
      <button onClick={onClick} className={style}>
        {content}
      </button>
    )
  return <span className={style}>{content}</span>
}

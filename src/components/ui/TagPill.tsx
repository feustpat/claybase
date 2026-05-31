interface Props {
  label: string
  active?: boolean
  onClick?: () => void
  count?: number
}

export default function TagPill({ label, active = false, onClick, count }: Props) {
  const base =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors'

  const style = onClick
    ? active
      ? `${base} border border-accent text-accent cursor-pointer`
      : `${base} border border-ctp-surface1 text-ctp-subtext1 hover:border-ctp-surface2 hover:text-ctp-text cursor-pointer`
    : `${base} bg-ctp-surface1 text-ctp-subtext1`

  const content = (
    <>
      {label}
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

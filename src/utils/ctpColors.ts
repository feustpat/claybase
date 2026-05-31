export const CTP_COLORS: Record<string, string> = {
  'catppuccin-blue': '#89b4fa',
  'catppuccin-green': '#a6e3a1',
  'catppuccin-lavender': '#b4befe',
  'catppuccin-mauve': '#cba6f7',
  'catppuccin-peach': '#fab387',
  'catppuccin-pink': '#f5c2e7',
  'catppuccin-red': '#f38ba8',
  'catppuccin-sky': '#89dceb',
  'catppuccin-teal': '#94e2d5',
  'catppuccin-yellow': '#f9e2af',
}

export function ctpColorHex(label: string): string | undefined {
  return CTP_COLORS[label.toLowerCase()]
}

export function ctpColorName(label: string): string {
  return label.replace(/^Catppuccin-/i, '')
}

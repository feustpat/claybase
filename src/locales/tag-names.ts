export const tagNames: Record<string, string> = {
  animal: 'Animals',
  arts: 'Arts & Culture',
  building: 'Buildings',
  clothing: 'Clothing',
  'food-drink': 'Food & Drink',
  'grocery-category': 'Food Types',
  home: 'Home & Living',
  interests: 'Interests',
  'inventory-category': 'Objects',
  knowledge: 'Knowledge',
  mindset: 'Mindset',
  nature: 'Nature',
  social: 'Social',
  sport: 'Sports & Fitness',
  tech: 'Technology',
  'tool-category': 'Tools',
  transport: 'Transport',
  travel: 'Travel',
  wellness: 'Wellness',
}

// Tag IDs listed here are hidden from the sidebar and detail panel.
// They remain functional for URL-based filtering and internal search indexing.
export const hiddenTags = new Set<string>([])

export function getTagLabel(tagId: string): string {
  return tagNames[tagId] ?? tagId
}

export function isTagHidden(tagId: string): boolean {
  return hiddenTags.has(tagId)
}

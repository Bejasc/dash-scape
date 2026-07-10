export function formatGp(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (abs >= 10_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (abs >= 10_000) return `${Math.round(n / 1000)}K`
  return n.toLocaleString()
}

export function formatNum(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return Math.round(n).toLocaleString()
}

export function formatHours(h: number): string {
  if (!Number.isFinite(h)) return '—'
  if (h < 1) return `${Math.round(h * 60)} min`
  return `${h.toFixed(h < 10 ? 1 : 0)} hrs`
}

/** Wiki page URL for an exact page name, e.g. "Mahogany plank". */
export function wikiUrl(page: string): string {
  return `https://oldschool.runescape.wiki/w/${encodeURIComponent(page.replace(/ /g, '_'))}`
}

/** Wiki image URL for an item/icon, e.g. "Slayer helmet (i)" →
 *  https://oldschool.runescape.wiki/images/Slayer_helmet_%28i%29.png */
export function wikiImageUrl(name: string): string {
  const file = name.replace(/ /g, '_')
  return `https://oldschool.runescape.wiki/images/${encodeURIComponent(file).replace(/'/g, '%27')}.png`
}

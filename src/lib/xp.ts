// OSRS experience table, computed from the official formula rather than a
// hardcoded table so it cannot contain transcription errors.
// xp(level) = floor( sum_{l=1}^{level-1} floor(l + 300 * 2^(l/7)) / 4 )
// Source: https://oldschool.runescape.wiki/w/Experience#Formula
const XP_TABLE: number[] = (() => {
  const table = [0, 0] // index by level; levels 0 and 1 are 0 xp
  let points = 0
  for (let level = 1; level < 99; level++) {
    points += Math.floor(level + 300 * Math.pow(2, level / 7))
    table.push(Math.floor(points / 4))
  }
  return table
})()

export const MAX_LEVEL = 99
export const XP_99 = XP_TABLE[99] // 13,034,431

export function xpForLevel(level: number): number {
  if (level <= 1) return 0
  return XP_TABLE[Math.min(level, 99)]
}

export function levelForXp(xp: number): number {
  let level = 1
  while (level < 99 && xp >= XP_TABLE[level + 1]) level++
  return level
}

export function progressWithinLevel(xp: number): { level: number; into: number; needed: number; pct: number } {
  const level = levelForXp(xp)
  if (level >= 99) return { level: 99, into: 0, needed: 0, pct: 100 }
  const into = xp - xpForLevel(level)
  const needed = xpForLevel(level + 1) - xpForLevel(level)
  return { level, into, needed, pct: (into / needed) * 100 }
}

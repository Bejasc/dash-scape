// Wise Old Man v2 API — live skill tracking.
// https://docs.wiseoldman.net/
import { WOM_BASE } from './config'

export type SkillName =
  | 'overall' | 'attack' | 'defence' | 'strength' | 'hitpoints' | 'ranged'
  | 'prayer' | 'magic' | 'cooking' | 'woodcutting' | 'fletching' | 'fishing'
  | 'firemaking' | 'crafting' | 'smithing' | 'mining' | 'herblore' | 'agility'
  | 'thieving' | 'slayer' | 'farming' | 'runecrafting' | 'hunter' | 'construction'

export interface WomSkillSnapshot {
  metric: SkillName
  experience: number
  level: number
  rank: number
}

export interface WomPlayer {
  username: string
  displayName: string
  combatLevel: number
  updatedAt: string
  latestSnapshot: {
    createdAt: string
    data: { skills: Record<SkillName, WomSkillSnapshot> }
  } | null
}

export async function fetchPlayer(rsn: string): Promise<WomPlayer> {
  const res = await fetch(`${WOM_BASE}/players/${encodeURIComponent(rsn)}`)
  if (!res.ok) throw new Error(`Wise Old Man fetch failed for "${rsn}": ${res.status}`)
  return (await res.json()) as WomPlayer
}

/** Ask WOM to refresh the player from the hiscores, then return the update. */
export async function refreshPlayer(rsn: string): Promise<WomPlayer> {
  const res = await fetch(`${WOM_BASE}/players/${encodeURIComponent(rsn)}`, { method: 'POST' })
  if (!res.ok) throw new Error(`Wise Old Man refresh failed for "${rsn}": ${res.status}`)
  return (await res.json()) as WomPlayer
}

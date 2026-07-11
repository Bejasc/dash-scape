// Live GE price service backed by the OSRS Wiki real-time prices API.
// https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices
//
//  - /mapping  → item id ↔ name (+ GE limits, icons). Fetched once per session,
//                persisted to localStorage (it changes rarely).
//  - /latest   → high/low instant prices for every item. Cached with a TTL and
//                persisted so the app can render stale prices offline with a
//                "last fetched" timestamp.
import { PRICES_BASE } from './config'

export interface MappedItem {
  id: number
  name: string
  examine?: string
  members?: boolean
  limit?: number
  icon?: string
}

export interface LatestPrice {
  high: number | null
  highTime: number | null
  low: number | null
  lowTime: number | null
}

export interface PriceSnapshot {
  /** id → latest price */
  prices: Record<string, LatestPrice>
  /** epoch ms when this snapshot was fetched */
  fetchedAt: number
  /** true when served from cache because a live fetch failed */
  stale: boolean
}

const TTL_MS = 10 * 60 * 1000 // 10 minutes — prices API updates roughly every minute; 5–15 min is plenty for cost tables
const LS_LATEST = 'dashscape.prices.latest.v1'
const LS_MAPPING = 'dashscape.prices.mapping.v1'

let mappingPromise: Promise<Map<string, MappedItem>> | null = null
let latestPromise: Promise<PriceSnapshot> | null = null
let lastSnapshot: PriceSnapshot | null = null

function normalizeName(name: string): string {
  return name.trim().toLowerCase()
}

function readLs<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeLs(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota exceeded or private browsing — in-memory cache still works.
  }
}

/** name(lowercased) → item mapping. */
export function getMapping(): Promise<Map<string, MappedItem>> {
  if (!mappingPromise) {
    mappingPromise = (async () => {
      let items = readLs<MappedItem[]>(LS_MAPPING)
      if (!items) {
        const res = await fetch(`${PRICES_BASE}/mapping`)
        if (!res.ok) throw new Error(`mapping fetch failed: ${res.status}`)
        items = (await res.json()) as MappedItem[]
        writeLs(LS_MAPPING, items)
      }
      const map = new Map<string, MappedItem>()
      for (const item of items) map.set(normalizeName(item.name), item)
      return map
    })().catch((err) => {
      mappingPromise = null // allow retry on next call
      throw err
    })
  }
  return mappingPromise
}

export function getLatest(force = false): Promise<PriceSnapshot> {
  const fresh = lastSnapshot && !lastSnapshot.stale && Date.now() - lastSnapshot.fetchedAt < TTL_MS
  if (!force && fresh) return Promise.resolve(lastSnapshot!)
  if (!latestPromise) {
    latestPromise = (async () => {
      try {
        const res = await fetch(`${PRICES_BASE}/latest`)
        if (!res.ok) throw new Error(`latest fetch failed: ${res.status}`)
        const body = (await res.json()) as { data: Record<string, LatestPrice> }
        const snapshot: PriceSnapshot = { prices: body.data, fetchedAt: Date.now(), stale: false }
        lastSnapshot = snapshot
        writeLs(LS_LATEST, snapshot)
        return snapshot
      } catch (err) {
        const cached = lastSnapshot ?? readLs<PriceSnapshot>(LS_LATEST)
        if (cached) {
          lastSnapshot = { ...cached, stale: true }
          return lastSnapshot
        }
        throw err
      } finally {
        latestPromise = null
      }
    })()
  }
  return latestPromise
}

/** Effective GP value used across cost tables: midpoint of instant-buy/sell,
 *  falling back to whichever side exists. */
export function effectivePrice(p: LatestPrice | undefined): number | null {
  if (!p) return null
  if (p.high !== null && p.low !== null) return Math.round((p.high + p.low) / 2)
  return p.high ?? p.low ?? null
}

export interface PriceLookup {
  snapshot: PriceSnapshot | null
  /** price by exact item name (case-insensitive); null while loading/unknown */
  byName(name: string): number | null
  idByName(name: string): number | null
  /** Item-name autocomplete over the GE mapping (prefix matches first). */
  searchNames(query: string, limit?: number): string[]
}

export async function loadPriceLookup(force = false): Promise<PriceLookup> {
  const [mapping, snapshot] = await Promise.all([getMapping(), getLatest(force)])
  return {
    snapshot,
    byName(name: string) {
      const item = mapping.get(normalizeName(name))
      if (!item) return null
      return effectivePrice(snapshot.prices[String(item.id)])
    },
    idByName(name: string) {
      return mapping.get(normalizeName(name))?.id ?? null
    },
    searchNames(query: string, limit = 25) {
      const q = normalizeName(query)
      if (!q) return []
      const starts: string[] = []
      const contains: string[] = []
      for (const item of mapping.values()) {
        const n = normalizeName(item.name)
        if (n.startsWith(q)) starts.push(item.name)
        else if (n.includes(q)) contains.push(item.name)
        if (starts.length >= limit) break
      }
      return [...starts, ...contains].slice(0, limit)
    },
  }
}

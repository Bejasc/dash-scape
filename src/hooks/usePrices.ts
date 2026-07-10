import { useCallback, useEffect, useState } from 'react'
import { loadPriceLookup, type PriceLookup } from '../services/prices'

export interface UsePrices {
  /** null while loading */
  lookup: PriceLookup | null
  /** price by exact item name; null while loading or unknown item */
  price(name: string): number | null
  error: string | null
  loading: boolean
  stale: boolean
  fetchedAt: number | null
  refresh(): void
}

/** Live GE prices for all items, cached with a 10-minute TTL and a stale
 *  localStorage fallback. Every cost table in every objective uses this. */
export function usePrices(): UsePrices {
  const [lookup, setLookup] = useState<PriceLookup | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback((force: boolean) => {
    setLoading(true)
    loadPriceLookup(force)
      .then((l) => {
        setLookup(l)
        setError(null)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => load(false), [load])

  return {
    lookup,
    price: (name: string) => lookup?.byName(name) ?? null,
    error,
    loading,
    stale: lookup?.snapshot?.stale ?? false,
    fetchedAt: lookup?.snapshot?.fetchedAt ?? null,
    refresh: () => load(true),
  }
}

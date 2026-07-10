import { useCallback, useEffect, useState } from 'react'
import { fetchPlayer, refreshPlayer, type SkillName, type WomPlayer } from '../services/wom'

export interface UseWiseOldMan {
  player: WomPlayer | null
  skill(name: SkillName): { experience: number; level: number } | null
  loading: boolean
  error: string | null
  /** Trigger a hiscores refresh on WOM, then re-read. */
  refresh(): void
  updatedAt: string | null
}

/** Live xp tracking for any account/skill via the Wise Old Man API.
 *  Any objective can consume any skill: useWiseOldMan(rsn).skill('slayer'). */
export function useWiseOldMan(rsn: string): UseWiseOldMan {
  const [player, setPlayer] = useState<WomPlayer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchPlayer(rsn)
      .then((p) => {
        if (cancelled) return
        setPlayer(p)
        setError(null)
      })
      .catch((err: unknown) => !cancelled && setError(err instanceof Error ? err.message : String(err)))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [rsn])

  const refresh = useCallback(() => {
    setLoading(true)
    refreshPlayer(rsn)
      .then((p) => {
        setPlayer(p)
        setError(null)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [rsn])

  return {
    player,
    skill: (name) => {
      const s = player?.latestSnapshot?.data.skills[name]
      return s ? { experience: s.experience, level: s.level } : null
    },
    loading,
    error,
    refresh,
    updatedAt: player?.updatedAt ?? null,
  }
}

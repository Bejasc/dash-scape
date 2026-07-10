import type { ReactNode } from 'react'
import { wikiImageUrl } from '../lib/format'
import { usePricesContext } from './PricesProvider'
import './components.css'

/** Shared chrome for every objective page: themed header with live-data
 *  status chips, then the objective's sections. */
export function ObjectiveLayout({
  title,
  icon,
  tagline,
  headerExtra,
  children,
}: {
  title: string
  icon: string
  tagline: string
  headerExtra?: ReactNode
  children: ReactNode
}) {
  const prices = usePricesContext()
  return (
    <div>
      <div className="site-header">
        <h1 className="site-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={wikiImageUrl(icon)} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
          <span>
            {title}
            <small>{tagline}</small>
          </span>
        </h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {headerExtra}
          <span className="stat-chip" title="GE prices from the OSRS Wiki real-time prices API">
            GE prices:{' '}
            {prices?.loading ? (
              <b>loading…</b>
            ) : prices?.error && !prices.fetchedAt ? (
              <b style={{ color: 'var(--red)' }}>offline</b>
            ) : (
              <b style={{ color: prices?.stale ? 'var(--gold)' : 'var(--green)' }}>
                {prices?.stale ? 'stale · ' : 'live · '}
                {prices?.fetchedAt ? new Date(prices.fetchedAt).toLocaleTimeString() : ''}
              </b>
            )}
          </span>
          <button
            onClick={() => prices?.refresh()}
            style={{
              background: 'var(--stone-3)', color: 'var(--parchment)', border: '1px solid var(--stone-5)',
              borderRadius: 4, padding: '4px 10px', fontSize: 12, cursor: 'pointer',
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}

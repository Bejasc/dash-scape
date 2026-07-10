import { wikiImageUrl, wikiUrl } from '../lib/format'
import './components.css'

export type SlotTint = 'prayer' | 'food' | 'util' | 'key'

export interface InventorySlot {
  /** Exact wiki item name; omit for an empty slot */
  item?: string
  /** Short label under the icon; defaults to item name */
  label?: string
  qty?: number
  tint?: SlotTint
  /** Repeat this slot definition n times (fills consecutive slots) */
  repeat?: number
}

/** 4×7 grid mimicking the in-game inventory. Data-driven: pass up to 28
 *  slots (repeat handles runs of the same item); remaining slots render
 *  as dimmed "loot" space. */
export function InventoryGrid({ slots, caption, emptyLabel = 'loot' }: { slots: InventorySlot[]; caption?: string; emptyLabel?: string }) {
  const expanded: InventorySlot[] = []
  for (const s of slots) {
    const n = s.repeat ?? 1
    for (let i = 0; i < n; i++) expanded.push(s)
  }
  const cells = expanded.slice(0, 28)
  while (cells.length < 28) cells.push({})

  return (
    <div>
      <div className="inv-grid">
        {cells.map((s, i) =>
          s.item ? (
            <a key={i} className={`inv-slot${s.tint ? ` tint-${s.tint}` : ''}`} href={wikiUrl(s.item)} target="_blank" rel="noreferrer" title={s.item}>
              {s.qty && s.qty > 1 && <span className="inv-qty">{s.qty >= 1000 ? `${Math.round(s.qty / 1000)}K` : s.qty}</span>}
              <img src={wikiImageUrl(s.item)} alt={s.item} onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
              <span className="inv-name">{s.label ?? s.item}</span>
            </a>
          ) : (
            <div key={i} className="inv-slot empty">
              <span className="inv-name">{emptyLabel}</span>
            </div>
          ),
        )}
      </div>
      {caption && <div className="inv-caption">{caption}</div>}
    </div>
  )
}

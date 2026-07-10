import { wikiImageUrl, wikiUrl } from '../lib/format'
import './components.css'

export type EquipSlotName =
  | 'head' | 'cape' | 'neck' | 'ammo' | 'weapon' | 'body' | 'shield'
  | 'legs' | 'hands' | 'feet' | 'ring'

export interface EquipItem {
  /** Exact wiki item name */
  item: string
  label?: string
  /** Override icon file when it differs (e.g. "Toxic blowpipe (empty)") */
  iconName?: string
  note?: string
}

export type EquipmentSet = Partial<Record<EquipSlotName, EquipItem>>

const LAYOUT: (EquipSlotName | null)[][] = [
  [null, 'head', null],
  ['cape', 'neck', 'ammo'],
  ['weapon', 'body', 'shield'],
  [null, 'legs', null],
  ['hands', 'feet', 'ring'],
]

/** Paper-doll equipment layout mimicking the in-game equipment tab. */
export function EquipmentLayout({ set }: { set: EquipmentSet }) {
  return (
    <div className="equip-layout">
      {LAYOUT.flat().map((slot, i) => {
        if (!slot) return <div key={i} />
        const eq = set[slot]
        if (!eq)
          return (
            <div key={i} className="equip-slot ghost">
              <span className="slot-label">{slot}</span>
            </div>
          )
        return (
          <a key={i} className="equip-slot" href={wikiUrl(eq.item)} target="_blank" rel="noreferrer" title={eq.note ? `${eq.item} — ${eq.note}` : eq.item}>
            <img src={wikiImageUrl(eq.iconName ?? eq.item)} alt={eq.item} onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
            <span className="slot-name">{eq.label ?? eq.item}</span>
          </a>
        )
      })}
    </div>
  )
}

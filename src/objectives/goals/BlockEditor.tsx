// Embeddable inventory/loadout blocks for Goals & Notes: view mode renders
// through the shared InventoryGrid/EquipmentLayout (wiki links + live
// prices); edit mode is a click-to-paint grid with item autocomplete from
// the live GE mapping.
import { useId, useState } from 'react'
import { EquipmentLayout, type EquipmentSet, type EquipSlotName } from '../../components/EquipmentLayout'
import { InventoryGrid, type InventorySlot } from '../../components/InventoryGrid'
import { usePricesContext } from '../../components/PricesProvider'
import { wikiImageUrl } from '../../lib/format'
import type { EmbedBlock } from './types'

const EQUIP_SLOTS: EquipSlotName[] = ['head', 'cape', 'neck', 'ammo', 'weapon', 'body', 'shield', 'legs', 'hands', 'feet', 'ring']

/** Item name input with autocomplete against the GE mapping (~4k items).
 *  Free text is allowed — untradeables aren't in the mapping. */
export function ItemSearchInput({
  value,
  onChange,
  placeholder,
  width = 220,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  width?: number
}) {
  const prices = usePricesContext()
  const listId = useId()
  const options = prices?.lookup?.searchNames(value, 20) ?? []
  return (
    <>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Item name…'}
        list={listId}
        style={{
          background: '#111', color: 'var(--parchment)', border: '1px solid var(--stone-5)',
          borderRadius: 4, padding: '5px 8px', fontSize: 12.5, width, fontFamily: 'var(--font-body)',
        }}
      />
      <datalist id={listId}>
        {options.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </>
  )
}

function InventoryBlockEditor({ block, onChange }: { block: EmbedBlock; onChange: (b: EmbedBlock) => void }) {
  const [brush, setBrush] = useState('')
  const slots = block.slots ?? Array(28).fill('')
  const paint = (i: number) => {
    const next = [...slots]
    next[i] = next[i] === brush ? '' : brush // painting the same item again clears
    onChange({ ...block, slots: next })
  }
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
        <ItemSearchInput value={brush} onChange={setBrush} placeholder="Pick an item, then click slots…" />
        <span className="muted" style={{ fontSize: 11 }}>
          Click a slot to place the item · click again to clear · empty brush erases
        </span>
      </div>
      <div className="inv-grid">
        {slots.map((s, i) => (
          <button
            key={i}
            onClick={() => paint(i)}
            className={`inv-slot${s ? '' : ' empty'}`}
            style={{ cursor: 'pointer', border: 'none' }}
            title={s || 'empty — click to place brush item'}
          >
            {s && (
              <img src={wikiImageUrl(s)} alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
            )}
            <span className="inv-name">{s || ''}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function LoadoutBlockEditor({ block, onChange }: { block: EmbedBlock; onChange: (b: EmbedBlock) => void }) {
  const set = block.set ?? {}
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 10px', alignItems: 'center', maxWidth: 360 }}>
      {EQUIP_SLOTS.map((slot) => (
        <div key={slot} style={{ display: 'contents' }}>
          <span className="muted" style={{ fontSize: 11.5, textTransform: 'capitalize' }}>{slot}</span>
          <ItemSearchInput
            value={set[slot] ?? ''}
            onChange={(v) => onChange({ ...block, set: { ...set, [slot]: v || undefined } })}
            width={240}
          />
        </div>
      ))}
    </div>
  )
}

export function BlockView({
  block,
  onChange,
  onDelete,
}: {
  block: EmbedBlock
  onChange: (b: EmbedBlock) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(() => {
    // A brand-new empty block opens straight into edit mode
    return block.type === 'inventory' ? !(block.slots ?? []).some(Boolean) : Object.keys(block.set ?? {}).length === 0
  })

  const viewSlots: InventorySlot[] = (block.slots ?? []).map((s) => (s ? { item: s } : {}))
  const viewSet: EquipmentSet = Object.fromEntries(
    Object.entries(block.set ?? {})
      .filter(([, v]) => v)
      .map(([k, v]) => [k, { item: v! }]),
  )

  return (
    <div style={{ background: '#14120e', border: '1px solid var(--stone-4)', borderRadius: 6, padding: '0.7rem 0.9rem', marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
        {editing ? (
          <input
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
            style={{ background: '#111', color: 'var(--gold)', border: '1px solid var(--stone-5)', borderRadius: 4, padding: '3px 8px', fontSize: 12.5, fontWeight: 600 }}
          />
        ) : (
          <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 12.5 }}>
            {block.type === 'inventory' ? '🎒' : '🛡'} {block.title}
          </span>
        )}
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button onClick={() => setEditing(!editing)} style={btnStyle}>{editing ? '✓ Done' : '✎ Edit'}</button>
          <button onClick={onDelete} style={{ ...btnStyle, color: '#e06060' }}>✕</button>
        </span>
      </div>
      {editing ? (
        block.type === 'inventory' ? (
          <InventoryBlockEditor block={block} onChange={onChange} />
        ) : (
          <LoadoutBlockEditor block={block} onChange={onChange} />
        )
      ) : block.type === 'inventory' ? (
        <InventoryGrid slots={viewSlots} emptyLabel="" />
      ) : (
        <EquipmentLayout set={viewSet} />
      )}
    </div>
  )
}

export const btnStyle: React.CSSProperties = {
  background: 'var(--stone-3)',
  color: 'var(--parchment)',
  border: '1px solid var(--stone-5)',
  borderRadius: 4,
  padding: '3px 10px',
  fontSize: 11.5,
  cursor: 'pointer',
}

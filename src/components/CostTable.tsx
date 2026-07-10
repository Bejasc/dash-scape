import { formatGp, formatNum } from '../lib/format'
import { ItemLink } from './ItemLink'
import { usePricesContext } from './PricesProvider'
import './components.css'

export interface CostRow {
  /** Exact wiki item name (used for live price lookup + icon + link) */
  item: string
  qty: number
  /** Fixed gp cost for non-GE items (e.g. Magic stone from Stonemason); skips live lookup */
  fixedPrice?: number
  note?: string
}

/** Live-priced materials table. Total and per-row costs compute from the
 *  live GE snapshot; unknown items render as "—" rather than fake numbers. */
export function CostTable({ rows, caption }: { rows: CostRow[]; caption?: string }) {
  const prices = usePricesContext()
  let total = 0
  let missing = false

  const rendered = rows.map((row) => {
    const unit = row.fixedPrice ?? prices?.price(row.item) ?? null
    const line = unit !== null ? unit * row.qty : null
    if (line !== null) total += line
    else missing = true
    return { ...row, unit, line }
  })

  return (
    <div className="table-scroll">
      <table className="ds-table">
        {caption && <caption style={{ captionSide: 'top', textAlign: 'left', paddingBottom: 6, color: 'var(--parchment-dim)', fontSize: 12 }}>{caption}</caption>}
        <thead>
          <tr>
            <th>Item</th>
            <th className="num">Qty</th>
            <th className="num">Unit price</th>
            <th className="num">Cost</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rendered.map((r, i) => (
            <tr key={i}>
              <td><ItemLink name={r.item} /></td>
              <td className="num">{formatNum(r.qty)}</td>
              <td className="num gp">{r.unit !== null ? formatGp(r.unit) : '—'}</td>
              <td className="num gp">{r.line !== null ? formatGp(r.line) : '—'}</td>
              <td className="muted">{r.fixedPrice !== undefined ? `Fixed price (not GE). ${r.note ?? ''}` : r.note ?? ''}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={3}>Total{missing ? ' (some prices unavailable)' : ''}</th>
            <th className="num gp">{formatGp(total)}</th>
            <th />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

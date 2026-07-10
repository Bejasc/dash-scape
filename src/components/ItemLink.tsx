import { wikiImageUrl, wikiUrl, formatGp } from '../lib/format'
import { usePricesContext } from './PricesProvider'
import './components.css'

export interface ItemLinkProps {
  /** Exact wiki item name, e.g. "Mahogany plank", "Slayer helmet (i)" */
  name: string
  /** Display label; defaults to name */
  label?: string
  /** Override the wiki page (e.g. link "Teleport to house (tablet)" mentions elsewhere) */
  wikiPage?: string
  /** Override icon file name when it differs from the item name */
  iconName?: string
  /** Show a live GE price badge next to the item */
  showPrice?: boolean
  /** Multiply the live price (e.g. qty) in the badge */
  qty?: number
  iconSize?: number
}

/** Canonical way to render any OSRS item anywhere in the app:
 *  wiki hyperlink + PNG icon + optional live GE price badge. */
export function ItemLink({ name, label, wikiPage, iconName, showPrice, qty = 1, iconSize = 18 }: ItemLinkProps) {
  const prices = usePricesContext()
  const price = (showPrice ? prices?.price(name) : null) ?? null
  return (
    <a className="item-link" href={wikiUrl(wikiPage ?? name)} target="_blank" rel="noreferrer" title={name}>
      <img
        src={wikiImageUrl(iconName ?? name)}
        alt=""
        width={iconSize}
        height={iconSize}
        loading="lazy"
        onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
      />
      <span>{label ?? name}</span>
      {showPrice && price !== null && (
        <span className="price-badge" title={`Live GE price${qty !== 1 ? ` × ${qty}` : ''}`}>
          {formatGp(price * qty)}
        </span>
      )}
    </a>
  )
}

import type { ReactNode } from 'react'
import { wikiImageUrl } from '../lib/format'
import './components.css'

export function SectionCard({ title, icon, children, id }: { title: string; icon?: string; children: ReactNode; id?: string }) {
  return (
    <section className="section-card" id={id}>
      <h2>
        {icon && <img src={wikiImageUrl(icon)} alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />}
        {title}
      </h2>
      {children}
    </section>
  )
}

export function SubHead({ children }: { children: ReactNode }) {
  return <div className="subhead">{children}</div>
}

export function Note({ kind = 'tip', children }: { kind?: 'tip' | 'warn' | 'danger'; children: ReactNode }) {
  const cls = kind === 'tip' ? 'note' : kind === 'warn' ? 'warn-note' : 'danger-note'
  return <div className={cls}>{children}</div>
}

export function Tag({ kind, children }: { kind: 'melee' | 'ranged' | 'magic' | 'cannon' | 'prayer' | 'safe' | 'gold' | 'neutral'; children: ReactNode }) {
  return <span className={`tag tag-${kind}`}>{children}</span>
}

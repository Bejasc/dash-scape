import type { ReactNode } from 'react'
import { formatNum } from '../lib/format'
import { xpForLevel } from '../lib/xp'
import './components.css'

export interface Milestone {
  level: number
  title: ReactNode
  detail?: ReactNode
}

/** Skill milestone table. When currentXp is provided (live from WOM), rows
 *  are tinted: reached milestones dim out, the next one highlights. */
export function MilestoneTable({ milestones, currentXp, skillLabel = 'level' }: { milestones: Milestone[]; currentXp?: number | null; skillLabel?: string }) {
  const sorted = [...milestones].sort((a, b) => a.level - b.level)
  const nextIdx = currentXp != null ? sorted.findIndex((m) => xpForLevel(m.level) > currentXp) : -1
  return (
    <div className="table-scroll">
      <table className="ds-table">
        <thead>
          <tr>
            <th>{skillLabel[0].toUpperCase() + skillLabel.slice(1)}</th>
            <th className="num">XP required</th>
            {currentXp != null && <th className="num">XP to go</th>}
            <th>Unlock</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m, i) => {
            const xp = xpForLevel(m.level)
            const done = currentXp != null && currentXp >= xp
            const cls = done ? 'milestone-done' : i === nextIdx ? 'milestone-next' : undefined
            return (
              <tr key={i} className={cls}>
                <td className="milestone-level">{done ? '✓ ' : ''}{m.level}</td>
                <td className="num">{formatNum(xp)}</td>
                {currentXp != null && <td className="num">{done ? '—' : formatNum(xp - currentXp)}</td>}
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--parchment)' }}>{m.title}</div>
                  {m.detail && <div className="muted" style={{ fontSize: 11.5 }}>{m.detail}</div>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

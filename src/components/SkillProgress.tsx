import { formatNum } from '../lib/format'
import { progressWithinLevel, xpForLevel, XP_99 } from '../lib/xp'
import { wikiImageUrl } from '../lib/format'
import { ProgressBar } from './ProgressBar'
import type { UseWiseOldMan } from '../hooks/useWiseOldMan'
import type { SkillName } from '../services/wom'
import './components.css'

/** Live skill progress block driven by Wise Old Man: current level, xp,
 *  progress within the level and toward 99. Shared by all objectives. */
export function SkillProgress({ wom, skill, skillIconName }: { wom: UseWiseOldMan; skill: SkillName; skillIconName: string }) {
  const s = wom.skill(skill)
  const skillTitle = skill[0].toUpperCase() + skill.slice(1)

  if (wom.error && !s) {
    return (
      <div className="warn-note" style={{ marginTop: 0 }}>
        <strong>Wise Old Man unavailable:</strong> {wom.error}. Live progress is hidden — data below still works, but
        remaining-xp maths needs the API. <button onClick={wom.refresh} style={{ marginLeft: 6 }}>Retry</button>
      </div>
    )
  }
  if (!s) return <div className="muted" style={{ fontSize: 12 }}>Loading live {skillTitle} stats from Wise Old Man…</div>

  const within = progressWithinLevel(s.experience)
  const to99 = Math.max(0, XP_99 - s.experience)

  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <span className="stat-chip" style={{ fontSize: 14, padding: '8px 14px' }}>
        <img src={wikiImageUrl(skillIconName)} alt="" />
        {skillTitle} <b style={{ fontSize: 18 }}>{within.level}</b>
      </span>
      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 3 }}>
          <span className="muted">
            {formatNum(s.experience)} xp · {within.level >= 99 ? 'maxed!' : `${formatNum(within.needed - within.into)} xp to level ${within.level + 1}`}
          </span>
          <span className="muted">{formatNum(to99)} xp to 99</span>
        </div>
        <ProgressBar
          pct={((s.experience - xpForLevel(within.level >= 99 ? 98 : within.level)) / (xpForLevel(within.level >= 99 ? 99 : within.level + 1) - xpForLevel(within.level >= 99 ? 98 : within.level))) * 100}
          label={within.level >= 99 ? '99 achieved' : `Level ${within.level} → ${within.level + 1}: ${within.pct.toFixed(1)}%`}
        />
        <div style={{ marginTop: 6 }}>
          <ProgressBar pct={(s.experience / XP_99) * 100} label={`Toward 99: ${((s.experience / XP_99) * 100).toFixed(1)}%`} />
        </div>
      </div>
      <span className="muted" style={{ fontSize: 11 }}>
        WOM updated {wom.updatedAt ? new Date(wom.updatedAt).toLocaleString() : '…'}
        <button
          onClick={wom.refresh}
          disabled={wom.loading}
          style={{ marginLeft: 8, background: 'var(--stone-3)', color: 'var(--parchment)', border: '1px solid var(--stone-5)', borderRadius: 4, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}
        >
          {wom.loading ? '…' : '↻ Update'}
        </button>
      </span>
    </div>
  )
}

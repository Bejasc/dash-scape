import { useMemo, useState } from 'react'
import { EquipmentLayout } from '../../components/EquipmentLayout'
import { InventoryGrid } from '../../components/InventoryGrid'
import { ItemLink } from '../../components/ItemLink'
import { MilestoneTable } from '../../components/MilestoneTable'
import { ObjectiveLayout } from '../../components/ObjectiveLayout'
import { Note, SectionCard, SubHead, Tag } from '../../components/SectionCard'
import { SkillProgress } from '../../components/SkillProgress'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useWiseOldMan } from '../../hooks/useWiseOldMan'
import { wikiImageUrl, wikiUrl } from '../../lib/format'
import { DEFAULT_RSN } from '../../services/config'
import { gearSetups, inventoryLegend } from './gearData'
import { strategies, type LoadoutId } from './strategies'
import { duradel, duradelTasks, type DuradelTask } from './tasks'

type Pref = 'unavailable' | 'blocked' | 'neutral' | 'preferred'
type Filter = 'all' | Pref

const PREF_LABEL: Record<Pref, string> = {
  unavailable: 'Not available',
  blocked: 'Blocked',
  neutral: 'Neutral',
  preferred: 'Preferred',
}
const PREF_ICON: Record<Pref, string> = { unavailable: '✕', blocked: '⛔', neutral: '—', preferred: '★' }
const PREF_TIP: Record<Pref, string> = {
  unavailable: "Can't be assigned — missing unlock/quest/level. Excluded from your pool.",
  blocked: 'Blocked at Duradel (100 points). Excluded from your pool.',
  neutral: 'Default',
  preferred: 'Mark preferred',
}

/** v1 stored 'blocked' meaning "not available"; v2 splits the two states. */
function migratePrefs(): Record<string, Pref> {
  try {
    const v1 = localStorage.getItem('dashscape.slayer.prefs.v1')
    if (!v1) return {}
    const old = JSON.parse(v1) as Record<string, string>
    const out: Record<string, Pref> = {}
    for (const [k, v] of Object.entries(old)) out[k] = v === 'blocked' ? 'unavailable' : (v as Pref)
    return out
  } catch {
    return {}
  }
}
const LOADOUT_LABEL: Record<LoadoutId, string> = {
  melee: 'Melee setup',
  blowpipe: 'Blowpipe setup',
  crossbow: 'Crossbow setup',
  burst: 'Burst setup',
}

const slayerMilestones = [
  { level: 65, title: 'Dust devils', detail: 'First great burst task (Catacombs)' },
  { level: 72, title: 'Skeletal wyverns', detail: 'Profit task — elemental shield required' },
  { level: 75, title: 'Gargoyles', detail: 'Consistent alchable income (rock hammer)' },
  { level: 80, title: 'Nechryael', detail: 'Top-tier burst task — always extend' },
  { level: 85, title: 'Abyssal demons', detail: 'Whip money + Abyssal Sire unlock' },
  { level: 87, title: 'Cave krakens', detail: 'Trident of the seas — never skip' },
  { level: 90, title: 'Dark beasts', detail: 'Dark bow chance, near-AFK' },
  { level: 91, title: 'Cerberus (via Hellhounds)', detail: 'BiS boot crystals — never block Hellhounds' },
  { level: 92, title: 'Araxytes', detail: 'Profitable venom spiders + Araxxor' },
  { level: 93, title: 'Smoke devils', detail: 'Premier barrage task + Thermy' },
  { level: 99, title: 'Max Slayer', detail: 'Use Duradel at any combat level with the cape' },
]

function PrefPicker({ value, onChange }: { value: Pref; onChange: (p: Pref) => void }) {
  return (
    <span className="pref-picker">
      {(['unavailable', 'blocked', 'neutral', 'preferred'] as const).map((p) => (
        <button key={p} className={value === p ? `on-${p}` : ''} onClick={() => onChange(p)} title={PREF_TIP[p]}>
          {PREF_ICON[p]} {PREF_LABEL[p]}
        </button>
      ))}
    </span>
  )
}

function TaskCard({ task, pref, setPref }: { task: DuradelTask; pref: Pref; setPref: (p: Pref) => void }) {
  const strat = strategies[task.name]
  const [open, setOpen] = useState(false)
  const excluded = pref === 'blocked' || pref === 'unavailable'
  return (
    <div
      style={{
        background: excluded ? '#191412' : '#161616',
        opacity: excluded ? 0.65 : 1,
        border: '1px solid #2e2a1e',
        borderLeft: `3px solid ${pref === 'preferred' ? 'var(--green-dim)' : pref === 'blocked' ? 'var(--red-dim)' : pref === 'unavailable' ? 'var(--stone-5)' : 'var(--gold)'}`,
        borderRadius: 'var(--radius)',
        padding: '0.9rem 1.1rem',
        marginBottom: '0.7rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <img
            src={wikiImageUrl(task.monsterWiki)}
            alt=""
            style={{ width: 30, height: 30, objectFit: 'contain' }}
            onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
          />
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--gold-light)' }}>{task.name}</span>
          <span className="muted" style={{ fontSize: 11 }}>
            {task.slayerReq ? `${task.slayerReq} Slayer · ` : ''}
            {task.combatReq ? `cb ${task.combatReq} · ` : ''}
            wt {task.weight} · {task.amount}
          </span>
          <a href={wikiUrl(task.monsterWiki)} target="_blank" rel="noreferrer" style={{ fontSize: 10.5 }}>Monster</a>
          {task.taskWiki && (
            <a href={wikiUrl(task.taskWiki)} target="_blank" rel="noreferrer" style={{ fontSize: 10.5 }}>Slayer guide</a>
          )}
        </div>
        <PrefPicker value={pref} onChange={setPref} />
      </div>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 6 }}>
        {strat && <Tag kind={strat.loadout === 'burst' ? 'magic' : strat.loadout === 'melee' ? 'melee' : 'ranged'}>{LOADOUT_LABEL[strat.loadout]}</Tag>}
        {strat?.cannon && !/no cannon|not /i.test(strat.cannon) && <Tag kind="cannon">Cannon</Tag>}
        {task.unlockRequired && <Tag kind="gold">Unlock: {task.unlockRequired}</Tag>}
        {task.extendable && <Tag kind="neutral">Extend: {task.extendable}</Tag>}
        {strat && <Tag kind="safe">AFK {'●'.repeat(strat.afk)}{'○'.repeat(5 - strat.afk)}</Tag>}
      </div>

      {strat && (
        <div style={{ marginTop: 8, fontSize: 12.5 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3px 12px' }}>
            <strong style={{ color: 'var(--gold)' }}>Prayers</strong>
            <span>{strat.protectPrayer} · {strat.offensivePrayer}</span>
            <strong style={{ color: 'var(--gold)' }}>Where</strong>
            <span>
              <a href={wikiUrl(strat.bestLocation.wikiPage)} target="_blank" rel="noreferrer">{strat.bestLocation.name}</a>
              {' — '}<span className="muted">{strat.bestLocation.transport}. {strat.bestLocation.why}.</span>
            </span>
            {strat.itemsRequired && strat.itemsRequired.length > 0 && (
              <>
                <strong style={{ color: '#e06060' }}>Required</strong>
                <span>{strat.itemsRequired.join(' · ')}</span>
              </>
            )}
            <strong style={{ color: 'var(--gold)' }}>Verdict</strong>
            <span className="muted">{strat.verdict}</span>
          </div>
          <button
            onClick={() => setOpen(!open)}
            style={{ marginTop: 6, background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontSize: 11.5, padding: 0 }}
          >
            {open ? '▾ Hide' : '▸ Show'} full strategy — gear swaps, inventory, drops
          </button>
          {open && (
            <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
              {strat.styleNote && (<><strong style={{ color: 'var(--gold)' }}>Style</strong><span>{strat.styleNote}</span></>)}
              {strat.gearMods && strat.gearMods.length > 0 && (
                <>
                  <strong style={{ color: 'var(--gold)' }}>Gear swaps</strong>
                  <span>
                    {strat.gearMods.map((g, i) => (
                      <div key={i}>
                        <span className="muted" style={{ textTransform: 'capitalize' }}>{g.slot}: </span>
                        <ItemLink name={g.item} showPrice /> <span className="muted">— {g.why}</span>
                      </div>
                    ))}
                  </span>
                </>
              )}
              {strat.inventoryExtras && strat.inventoryExtras.length > 0 && (
                <>
                  <strong style={{ color: 'var(--gold)' }}>Bring</strong>
                  <span style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {strat.inventoryExtras.map((it) => <ItemLink key={it} name={it} showPrice />)}
                  </span>
                </>
              )}
              {strat.cannon && (<><strong style={{ color: 'var(--gold)' }}>Cannon</strong><span className="muted">{strat.cannon}</span></>)}
              {strat.altLocation && (
                <>
                  <strong style={{ color: 'var(--gold)' }}>Alt spot</strong>
                  <span>
                    <a href={wikiUrl(strat.altLocation.wikiPage)} target="_blank" rel="noreferrer">{strat.altLocation.name}</a>
                    {' — '}<span className="muted">{strat.altLocation.transport}. {strat.altLocation.why}.</span>
                  </span>
                </>
              )}
              {strat.dangers && strat.dangers.length > 0 && (<><strong style={{ color: '#e06060' }}>Watch out</strong><span className="muted">{strat.dangers.join(' · ')}</span></>)}
              <strong style={{ color: 'var(--gold)' }}>How-to</strong><span>{strat.strategy}</span>
              {strat.keyDrops && (<><strong style={{ color: 'var(--gold)' }}>Drops</strong><span className="muted">{strat.keyDrops.join(' · ')}</span></>)}
              {strat.superior && (<><strong style={{ color: 'var(--gold)' }}>Superior</strong><span className="muted">{strat.superior}</span></>)}
              {strat.bossAlt && (<><strong style={{ color: 'var(--gold)' }}>Boss alt</strong><span className="muted">{strat.bossAlt}</span></>)}
              {task.otherReqs && task.otherReqs.length > 0 && (<><strong style={{ color: 'var(--gold)' }}>Task reqs</strong><span className="muted">{task.otherReqs.join(' · ')}</span></>)}
              {strat.unverified && (<><strong style={{ color: 'var(--gold)' }}>Note</strong><span className="muted">Some details couldn't be fully wiki-verified — double-check before relying on them.</span></>)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function SlayerPage() {
  const wom = useWiseOldMan(DEFAULT_RSN)
  const slayerXp = wom.skill('slayer')?.experience ?? null
  const [prefs, setPrefs] = useLocalStorage<Record<string, Pref>>('dashscape.slayer.prefs.v2', migratePrefs())
  const [filter, setFilter] = useState<Filter>('all')
  const [setupId, setSetupId] = useState(gearSetups[0].id)

  const counts = useMemo(() => {
    const c: Record<Pref, number> = { unavailable: 0, blocked: 0, neutral: 0, preferred: 0 }
    for (const t of duradelTasks) c[prefs[t.name] ?? 'neutral']++
    return c
  }, [prefs])

  const activeWeight = useMemo(
    () =>
      duradelTasks
        .filter((t) => {
          const p = prefs[t.name] ?? 'neutral'
          return p !== 'blocked' && p !== 'unavailable'
        })
        .reduce((s, t) => s + t.weight, 0),
    [prefs],
  )

  const visible = duradelTasks
    .filter((t) => filter === 'all' || (prefs[t.name] ?? 'neutral') === filter)
    .sort((a, b) => b.weight - a.weight)

  const setup = gearSetups.find((s) => s.id === setupId)!

  return (
    <ObjectiveLayout title="Slayer" icon="Slayer icon" tagline="Duradel task reference — gear, prayers, inventories, preferences">
      <SectionCard title="Live progress" icon="Slayer icon">
        <SkillProgress wom={wom} skill="slayer" skillIconName="Slayer icon" />
        <Note kind="warn">
          <strong>{duradel.name}</strong> — {duradel.location} Requirements: {duradel.requirements.join('; ')}. Points:{' '}
          {duradel.points}
        </Note>
        <SubHead>Slayer level milestones</SubHead>
        <MilestoneTable milestones={slayerMilestones} currentXp={slayerXp} skillLabel="level" />
      </SectionCard>

      <SectionCard title="Gear setups" icon="Slayer helmet (i)">
        <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
          {gearSetups.map((s) => (
            <button
              key={s.id}
              onClick={() => setSetupId(s.id)}
              style={{
                background: s.id === setupId ? '#1a1a10' : '#111',
                border: `1px solid ${s.id === setupId ? 'var(--gold-dim)' : 'var(--stone-4)'}`,
                color: s.id === setupId ? 'var(--gold)' : 'var(--parchment-dim)',
                borderRadius: 4, padding: '5px 14px', fontSize: 12.5, cursor: 'pointer',
                fontWeight: s.id === setupId ? 600 : 400,
              }}
            >
              {s.title}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <SubHead>Equipment</SubHead>
            <EquipmentLayout set={setup.set} />
            <Note kind="tip"><strong>Prayer:</strong> {setup.prayerNote}</Note>
          </div>
          <div>
            <SubHead>Inventory — base</SubHead>
            <InventoryGrid slots={setup.inventory} caption={setup.useFor} />
            <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
              {inventoryLegend.map((l) => (
                <span key={l.tint} className="muted" style={{ fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span className={`inv-slot tint-${l.tint}`} style={{ width: 12, height: 12, padding: 0, display: 'inline-block' }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Note kind="warn">
          Task cards below name one of these four setups and list the task-specific swaps on top (nose peg tasks, rock
          hammer, shields, leaf-bladed weapons, …). Hover any item for its live GE price.
        </Note>
      </SectionCard>

      <SectionCard title="Duradel task list" icon="Duradel chathead">
        <p className="muted" style={{ fontSize: 12.5, marginBottom: 8 }}>
          All {duradelTasks.length} assignment categories, sorted by assignment weight. Mark tasks{' '}
          <b className="muted">Not available</b> (can't be assigned — missing unlock/quest/level),{' '}
          <b style={{ color: '#e06060' }}>Blocked</b> (100 points spent at Duradel), <b>Neutral</b>, or{' '}
          <b style={{ color: '#60c060' }}>Preferred</b> — marks persist in your browser. Both Not available and
          Blocked are excluded from your assignment pool.
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          {(['all', 'preferred', 'neutral', 'blocked', 'unavailable'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--stone-4)' : '#111',
                border: `1px solid ${filter === f ? 'var(--gold-dim)' : 'var(--stone-4)'}`,
                color: filter === f ? 'var(--gold)' : 'var(--parchment-dim)',
                borderRadius: 4, padding: '4px 12px', fontSize: 12, cursor: 'pointer',
              }}
            >
              {f === 'all' ? `All (${duradelTasks.length})` : `${PREF_LABEL[f as Pref]} (${counts[f as Pref]})`}
            </button>
          ))}
          <span className="muted" style={{ fontSize: 11.5, marginLeft: 'auto' }}>
            Weight in your pool (excl. blocked + not-available): <b style={{ color: 'var(--gold)' }}>{activeWeight}</b>{' '}
            — a task's assignment odds ≈ weight ÷ pool
          </span>
        </div>
        {visible.map((t) => (
          <TaskCard
            key={t.name}
            task={t}
            pref={prefs[t.name] ?? 'neutral'}
            setPref={(p) => setPrefs((prev) => ({ ...prev, [t.name]: p }))}
          />
        ))}
      </SectionCard>

      <SectionCard title="Points — what to spend on" icon="Slayer reward point">
        <div className="table-scroll">
          <table className="ds-table">
            <thead><tr><th>Cost</th><th>Unlock</th><th>Why</th></tr></thead>
            <tbody>
              <tr><td className="num">150</td><td><a href={wikiUrl('Slayer Rewards')} target="_blank" rel="noreferrer">Bigger and Badder</a></td><td>Superior spawns — bonus xp and Imbued heart chance. First buy.</td></tr>
              <tr><td className="num">100 ea</td><td>Task blocks</td><td>Block your worst high-weight tasks, then mark them ⛔ Blocked above so your pool weight stays accurate (Metal dragons at weight 14 is the classic first block).</td></tr>
              <tr><td className="num">200</td><td>Like a Boss</td><td>Boss tasks: +5,000 bonus xp each, helm active on bosses, best gp/task at Duradel.</td></tr>
              <tr><td className="num">750</td><td><ItemLink name="Herb sack" /></td><td>Needs 58 Herblore. Frees loot space on spectres/nechs/kurask/dust devils.</td></tr>
              <tr><td className="num">100-200</td><td>Extensions</td><td>Extend the great tasks you marked Preferred (Nechryael, Dust devils, Smoke devils, Bloodveld, Abyssal demons).</td></tr>
            </tbody>
          </table>
        </div>
        <Note kind="tip">
          Skips cost 30 points, blocks 100. Once your "Not available" list is blocked, your skip rate — and point burn —
          drops to near zero.
        </Note>
      </SectionCard>

      <SectionCard title="Sources" icon="Book of knowledge">
        <p className="muted" style={{ fontSize: 12 }}>
          Task table from the wiki's Duradel assignment page (post-Aug-2025 rework verified). Per-task strategies from
          each monster's Slayer task / Strategies wiki page (July 2026). Cards flagged in their notes contain details
          that couldn't be fully verified via search — treat those as advisory.
        </p>
        <ul style={{ paddingLeft: '1.2rem', fontSize: 12, columns: 2, gap: '2rem' }}>
          {[duradel.source, 'https://oldschool.runescape.wiki/w/Duradel/Slayer_assignments', 'https://oldschool.runescape.wiki/w/Slayer_Rewards', 'https://oldschool.runescape.wiki/w/Update:Summer_Sweep_Up_Slayer_%26_More'].map((s) => (
            <li key={s} style={{ breakInside: 'avoid' }}>
              <a href={s} target="_blank" rel="noreferrer">{decodeURIComponent(s.replace('https://oldschool.runescape.wiki/w/', 'wiki/')).replace(/_/g, ' ')}</a>
            </li>
          ))}
          <li>Plus each task card's Monster / Slayer guide links above.</li>
        </ul>
      </SectionCard>
    </ObjectiveLayout>
  )
}

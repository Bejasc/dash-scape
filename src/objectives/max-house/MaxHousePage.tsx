import { CostTable } from '../../components/CostTable'
import { InventoryGrid } from '../../components/InventoryGrid'
import { ItemLink } from '../../components/ItemLink'
import { MilestoneTable } from '../../components/MilestoneTable'
import { ObjectiveLayout } from '../../components/ObjectiveLayout'
import { usePricesContext } from '../../components/PricesProvider'
import { Note, SectionCard, SubHead, Tag } from '../../components/SectionCard'
import { SkillProgress } from '../../components/SkillProgress'
import { useWiseOldMan } from '../../hooks/useWiseOldMan'
import { formatGp, formatHours, formatNum, wikiUrl } from '../../lib/format'
import { XP_99 } from '../../lib/xp'
import { DEFAULT_RSN } from '../../services/config'
import {
  demonButler,
  hosidius,
  layoutAdvice,
  layoutTools,
  milestones,
  pohBuildGroups,
  sources,
  trainingMethods,
  type TrainingMethod,
} from './data'

/** Butler wage amortised per xp: 1,250 gp per trip carrying the largest
 *  plank multiple under his 26-item capacity. */
function wagePerXp(m: TrainingMethod): number {
  if (!m.usesButler) return 0
  const tripPlanks = Math.floor(demonButler.capacity / m.planksPerAction) * m.planksPerAction
  const xpPerPlank = m.xpPerAction / m.planksPerAction
  return demonButler.wagePerTrip / (tripPlanks * xpPerPlank)
}

export function MaxHousePage() {
  const wom = useWiseOldMan(DEFAULT_RSN)
  const prices = usePricesContext()
  const conXp = wom.skill('construction')?.experience ?? null
  const xpLeft = conXp !== null ? Math.max(0, XP_99 - conXp) : null

  return (
    <ObjectiveLayout
      title="Max House"
      icon="Construction icon"
      tagline="Fastest route to a maxed player-owned house — teleports, rejuvenation, spellbook switching"
    >
      {/* ── Live progress ── */}
      <SectionCard title="Live progress" icon="Construction icon">
        <SkillProgress wom={wom} skill="construction" skillIconName="Construction icon" />
        {xpLeft !== null && xpLeft > 0 && (
          <Note kind="tip">
            <strong>The short version:</strong> everything below recomputes from your live xp. At mahogany-table pace
            that's <strong>{formatHours(xpLeft / 850_000)}</strong> of building to 99; the milestone table shows what
            unlocks on the way.
          </Note>
        )}
      </SectionCard>

      {/* ── Milestones ── */}
      <SectionCard title="Level milestones — when key builds unlock" icon="Construction icon">
        <p className="muted" style={{ fontSize: 12.5, marginBottom: 10 }}>
          All levels verified against the wiki. Reached milestones dim out; your next unlock is highlighted. Several
          builds are boostable with <ItemLink name="Crystal saw" /> (+3, invisible) and{' '}
          <ItemLink name="Spicy stew" /> (+0–5 orange spice) — noted per build below.
        </p>
        <MilestoneTable milestones={milestones} currentXp={conXp} skillLabel="level" />
      </SectionCard>

      {/* ── Training methods ── */}
      <SectionCard title="Training methods — costs, speed, AFK-ness" icon="Saw">
        <p className="muted" style={{ fontSize: 12.5, marginBottom: 10 }}>
          Costs are computed from <strong>live GE prices</strong> (mid of instant buy/sell) and include the demon
          butler's amortised wage where he's used. "To 99" columns use your live xp
          {conXp === null ? ' (waiting for Wise Old Man…)' : ''}.
        </p>
        <div className="table-scroll">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Method</th>
                <th className="num">Lvl</th>
                <th>Planks</th>
                <th className="num">XP/action</th>
                <th className="num">XP/plank</th>
                <th className="num">GP/XP</th>
                <th className="num">XP/hr</th>
                <th>AFK</th>
                <th className="num">Hours to 99</th>
                <th className="num">Cost to 99</th>
              </tr>
            </thead>
            <tbody>
              {trainingMethods.map((m) => {
                const plankPrice = prices?.price(m.plankItem) ?? null
                const xpPerPlank = m.xpPerAction / m.planksPerAction
                const gpPerXp = plankPrice !== null ? plankPrice / xpPerPlank + wagePerXp(m) : null
                const midRate = (m.xpPerHourLow + m.xpPerHourHigh) / 2
                return (
                  <tr key={m.name}>
                    <td>
                      <a href={wikiUrl(m.wikiPage)} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>
                        {m.name}
                      </a>
                      {m.recommended && (
                        <div style={{ marginTop: 3 }}>
                          <Tag kind={m.recommended === 'primary' ? 'gold' : m.recommended === 'budget' ? 'safe' : 'prayer'}>
                            {m.recommended === 'primary' ? '★ Fastest sane' : m.recommended === 'budget' ? 'Budget' : 'Relaxed'}
                          </Tag>
                        </div>
                      )}
                      {m.requirements && <div className="muted" style={{ fontSize: 11 }}>{m.requirements.join(' · ')}</div>}
                    </td>
                    <td className="num">{m.level}</td>
                    <td>
                      <ItemLink name={m.plankItem} label={`${m.planksPerAction % 1 ? '~' : ''}${Math.round(m.planksPerAction)} ×`} showPrice />
                    </td>
                    <td className="num">{formatNum(m.xpPerAction)}</td>
                    <td className="num">{xpPerPlank.toFixed(0)}</td>
                    <td className="num gp">{gpPerXp !== null ? gpPerXp.toFixed(1) : '—'}</td>
                    <td className="num">
                      {formatGp(m.xpPerHourLow)}–{formatGp(m.xpPerHourHigh)}
                    </td>
                    <td title={m.intensity}>{'●'.repeat(m.afkRating)}{'○'.repeat(5 - m.afkRating)}</td>
                    <td className="num">{xpLeft !== null ? formatHours(xpLeft / midRate) : '—'}</td>
                    <td className="num gp">{xpLeft !== null && gpPerXp !== null ? formatGp(xpLeft * gpPerXp) : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Note kind="warn">
          <strong>Recommended plan:</strong> mahogany tables as the workhorse (~850k xp/hr), gnome benches when you
          want to sweat (same gp/xp, ~1.1M/hr), Mahogany Homes Expert contracts on lazy nights — they cost ~60% less
          per xp and bank the 2,000 carpenter points that unlock the Hosidius house style anyway. Oak dungeon doors are
          the budget fallback. AFK dots: ● more = more AFK; hover for the click pattern.
        </Note>
      </SectionCard>

      {/* ── Butler loops ── */}
      <SectionCard title="Butler loops — inventories and step-by-step" icon="Demon butler">
        <p style={{ fontSize: 12.5, marginBottom: 4 }}>
          <a href={wikiUrl(demonButler.wikiPage)} target="_blank" rel="noreferrer" style={{ fontWeight: 700 }}>
            {demonButler.name}
          </a>{' '}
          — capacity {demonButler.capacity}, bank round-trip {demonButler.tripTicks} ticks (~7.2s), wage{' '}
          {demonButler.wage}. {demonButler.hire}
        </p>
        <Note kind="tip">
          <strong>Before you start:</strong> {demonButler.moneyBag}
        </Note>
        {trainingMethods
          .filter((m) => m.loop)
          .map((m) => (
            <div key={m.name}>
              <SubHead>
                {m.name} — {formatGp(m.xpPerHourLow)}–{formatGp(m.xpPerHourHigh)} xp/hr
              </SubHead>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <InventoryGrid slots={m.loop!.inventory} caption={m.intensity} emptyLabel="" />
                <ol className="loop-steps" style={{ flex: 1, minWidth: 280 }}>
                  {m.loop!.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
      </SectionCard>

      {/* ── Dream house builds ── */}
      <SectionCard title="The dream house — what to build and what it costs" icon="Construction cape">
        <p className="muted" style={{ fontSize: 12.5, marginBottom: 4 }}>
          Grouped by your three priorities. Material costs are live GE prices; rows marked "verify in-game" carry a
          quantity the wiki search pass couldn't pin down exactly — check the build menu before bulk-buying.
        </p>
        {pohBuildGroups.map((group) => (
          <div key={group.title}>
            <SubHead>{group.title}</SubHead>
            <p className="muted" style={{ fontSize: 12.5, marginBottom: 8 }}>{group.why}</p>
            {group.builds.map((b) => (
              <div key={b.name} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <a href={wikiUrl(b.wikiPage)} target="_blank" rel="noreferrer" style={{ fontWeight: 700, fontSize: 13.5 }}>
                    {b.name}
                  </a>
                  <Tag kind="gold">Level {b.level}</Tag>
                  {b.boostable && <Tag kind="neutral">boostable: {b.boostable}</Tag>}
                  {b.upgradesFrom && <span className="muted" style={{ fontSize: 11 }}>upgrades {b.upgradesFrom}</span>}
                  {b.unverified && <Tag kind="neutral">qty: verify in-game</Tag>}
                </div>
                <div style={{ fontSize: 12.5, marginBottom: 6 }}>{b.provides}</div>
                {b.requirements && (
                  <div className="muted" style={{ fontSize: 11.5, marginBottom: 6 }}>Requires: {b.requirements.join(' · ')}</div>
                )}
                <CostTable rows={b.materials} />
              </div>
            ))}
          </div>
        ))}
      </SectionCard>

      {/* ── Hosidius house style ── */}
      <SectionCard title="Hosidius house style — the 2026 route" icon="Hosidius blueprints">
        <Note kind="danger">
          <strong>The favour grind is gone.</strong> {hosidius.removalNote}
        </Note>
        <SubHead>Current unlock</SubHead>
        <ol className="loop-steps">
          {hosidius.currentUnlock.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <Note kind="tip">
          <strong>Time & xp:</strong> {hosidius.effort} {hosidius.note}
        </Note>
      </SectionCard>

      {/* ── Layout ── */}
      <SectionCard title="House layout — planners and placement" icon="Teleport to house (tablet)">
        <SubHead>Recommended tools</SubHead>
        <ul style={{ paddingLeft: '1.2rem', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {layoutTools.map((t) => (
            <li key={t.name}>
              <a href={t.url} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>{t.name}</a>
              <span className="muted"> — {t.note}</span>
            </li>
          ))}
        </ul>
        <SubHead>Placement principles (teleports · rejuvenation · spellbook)</SubHead>
        <ol className="loop-steps">
          {layoutAdvice.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ol>
      </SectionCard>

      {/* ── Sources ── */}
      <SectionCard title="Sources" icon="Book of knowledge">
        <p className="muted" style={{ fontSize: 12 }}>
          Every gameplay fact on this page was checked against these wiki pages during the build (July 2026). Rows
          flagged "verify in-game" had conflicting or unconfirmable quantities in the research pass.
        </p>
        <ul style={{ paddingLeft: '1.2rem', fontSize: 12, columns: 2, gap: '2rem' }}>
          {sources.map((s) => (
            <li key={s} style={{ breakInside: 'avoid' }}>
              <a href={s} target="_blank" rel="noreferrer">{s.replace('https://oldschool.runescape.wiki/w/', 'wiki/').replace(/_/g, ' ')}</a>
            </li>
          ))}
        </ul>
      </SectionCard>
    </ObjectiveLayout>
  )
}

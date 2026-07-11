// Goals & Notes — freeform per-user planning, persisted in localStorage.
import type { EquipSlotName } from '../../components/EquipmentLayout'

export interface EmbedBlock {
  id: string
  type: 'inventory' | 'loadout'
  title: string
  /** inventory: 28 slots of exact wiki item names ('' = empty) */
  slots?: string[]
  /** loadout: slot → exact wiki item name */
  set?: Partial<Record<EquipSlotName, string>>
}

export interface Goal {
  id: string
  title: string
  done: boolean
  notes: string
  blocks: EmbedBlock[]
  createdAt: number
}

export interface NoteDoc {
  id: string
  title: string
  tags: string[]
  body: string
  blocks: EmbedBlock[]
  updatedAt: number
}

export function uid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

export function emptyBlock(type: EmbedBlock['type']): EmbedBlock {
  return type === 'inventory'
    ? { id: uid(), type, title: 'Inventory', slots: Array(28).fill('') }
    : { id: uid(), type, title: 'Loadout', set: {} }
}

/** Every item name appearing in a block set/slots — used for search. */
export function blockItems(b: EmbedBlock): string[] {
  if (b.type === 'inventory') return (b.slots ?? []).filter(Boolean)
  return Object.values(b.set ?? {}).filter((v): v is string => !!v)
}

function describeBlocks(blocks: EmbedBlock[]): string {
  if (!blocks.length) return ''
  const lines = blocks.map((b) => {
    const items = blockItems(b)
    return `- ${b.type === 'inventory' ? 'Inventory' : 'Equipment loadout'} "${b.title}": ${items.length ? items.join(', ') : '(empty)'}`
  })
  return `\nATTACHED SETUPS:\n${lines.join('\n')}\n`
}

/** Builds the prompt that turns a short named goal into a full DashScape
 *  guide — aligned with the repo's Claude skills. Wire the button to
 *  clipboard now; longer-term it can post straight into a Claude session. */
export function buildClaudePrompt(goal: Goal): string {
  return `Use the DashScape skills: osrs-objective-builder (scaffold + schema), osrs-data-integrations (APIs), osrs-progress-review (my live stats).

Convert this short goal into a full, wiki-verified guide in my DashScape dashboard — same depth as the existing Max House and Slayer objectives:

GOAL: ${goal.title}
STATUS: ${goal.done ? 'done (retrospective/optimisation welcome)' : 'not started'}
MY NOTES:
${goal.notes.trim() || '(none)'}
${describeBlocks(goal.blocks)}
Requirements:
- Pull my live stats first (RSN "B 3 N N O" — \`npm run wiki -- --wom "b 3 n n o"\` or useWiseOldMan) and plan from where I actually am.
- Verify EVERY gameplay fact against the OSRS Wiki with \`npm run wiki -- "<Page>"\` (wikitext infoboxes are ground truth). No training memory, no web search unless fetch is blocked; flag anything unverifiable.
- Build it as src/objectives/<id>/{data.ts,<Id>Page.tsx} rendered through the shared components (ItemLink, InventoryGrid, EquipmentLayout, CostTable, MilestoneTable, SkillProgress) and register it in registry.tsx.
- Include: requirements (levels/quests/items), live-GE-priced cost tables, step-by-step methods with inventory/equipment mocks, milestones against my live xp, AFK/effort ratings where relevant, and a sources section.
- Keep npm run build green and update HANDOVER.md (verified vs assumed).`
}

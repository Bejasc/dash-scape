// Base gear setups migrated from Ben's previous slayer reference, plus a
// burst setup enabled by his Ancient Magicks unlock. These are loadout
// *recommendations* at his gear tier — task cards reference one of these
// and list task-specific swaps on top.
import type { EquipmentSet } from '../../components/EquipmentLayout'
import type { InventorySlot } from '../../components/InventoryGrid'

export interface GearSetup {
  id: 'melee' | 'blowpipe' | 'crossbow' | 'burst'
  title: string
  set: EquipmentSet
  inventory: InventorySlot[]
  prayerNote: string
  useFor: string
}

const baseUtility: InventorySlot[] = [
  { item: 'Slayer ring (8)', label: 'Slayer ring', tint: 'util' },
  { item: 'Rune pouch', tint: 'util' },
  { item: 'Teleport to house (tablet)', label: 'House tab', tint: 'util' },
]

export const gearSetups: GearSetup[] = [
  {
    id: 'melee',
    title: 'Melee',
    set: {
      head: { item: 'Slayer helmet (i)', label: 'Slayer helm (i)' },
      cape: { item: 'Fire cape' },
      neck: { item: 'Amulet of fury', label: 'Fury' },
      weapon: { item: 'Abyssal whip' },
      body: { item: 'Fighter torso', note: 'Upgrade: Bandos chestplate' },
      shield: { item: 'Dragon defender' },
      legs: { item: 'Bandos tassets' },
      hands: { item: 'Barrows gloves' },
      feet: { item: 'Dragon boots' },
      ring: { item: 'Berserker ring (i)' },
    },
    inventory: [
      { item: 'Super combat potion(4)', label: 'Super combat', tint: 'prayer' },
      { item: 'Prayer potion(4)', label: 'Prayer pot', repeat: 3, tint: 'prayer' },
      { item: 'Shark', repeat: 6, tint: 'food' },
      ...baseUtility,
    ],
    prayerNote: 'Piety on every melee task. Protect from Melee situationally on hard hitters.',
    useFor: 'Default for most tasks — whip slash/crush targets.',
  },
  {
    id: 'blowpipe',
    title: 'Ranged — Blowpipe',
    set: {
      head: { item: 'Slayer helmet (i)', label: 'Slayer helm (i)' },
      cape: { item: "Ava's accumulator" },
      neck: { item: 'Amulet of fury', label: 'Fury' },
      ammo: { item: 'Dragon dart', label: 'Dragon darts', note: 'Budget: adamant/mithril darts' },
      weapon: { item: 'Toxic blowpipe', iconName: 'Toxic blowpipe (empty)' },
      body: { item: "Guthix d'hide body", label: "Blessed d'hide body" },
      legs: { item: 'Guthix chaps', label: "Blessed d'hide chaps" },
      hands: { item: 'Barrows gloves' },
      feet: { item: "Guthix d'hide boots", label: "D'hide boots" },
      ring: { item: 'Archers ring (i)' },
    },
    inventory: [
      { item: 'Ranging potion(4)', label: 'Ranging pot', tint: 'prayer' },
      { item: 'Prayer potion(4)', label: 'Prayer pot', repeat: 3, tint: 'prayer' },
      { item: 'Shark', repeat: 6, tint: 'food' },
      ...baseUtility,
    ],
    prayerNote: 'Eagle Eye (or Rigour when unlocked) + overhead per task.',
    useFor: 'Fast kills on low-defence targets; ranged-only monsters (Aviansies).',
  },
  {
    id: 'crossbow',
    title: 'Ranged — Crossbow',
    set: {
      head: { item: 'Slayer helmet (i)', label: 'Slayer helm (i)' },
      cape: { item: "Ava's accumulator" },
      neck: { item: 'Amulet of fury', label: 'Fury' },
      ammo: { item: 'Diamond bolts (e)', note: 'Broad bolts on Kurask' },
      weapon: { item: 'Rune crossbow' },
      body: { item: "Guthix d'hide body", label: "Blessed d'hide body" },
      shield: { item: 'Book of balance', label: 'God book / DFS slot' },
      legs: { item: 'Guthix chaps', label: "Blessed d'hide chaps" },
      hands: { item: 'Barrows gloves' },
      feet: { item: "Guthix d'hide boots", label: "D'hide boots" },
      ring: { item: 'Archers ring (i)' },
    },
    inventory: [
      { item: 'Ranging potion(4)', label: 'Ranging pot', tint: 'prayer' },
      { item: 'Prayer potion(4)', label: 'Prayer pot', repeat: 3, tint: 'prayer' },
      { item: 'Shark', repeat: 6, tint: 'food' },
      ...baseUtility,
    ],
    prayerNote: 'Eagle Eye + overhead per task.',
    useFor: 'Safe-spotting, high-defence targets, and shield-required tasks (dragonfire, wyverns).',
  },
  {
    id: 'burst',
    title: 'Magic — Ice Burst/Barrage',
    set: {
      head: { item: 'Slayer helmet (i)', label: 'Slayer helm (i)' },
      cape: { item: 'Imbued saradomin cape', label: 'Imbued god cape' },
      neck: { item: 'Occult necklace', note: 'Budget: Amulet of fury' },
      weapon: { item: 'Ancient staff', note: 'Upgrade: Kodai wand' },
      body: { item: 'Mystic robe top', note: "Upgrade: Ahrim's robetop" },
      shield: { item: 'Malediction ward', note: 'Budget: Unholy book / tome' },
      legs: { item: 'Mystic robe bottom' },
      hands: { item: 'Barrows gloves' },
      feet: { item: 'Wizard boots', note: 'Upgrade: Eternal boots' },
      ring: { item: 'Seers ring (i)', note: 'Budget: any' },
    },
    inventory: [
      { item: 'Saradomin brew(4)', label: 'Sara brew', repeat: 2, tint: 'food' },
      { item: 'Super restore(4)', label: 'Super restore', repeat: 4, tint: 'prayer' },
      { item: 'Prayer potion(4)', label: 'Prayer pot', repeat: 2, tint: 'prayer' },
      { item: 'Death rune', label: 'Burst runes', tint: 'key' },
      { item: 'Chaos rune', label: 'Burst runes', tint: 'key' },
      { item: 'Water rune', label: 'Burst runes', tint: 'key' },
      ...baseUtility,
    ],
    prayerNote: 'Mystic Might (or Augury when unlocked) + Protect from Melee while stacked monsters wail on you.',
    useFor: 'AoE tasks in the Catacombs — Dust devils, Nechryael, Smoke devils, Warped creatures. Stack, freeze, profit.',
  },
]

export const inventoryLegend = [
  { tint: 'prayer' as const, label: 'Potions / prayer' },
  { tint: 'food' as const, label: 'Food' },
  { tint: 'util' as const, label: 'Utility / teleports' },
  { tint: 'key' as const, label: 'Task-critical' },
]

/** Extras referenced by task cards — shown as swap-in suggestions. */
export const commonExtras: Record<string, { item: string; note: string }> = {
  'Herb sack': { item: 'Herb sack', note: '750 slayer points + 58 Herblore. Holds 30 of each grimy herb — near-mandatory on herb-dropping tasks.' },
  'Alch runes': { item: 'Nature rune', note: 'Rune pouch with Nature + Fire runes — high-alch rune/bar drops on task.' },
  'Cannon': { item: 'Cannon barrels', note: 'Dwarf multicannon + 2,000–3,000 cannonballs. Multi-combat tasks only.' },
  'Bonecrusher': { item: 'Bonecrusher', note: 'Hard Morytania diary. In the Catacombs, restores prayer per bone — free prayer pots.' },
  'Ash sanctifier': { item: 'Ash sanctifier', note: 'Hard Kourend & Kebos diary. Passive prayer xp from demonic ashes.' },
  'Holy wrench': { item: 'Holy wrench', note: 'Rum Deal quest. Extra prayer points per sip on prayer-heavy tasks.' },
  'Expeditious bracelet': { item: 'Expeditious bracelet', note: '25% chance a kill counts twice — speed through bad tasks.' },
  'Bracelet of slaughter': { item: 'Bracelet of slaughter', note: '25% chance a kill doesn\'t count — stretch great tasks.' },
}

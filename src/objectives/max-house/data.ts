// Max House objective — wiki-verified game data.
// Every number here was checked against the OSRS Wiki (see `sources` and the
// per-entry source fields). Facts that could not be fully confirmed carry
// `unverified: true` and render with a caveat.
import type { InventorySlot } from '../../components/InventoryGrid'
import type { CostRow } from '../../components/CostTable'

// ── Training methods ─────────────────────────────────────────────────────

export interface TrainingMethod {
  name: string
  wikiPage: string
  level: number
  xpPerAction: number
  planksPerAction: number
  /** Exact GE item name for live pricing */
  plankItem: string
  /** Non-plank per-action extras (rare) */
  extraCostNote?: string
  xpPerHourLow: number
  xpPerHourHigh: number
  /** 1 = sweatiest, 5 = most AFK */
  afkRating: number
  intensity: string
  requirements?: string[]
  usesButler: boolean
  loop?: { inventory: InventorySlot[]; steps: string[] }
  notes: string
  recommended?: 'primary' | 'budget' | 'relaxed'
  source: string
  unverified?: boolean
}

export const trainingMethods: TrainingMethod[] = [
  {
    name: 'Mahogany tables',
    wikiPage: 'Mahogany table',
    level: 52,
    xpPerAction: 840,
    planksPerAction: 6,
    plankItem: 'Mahogany plank',
    xpPerHourLow: 800_000,
    xpPerHourHigh: 900_000,
    afkRating: 2,
    intensity: 'High — an action every 1–2 game ticks during the build/remove burst; capped near 900k xp/hr by the single Dining Room hotspot.',
    usesButler: true,
    recommended: 'primary',
    loop: {
      inventory: [
        { item: 'Hammer', tint: 'util' },
        { item: 'Saw', tint: 'util' },
        { item: 'Coins', label: 'Coins (wages)', qty: 100_000, tint: 'util' },
        { item: 'Mahogany plank', qty: 24, repeat: 24, tint: 'key' },
      ],
      steps: [
        'Stand at the Dining Room table hotspot. Keep the Servant\'s money bag stocked so wage prompts never interrupt (10,000 gp per 8 trips, auto-paid).',
        'Send the demon butler to fetch 24 mahogany planks — exactly 4 tables\' worth, under his 26-item capacity. His round trip is 12 ticks; the full cycle is ~22 ticks on low ping.',
        'While he banks: build 3 tables and remove 2 (low ping). On higher ping use build 2 / remove 2, or remove 3 / build 2.',
        'When he returns, take the planks and re-send him immediately — the re-send click is the loop\'s heartbeat.',
        'If he idles elsewhere, use House Options → Call Servant to summon him instantly.',
      ],
    },
    notes:
      'The standard GE-buyer meta from 52 to 77 and a saner alternative to gnome benches after. 140 xp per plank.',
    source: 'https://oldschool.runescape.wiki/w/Mahogany_table',
  },
  {
    name: 'Gnome benches (Superior Garden)',
    wikiPage: 'Gnome bench',
    level: 77,
    xpPerAction: 840,
    planksPerAction: 6,
    plankItem: 'Mahogany plank',
    xpPerHourLow: 1_000_000,
    xpPerHourHigh: 1_150_000,
    afkRating: 1,
    intensity: 'Maximum — two adjacent seating hotspots let you build one bench while removing the other with near-constant perfectly-timed clicks. Fastest Construction xp in the game; very hard to sustain a full hour.',
    requirements: ['65 Construction for the Superior Garden room itself'],
    usesButler: true,
    loop: {
      inventory: [
        { item: 'Hammer', tint: 'util' },
        { item: 'Saw', tint: 'util' },
        { item: 'Coins', label: 'Coins (wages)', qty: 100_000, tint: 'util' },
        { item: 'Mahogany plank', qty: 24, repeat: 24, tint: 'key' },
      ],
      steps: [
        'Build a Superior Garden (65 Construction) — it has two adjacent seating spaces.',
        'Send the demon butler for 24 mahogany planks.',
        'Alternate: build a gnome bench on one hotspot while removing the bench on the other, back-to-back with no dead time.',
        'Collect planks on the butler\'s return and re-send immediately.',
      ],
    },
    notes:
      'Identical 6 planks / 840 xp to tables, so identical gp/xp — you pay only in focus. Use for burst sessions; drop back to tables when tired.',
    source: 'https://oldschool.runescape.wiki/w/Gnome_bench',
  },
  {
    name: 'Oak dungeon doors',
    wikiPage: 'Oak door',
    level: 74,
    xpPerAction: 600,
    planksPerAction: 10,
    plankItem: 'Oak plank',
    xpPerHourLow: 350_000,
    xpPerHourHigh: 550_000,
    afkRating: 3,
    intensity: 'Moderate — the Dungeon corridor\'s two adjacent door hotspots need minimal mouse movement; a popular keyboard-heavy method.',
    requirements: ['74 Construction', 'A Dungeon corridor room'],
    usesButler: true,
    recommended: 'budget',
    loop: {
      inventory: [
        { item: 'Hammer', tint: 'util' },
        { item: 'Saw', tint: 'util' },
        { item: 'Coins', label: 'Coins (wages)', qty: 100_000, tint: 'util' },
        { item: 'Oak plank', qty: 20, repeat: 20, tint: 'key' },
      ],
      steps: [
        'Build a Dungeon corridor — it has two door hotspots side by side.',
        'Send the demon butler for 20 oak planks (2 doors\' worth).',
        'Build both oak doors (10 planks / 600 xp each) while he banks, then remove both.',
        'Collect planks, re-send, repeat.',
      ],
    },
    notes:
      'Same 60 xp per oak plank as larders but far better xp/hr — the cheap-gp/xp sweet spot when mahogany feels too expensive.',
    source: 'https://oldschool.runescape.wiki/w/Oak_door',
  },
  {
    name: 'Oak larders',
    wikiPage: 'Oak larder',
    level: 33,
    xpPerAction: 480,
    planksPerAction: 8,
    plankItem: 'Oak plank',
    xpPerHourLow: 380_000,
    xpPerHourHigh: 480_000,
    afkRating: 3,
    intensity: 'Moderate — one Kitchen hotspot, a few clicks every ~5–7 seconds.',
    usesButler: true,
    notes:
      'The classic low-level workhorse. At your level it is outclassed by oak dungeon doors (same gp/xp, better rates) — listed for completeness.',
    source: 'https://oldschool.runescape.wiki/w/Construction_training',
  },
  {
    name: 'Mounted mythical capes',
    wikiPage: 'Mythical cape (mounted)',
    level: 47,
    xpPerAction: 370,
    planksPerAction: 3,
    plankItem: 'Teak plank',
    extraCostNote: 'One Mythical cape (returned on removal — buy once)',
    xpPerHourLow: 300_000,
    xpPerHourHigh: 430_000,
    afkRating: 3,
    intensity: 'Moderate — 3 planks per action means each butler trip covers many mounts.',
    requirements: ['Dragon Slayer II completed (Myths\' Guild access to buy the Mythical cape)'],
    usesButler: true,
    notes:
      '123.3 xp per teak plank (vs 90 for normal teak furniture) makes this the classic cheap-gp/xp method — roughly a third of mahogany\'s cost per xp at typical prices.',
    source: 'https://oldschool.runescape.wiki/w/Mythical_cape_(mounted)',
  },
  {
    name: 'Mahogany Homes (Expert contracts)',
    wikiPage: 'Mahogany Homes',
    level: 70,
    xpPerAction: 4378.8,
    planksPerAction: 12.7,
    plankItem: 'Mahogany plank',
    extraCostNote: 'Some fixtures also take steel bars',
    xpPerHourLow: 165_000,
    xpPerHourHigh: 270_000,
    afkRating: 4,
    intensity: 'Low — travel between client houses and fix marked hotspots; no butler micromanagement. 50–60 contracts/hr with a plank sack and good teleports.',
    usesButler: false,
    recommended: 'relaxed',
    loop: {
      inventory: [
        { item: 'Hammer', tint: 'util' },
        { item: 'Saw', tint: 'util' },
        { item: 'Steel bar', qty: 4, repeat: 4, tint: 'key' },
        { item: 'Plank sack', tint: 'util' },
        { item: 'Mahogany plank', qty: 20, repeat: 20, tint: 'key' },
        { item: 'Rune pouch', label: 'NPC Contact runes', tint: 'util' },
        { item: 'Teleport to house (tablet)', label: 'House tabs', qty: 8, tint: 'util' },
      ],
      steps: [
        'Speak to Amy (or use Lunar NPC Contact) for an Expert contract — level 70+, mahogany planks.',
        'Teleport to the client\'s house (Falador / Varrock / Ardougne / Hosidius) and repair or build every marked hotspot.',
        'Talk to the client for the completion bonus and 5 carpenter points.',
        'Average 4,378.8 xp per Expert contract. Repeat.',
      ],
    },
    notes:
      '346.1 xp per mahogany plank including bonuses — ~2.4× the xp-per-plank of tables, so roughly 40% of the gp/xp, at the cost of much slower rates. Also the only source of carpenter points: Plank sack (350), Hosidius blueprints (2,000), Carpenter\'s outfit (+2.5% xp). The loop numbers here are per-contract averages.',
    source: 'https://oldschool.runescape.wiki/w/Mahogany_Homes',
  },
]

export const demonButler = {
  name: 'Alathazdrar, the demon butler',
  wikiPage: 'Demon butler',
  hire: 'Servants\' Guild, East Ardougne. Requires 50 Construction and two bedrooms with beds.',
  wage: '10,000 gp per 8 uses (1,250 gp per trip)',
  capacity: 26,
  tripTicks: 12,
  moneyBag:
    'Build a Servant\'s money bag in a Bedroom (58 Construction, 595 xp). Holds up to 3M coins and auto-pays the wage every 8th trip so training never stops.',
  wagePerTrip: 1250,
  source: 'https://oldschool.runescape.wiki/w/Demon_butler',
}

// ── Hosidius house style (favour is gone) ────────────────────────────────

export const hosidius = {
  favourRemoved: true,
  removalNote:
    'The Kourend favour system was removed from the game on 10 January 2024 — the old "grind 100% Hosidius favour" route no longer exists.',
  currentUnlock: [
    'Earn 2,000 Carpenter points from Mahogany Homes contracts (Expert contracts give 5 points each — roughly 400 contracts; Adept give 4).',
    'Buy Hosidius blueprints from Amy in Falador for those 2,000 points.',
    'Take the blueprints to any Estate agent and redecorate for 5,000 gp (blueprints consumed; the style stays permanently unlocked, 5,000 gp to switch back later).',
  ],
  effort:
    'At 50–60 contracts/hr, 2,000 points ≈ 7–8 hours of Mahogany Homes — which also banks roughly 1.5–2M Construction xp at Expert rates while you earn it.',
  note:
    'Do this grind as your "relaxed nights" training and the theme pays for itself in xp.',
  source: 'https://oldschool.runescape.wiki/w/Hosidius_blueprints',
}

// ── POH builds — the "dream house" checklist ─────────────────────────────
// Priorities: teleports, rejuvenation, spellbook switching.

export interface PohBuild {
  name: string
  wikiPage: string
  level: number
  /** Boosted level note, e.g. "82 with crystal saw + spicy stew" */
  boostable?: string
  room: string
  materials: CostRow[]
  provides: string
  requirements?: string[]
  /** Name of the tier this is built by upgrading */
  upgradesFrom?: string
  /** True when some material counts could not be fully wiki-verified */
  unverified?: boolean
  source: string
}

export interface PohBuildGroup {
  title: string
  icon: string
  why: string
  builds: PohBuild[]
}

export const pohBuildGroups: PohBuildGroup[] = [
  {
    title: 'Rejuvenation — Superior Garden pool',
    icon: 'Ornate rejuvenation pool icon',
    why: 'One click restores everything between tasks. The Ornate pool at 90 is the single biggest quality-of-life build in the game.',
    builds: [
      {
        name: 'Superior Garden (room)',
        wikiPage: 'Superior garden',
        level: 65,
        room: '—',
        materials: [{ item: 'Coins', qty: 75_000, fixedPrice: 1, note: 'Room cost paid to build' }],
        provides: 'The room holding the pool space and a teleport space.',
        source: 'https://oldschool.runescape.wiki/w/Superior_garden',
      },
      {
        name: 'Restoration pool',
        wikiPage: 'Restoration pool',
        level: 65,
        room: 'Superior Garden',
        materials: [
          { item: 'Limestone brick', qty: 5 },
          { item: 'Bucket of water', qty: 5 },
          { item: 'Soul rune', qty: 1000 },
          { item: 'Body rune', qty: 1000 },
        ],
        provides: 'Restores special attack energy.',
        source: 'https://oldschool.runescape.wiki/w/Restoration_pool',
      },
      {
        name: 'Revitalisation pool',
        wikiPage: 'Revitalisation pool',
        level: 70,
        room: 'Superior Garden',
        upgradesFrom: 'Restoration pool',
        materials: [{ item: 'Super energy(4)', qty: 10, note: 'Quantity per wiki; conflicting search snippets — treat as approximate' }],
        provides: '+ run energy.',
        unverified: true,
        source: 'https://oldschool.runescape.wiki/w/Revitalisation_pool',
      },
      {
        name: 'Rejuvenation pool',
        wikiPage: 'Rejuvenation pool',
        level: 80,
        room: 'Superior Garden',
        upgradesFrom: 'Revitalisation pool',
        materials: [{ item: 'Prayer potion(4)', qty: 10, note: 'Quantity per wiki; verify in-game before buying' }],
        provides: '+ prayer points.',
        unverified: true,
        source: 'https://oldschool.runescape.wiki/w/Rejuvenation_pool',
      },
      {
        name: 'Fancy rejuvenation pool',
        wikiPage: 'Fancy rejuvenation pool',
        level: 85,
        boostable: '77 with crystal saw + spicy stew',
        room: 'Superior Garden',
        upgradesFrom: 'Rejuvenation pool',
        materials: [
          { item: 'Marble block', qty: 2 },
          { item: 'Anti-venom(4)', qty: 10, note: 'Per wiki; one source attributed super restores here — verify in-game' },
        ],
        provides: '+ restores reduced stats (except HP).',
        unverified: true,
        source: 'https://oldschool.runescape.wiki/w/Fancy_rejuvenation_pool',
      },
      {
        name: 'Ornate rejuvenation pool',
        wikiPage: 'Ornate rejuvenation pool',
        level: 90,
        boostable: '82 with crystal saw (+3) + spicy stew (+5)',
        room: 'Superior Garden',
        upgradesFrom: 'Fancy rejuvenation pool',
        materials: [
          { item: 'Gold leaf', qty: 5 },
          { item: 'Blood rune', qty: 1000 },
          { item: 'Super restore(4)', qty: 10, note: 'Listed by one source for this tier — verify in-game' },
        ],
        provides: 'Full restore: HP, prayer, run, special attack, all stats; cures poison/venom/disease/bleeds; resets surge potion cooldown.',
        unverified: true,
        source: 'https://oldschool.runescape.wiki/w/Ornate_rejuvenation_pool',
      },
    ],
  },
  {
    title: 'Spellbook switching — Occult altar',
    icon: 'Occult altar icon',
    why: 'Switch between Standard, Ancient, Lunar and Arceuus at will. You have all three quest unlocks ✓ (Desert Treasure I, Lunar Diplomacy, Arceuus via Tyss) — you can use every book the day you build it.',
    builds: [
      {
        name: 'Achievement Gallery (room)',
        wikiPage: 'Achievement gallery',
        level: 80,
        room: '—',
        materials: [{ item: 'Coins', qty: 200_000, fixedPrice: 1, note: 'Room cost' }],
        provides: 'Holds the altar, jewellery box and boss lair hotspots. (Room is level 80 — not 91 as often misremembered; 91 is only the Ornate jewellery box.)',
        source: 'https://oldschool.runescape.wiki/w/Achievement_gallery',
      },
      {
        name: 'Lunar altar (recommended first tier)',
        wikiPage: 'Lunar altar',
        level: 80,
        room: 'Achievement Gallery',
        materials: [
          { item: 'Limestone brick', qty: 10 },
          { item: 'Magic stone', qty: 1 },
          { item: 'Astral rune', qty: 10_000 },
          { item: 'Lunar signet', qty: 1, fixedPrice: 2, note: "Baba Yaga's Magic Shop, 2 gp, after Lunar Diplomacy ✓" },
        ],
        provides: 'Standard ↔ Lunar switching. (Ancient altar and Dark altar are the same idea for Ancient/Arceuus — build whichever single book you want first, or go straight to Occult if you have the level.)',
        source: 'https://oldschool.runescape.wiki/w/Lunar_altar',
      },
      {
        name: 'Occult altar',
        wikiPage: 'Occult altar',
        level: 90,
        boostable: '82 with crystal saw + spicy stew',
        room: 'Achievement Gallery',
        upgradesFrom: 'Any of Ancient/Lunar/Dark altar (80)',
        materials: [
          { item: 'Ancient signet', qty: 1, fixedPrice: 0, note: 'Free from Eblis after Desert Treasure I ✓' },
          { item: 'Lunar signet', qty: 1, fixedPrice: 2, note: "Baba Yaga, 2 gp ✓" },
          { item: 'Arceuus signet', qty: 1, fixedPrice: 0, note: 'From Tyss — no favour requirement since Jan 2024 ✓' },
          { item: 'Astral rune', qty: 10_000 },
          { item: 'Blood rune', qty: 5000 },
          { item: 'Soul rune', qty: 5000 },
        ],
        provides: 'All four spellbooks at one altar. You only pay for components not already spent on the tier you upgrade from (e.g. upgrading the Lunar altar skips the astral runes).',
        requirements: [
          'Switching to a book still requires its unlock: Desert Treasure I (Ancient) ✓, Lunar Diplomacy (Lunar) ✓, Arceuus via Tyss ✓ — you cannot switch to a book you have not unlocked.',
        ],
        source: 'https://oldschool.runescape.wiki/w/Occult_altar',
      },
    ],
  },
  {
    title: 'Teleports — Ornate jewellery box',
    icon: 'Ornate jewellery box icon',
    why: 'Every jewellery teleport in the game, free, forever: dueling, games, combat bracelet, skills necklace, glory and ring of wealth destinations.',
    builds: [
      {
        name: 'Basic jewellery box',
        wikiPage: 'Basic jewellery box',
        level: 81,
        room: 'Achievement Gallery',
        materials: [
          { item: 'Bolt of cloth', qty: 1 },
          { item: 'Steel bar', qty: 1 },
          { item: 'Ring of dueling(8)', qty: 3 },
          { item: 'Games necklace(8)', qty: 3 },
        ],
        provides: 'Ring of dueling (PvP Arena, Castle Wars, Ferox Enclave) + games necklace (Burthorpe, Barbarian Outpost, Corporeal Beast, Tears of Guthix, Wintertodt) teleports.',
        source: 'https://oldschool.runescape.wiki/w/Basic_jewellery_box',
      },
      {
        name: 'Fancy jewellery box',
        wikiPage: 'Fancy jewellery box',
        level: 86,
        boostable: '78 with crystal saw + spicy stew',
        room: 'Achievement Gallery',
        upgradesFrom: 'Basic jewellery box',
        materials: [
          { item: 'Gold leaf', qty: 1, note: 'Item verified; qty follows the wiki pattern — verify in-game' },
          { item: 'Combat bracelet(4)', qty: 3, note: 'Charged (4) variants required' },
          { item: 'Skills necklace(4)', qty: 3, note: 'Charged (4) variants required' },
        ],
        provides: '+ combat bracelet (Warriors\'/Champions\' Guild, Monastery, Ranging Guild) and skills necklace (Fishing/Mining/Crafting/Cooking/Woodcutting/Farming Guild) teleports.',
        unverified: true,
        source: 'https://oldschool.runescape.wiki/w/Fancy_jewellery_box',
      },
      {
        name: 'Ornate jewellery box',
        wikiPage: 'Ornate jewellery box',
        level: 91,
        boostable: '83 with crystal saw + spicy stew',
        room: 'Achievement Gallery',
        upgradesFrom: 'Fancy jewellery box',
        materials: [
          { item: 'Gold leaf', qty: 2, note: 'Item verified; qty per wiki pattern — verify in-game' },
          { item: 'Amulet of glory(4)', qty: 3, note: 'Regular charged glories — eternal glory NOT required' },
          { item: 'Ring of wealth (5)', qty: 3 },
        ],
        provides: '+ amulet of glory (Edgeville, Karamja, Draynor, Al Kharid) and ring of wealth (Grand Exchange, Miscellania, Falador Park, Dondakan) — unlimited uses of everything.',
        unverified: true,
        source: 'https://oldschool.runescape.wiki/w/Ornate_jewellery_box',
      },
    ],
  },
  {
    title: 'Teleports — Portal Nexus',
    icon: 'Portal nexus icon',
    why: 'One object holding up to 41 spell teleports (1,000× the runes each, paid once, unlimited casts). With Ancient + Lunar unlocked ✓ you can load it with Kharyrll, Waterbirth, Catherby and more.',
    builds: [
      {
        name: 'Portal Nexus (room)',
        wikiPage: 'Portal nexus',
        level: 72,
        room: '—',
        materials: [{ item: 'Coins', qty: 200_000, fixedPrice: 1, note: 'Room cost' }],
        provides: 'The nexus hotspot plus two wall-mount hotspots (Xeric\'s talisman, Digsite pendant).',
        source: 'https://oldschool.runescape.wiki/w/Portal_nexus',
      },
      {
        name: 'Marble portal nexus',
        wikiPage: 'Marble portal nexus',
        level: 72,
        room: 'Portal Nexus',
        materials: [{ item: 'Marble block', qty: 4, note: 'Qty per wiki — verify in-game' }],
        provides: 'Up to 4 teleport destinations.',
        unverified: true,
        source: 'https://oldschool.runescape.wiki/w/Portal_nexus',
      },
      {
        name: 'Gilded portal nexus',
        wikiPage: 'Gilded portal nexus',
        level: 82,
        room: 'Portal Nexus',
        upgradesFrom: 'Marble portal nexus',
        materials: [
          { item: 'Marble block', qty: 4, note: 'Qty per wiki — verify in-game' },
          { item: 'Gold leaf', qty: 2, note: 'Qty per wiki — verify in-game' },
        ],
        provides: 'More destinations (wiki lists the exact cap).',
        unverified: true,
        source: 'https://oldschool.runescape.wiki/w/Portal_nexus',
      },
      {
        name: 'Crystalline portal nexus',
        wikiPage: 'Crystalline portal nexus',
        level: 92,
        room: 'Portal Nexus',
        upgradesFrom: 'Gilded portal nexus',
        materials: [
          { item: 'Magic stone', qty: 2, note: 'Qty per wiki — verify in-game' },
          { item: 'Gold leaf', qty: 2, note: 'Qty per wiki — verify in-game' },
        ],
        provides: 'Up to 41 destinations — the everything-portal.',
        unverified: true,
        source: 'https://oldschool.runescape.wiki/w/Portal_nexus',
      },
      {
        name: "Mounted Xeric's talisman",
        wikiPage: "Xeric's talisman",
        level: 72,
        room: 'Portal Nexus (wall)',
        materials: [
          { item: 'Mahogany plank', qty: 1 },
          { item: 'Gold leaf', qty: 1 },
          { item: "Xeric's talisman (inert)", qty: 1 },
        ],
        provides: 'Unlimited Kourend teleports (Lookout, Glade, Inferno, Heart, Honour) — your Catacombs slayer commute.',
        unverified: true,
        source: 'https://oldschool.runescape.wiki/w/Portal_nexus',
      },
      {
        name: 'Mounted Digsite pendant',
        wikiPage: 'Digsite pendant',
        level: 82,
        room: 'Portal Nexus (wall)',
        materials: [
          { item: 'Mahogany plank', qty: 1 },
          { item: 'Gold leaf', qty: 1 },
          { item: 'Digsite pendant (5)', qty: 1 },
        ],
        provides: 'Unlimited Digsite / Fossil Island teleports (wyvern tasks).',
        unverified: true,
        source: 'https://oldschool.runescape.wiki/w/Portal_nexus',
      },
    ],
  },
  {
    title: 'Transport networks — Spirit tree & fairy ring',
    icon: 'Spirit tree & fairy ring icon',
    why: 'Both travel networks on one tile in your Superior Garden. You have fairy rings and spirit trees unlocked ✓ — the only gates are 95 Construction and 83 Farming.',
    builds: [
      {
        name: 'Spirit tree',
        wikiPage: 'Spirit tree (Construction)',
        level: 75,
        room: 'Superior Garden (teleport space)',
        requirements: ['83 Farming', 'Watering can', 'Tree Gnome Village + The Grand Tree ✓'],
        materials: [{ item: 'Spirit sapling', qty: 1, fixedPrice: 0, note: 'Untradeable — grow from a Spirit seed (bird nests, wyson) in a plant pot' }],
        provides: 'Spirit tree network from home.',
        source: 'https://oldschool.runescape.wiki/w/Spirit_tree_(Construction)',
      },
      {
        name: 'Fairy ring',
        wikiPage: 'Fairy ring (Construction)',
        level: 85,
        boostable: '80 with spicy stew (crystal saw does not apply — no saw involved)',
        room: 'Superior Garden (teleport space)',
        requirements: ['Fairytale II started ✓'],
        materials: [
          { item: 'Fairy enchantment', qty: 1, fixedPrice: 0, note: 'Bought from Fairy Fixit (cost unverified)' },
          { item: 'Mushroom', qty: 10 },
        ],
        provides: 'Fairy ring network from home (code DIQ). Requires a watering can with water (not consumed).',
        source: 'https://oldschool.runescape.wiki/w/Fairy_ring_(Construction)',
      },
      {
        name: 'Spirit tree & fairy ring',
        wikiPage: 'Spirit tree & fairy ring',
        level: 95,
        room: 'Superior Garden (teleport space)',
        requirements: ['83 Farming', 'Watering can', 'Fairytale II started ✓'],
        materials: [
          { item: 'Spirit sapling', qty: 1, fixedPrice: 0, note: 'Untradeable — grow from a Spirit seed' },
          { item: 'Fairy enchantment', qty: 1, fixedPrice: 0, note: 'Fairy Fixit' },
          { item: 'Mushroom', qty: 10 },
        ],
        provides: 'Both networks on one tile (885 Construction AND Farming xp). Alternative: two separate superior gardens with one each (75 + 85).',
        source: 'https://oldschool.runescape.wiki/w/Spirit_tree_&_fairy_ring',
      },
    ],
  },
  {
    title: 'Worth adding along the way',
    icon: 'Gilded altar icon',
    why: 'Not teleport/rejuvenation/spellbook, but standard parts of a max house.',
    builds: [
      {
        name: 'Gilded altar + incense burners',
        wikiPage: 'Gilded altar',
        level: 75,
        room: 'Chapel',
        materials: [
          { item: 'Marble block', qty: 2 },
          { item: 'Gold leaf', qty: 4 },
          { item: 'Bolt of cloth', qty: 2 },
        ],
        provides: '350% Prayer xp per bone with both burners lit (clean marrentill). The classic prayer trainer.',
        source: 'https://oldschool.runescape.wiki/w/Gilded_altar',
      },
      {
        name: 'Mounted amulet of glory',
        wikiPage: 'Amulet of Glory (mounted)',
        level: 47,
        room: 'Quest Hall',
        materials: [
          { item: 'Teak plank', qty: 3 },
          { item: 'Amulet of glory', qty: 1, note: 'Uncharged' },
        ],
        provides: 'Unlimited Edgeville / Karamja / Draynor / Al Kharid teleports until the jewellery box replaces it.',
        source: 'https://oldschool.runescape.wiki/w/Amulet_of_Glory_(mounted)',
      },
      {
        name: 'Menagerie',
        wikiPage: 'Menagerie',
        level: 37,
        room: '—',
        materials: [{ item: 'Coins', qty: 30_000, fixedPrice: 1, note: 'Room cost' }],
        provides: 'Pet storage and display.',
        source: 'https://oldschool.runescape.wiki/w/Menagerie',
      },
    ],
  },
]

// ── Construction milestones (verified levels) ────────────────────────────

export const milestones: { level: number; title: string; detail?: string }[] = [
  { level: 37, title: 'Menagerie', detail: 'Pet storage (30k room)' },
  { level: 47, title: 'Mounted glory + Mythical cape mount', detail: 'Early teleports; cape mount is the cheap-xp method (needs DS2)' },
  { level: 50, title: 'Portal chamber', detail: '3 portals at 100× rune cost each' },
  { level: 65, title: 'Superior Garden + Restoration pool', detail: 'Spec restore; the pool chain begins' },
  { level: 70, title: 'Revitalisation pool', detail: '+ run energy · also Mahogany Homes Expert contracts' },
  { level: 72, title: 'Portal Nexus room + Marble nexus', detail: "4 destinations · Mounted Xeric's talisman (Kourend/Catacombs)" },
  { level: 75, title: 'Gilded altar · Spirit tree', detail: '350% prayer xp · spirit tree needs 83 Farming' },
  { level: 80, title: 'Achievement Gallery · Rejuvenation pool · single-book altars', detail: 'Ancient/Lunar/Dark altars (one spellbook each) · pool restores prayer · Obelisk' },
  { level: 81, title: 'Basic jewellery box', detail: 'Dueling + games necklace teleports' },
  { level: 82, title: 'Gilded portal nexus · Mounted Digsite pendant' },
  { level: 85, title: 'Fancy rejuvenation pool · Fairy ring', detail: 'Pool restores stats · fairy ring boostable to 80 with spicy stew' },
  { level: 86, title: 'Fancy jewellery box', detail: '+ combat bracelet & skills necklace teleports' },
  { level: 90, title: 'Ornate rejuvenation pool · OCCULT ALTAR', detail: 'Full one-click restore · all four spellbooks (both boostable to 82)' },
  { level: 91, title: 'Ornate jewellery box', detail: 'Every jewellery teleport, unlimited (boostable to 83)' },
  { level: 92, title: 'Crystalline portal nexus', detail: 'Up to 41 spell teleports in one object' },
  { level: 95, title: 'Spirit tree & fairy ring', detail: 'Both networks, one tile — the last big unlock' },
  { level: 99, title: 'Max Construction', detail: 'Skill cape (+ Crafting Guild teleport perk)' },
]

// ── Layout planners & guides ─────────────────────────────────────────────

export const layoutTools = [
  {
    name: 'OSRS Toolkit — POH Planner',
    url: 'https://osrstoolkit.com/tools/house-planner/',
    note: 'Interactive grid planner: place and rotate rooms across floors, tracks room cap and build costs.',
  },
  {
    name: 'OldSchool.tools — House Planner',
    url: 'https://oldschool.tools/calculators/house-planner',
    note: 'Grid-based layout planner with placement cost tracking.',
  },
  {
    name: 'Theoatrix — Guide to Maxing Your House',
    url: 'https://www.theoatrix.net/post/guide-to-maxing-your-house-osrs',
    note: 'The reference walkthrough for a max-house build order.',
  },
  {
    name: 'OSRS Wiki — Player-owned house',
    url: 'https://oldschool.runescape.wiki/w/Player-owned_house',
    note: 'Canonical room/hotspot reference.',
  },
]

export const layoutAdvice = [
  'Put the Portal Nexus adjacent to your house entrance — most trips start there.',
  'Superior Garden (pool + spirit tree/fairy ring tile) should touch the entrance portal too: teleport home → pool tap → fairy ring is the core loop.',
  'Achievement Gallery (jewellery box + occult altar) next to the Superior Garden keeps restore → switch book → teleport within a few tiles.',
  'Keep the Dining Room (mahogany tables) near the entrance while training so the butler pathing stays short.',
  'Use a planner above to dry-run the layout before spending — moving rooms costs gp and redecorating resets nothing but stings.',
]

export const sources: string[] = [
  'https://oldschool.runescape.wiki/w/Construction_training',
  'https://oldschool.runescape.wiki/w/Mahogany_table',
  'https://oldschool.runescape.wiki/w/Gnome_bench',
  'https://oldschool.runescape.wiki/w/Oak_door',
  'https://oldschool.runescape.wiki/w/Oak_larder',
  'https://oldschool.runescape.wiki/w/Mythical_cape_(mounted)',
  'https://oldschool.runescape.wiki/w/Mahogany_Homes',
  'https://oldschool.runescape.wiki/w/Demon_butler',
  "https://oldschool.runescape.wiki/w/Servant's_money_bag",
  'https://oldschool.runescape.wiki/w/Hosidius_blueprints',
  'https://oldschool.runescape.wiki/w/Kourend_Favour',
  'https://oldschool.runescape.wiki/w/Superior_garden',
  'https://oldschool.runescape.wiki/w/Restoration_pool',
  'https://oldschool.runescape.wiki/w/Ornate_rejuvenation_pool',
  'https://oldschool.runescape.wiki/w/Achievement_gallery',
  'https://oldschool.runescape.wiki/w/Basic_jewellery_box',
  'https://oldschool.runescape.wiki/w/Ornate_jewellery_box',
  'https://oldschool.runescape.wiki/w/Occult_altar',
  'https://oldschool.runescape.wiki/w/Lunar_altar',
  'https://oldschool.runescape.wiki/w/Dark_altar_(Construction)',
  'https://oldschool.runescape.wiki/w/Ancient_altar',
  'https://oldschool.runescape.wiki/w/Portal_nexus',
  'https://oldschool.runescape.wiki/w/Spirit_tree_(Construction)',
  'https://oldschool.runescape.wiki/w/Fairy_ring_(Construction)',
  'https://oldschool.runescape.wiki/w/Spirit_tree_&_fairy_ring',
  'https://oldschool.runescape.wiki/w/Gilded_altar',
  'https://oldschool.runescape.wiki/w/House_styles',
  'https://oldschool.runescape.wiki/w/Player-owned_house',
]

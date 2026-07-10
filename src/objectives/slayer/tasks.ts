// Duradel's complete assignment table, verified against the OSRS Wiki
// (July 2026; reflects the 27 Aug 2025 "Summer Sweep Up" Slayer rework:
// metal dragons consolidated into one task; Sailing-era tasks — Aquanites,
// Frost dragons, Gryphons — included).
// Source: https://oldschool.runescape.wiki/w/Duradel

export interface DuradelTask {
  name: string
  /** Assignment size, e.g. "130-200" */
  amount: string
  weight: number
  slayerReq?: number
  combatReq?: number
  otherReqs?: string[]
  /** Slayer-point unlock needed before this can be assigned */
  unlockRequired?: string
  extendable?: string
  monsterWiki: string
  taskWiki?: string
  unverified?: boolean
}

export const duradel = {
  name: 'Duradel',
  location:
    'Shilo Village (ladder in the fishing shop). Fastest access: Karamja gloves 4 teleport, fairy ring CKR, or NPC Contact (Lunar) remotely.',
  requirements: ['Combat 100 + Slayer 50 (or any combat with 99 Slayer + cape)', 'Shilo Village quest'],
  points: '15 per task · 75 every 10th · 225 every 50th · 375 every 100th. Skip = 30 points, block = 100 points.',
  source: 'https://oldschool.runescape.wiki/w/Duradel',
}

export const duradelTasks: DuradelTask[] = [
  { name: 'Aberrant spectres', amount: '130-200', weight: 7, slayerReq: 60, combatReq: 65, otherReqs: ['Priest in Peril'], extendable: 'Smell ya later (200-250)', monsterWiki: 'Aberrant spectre', taskWiki: 'Slayer task/Aberrant spectres' },
  { name: 'Abyssal demons', amount: '130-200', weight: 12, slayerReq: 85, combatReq: 85, otherReqs: ['Priest in Peril or Fairytale II'], extendable: 'Augment my abbies (200-250)', monsterWiki: 'Abyssal demon', taskWiki: 'Slayer task/Abyssal demons' },
  { name: 'Ankou', amount: '50-80', weight: 5, combatReq: 40, extendable: 'Ankou very much (91-150)', monsterWiki: 'Ankou', taskWiki: 'Slayer task/Ankous' },
  { name: 'Aquanites', amount: '30-50', weight: 5, slayerReq: 78, otherReqs: ['73 Sailing (Ynysdail; adamant keel or better)'], unlockRequired: 'Lured In (80 pts)', extendable: "Let's Stay All Aquanite (150-200)", monsterWiki: 'Aquanite', taskWiki: 'Slayer task/Aquanites' },
  { name: 'Araxytes', amount: '60-80', weight: 10, slayerReq: 92, otherReqs: ['Priest in Peril'], extendable: 'More eyes than sense (200-250)', monsterWiki: 'Araxyte', taskWiki: 'Slayer task/Araxytes' },
  { name: 'Aviansies', amount: '120-200', weight: 8, unlockRequired: 'Watch the birdie (80 pts)', extendable: 'Birds of a feather (200-250)', monsterWiki: 'Aviansie', taskWiki: 'Slayer task/Aviansie' },
  { name: 'Basilisks', amount: '130-200', weight: 7, slayerReq: 40, unlockRequired: 'Basilocked (80 pts)', extendable: 'Basilonger (200-250)', monsterWiki: 'Basilisk', taskWiki: 'Slayer task/Basilisks' },
  { name: 'Black demons', amount: '130-200', weight: 8, combatReq: 80, extendable: "It's dark in here (200-250)", monsterWiki: 'Black demon', taskWiki: 'Slayer task/Black demons' },
  { name: 'Black dragons', amount: '10-20', weight: 9, combatReq: 80, otherReqs: ['Partial Dragon Slayer I'], extendable: 'Fire & Darkness (40-60)', monsterWiki: 'Black dragon', taskWiki: 'Slayer task/Black dragons' },
  { name: 'Bloodveld', amount: '130-200', weight: 8, slayerReq: 50, combatReq: 50, otherReqs: ['Priest in Peril'], extendable: 'Bleed me dry (200-250)', monsterWiki: 'Bloodveld', taskWiki: 'Slayer task/Bloodveld' },
  { name: 'Blue dragons', amount: '110-170', weight: 4, combatReq: 65, otherReqs: ['Partial Dragon Slayer I'], monsterWiki: 'Blue dragon', taskWiki: 'Slayer task/Blue_dragons' },
  { name: 'Boss tasks', amount: '3-35', weight: 12, otherReqs: ['Amount cap rises with Combat Achievement tier (40 Easy → 65 GM)', 'Boss category rolled, then a specific boss within it'], unlockRequired: 'Like a boss (200 pts)', monsterWiki: 'Boss', taskWiki: 'Boss' },
  { name: 'Cave horrors', amount: '130-200', weight: 4, slayerReq: 58, combatReq: 85, otherReqs: ['Cabin Fever'], extendable: 'Horrorific (200-250)', monsterWiki: 'Cave horror', taskWiki: 'Slayer task/Cave horrors' },
  { name: 'Cave kraken', amount: '100-120', weight: 9, slayerReq: 87, combatReq: 80, otherReqs: ['50 Magic'], extendable: 'Krack on (150-200)', monsterWiki: 'Cave kraken', taskWiki: 'Slayer task/Cave krakens' },
  { name: 'Dagannoth', amount: '130-200', weight: 9, combatReq: 75, otherReqs: ['Horror from the Deep'], monsterWiki: 'Dagannoth', taskWiki: 'Slayer task/Dagannoths' },
  { name: 'Dark beasts', amount: '10-20', weight: 11, slayerReq: 90, combatReq: 90, otherReqs: ["Started Mourning's End Part II"], extendable: 'Need more darkness (110-135)', monsterWiki: 'Dark beast', taskWiki: 'Slayer task/Dark beast' },
  { name: 'Drakes', amount: '50-110', weight: 8, slayerReq: 84, monsterWiki: 'Drake', taskWiki: 'Slayer task/Drake' },
  { name: 'Dust devils', amount: '130-200', weight: 5, slayerReq: 65, combatReq: 70, otherReqs: ['Partial Desert Treasure I'], extendable: 'To dust you shall return (200-250)', monsterWiki: 'Dust devil', taskWiki: 'Slayer task/Dust devil' },
  { name: 'Elves', amount: '110-170', weight: 4, combatReq: 70, otherReqs: ['Regicide'], monsterWiki: 'Elf warrior', taskWiki: 'Slayer task/Elves' },
  { name: 'Fire giants', amount: '130-200', weight: 7, combatReq: 65, monsterWiki: 'Fire giant', taskWiki: 'Slayer task/Fire giants' },
  { name: 'Fossil Island wyverns', amount: '20-50', weight: 7, slayerReq: 66, combatReq: 60, otherReqs: ['Bone Voyage', 'Elemental Workshop I', 'Ancient wyverns need 82 Slayer'], extendable: 'Wyver-nother two (55-75)', monsterWiki: 'Fossil Island Wyvern', taskWiki: 'Slayer task/Fossil Island wyverns' },
  { name: 'Frost dragons', amount: '70-120', weight: 5, combatReq: 85, otherReqs: ['87 Sailing (Isle of Grimstone)'], extendable: "Chance of Heavy Frost raises weight to 8", monsterWiki: 'Frost dragon' },
  { name: 'Gargoyles', amount: '130-200', weight: 8, slayerReq: 75, combatReq: 80, otherReqs: ['Priest in Peril'], extendable: 'Get smashed (200-250)', monsterWiki: 'Gargoyle', taskWiki: 'Slayer task/Gargoyles' },
  { name: 'Greater demons', amount: '130-200', weight: 9, combatReq: 75, extendable: 'Greater Challenge (200-250)', monsterWiki: 'Greater demon', taskWiki: 'Slayer task/Greater demons' },
  { name: 'Gryphons', amount: '100-210', weight: 7, slayerReq: 51, otherReqs: ['45 Sailing', 'Troubled Tortugans'], unlockRequired: 'Wings Spread (80 pts)', extendable: 'Gryphon and on (180-290)', monsterWiki: 'Gryphon', taskWiki: 'Slayer task/Gryphons' },
  { name: 'Hellhounds', amount: '130-200', weight: 10, combatReq: 75, otherReqs: ['Cerberus alternative at 91 Slayer'], monsterWiki: 'Hellhound', taskWiki: 'Slayer task/Hellhounds' },
  { name: 'Kalphite', amount: '130-200', weight: 9, combatReq: 15, monsterWiki: 'Kalphite', taskWiki: 'Slayer task/Kalphites' },
  { name: 'Kurask', amount: '130-200', weight: 4, slayerReq: 70, combatReq: 65, monsterWiki: 'Kurask', taskWiki: 'Slayer task/Kurask' },
  { name: 'Lizardmen', amount: '130-210', weight: 10, unlockRequired: 'Reptile got ripped (75 pts)', monsterWiki: 'Lizardman', taskWiki: 'Slayer task/Lizardmen' },
  { name: 'Metal dragons', amount: '35-45', weight: 14, otherReqs: ['One consolidated task since 27 Aug 2025 (Bronze → Rune)', 'Mithril needs partial Barbarian Training; Adamant/Rune need Dragon Slayer II'], extendable: 'Pedal to the metals (150-200)', monsterWiki: 'Metal dragons', taskWiki: 'Slayer task/Metal dragons' },
  { name: 'Mutated Zygomites', amount: '20-30', weight: 2, slayerReq: 57, combatReq: 60, otherReqs: ['Lost City'], monsterWiki: 'Zygomite', taskWiki: 'Slayer task/Zygomites' },
  { name: 'Nechryael', amount: '130-200', weight: 9, slayerReq: 80, combatReq: 85, extendable: 'Nechs please (200-250)', monsterWiki: 'Nechryael', taskWiki: 'Slayer task/Nechryael' },
  { name: 'Red dragons', amount: '30-65', weight: 8, combatReq: 68, otherReqs: ['Partial Dragon Slayer I'], unlockRequired: 'Seeing red (50 pts)', monsterWiki: 'Red dragon', taskWiki: 'Slayer task/Red dragons' },
  { name: 'Skeletal Wyverns', amount: '20-40', weight: 7, slayerReq: 72, combatReq: 70, otherReqs: ['Elemental Workshop I'], extendable: 'Wyver-nother one (50-70)', monsterWiki: 'Skeletal Wyvern' },
  { name: 'Smoke devils', amount: '130-200', weight: 9, slayerReq: 93, combatReq: 85, monsterWiki: 'Smoke devil', taskWiki: 'Slayer task/Smoke devils' },
  { name: 'Spiritual creatures', amount: '130-200', weight: 7, slayerReq: 63, combatReq: 60, otherReqs: ['Death Plateau', '60 Strength or Agility', 'Ranger 63 / Warrior 68 / Mage 83 Slayer'], extendable: 'Spiritual fervour (181-250)', monsterWiki: 'Spiritual mage', taskWiki: 'Slayer task/Spiritual creatures' },
  { name: 'Suqah', amount: '60-90', weight: 8, combatReq: 85, otherReqs: ['Partial Lunar Diplomacy'], extendable: 'Suq-a-nother one (186-250)', monsterWiki: 'Suqah', taskWiki: 'Slayer task/Suqah' },
  { name: 'Trolls', amount: '130-200', weight: 6, combatReq: 60, monsterWiki: 'Troll', taskWiki: 'Slayer task/Trolls' },
  { name: 'TzHaar', amount: '130-199', weight: 10, otherReqs: ['May offer TzTok-Jad (25k bonus xp) or TzKal-Zuk (100k, needs prior Zuk kill) instead'], unlockRequired: 'Hot stuff (100 pts)', monsterWiki: 'TzHaar', taskWiki: 'Slayer task/TzHaar' },
  { name: 'Vampyres', amount: '100-210', weight: 8, unlockRequired: 'Actual Vampyre Slayer (80 pts)', extendable: 'More at stake (200-250)', monsterWiki: 'Vampyre', taskWiki: 'Slayer task/Vampyres' },
  { name: 'Warped creatures', amount: '130-200', weight: 8, unlockRequired: 'Warped Reality (60 pts)', monsterWiki: 'Warped Terrorbird', taskWiki: 'Slayer task/Warped creature' },
  { name: 'Waterfiends', amount: '130-200', weight: 2, combatReq: 75, otherReqs: ['Barbarian Training through pyre ships'], monsterWiki: 'Waterfiend', taskWiki: 'Slayer task/Waterfiends' },
  { name: 'Wyrms', amount: '100-160', weight: 8, slayerReq: 62, extendable: 'Can of Wyrms (200-250)', monsterWiki: 'Wyrm', taskWiki: 'Slayer task/Wyrms' },
]

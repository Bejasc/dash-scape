// Register every objective here. Adding an objective = add a folder under
// src/objectives/<id>/ with a data.ts + Page.tsx, then append one entry.
import type { ObjectiveDefinition } from './types'
import { GoalsPage } from './goals/GoalsPage'
import { MaxHousePage } from './max-house/MaxHousePage'
import { SlayerPage } from './slayer/SlayerPage'

export const objectives: ObjectiveDefinition[] = [
  {
    id: 'max-house',
    title: 'Max House',
    icon: 'Construction icon',
    skills: ['construction'],
    tagline: 'Fastest route to a maxed player-owned house — teleports, rejuvenation, spellbooks',
    page: MaxHousePage,
  },
  {
    id: 'slayer',
    title: 'Slayer',
    icon: 'Slayer icon',
    skills: ['slayer'],
    tagline: "Duradel task reference — gear, prayers, inventories, and task preferences",
    page: SlayerPage,
  },
  {
    id: 'goals',
    title: 'Goals & Notes',
    icon: 'Quest point icon',
    skills: [],
    tagline: 'Freeform goal tracking, tagged notes, and loadout scratchpads',
    page: GoalsPage,
  },
]

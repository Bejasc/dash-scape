// Objective module contract. Every objective (Max House, Slayer, quest cape,
// ...) is a data-driven module registered in registry.tsx and rendered
// through the shared components — never a bespoke one-off page.
import type { ComponentType } from 'react'
import type { SkillName } from '../services/wom'

export interface ObjectiveDefinition {
  /** URL slug, e.g. "max-house" */
  id: string
  title: string
  /** Wiki icon name used in nav + header, e.g. "Construction icon" */
  icon: string
  /** Primary skill(s) this objective tracks via Wise Old Man, if any */
  skills: SkillName[]
  /** Short strapline shown under the title */
  tagline: string
  page: ComponentType
}

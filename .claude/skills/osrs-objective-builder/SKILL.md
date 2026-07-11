---
name: osrs-objective-builder
description: Scaffold a new objective for the DashScape OSRS dashboard — data schema, shared components, wiki verification workflow, where data files live. Use when adding an objective (e.g. quest cape, diaries, combat achievements) or restructuring an existing one.
---

# Building a new objective

Objectives are data-driven modules rendered through shared components. Never
build a bespoke page with its own styling or item rendering.

## Steps

1. **Create the module**
   - `src/objectives/<id>/data.ts` — ALL game content lives here, typed.
   - `src/objectives/<id>/<Name>Page.tsx` — renders `data.ts` through shared
     components only (`SectionCard`, `ItemLink`, `InventoryGrid`,
     `EquipmentLayout`, `CostTable`, `MilestoneTable`, `SkillProgress`,
     `Note`, `Tag`). Import CSS from nowhere — the shared stylesheets cover it;
     add objective-specific classes to a co-located `.css` only for genuinely
     new layout patterns.
   - Register in `src/objectives/registry.tsx`: `{ id, title, icon, skills,
     tagline, page }`. Nav and routing derive from the registry.

2. **Data conventions**
   - Items: exact wiki names (`"Super restore(4)"`, `"Slayer helmet (i)"`).
     Prices resolve at runtime by name via the mapping — never hardcode gp
     values for GE items. Shop-only items (Magic stone, Marble block) use
     `fixedPrice` in `CostRow`.
   - Levels/xp: use `xpForLevel`/`levelForXp` from `src/lib/xp.ts` — never
     hardcode xp thresholds.
   - Live progress: `useWiseOldMan(DEFAULT_RSN).skill('<skill>')` — recompute
     remaining cost/hours from live xp, never from a snapshot constant.
   - Per-user choices (availability marks, toggles): `useLocalStorage` with a
     `dashscape.<objective>.*` key.

3. **Wiki verification workflow (mandatory)**
   - Verify every gameplay number (levels, materials, weights, xp rates)
     against oldschool.runescape.wiki while authoring — fetch the real page
     with `npm run wiki -- "<Page>"` (wikitext infoboxes are ground truth;
     see `tools/wiki.mjs` for --search/--html/--price/--wom). Only fall back
     to WebSearch in sandboxed sessions where egress is blocked.
   - Keep a `sources: string[]` (wiki URLs) export in `data.ts` and render a
     Sources section at the bottom of the page.
   - Anything you could not verify: mark `unverified: true` in data and
     surface it in the UI; list it under "Assumed" in `HANDOVER.md`.

4. **Verify**: `npm run build` must pass (strict TS). Eyeball with
   `npm run dev` if a browser is available.

# DashScape — OSRS Objective Dashboard

Ben's dashboard for plotting OSRS goals. "Max house" and "Slayer" are the first
two objectives; more will be added over time (quest cape, diaries, ...). The
theme, item rendering, price fetching, and component vocabulary must stay
consistent across all objectives.

- **RSN:** `B 3 N N O` (see `DEFAULT_RSN` in `src/services/config.ts`)
- Not an ironman; buys materials on the GE. Has a demon butler.
- Spellbooks unlocked: Ancient, Lunar, Arceuus. Fairy rings + spirit trees unlocked.

## Run / test

```bash
npm install
npm run dev        # Vite dev server with API proxy (User-Agent stamping)
npm run build      # tsc -b && vite build — this is the CI gate; keep it green
npm run preview
```

There is no test suite yet; `npm run build` (strict TS) is the verification step.

## Architecture

**Objectives are data-driven modules, not bespoke pages.**

```
src/
  theme/            tokens.css (design tokens — never hardcode colours) + global.css
  lib/              xp.ts (OSRS xp table, computed from the official formula), format.ts
  services/         config.ts (API bases, RSN), prices.ts (GE price service), wom.ts (Wise Old Man)
  hooks/            usePrices, useWiseOldMan, useLocalStorage
  components/       shared vocabulary — see below
  objectives/
    types.ts        ObjectiveDefinition contract
    registry.tsx    ONE entry per objective; nav + routes derive from it
    <id>/data.ts    typed, wiki-verified game data (all content lives here)
    <id>/<Id>Page.tsx  renders data.ts through shared components only
```

To add an objective: create `src/objectives/<id>/{data.ts,<Id>Page.tsx}`,
register it in `registry.tsx`. See `.claude/skills/osrs-objective-builder/`.

### Shared components (use these; do not reinvent)

| Component         | Purpose |
|-------------------|---------|
| `ItemLink`        | THE way to render any item: wiki hyperlink + PNG icon + optional live price badge (`showPrice`, `qty`) |
| `InventoryGrid`   | 4×7 in-game inventory mock; slots take exact wiki item names, `qty`, `tint`, `repeat` |
| `EquipmentLayout` | Paper-doll equipment tab mock |
| `CostTable`       | Materials table; unit/total costs computed from live GE prices (use `fixedPrice` for shop-only items) |
| `MilestoneTable`  | Skill milestones; tints reached/next rows when given live xp |
| `SkillProgress`   | Live WOM progress block (level, xp to next, xp to 99) |
| `ObjectiveLayout` | Page chrome: header, price freshness chip, refresh |
| `SectionCard` / `SubHead` / `Note` / `Tag` / `ProgressBar` | layout + wiki-style callouts |

## Data integrations

### Live GE prices — OSRS Wiki real-time prices API

- `https://prices.runescape.wiki/api/v1/osrs/latest` + `/mapping` (id ↔ name).
- **User-Agent rule:** the API requires a descriptive UA
  (`ben-osrs-dashboard - github.com/Bejasc/dash-scape`). Browsers cannot set
  the User-Agent header, so the Vite dev server proxies `/proxy/prices` and
  stamps it (see `vite.config.ts`). Production builds call the API directly —
  it sends CORS headers. If it ever starts blocking UA-less browser calls,
  front the app with any tiny passthrough proxy that adds the header.
- `src/services/prices.ts`: 10-min TTL, in-memory + localStorage cache, stale
  offline fallback with `fetchedAt` timestamp surfaced in the UI. One fetch
  per session shared app-wide via `PricesProvider`.
- **Items are referenced by exact wiki name** (e.g. `"Mahogany plank"`,
  `"Super restore(4)"`); ids resolve at runtime through `/mapping`. No item
  ids in data files.

### Live XP — Wise Old Man v2

- `https://api.wiseoldman.net/v2/players/<rsn>` via `useWiseOldMan(rsn)`;
  any objective can consume any skill. POST to the same path asks WOM to
  re-scrape the hiscores (wired to the "Update" button).
- Same User-Agent/dev-proxy arrangement as prices.

### Item icons

- `wikiImageUrl(name)` → `https://oldschool.runescape.wiki/images/<Name_with_underscores>.png`
  (URL-encoded; apostrophes → `%27`, parens → `%28%29`). Every icon has an
  `onError` hide so a bad filename degrades to text, never a broken image.
  Some items need an explicit `iconName` variant (e.g. `"Toxic blowpipe (empty)"`).

## Accuracy rule (non-negotiable)

**Never trust training memory for game data** — xp rates, level requirements,
material counts, task weights, prices. Every gameplay fact in a `data.ts` must
be verified against the OSRS Wiki at authoring time, and each data file keeps
a `sources` list of the wiki pages used. Facts that could not be verified are
flagged in the UI and in `HANDOVER.md`. When editing game data, re-verify
against the wiki (WebSearch reaches wiki content even when direct fetch is
blocked).

## Design system

Dark OSRS stone-and-gold. All tokens in `src/theme/tokens.css` (`--gold`,
`--stone` … `--radius`). Fonts: IM Fell English (headings), Inter (body),
MedievalSharp (accents). Section cards on stone-2/stone-3 with gold-dim
borders. Tables follow the wiki look (`.ds-table`).

## User preferences

Per-user state (Slayer task availability marks, future settings) lives in
localStorage via `useLocalStorage` under `dashscape.*` keys — no backend.

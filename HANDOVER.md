# HANDOVER — DashScape build session (July 2026)

## Session 2 additions

- **Slayer: four preference states** — Not available (can't be assigned) and
  Blocked (100 pts spent) are now distinct; both excluded from the pool
  weight. Old v1 marks migrate automatically (v1 "blocked" → "Not available").
- **Local data toolkit** (`tools/`): `npm run proxy` = UA-stamping CORS
  passthrough on :8787 for `/prices`, `/wom`, `/wiki` (app can target it via
  `VITE_API_PROXY`); `npm run wiki -- "<Page>"` fetches real wikitext
  (+ `--search/--html/--price/--wom`). CLAUDE.md + skills now direct local
  Claude sessions to these for hard-verified data instead of web search.
  Written for Ben's machine — could NOT be live-tested from this sandbox
  (egress blocked); both are plain Node 18 `fetch`, no dependencies.
- **Max House goal planner** — pick any milestone (or custom level) + method:
  exact planks to buy, actions, butler trips/wages, total live-GE cost,
  time estimate, all from live WOM xp. Verified against mocked APIs
  (756k xp → Occult altar = 32,790 mahogany planks / 68.4M / ~5.5h ✓).
- **Goals & Notes objective** — checkbox goals with drag-and-drop reorder and
  per-goal notes; named + tagged notes authored in-page with tag filter and
  full-text search (matches embedded item names too); both goals and notes
  can embed inventory (click-to-paint, 4×7) and equipment loadout blocks with
  item autocomplete from the GE mapping; each goal has a "⚒ Claude prompt"
  button that copies a skills-aligned brief for turning the goal into a full
  objective (wire-up to a live Claude session is future work — see backlog).
  All localStorage (`dashscape.goals.v1`, `dashscape.notes.v1`).

## What was built (session 1)

A Vite + React + TypeScript objective dashboard with two complete objectives,
rendered through a shared component system (see `CLAUDE.md` for architecture).

**Shared platform**
- Design tokens (stone-and-gold), IM Fell English / Inter / MedievalSharp fonts.
- `ItemLink` (wiki link + PNG icon + live price badge), `InventoryGrid` (4×7),
  `EquipmentLayout` (paper doll), `CostTable` (live-priced), `MilestoneTable`
  (live-xp aware), `SkillProgress`, `ObjectiveLayout`, notes/tags.
- Price service: OSRS Wiki real-time prices, 10-min TTL, localStorage offline
  fallback with visible "stale/offline + timestamp" state, name→id via
  `/mapping`. `usePrices()` + app-wide `PricesProvider`.
- `useWiseOldMan(rsn)` — live xp for any skill; POST-refresh wired to a button.
- Dev proxy stamps the required User-Agent (browsers can't set it); prod calls
  the APIs directly via CORS.
- Objective registry — nav/routes derive from one array.

**Max House objective**
- Live Construction progress; every table recomputes from live WOM xp.
- Verified milestone table (37 → 99) — including corrections vs. common lore:
  Achievement Gallery room is **80** (not 91), Portal Nexus room is **72**
  (Crystalline tier is the 92 part), fairy ring boost is spicy-stew-only.
- Training method comparison with live gp/xp (mid-price + amortised demon
  butler wage), hours-to-99 and cost-to-99 from live xp: mahogany tables,
  gnome benches, oak dungeon doors, oak larders, mythical capes (DS2 req
  noted), Mahogany Homes.
- Butler loop walkthroughs with 4×7 inventory mocks and tick-level steps
  (24-plank / build-3-remove-2 cycle, money bag, Call Servant).
- Dream-house build list grouped by Ben's priorities (rejuvenation pool chain,
  Occult altar path, jewellery box tiers, Portal Nexus + wall mounts, spirit
  tree & fairy ring), each with live-priced material tables and quest/skill
  requirement checkmarks against Ben's confirmed unlocks (all spellbooks ✓,
  fairy rings ✓, spirit trees ✓).
- Hosidius house style section rewritten for the **post-favour game**: favour
  was removed 10 Jan 2024; the style now costs 2,000 Mahogany Homes carpenter
  points + 5,000 gp (~7–8 hours of contracts that themselves bank ~1.5–2M
  Construction xp).
- Layout planner links + placement principles; sources section.

**Slayer objective** (migrated from the old HTML guide, per request)
- Current-task feature **excluded** as requested.
- Full Duradel assignment table — all 43 categories, verified against the
  post-27-Aug-2025 rework (Metal dragons consolidated; Sailing-era Aquanites,
  Frost dragons, Gryphons included; weights/amounts/unlocks per wiki).
- Per-task preference marking: **Not available / Neutral (default) /
  Preferred**, persisted to localStorage, with filters and a live "weight in
  your pool" figure.
- Per-task strategy cards: recommended base loadout + task-specific gear
  swaps, protect/offensive prayers, cannon rules, best/alt locations with
  transport, mandatory items, dangers, drops, superiors, boss alternatives,
  AFK rating, verdict.
- Four base gear setups (melee / blowpipe / crossbow / burst) with paper-doll
  + inventory mocks; burst setup exists because Ancient Magicks is confirmed
  unlocked.
- Points-spend priority table; slayer level milestone table vs live WOM level.

**Docs & skills**
- `CLAUDE.md` — conventions, schema, API quirks, accuracy rule.
- `.claude/skills/osrs-objective-builder`, `osrs-data-integrations`,
  `osrs-progress-review`.

## Verified vs. assumed

**Verified against the wiki during the build** (sources listed in each
`data.ts` and on-page): all Construction unlock levels, xp table (computed
from the official formula, not transcribed), training method xp/planks/rates,
demon butler mechanics (10k per 8 uses, capacity 26, 12-tick trip), Duradel
table (requirements, weights, amounts, extensions), favour removal + current
Hosidius unlock, occult altar spellbook-switch requirements.

**Flagged unverified** (marked in the UI with "verify in-game" tags or card
notes; conflicting/unconfirmable search snippets):
- Exact material *quantities* for: Revitalisation/Rejuvenation/Fancy/Ornate
  pool potion components; Fancy/Ornate jewellery box gold leaf + jewellery
  counts; Portal nexus tier marble/gold/magic-stone counts; Xeric's/Digsite
  wall mounts. Items themselves are verified; check the build menu before
  bulk-buying.
- A few strategy details flagged per-card (Aquanites/Araxytes/Frost dragons
  transport specifics, some cannon rules).
- Fairy enchantment shop price; Mahogany Homes plank-per-contract average.

**Assumptions**
- WOM prices/products of the account `B 3 N N O` resolve (couldn't hit the API
  from this sandbox — network policy blocks all game APIs and even the wiki;
  research went through web search instead).
- Burst gear tier (mystic/ancient staff/occult) assumed reasonable; adjust in
  `slayer/gearData.ts` to match the bank.
- Dragon Slayer II status unknown → Mythical cape method and Vorkath/rune
  dragon options carry explicit DS2 notes rather than assumptions.

## Verification done

- `npm run build` green (strict TS).
- Headless Chromium smoke test of both routes: zero console/page errors;
  offline fallbacks render correctly (prices chip shows "offline", WOM shows
  retry note); preference marking + filters + expanding strategy panels work.
- Live API calls could **not** be exercised from this environment (egress
  blocked) — first `npm run dev` on a normal machine will confirm prices/WOM;
  the code paths degrade gracefully if either is down.

## Backlog / next steps

1. **Run it locally** (`npm install && npm run dev`) — confirm live prices +
   WOM resolve for the RSN, and correct any "verify in-game" quantities.
2. Next objectives via `osrs-objective-builder`: quest cape, achievement
   diaries, combat achievements.
3. Slayer: block-list planner that recomputes assignment odds from the
   preference marks; point income projection (streak math).
4. Max House: build-order checklist with "own it" checkboxes (localStorage,
   same pattern as slayer prefs) and a running total of remaining cost.
5. Deployment: static host (GitHub Pages works — HashRouter already in
   place); consider a tiny worker proxy to stamp the User-Agent in prod.
6. Mobile layout pass (tables scroll horizontally already; the inventory grid
   could scale down).
7. Optional: swap `Coins` fixed rows in cost tables for a dedicated fee row
   type; add Konar/Nieve master tabs to the Slayer objective.
8. Wire the Goals page "⚒ Claude prompt" button beyond the clipboard — e.g.
   POST into a Claude Code session/automation so a goal becomes a PR that
   adds the generated objective. The prompt text lives in
   `src/objectives/goals/types.ts` (`buildClaudePrompt`).
9. Goals/notes export-import (JSON download/upload) so localStorage isn't the
   only copy.

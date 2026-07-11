---
name: osrs-data-integrations
description: How DashScape's price service, Wise Old Man hook, and item icon resolution work — API quirks (User-Agent, rate limits, id mapping, CORS). Use when touching src/services, src/hooks, the Vite proxy, or debugging price/xp/icon issues.
---

# Data integrations

## GE prices — OSRS Wiki real-time prices API

- Endpoints: `GET /api/v1/osrs/latest` (all item prices), `GET /api/v1/osrs/mapping`
  (id ↔ name ↔ GE limit; ~4k items, changes rarely).
- **User-Agent is mandatory** — the API blocks generic/absent UAs. Browsers
  can't set the UA header, so `vite.config.ts` proxies `/proxy/prices` in dev
  and stamps `ben-osrs-dashboard - github.com/Bejasc/dash-scape`. Production
  calls go direct (the API sends CORS headers and currently tolerates browser
  UAs); if that changes, add any passthrough proxy that stamps the header and
  point `PRICES_BASE` at it (`src/services/config.ts`).
- Caching (`src/services/prices.ts`): `/latest` TTL 10 min, persisted to
  localStorage; on fetch failure the last snapshot is served with
  `stale: true` and the UI shows the fetch timestamp. `/mapping` is fetched
  once and persisted. One shared fetch app-wide via `PricesProvider`.
- Rate limits: be polite — never poll `/latest` more than ~once/min; the TTL
  plus manual Refresh button is the intended pattern.
- Price semantics: `effectivePrice` = midpoint of instant-buy `high` and
  instant-sell `low` (fallback to whichever exists). `null` means "unknown" —
  render "—", never 0.
- Items are referenced by **exact wiki name**; ids resolve via mapping at
  runtime (case-insensitive). If a price comes back null, the usual cause is a
  name mismatch with the mapping (check the wiki item page's exact spelling,
  including `(4)` dose suffixes and curly apostrophes).

## Live XP — Wise Old Man v2

- `GET https://api.wiseoldman.net/v2/players/<rsn>` → player with
  `latestSnapshot.data.skills.<skill>.{experience,level}`.
- `POST` to the same path asks WOM to re-scrape the OSRS hiscores (wired to
  the "Update" button). WOM rate-limits unauthenticated traffic (~20 req/min
  and ~1 refresh/min per player) — don't auto-poll.
- Same dev-proxy arrangement (`/proxy/wom`) for the User-Agent.
- `useWiseOldMan(rsn)` is account-agnostic: any objective consumes any skill.
  RSN lives in `DEFAULT_RSN` (`src/services/config.ts`).

## Item icons + wiki links

- `wikiImageUrl(name)`: spaces → underscores, URL-encode, apostrophes → `%27`
  → `https://oldschool.runescape.wiki/images/<file>.png`. Hotlinking is fine
  (plain `<img>`, no CORS involved).
- Some items' inventory icon lives under a variant file name — pass
  `iconName` (e.g. item "Toxic blowpipe" → icon "Toxic blowpipe (empty)").
- Every `<img>` gets `onError` → hide, so wrong guesses degrade to text.
- `wikiUrl(page)` for hyperlinks; `ItemLink` combines link + icon + optional
  live price badge and is the only sanctioned way to render an item mention.

## Local toolkit — hard-verified data (preferred)

- `npm run wiki -- "<Page>"` (`tools/wiki.mjs`) fetches a wiki page's
  wikitext — `{{Infobox ...}}` blocks carry exact levels/materials/xp. Flags:
  `--search`, `--html`, `--price "<item>"`, `--wom "<rsn>"`. **Always prefer
  this over web search for game facts** when the network allows direct fetch.
- `npm run proxy` (`tools/osrs-proxy.mjs`) runs a local UA-stamping
  passthrough on :8787 for `/prices/*`, `/wom/*`, `/wiki/*` with CORS. The
  app consumes it via `VITE_API_PROXY=http://127.0.0.1:8787` in any mode;
  Claude can `curl` through it for anything the CLI doesn't cover.

## Sandbox note

In Claude Code cloud sessions, egress to these hosts may be blocked by
network policy (403 CONNECT) — then, and only then, fall back to WebSearch
and mark unconfirmable numbers `unverified: true`. On Ben's machine the
toolkit above works directly; the app itself always runs in his browser.

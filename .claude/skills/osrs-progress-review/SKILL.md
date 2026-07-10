---
name: osrs-progress-review
description: Pull Ben's live Wise Old Man stats and report progress against DashScape's defined objectives (Max House construction xp, Slayer level, etc.). Use when asked "how am I going", "progress review", or to recompute remaining cost/hours.
---

# Progress review

RSN: `B 3 N N O` (also in `DEFAULT_RSN`, `src/services/config.ts`).

## Fetch live stats

```bash
curl -sS -H "User-Agent: ben-osrs-dashboard - github.com/Bejasc/dash-scape" \
  "https://api.wiseoldman.net/v2/players/b%203%20n%20n%20o"
```

If the sandbox blocks egress, ask the user to paste the numbers or read them
from the dashboard. To force a hiscores re-scrape first, POST the same URL.

Skills of interest: `latestSnapshot.data.skills.{construction,slayer}.experience`.

## Report against objectives

For each objective in `src/objectives/registry.tsx`, mirror the maths the app
does (all data in each objective's `data.ts`):

- **Max House** — construction xp vs the milestone list (each POH unlock
  level), xp remaining to each and to 99 (`13,034,431`), hours remaining at
  the user's chosen method's xp/hr, and gp remaining (planks needed × live GE
  price — `prices.runescape.wiki/api/v1/osrs/latest`, same User-Agent rule).
  Use `src/lib/xp.ts` formula values, not memory.
- **Slayer** — slayer level vs task unlock milestones in the Duradel table
  (65 dust devils, 75 gargoyles, 80 nechryael, 85 abyssal demons, 87 cave
  krakens, 91 cerberus, 93 smoke devils, 95 hydra — verify against
  `data.ts`, which is wiki-verified).

## Output format

Short report: current level/xp per tracked skill, next milestone (+xp to go),
% to 99, and any objective-specific callouts (e.g. "72 slayer unlocks Skeletal
wyverns — 41k xp away"). Compare against the previous review if one exists in
the conversation.

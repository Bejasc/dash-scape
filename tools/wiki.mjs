#!/usr/bin/env node
// Hard-verification fetcher for the OSRS Wiki — the source of truth for all
// game data in this repo. Run locally (Node 18+, no dependencies). This is
// what Claude Code should use instead of web search when authoring or
// checking any data.ts fact.
//
//   node tools/wiki.mjs "Occult altar"              # page wikitext (infoboxes = exact data)
//   node tools/wiki.mjs --search "jewellery box"    # find page titles
//   node tools/wiki.mjs --html "Occult altar"       # rendered HTML (tables etc.)
//   node tools/wiki.mjs --price "Mahogany plank"    # live GE price via prices API
//   node tools/wiki.mjs --wom "b 3 n n o"           # Wise Old Man player snapshot
//
// Wikitext is the most reliable form: `{{Infobox Construction|...}}` blocks
// carry exact levels/materials/xp, and drop/assignment tables are explicit.
const USER_AGENT = 'ben-osrs-dashboard - github.com/Bejasc/dash-scape'
const WIKI_API = 'https://oldschool.runescape.wiki/api.php'

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`)
  return res
}

async function main() {
  const args = process.argv.slice(2)
  const flag = args[0]?.startsWith('--') ? args.shift() : null
  const query = args.join(' ').trim()
  if (!query) {
    console.error('usage: node tools/wiki.mjs [--search|--html|--price|--wom] "<page or query>"')
    process.exit(1)
  }

  if (flag === '--search') {
    const url = `${WIKI_API}?action=opensearch&search=${encodeURIComponent(query)}&limit=15&format=json`
    const [, titles, , urls] = await (await get(url)).json()
    titles.forEach((t, i) => console.log(`${t}\n  ${urls[i]}`))
    return
  }

  if (flag === '--price') {
    const mapping = await (await get('https://prices.runescape.wiki/api/v1/osrs/mapping')).json()
    const item = mapping.find((m) => m.name.toLowerCase() === query.toLowerCase())
    if (!item) throw new Error(`no GE item named "${query}" in /mapping`)
    const latest = await (await get(`https://prices.runescape.wiki/api/v1/osrs/latest?id=${item.id}`)).json()
    console.log(JSON.stringify({ ...item, ...latest.data[item.id] }, null, 2))
    return
  }

  if (flag === '--wom') {
    const player = await (await get(`https://api.wiseoldman.net/v2/players/${encodeURIComponent(query)}`)).json()
    const skills = player.latestSnapshot?.data?.skills ?? {}
    console.log(`${player.displayName} — combat ${player.combatLevel}, updated ${player.updatedAt}`)
    for (const [k, v] of Object.entries(skills)) console.log(`${k.padEnd(14)} lvl ${String(v.level).padStart(3)}  ${v.experience.toLocaleString()} xp`)
    return
  }

  const prop = flag === '--html' ? 'text' : 'wikitext'
  const url = `${WIKI_API}?action=parse&page=${encodeURIComponent(query)}&prop=${prop}&format=json&redirects=1`
  const body = await (await get(url)).json()
  if (body.error) throw new Error(`${body.error.code}: ${body.error.info}`)
  const content = flag === '--html' ? body.parse.text['*'] : body.parse.wikitext['*']
  console.log(`== ${body.parse.title} ==\n`)
  console.log(content)
}

main().catch((err) => {
  console.error(String(err))
  process.exit(1)
})

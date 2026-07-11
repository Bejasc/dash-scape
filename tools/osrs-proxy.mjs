#!/usr/bin/env node
// Local OSRS data proxy — run on your own machine to give BOTH the app and
// Claude Code direct, User-Agent-stamped access to the game APIs and the
// wiki. No dependencies; Node 18+.
//
//   node tools/osrs-proxy.mjs            # listens on http://127.0.0.1:8787
//   PORT=9000 node tools/osrs-proxy.mjs
//
// Routes (path prefix → upstream):
//   /prices/*  → https://prices.runescape.wiki/api/v1/osrs/*
//   /wom/*     → https://api.wiseoldman.net/v2/*
//   /wiki/*    → https://oldschool.runescape.wiki/*   (api.php, /w/<Page>, /images/...)
//
// Examples:
//   curl http://127.0.0.1:8787/prices/latest
//   curl http://127.0.0.1:8787/wom/players/b%203%20n%20n%20o
//   curl "http://127.0.0.1:8787/wiki/api.php?action=parse&page=Occult_altar&prop=wikitext&format=json"
//
// The app can be pointed at it (dev or prod build) with:
//   VITE_API_PROXY=http://127.0.0.1:8787 npm run dev|build
import http from 'node:http'

const PORT = Number(process.env.PORT || 8787)
const USER_AGENT = 'ben-osrs-dashboard - github.com/Bejasc/dash-scape'

const UPSTREAMS = {
  '/prices': 'https://prices.runescape.wiki/api/v1/osrs',
  '/wom': 'https://api.wiseoldman.net/v2',
  '/wiki': 'https://oldschool.runescape.wiki',
}

const server = http.createServer(async (req, res) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors)
    return res.end()
  }

  const prefix = Object.keys(UPSTREAMS).find((p) => req.url.startsWith(p + '/') || req.url === p)
  if (!prefix) {
    res.writeHead(404, { 'Content-Type': 'application/json', ...cors })
    return res.end(JSON.stringify({ error: 'unknown route', routes: Object.keys(UPSTREAMS) }))
  }

  const target = UPSTREAMS[prefix] + req.url.slice(prefix.length)
  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: { 'User-Agent': USER_AGENT, Accept: req.headers.accept ?? '*/*' },
      // WOM uses empty-body POST for refresh; forward the method, drop the body
      redirect: 'follow',
    })
    const headers = { ...cors }
    for (const h of ['content-type', 'cache-control', 'etag', 'last-modified']) {
      const v = upstream.headers.get(h)
      if (v) headers[h] = v
    }
    res.writeHead(upstream.status, headers)
    const buf = Buffer.from(await upstream.arrayBuffer())
    res.end(buf)
    console.log(`${req.method} ${req.url} → ${upstream.status} (${buf.length}b)`)
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json', ...cors })
    res.end(JSON.stringify({ error: String(err), target }))
    console.error(`${req.method} ${req.url} → 502: ${err}`)
  }
})

server.listen(PORT, () => {
  console.log(`OSRS proxy listening on http://127.0.0.1:${PORT}`)
  console.log(`  /prices/latest  /prices/mapping`)
  console.log(`  /wom/players/<rsn>   (POST to refresh)`)
  console.log(`  /wiki/api.php?...    /wiki/w/<Page>   /wiki/images/<File>.png`)
})

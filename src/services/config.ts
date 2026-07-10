// API base URLs.
//
// The OSRS Wiki prices API and Wise Old Man API both require a descriptive
// User-Agent. Browsers cannot set that header from fetch(), so:
//   - dev:  requests go through the Vite proxy (vite.config.ts) which stamps
//           the User-Agent on before forwarding.
//   - prod: requests go direct — both APIs send CORS headers. If either API
//           starts rejecting UA-less browser traffic, front the app with any
//           tiny passthrough proxy that adds the header (see CLAUDE.md).
export const PRICES_BASE = import.meta.env.DEV
  ? '/proxy/prices'
  : 'https://prices.runescape.wiki/api/v1/osrs'

export const WOM_BASE = import.meta.env.DEV
  ? '/proxy/wom'
  : 'https://api.wiseoldman.net/v2'

/** Ben's RSN. Any component can track any skill for this account. */
export const DEFAULT_RSN = 'B 3 N N O'

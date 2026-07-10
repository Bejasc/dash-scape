import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The OSRS Wiki prices API and Wise Old Man API both ask clients to send a
// descriptive User-Agent. Browsers cannot set the User-Agent header from
// fetch(), so in dev we route through this proxy which stamps it on.
// In production builds the app calls the APIs directly (both send CORS
// headers); see src/services/config.ts.
const USER_AGENT = 'ben-osrs-dashboard - github.com/Bejasc/dash-scape'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/proxy/prices': {
        target: 'https://prices.runescape.wiki',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/prices/, '/api/v1/osrs'),
        headers: { 'User-Agent': USER_AGENT },
      },
      '/proxy/wom': {
        target: 'https://api.wiseoldman.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/wom/, '/v2'),
        headers: { 'User-Agent': USER_AGENT },
      },
    },
  },
})

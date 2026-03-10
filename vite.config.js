import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const SECRET_KEY = 'sk_live_ssQPxf1BcKU1W5GayIpFFQFY4n2xvKMHRbvP8hs1TOeFK57W'
const COMPANY_ID = '91e80b85-a9f7-4b42-9c40-d22918396be2'
const credentials = Buffer.from(`${SECRET_KEY}:${COMPANY_ID}`).toString('base64')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ghostspay': {
        target: 'https://api.ghostspaysv2.com/functions/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ghostspay/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', `Basic ${credentials}`)
            proxyReq.setHeader('Content-Type', 'application/json')
          })
        }
      }
    }
  }
})


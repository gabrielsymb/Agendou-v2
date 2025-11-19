import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    host: true,
    port: 5173,
    // aceita qualquer <sub>.trycloudflare.com e localhost
    allowedHosts: ['.trycloudflare.com', 'localhost', '127.0.0.1']
  }
})

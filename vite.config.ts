import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8'),
) as { dependencies: Record<string, string> }

// The playground sandbox loads these two from a CDN. Reading the range from
// package.json here means the sandbox can never silently drift from the
// versions the rest of the repo is developed against.
const exact = (name: string) => JSON.stringify(pkg.dependencies[name]!.replace(/^[\^~]/, ''))

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  define: {
    __EFFECT_VERSION__: exact('effect'),
    __ATOM_VUE_VERSION__: exact('@effect/atom-vue'),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    // @vue/repl ships its own pre-bundled deps (Monaco, the Volar workers and
    // the SFC compiler). Pre-bundling it again breaks its worker resolution.
    exclude: ['@vue/repl'],
  },
})

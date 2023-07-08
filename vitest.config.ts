import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    root: './',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', 'test', 'release'],
  },
  resolve: {
    alias: {
      '@/render': fileURLToPath(new URL('./src', import.meta.url)),
      '@/share': fileURLToPath(new URL('./packages/share', import.meta.url)),
      '@/main': fileURLToPath(new URL('./electron/main', import.meta.url)),
      '@/preload': fileURLToPath(new URL('./electron/preload', import.meta.url)),
    },
  },
})

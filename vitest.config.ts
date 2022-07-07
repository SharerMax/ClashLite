import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'test'],
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

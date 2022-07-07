import { rmSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
// import renderer from 'vite-plugin-electron/renderer'
import Unocss from 'unocss/vite'
import { env } from './package.json'

rmSync('dist', { recursive: true, force: true }) // v14.14.0

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    vue(),
    Unocss(),
    mode !== 'debug'
      ? electron({
        main: {
          entry: 'electron/main/index.ts',
          vite: {
            build: {
              sourcemap: false,
              outDir: 'dist/electron/main',
            },
            resolve: {
              alias: {
                '@/main': fileURLToPath(new URL('./electron/main', import.meta.url)),
                '@/share': fileURLToPath(new URL('./packages/share', import.meta.url)),
              },
            },
          },
        },
        preload: {
          input: {
            // You can configure multiple preload here
            index: join(__dirname, 'electron/preload/index.ts'),
          },
          vite: {
            build: {
              // For debug
              sourcemap: 'inline',
              outDir: 'dist/electron/preload',
            },
            resolve: {
              alias: {
                '@/preload': fileURLToPath(new URL('./electron/preload', import.meta.url)),
                '@/share': fileURLToPath(new URL('./packages/share', import.meta.url)),
              },
            },
          },
        },
      })
      : undefined,
    // Enable use Electron, Node.js API in Renderer-process
    // renderer(),
  ],
  resolve: {
    alias: {
      '@/render': fileURLToPath(new URL('./src', import.meta.url)),
      '@/share': fileURLToPath(new URL('./packages/share', import.meta.url)),
    },
  },
  server: {
    host: env.VITE_DEV_SERVER_HOST,
    port: env.VITE_DEV_SERVER_PORT,
  },
  build: {
    outDir: 'dist/electron/renderer',
    emptyOutDir: false,
  },
}))

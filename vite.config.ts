import { rmSync } from 'node:fs'

// import { join } from 'path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// eslint-disable-next-line import/default
import electron from 'vite-plugin-electron'
import VueDevTools from 'vite-plugin-vue-devtools'

// import renderer from 'vite-plugin-electron/renderer'
import Unocss from 'unocss/vite'
import { env } from './package.json'

Object.assign(process.env, { VITE_DEV_SERVER_HOST: env.VITE_DEV_SERVER_HOST, VITE_DEV_SERVER_PORT: env.VITE_DEV_SERVER_PORT })
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode !== 'debug') {
    rmSync('dist', { recursive: true, force: true }) // v14.14.0
  }
  return {
    base: './',
    plugins: [
      vue(),
      Unocss(),
      VueDevTools(),
      mode !== 'debug'
        ? electron([{
          entry: 'electron/main/index.ts',
          vite: {
            resolve: {
              alias: {
                '@/preload': fileURLToPath(new URL('./electron/preload', import.meta.url)),
                '@/main': fileURLToPath(new URL('./electron/main', import.meta.url)),
                '@/render': fileURLToPath(new URL('./src', import.meta.url)),
              },
            },
            build: {
              sourcemap: 'inline',
              outDir: 'dist/electron/main',
            },
          },
        }, {
          entry: 'electron/preload/index.ts',
          vite: {
            resolve: {
              alias: {
                '@/preload': fileURLToPath(new URL('./electron/preload', import.meta.url)),
                '@/main': fileURLToPath(new URL('./electron/main', import.meta.url)),
                '@/render': fileURLToPath(new URL('./src', import.meta.url)),
              },
            },
            build: {
              sourcemap: 'inline',
              outDir: 'dist/electron/preload',
            },
          },
        }])
        : undefined,
      // Enable use Electron, Node.js API in Renderer-process
      // renderer(),
    ],
    resolve: {
      alias: {
        '@/preload': fileURLToPath(new URL('./electron/preload', import.meta.url)),
        '@/main': fileURLToPath(new URL('./electron/main', import.meta.url)),
        '@/render': fileURLToPath(new URL('./src', import.meta.url)),
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
  }
})

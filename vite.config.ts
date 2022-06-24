import { rmSync } from 'fs'
import { join } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
// import renderer from 'vite-plugin-electron/renderer'
import Unocss from 'unocss/vite'
import { builtinModules } from 'module'

rmSync('dist', { recursive: true, force: true }) // v14.14.0

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    Unocss(),
    electron({
      main: {
        entry: 'electron/main/index.ts',
        vite: {
          build: {
            sourcemap: false,
            outDir: 'dist/electron/main',
            rollupOptions: {
              external: [
                'electron',
                ...builtinModules,
                ...builtinModules.map(((module) => `node:${module}`)),
              ],
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
            rollupOptions: {
              external: [
                'electron',
                ...builtinModules,
                ...builtinModules.map(((module) => `node:${module}`)),
              ],
            },
          },
        },
      },
    }),
    // Enable use Electron, Node.js API in Renderer-process
    // renderer(),
  ],
  build: {
    outDir: 'dist/electron/renderer',
  },
})

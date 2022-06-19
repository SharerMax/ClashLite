import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  rules: [
    [/^font-size-(\d+)$/, ([, d]) => ({ 'font-size': `${+d / 4}rem` })],
  ],
})

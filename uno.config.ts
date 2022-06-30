import type { UserConfig } from 'unocss'
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  rules: [
    ['font-fira-code', { 'font-family': 'v-mono' }],
    [/^font-size-(\d+)$/, ([, d]) => ({ 'font-size': `${+d / 4}rem` })],
  ],
}) as UserConfig

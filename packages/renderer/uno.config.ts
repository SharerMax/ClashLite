import { defineConfig, presetUno, UserConfig } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  rules: [
    [/^font-size-(\d+)$/, ([, d]) => ({ 'font-size': `${+d / 4}rem` })],
  ],
}) as UserConfig

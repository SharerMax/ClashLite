import type { BaseClashConfig } from '@/share/type'

export function checkClashHealth(config: Pick<BaseClashConfig, 'port' | 'mixed-port' | 'socks-port'>) {
  return config['mixed-port'] !== 0 || config.port !== 0 || config['socks-port'] !== 0
}

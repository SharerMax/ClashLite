export type Network = 'tcp' | 'udp'

export type RunMode = 'direct' | 'global' | 'rule'

export interface BaseClashConfig {
  mode: RunMode
  port: number
  'socks-port': number
  'mixed-port': number
  'redir-port': number
  'allow-lan': boolean
  'bind-address': string
  authentication: string[]
  'log-level': 'info' | 'warning ' | 'error' | 'debug' | 'silent'
}

export interface ClashStartInfo {
  controllerUrl: string
  apiSecret: string
}

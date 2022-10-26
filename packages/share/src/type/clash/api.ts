import type { Network } from './base'
export interface Connection {
  id: string
  metadata: Metadata
  upload: number
  download: number
  start: Date
  chains: string[]
  rule: string
  rulePayload: string
}

export interface Metadata {
  network: Network | Uppercase<Network>
  type: string
  sourceIP: string
  destinationIP: string
  sourcePort: string
  destinationPort: string
  host: string
  dnsMode: string
  processPath: string
}

export interface Connections {
  upload: number
  download: number
  connections: Connection[]
}

export interface version {
  premium: boolean
  version: string
}

export interface ProxyInfo {
  history: {
    time: string
    delay: number
  }[]
  name: string
  type: string
  udp: boolean
}

export interface ProxyGroupInfo extends ProxyInfo {
  all: string[]
  now: string
}

export interface Proxies {
  proxies: {
    [K: string]: ProxyInfo | ProxyGroupInfo
  }
}

export interface ProxyDelay {
  delay: number
}

export interface ProxyProvider {
  name: string
  proxies: Array<ProxyInfo | ProxyGroupInfo>
}

export interface ProxyProviders {
  [K: string]: ProxyProvider
}

export interface Rule {
  type: string
  payload: string
  proxy: string
}

export interface Rules {
  rules: Rule[]
}

export interface RuleProvider {
  name: string
  type: 'Rule'
  vehicleType: 'HTTP' | 'File'
  behavior: string
  ruleCount: number
  updatedAt?: string
}

export interface RuleProviders {
  providers: Record<string, RuleProvider>
}

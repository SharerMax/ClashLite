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
  all?: string[]
  now?: keyof ProxyInfo['all']
  history: {
    time: string
    delay: number
  }[]
  name: string
  type: string
  udp: boolean
}

// type A = string[]
// export type B = keyof A
// export const a: A = ['1', '2']
// export const b: B = '1'

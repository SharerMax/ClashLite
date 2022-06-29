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

export namespace Api {
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

  export interface ConnectionsResponse {
    upload: number
    download: number
    connections: Connection[]
  }
}

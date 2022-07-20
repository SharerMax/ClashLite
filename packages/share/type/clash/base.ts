// TODO maybe we can have a define function to restrict[constraint] type use generics
// use condition more explicit determine relationship
import type { ClashProxy } from '../proxy'

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

export type ProxyGroupType = 'relay' | 'auto' | 'fallback' | 'load-balance' | 'select'

// TODO  more type
export interface ProxyGroup {
  name: string
  type: ProxyGroupType
  use?: string[]
  proxies?: string[]
}

export interface ProxyProviders {
  [k: string]: HttpProxyProvide | FileProxyProvide
}
export interface HttpProxyProvide {
  type: 'http'
  url: string
  interval: number
  path: string
  'health-check': {
    enable: boolean
    interval: number
    lazy?: boolean
    url: string
  }
}

export interface FileProxyProvide {
  type: 'file'
  path: string
  'health-check': {
    enable: boolean
    interval: number
    url: string
  }
}

export interface ClashConfig extends BaseClashConfig {
  proxies: ClashProxy[]
  'proxy-groups': ProxyGroup[]
  'proxy-providers': ProxyProviders
  'rules': string[]
}

export interface ClashStartInfo {
  controllerUrl: string
  apiSecret: string
}

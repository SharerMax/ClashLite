export type ProxType = 'ss' | 'vmess' | 'trojan' | 'ssr' | 'http' | 'socks5' | 'snell'

interface BaseProxy {
  name: string
  type: ProxType
  port: number
  server: string
}

interface BaseShadowSocks extends BaseProxy {
  readonly type: 'ss'
  name: string
  password: string
  cipher:
  'aes-128-gcm' | 'aes-192-gcm' | 'aes-256-gcm' |
  'aes-128-cfb' | 'aes-192-cfb' | 'aes-256-cfb' |
  'aes-128-ctr' | 'aes-192-ctr' | 'aes-256-ctr' |
  'rc4-md5' | 'chacha20-ietf' | 'xchacha20' |
  'chacha20-ietf-poly1305' | 'xchacha20-ietf-poly1305'
}

interface ShadowSocksWithObfs extends BaseShadowSocks {
  plugin: 'obfs'
  'plugin-opt': {
    mode: 'http' | 'tls'
    host?: string
  }
}

interface ShadowSocksWithV2ray extends BaseShadowSocks {
  plugin: 'v2ray-plugin'
  'plugin-opt': {
    mode: 'websocket'
    tls?: boolean
    host?: string
    'skip-cert-verify'?: boolean
    path?: string
    mux?: boolean
    headers?: {
      [k: string]: string
    }
  }
}

export type ShadowSocks = BaseShadowSocks | ShadowSocksWithObfs | ShadowSocksWithV2ray

export type ClashProxy = ShadowSocks

export type ProxType = 'ss' | 'vmess' | 'trojan' | 'ssr' | 'http' | 'socks5' | 'snell'
export type ShadowSocksCipher =
    'aes-128-gcm' | 'aes-192-gcm' | 'aes-256-gcm' |
    'aes-128-cfb' | 'aes-192-cfb' | 'aes-256-cfb' |
    'aes-128-ctr' | 'aes-192-ctr' | 'aes-256-ctr' |
    'rc4-md5' | 'chacha20-ietf' | 'xchacha20' |
    'chacha20-ietf-poly1305' | 'xchacha20-ietf-poly1305'

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
  cipher: ShadowSocksCipher
}

export interface ShadowSocksWithObfs extends BaseShadowSocks {
  plugin: 'obfs'
  'plugin-opt': {
    mode: 'http' | 'tls'
    host?: string
  }
}

export interface ShadowSocksWithV2ray extends BaseShadowSocks {
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

export interface HttpProxy extends BaseProxy {
  type: 'http'
  username?: string
  password?: string
  tls: boolean
  'skip-cert-verify': boolean
  sni?: string
}

export interface SocksProxy extends BaseProxy {
  type: 'socks5'
  username?: string
  password?: string
  tls: boolean
  'skip-cert-verify': boolean
  sni?: string
  udp: boolean
}

export interface SnellProxy extends BaseProxy {
  type: 'snell'
  psk: string
  version?: 2
  'obfs-opts': {
    mode: 'http' | 'tls'
    host: string
  }
}
export interface OrdinaryTrojanProxy extends BaseProxy {
  type: 'trojan'
  password: string
  udp: boolean
  sni?: string
  alpn: ['h2', 'http/1.1'] | ['http/1.1']
  'skip-cert-verify': boolean
}

export interface TrojanGrpcProxy extends BaseProxy {
  type: 'trojan'
  password: string
  network: 'grpc'
  udp: boolean
  sni: string
  'skip-cert-verify': boolean
  'grpc-opts': {
    'grpc-service-name': string
  }
}

export interface TrojanWebsocketProxy extends BaseProxy {
  type: 'trojan'
  password: string
  network: 'ws'
  sni: string
  udp: boolean
  'skip-cert-verify': boolean
  'ws-opts'?: {
    path: string
    headers: {
      Host?: string
    }
  }
}

export type TrojanProxy = OrdinaryTrojanProxy | TrojanGrpcProxy | TrojanWebsocketProxy

export type ShadowsocksRObfs = 'plain' | 'http_simple' | 'http_post' | 'random_head' | 'tls1.2_ticket_auth' | 'tls1.2_ticket_fastauth'
export type ShadowsocksRProtocol = 'origin' | 'auth_sha1_v4' | 'auth_aes128_md5' | 'auth_aes128_sha1' | 'tls1.auth_chain_a' | 'tls1.auth_chain_b'
export interface ShadowSocksRProxy extends BaseProxy {
  type: 'ssr'
  cipher: ShadowSocksCipher
  password: string
  obfs: ShadowsocksRObfs
  protocol: ShadowsocksRProtocol
  'obfs-param'?: string
  'protocol-param'?: string
  udp: boolean
}
/**
 * https://www.v2fly.org/config/protocols/vmess.html
 */
type VmessCipher = 'auto' | 'aes-128-gcm' | 'chacha20-poly1305' | 'none' | 'zero'

interface BaseVmessProxy extends BaseProxy {
  type: 'vmess'
  uuid: string
  alertId: number
  cipher: VmessCipher
  udp: boolean
}

export interface OrdinaryVmessProxy extends BaseVmessProxy {
  tls: boolean
  'skip-cert-verify': boolean
  servername?: string
}

/**
 * vmess with websocket
 */
export interface VmessWebsocketProxy extends OrdinaryVmessProxy {
  network: 'ws'
  'ws-opts': {
    path: string
    headers?: {
      Host: string
    }
    'max-early-data'?: number
    'early-data-header-name'?: string
  }
}
/**
 * vmess with http2
 * https://www.v2fly.org/config/transport/h2.html
 */
export interface VmessH2Proxy extends OrdinaryVmessProxy {
  network: 'h2'
  'h2-opts': {
    host: string[]
    path: string
  }
}
/**
 * vmess with http
 * https://www.v2fly.org/config/transport/tcp.html#httprequestobject
 */
export interface VmessHttpProxy extends BaseVmessProxy {
  network: 'http'
  'http-opts': {
    method: 'PUT' | 'GET' | 'DELETE' | 'POST' | 'PATCH' // other can use ?
    path: string[]
    headers?: Record<string, string[]>
  }
}
/**
 * vmess with gRPC
 * https://www.v2fly.org/config/transport/grpc.html
 */
export interface VmessGrpcProxy extends OrdinaryVmessProxy {
  network: 'grpc'
  'grpc-opts': {
    'grpc-service-name': string
  }
}

export type VmessProxy = OrdinaryVmessProxy | VmessWebsocketProxy | VmessH2Proxy | VmessHttpProxy | VmessGrpcProxy

export type ClashProxy = ShadowSocks | ShadowSocksRProxy | HttpProxy | SocksProxy | SnellProxy | TrojanProxy

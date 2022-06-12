export type ProxType = 'ss' | 'vmess' | 'trojan' | 'ssr' | 'http' | 'socks5' | 'snell'
interface BaseProxy {
  name: string,
  type: ProxType,
  port: number
}

export interface ShadowSocks extends BaseProxy {
  readonly type: 'ss',
  name: string,
  password: string,
  cipher:
  'aes-128-gcm' | 'aes-192-gcm' | 'aes-256-gcm' |
  'aes-128-cfb' | 'aes-192-cfb' | 'aes-256-cfb' |
  'aes-128-ctr' | 'aes-192-ctr' | 'aes-256-ctr' |
  'rc4-md5' | 'chacha20-ietf' | 'xchacha20' |
  'chacha20-ietf-poly1305' | 'xchacha20-ietf-poly1305',
  plugin?: 'obfs' | 'v2ray-plugin',
  'plugin-opt'?: {
    mode: 'tls' | 'http' | 'websocket',
    host?: string,
    tls?: boolean,
    'skip-cert-verify'?: boolean,
    path? : string,
    mux?: boolean,
    headers?: {
      [k: string]: string
    }
  },
}

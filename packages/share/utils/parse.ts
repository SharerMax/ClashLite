import { decode } from 'js-base64'
import URL from 'url-parse'
import type { ClashProxy, HttpProxy, ShadowSocks, ShadowSocksWithObfs, ShadowSocksWithV2ray } from '../type'
export type ProxySubType = 'plain' | 'base64' | 'sip008' | 'clash'

export function parseProxySubContent(type: ProxySubType, content: string) {
  switch (type) {
    case 'plain': return parsePlainProxyContent(content)
    case 'base64': return parseBase64SubContent(content)
    case 'sip008': return parseSIP008SubContent(content)
    case 'clash': return parseClashSubContent(content)
  }
}

function parsePlainProxyContent(content: string): ClashProxy | null {
  console.log(content)
  return null
}

function parseBase64SubContent(content: string): ClashProxy | null {
  console.log(content)
  return null
}

function parseSIP008SubContent(content: string): ClashProxy | null {
  console.log(content)
  return null
}

function parseClashSubContent(content: string): ClashProxy | null {
  console.log(content)
  return null
}

// https://shadowsocks.org/guide/configs.html#uri-and-qr-code
// ss://YmYtY2ZiOnRlc3QvIUAjOkAxOTIuMTY4LjEwMC4xOjg4ODg#123
export function parseShadowsocksLegacyUri(uri: string): ClashProxy | null {
  if (!uri) {
    return null
  }
  const hashIndex = uri.indexOf('#')
  let name = ''
  let withOutNameUri = uri
  if (hashIndex > 0) {
    [withOutNameUri, name] = uri.split('#')
  }

  const decodeInfo = decode(withOutNameUri.slice(5))
  const serveSplitIndex = decodeInfo.lastIndexOf('@')
  const userInfo = decodeInfo.slice(0, serveSplitIndex)
  const serverInfo = decodeInfo.slice(serveSplitIndex + 1)
  const [cipher, password] = userInfo.split(':')
  const [server, port] = serverInfo.split(':')
  return {
    type: 'ss',
    name,
    server,
    cipher: cipher as ShadowSocks['cipher'],
    password,
    port: parseInt(port),
  }
}

// https://github.com/shadowsocks/shadowsocks-org/wiki/SIP002-URI-Scheme
// https://shadowsocks.org/guide/sip002.html

export function parseShadowsocksSIP002URI(uri: string): ClashProxy | null {
  if (uri) {
    // ss://cmM0LW1kNTpwYXNzd2Q@us.proxy.com:8888/?plugin=obfs-local%3Bobfs%3Dhttp#Example2
    // const regex = /ss:\/\/(\S+)@(\S+):(\d+)(?:\/\?plugin=(\S+))?#(\S+)/
    // const [userInfo, host, port, pluginArgs, name] = uri.match(regex) ?? []
    const ssUrl = new URL(decodeURIComponent(uri))
    const [cipher, password] = decode(ssUrl.username).split(':')
    const host = ssUrl.hostname
    const port = parseInt(ssUrl.port)
    const pluginInfo = new URLSearchParams(ssUrl.query).get('plugin') || ''
    const name = ssUrl.hash.slice(1)
    console.log(cipher, password, host, port, pluginInfo, name)

    const baseSSConfig: ShadowSocks = {
      type: 'ss',
      name,
      server: host,
      cipher: cipher as ShadowSocks['cipher'],
      password: decodeURIComponent(password),
      port,
    }
    if (pluginInfo) {
      const [pluginName, ...pluginArgs] = pluginInfo.split(';')
      if (pluginName === 'obfs-local' || pluginName === 'obfs') {
        const obfsConfig = baseSSConfig as ShadowSocksWithObfs
        const optArgs: Record<string, string> = {}
        for (const opts of pluginArgs) {
          const [key, value] = opts.split('=')
          optArgs[key] = value
        }
        obfsConfig.plugin = 'obfs'
        const pluginOpt = {
          mode: optArgs.obfs === 'tls' ? 'tls' : 'http',
          host: optArgs['obfs-host'] ?? '',
        }

        obfsConfig['plugin-opt'] = pluginOpt as ShadowSocksWithObfs['plugin-opt']
        return obfsConfig
      }
      else if (pluginName === 'v2ray-plugin') {
        const v2rayPluginConfig = baseSSConfig as ShadowSocksWithV2ray
        v2rayPluginConfig.plugin = 'v2ray-plugin'
        const optArgs: Record<string, string> = {}
        for (const opts of pluginArgs) {
          const [key, value] = opts.split('=')
          optArgs[key] = value
        }
        const pluginOpt: ShadowSocksWithV2ray['plugin-opt'] = {
          mode: 'websocket',
          tls: 'tls' in optArgs,
          host: optArgs.host ?? '',
          path: optArgs.path ?? '',
        }
        v2rayPluginConfig['plugin-opt'] = pluginOpt
        return v2rayPluginConfig
      }
    }
    return baseSSConfig
  }
  return null
}

export function parseHttpUri(uri: string): HttpProxy | null {
  if (uri) {
    const parsed = new URL(uri)
    const protocol = parsed.protocol
    // TODO will check http(s) proxy scheme
    if (protocol.startsWith('https')) {
      return {
        'name': parsed.hash ? encodeURIComponent(parsed.hash.slice(1)) : parsed.hostname,
        'type': 'http',
        'tls': true,
        'username': parsed.username,
        'password': parsed.password,
        'port': +parsed.port,
        'skip-cert-verify': false,
        'server': parsed.hostname,
      }
    }
    else if (protocol.startsWith('http')) {
      return {
        'name': parsed.hash ? encodeURIComponent(parsed.hash.slice(1)) : parsed.hostname,
        'type': 'http',
        'tls': false,
        'username': parsed.username,
        'password': parsed.password,
        'port': +parsed.port,
        'skip-cert-verify': false,
        'server': parsed.hostname,
      }
    }
  }

  return null
}

import { decode as decodeBase64, isValid as isBase64Valid } from 'js-base64'
import URL from 'url-parse'
import { toUnicode } from 'punycode-esm'
import type { ClashProxy, HttpProxy, ShadowSocks, ShadowSocksCipher, ShadowSocksRProxy, ShadowSocksWithObfs, ShadowSocksWithV2ray, ShadowsocksRObfs, ShadowsocksRProtocol, SocksProxy, TrojanProxy, VmessProxy } from '../type'
import { parse as parseJson } from './json-helper'
export type ProxySubType = 'plain' | 'base64' | 'sip008' | 'clash'

export function parseProxySubContent(type: ProxySubType, content: string) {
  switch (type) {
    case 'plain': return parsePlainProxyContent(content)
    case 'base64': return parseBase64SubContent(content)
    case 'sip008': return parseSIP008SubContent(content)
    case 'clash': return parseClashSubContent(content)
  }
}

function parsePlainProxyContent(content: string): ClashProxy[] | null {
  if (content) {
    const uriList = content.split(/\s/)
    console.log(uriList)
    const clashProxyList: ClashProxy[] = []
    for (const uri of uriList) {
      const clashProxy = parseUri(uri.trim())
      console.log('============')
      console.log(`raw: ${uri}`)
      console.log(`clash: ${JSON.stringify(clashProxy)}`)
      console.log('============')
      if (clashProxy) {
        clashProxyList.push(clashProxy)
      }
    }
    return clashProxyList
  }

  return null
}

function parseBase64SubContent(content: string): ClashProxy[] | null {
  if (isBase64Valid(content)) {
    const decodedContent = decodeBase64(content)
    return parsePlainProxyContent(decodedContent)
  }
  return null
}

function parseSIP008SubContent(_content: string): ClashProxy | null {
  return null
}

function parseClashSubContent(_content: string): ClashProxy | null {
  return null
}

export function parseUri(uri: string): ClashProxy | null {
  const protocol = new URL(uri).protocol
  console.log(uri, protocol)
  switch (protocol) {
    case 'ss:':
      return parseShadowsocksUri(uri)
    case 'vmess:':
      return parseVmessUri(uri)
    case 'trojan:':
    case 'trojan-go:':
      return parseTrojanUri(uri)
    case 'http:':
    case 'https:':
      return parseHttpUri(uri)
    case 'socks5:':
      return parseSocksUri(uri)
  }
  return null
}

export function parseShadowsocksUri(uri: string): ShadowSocks | null {
  if (uri) {
    if (uri.includes('@')) {
      return parseShadowsocksUri(uri)
    }
    else {
      return parseShadowsocksLegacyUri(uri)
    }
  }
  return null
}

function fillBase64Content(content: string) {
  if (content) {
    const length = content.length
    const fillCount = length % 4
    if (fillCount !== 0) {
      return content + '='.repeat(fillCount)
    }
  }
  return content
}

// https://shadowsocks.org/guide/configs.html#uri-and-qr-code
// ss://YmYtY2ZiOnRlc3QvIUAjOkAxOTIuMTY4LjEwMC4xOjg4ODg#123
export function parseShadowsocksLegacyUri(uri: string): ShadowSocks | null {
  if (!uri) {
    return null
  }
  const hashIndex = uri.indexOf('#')
  let name = ''
  let withOutNameUri = uri
  if (hashIndex > 0) {
    [withOutNameUri, name] = uri.split('#')
  }

  const decodeInfo = decodeBase64(fillBase64Content(withOutNameUri.slice(5)))
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
    const [cipher, password] = decodeBase64(ssUrl.username).split(':')
    const host = ssUrl.hostname
    const port = parseInt(ssUrl.port)
    const pluginInfo = new URLSearchParams(ssUrl.query).get('plugin') || ''
    const name = ssUrl.hash.slice(1)
    // console.log(cipher, password, host, port, pluginInfo, name)

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

export function parseSocksUri(uri: string): SocksProxy | null {
  if (!uri) {
    return null
  }
  const socksUrl = new URL(uri)
  return {
    'type': 'socks5',
    'name': socksUrl.hash ? decodeURIComponent(socksUrl.hash.slice(1)) : socksUrl.hostname,
    'server': socksUrl.hostname,
    'port': +socksUrl.port,
    'username': socksUrl.username || '',
    'password': socksUrl.password || '',
    'tls': false,
    'udp': true,
    'sni': '',
    'skip-cert-verify': false,
  }
}

export function parseTrojanUri(uri: string): TrojanProxy | null {
  if (uri && (uri.startsWith('trojan://') || uri.startsWith('trojan-go://'))) {
    const trojanUrl = new URL(uri)
    const name = trojanUrl.hash ? decodeURIComponent(trojanUrl.hash) : trojanUrl.hostname
    const server = toUnicode(trojanUrl.hostname)
    const port = +trojanUrl.port || 443
    const password = decodeURIComponent(trojanUrl.auth)
    const queryParams = new URLSearchParams(trojanUrl.query)
    const trojanType = queryParams.get('type')
    if (!trojanType) {
      return {
        'type': 'trojan',
        name,
        server,
        port,
        password,
        'alpn': ['h2', 'http/1.1'],
        'skip-cert-verify': false,
        'udp': true,
      }
    }
    else if (trojanType === 'ws') {
      const wsPath = decodeURIComponent(queryParams.get('path') || '') || '/'
      const host = decodeURIComponent(queryParams.get('host') || '') || server
      const sni = decodeURIComponent(queryParams.get('sni') || '') || server
      const tls = queryParams.has('tls') || !queryParams.has('allowInsecure')
      return {
        'type': 'trojan',
        name,
        server,
        port,
        password,
        'network': 'ws',
        sni,
        'skip-cert-verify': !tls,
        'udp': true,
        'ws-opts': {
          path: wsPath,
          headers: {
            Host: host,
          },
        },
      }
    }
  }
  return null
}

interface V2rayNUri {
  v: string
  ps: string
  add: string
  port: string
  id: string
  aid: string
  scy: 'auto' | 'aes-128-gcm' | 'chacha20-poly1305' | 'none' | 'zero'
  net: string
  type: string
  host: string
  path: string
  tls: string
  sni: string
}

export function parseVmessUri(uri: string): VmessProxy | null {
  if (uri && uri.startsWith('vmess://')) {
    const encodedUri = uri.slice(8)
    const v2rayNFormat = decodeBase64(encodedUri)
    // dirty handle
    const uriObj = parseJson(v2rayNFormat) as V2rayNUri
    if (!uriObj) {
      return null
    }
    const name = uriObj.ps
    const alertId = +uriObj.aid
    const uuid = uriObj.id
    const port = +uriObj.port
    const cipher = uriObj.scy || 'auto'
    const server = uriObj.add
    const netType = uriObj.net
    const tls = Boolean(uriObj.tls)
    const sni = uriObj.sni || uriObj.add
    if (netType === 'tcp') {
      const obfsType = uriObj.type
      if (obfsType === 'http') {
        const path = uriObj.path || '/'
        const host = uriObj.host || server

        return {
          name,
          'type': 'vmess',
          server,
          port,
          cipher,
          alertId,
          'udp': true,
          uuid,
          'network': 'http',
          'http-opts': {
            method: 'PUT',
            path: [path],
            headers: {
              Host: host.split(','),
            },
          },
        }
      }
      return {
        name,
        'type': 'vmess',
        server,
        port,
        cipher,
        alertId,
        'udp': true,
        uuid,
        tls,
        'servername': sni,
        'skip-cert-verify': false,
      }
    }
    else if (netType === 'ws') {
      const host = uriObj.host || server
      const path = uriObj.path || '/'
      return {
        name,
        'type': 'vmess',
        server,
        port,
        cipher,
        alertId,
        'udp': true,
        uuid,
        tls,
        'servername': sni,
        'skip-cert-verify': false,
        'network': 'ws',
        'ws-opts': {
          path,
          headers: {
            Host: host,
          },
        },
      }
    }
    else if (netType === 'h2') {
      const host = uriObj.host || server
      const path = uriObj.path || '/'
      return {
        name,
        'type': 'vmess',
        server,
        port,
        cipher,
        alertId,
        'udp': true,
        uuid,
        tls,
        'servername': sni,
        'skip-cert-verify': false,
        'network': 'h2',
        'h2-opts': {
          host: host.split(','),
          path,
        },
      }
    }
    else if (netType === 'grpc') {
      const path = uriObj.path || '/'
      return {
        name,
        'type': 'vmess',
        server,
        port,
        cipher,
        alertId,
        'udp': true,
        uuid,
        tls,
        'servername': sni,
        'skip-cert-verify': false,
        'network': 'grpc',
        'grpc-opts': {
          'grpc-service-name': path,
        },
      }
    }
  }
  return null
}

// https://github.com/tindy2013/subconverter/blob/a24cb7c00a7e5a71ef2e6c0d64d84d91bc7a21d6/src/parser/subparser.cpp#L531-L566
export function parseShadowsocksRUri(uri: string): ShadowSocksRProxy | null {
  if (uri) {
    // ssr6.ssrsub.com:8333:origin:rc4-md5:plain:cGFzc2Z3MnhzNGUh
    //
    // ssr://c3NyNi5zc3JzdWIuY29tOjgzMzM6b3JpZ2luOnJjNC1tZDU6cGxhaW46Y0dGemMyWjNNbmh6TkdVaC8/b2Jmc3BhcmFtPVYxZFhMbGxQVlU1RlJVUXVWMGxPJnByb3RvcGFyYW09VjFkWExsbFBWVTVGUlVRdVYwbE8mcmVtYXJrcz1WMWRYTGxsUFZVNUZSVVF1VjBsTyZncm91cD1WMWRYTGxsUFZVNUZSVVF1VjBsTw==
    const ssrUri = decodeBase64(fillBase64Content(uri.slice(6)))
    const queryIndex = ssrUri.indexOf('/?')
    const serverInfo = ssrUri.slice(0, queryIndex)
    // ssr6.ssrsub.com:8333:origin:rc4-md5:plain:cGFzc2Z3MnhzNGUh
    const matchResult = serverInfo.match(/(\S+):(\d+):(\S+):(\S+):(\S+):(\S+)/)
    if (matchResult) {
      const [,server, port, protocol, method, obfs, password] = matchResult
      //  /?obfsparam=V1dXLllPVU5FRUQuV0lO&protoparam=V1dXLllPVU5FRUQuV0lO&remarks=V1dXLllPVU5FRUQuV0lO&group=V1dXLllPVU5FRUQuV0lO
      const params = new URLSearchParams(ssrUri.slice(queryIndex + 2))
      const group = decodeBase64(fillBase64Content(params.has('group') ? params.get('group') || '' : ''))
      const name = `${group}-${decodeBase64(fillBase64Content(params.has('remarks') ? params.get('remarks') || '' : server))}`
      const obfsparam = decodeBase64(fillBase64Content(params.has('obfsparam') ? params.get('obfsparam') || '' : ''))
      const protoparam = decodeBase64(fillBase64Content(params.has('protoparam') ? params.get('protoparam') || '' : ''))
      return {
        server,
        'port': +port,
        'type': 'ssr',
        'protocol': protocol as ShadowsocksRProtocol,
        'cipher': method as ShadowSocksCipher,
        'obfs': obfs as ShadowsocksRObfs,
        'password': decodeBase64(fillBase64Content(password)),
        'udp': true,
        'name': name || server,
        'obfs-param': obfsparam,
        'protocol-param': protoparam,
      }
    }
  }
  return null
}

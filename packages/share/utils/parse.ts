import { decode } from 'js-base64'
import URL from 'url-parse'
import type { ClashProxy } from '../type'
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
// function parseShadowscoksLegacyUri(uri: string) {
//   console.log(uri)
//   return null
// }

// https://github.com/shadowsocks/shadowsocks-org/wiki/SIP002-URI-Scheme
// https://shadowsocks.org/guide/sip002.html

export function parseShadowsocksSIP002URI(uri: string): ClashProxy | null {
  if (uri) {
    // ss://cmM0LW1kNTpwYXNzd2Q@us.proxy.com:8888/?plugin=obfs-local%3Bobfs%3Dhttp#Example2
    // const regex = /ss:\/\/(\S+)@(\S+):(\d+)(?:\/\?plugin=(\S+))?#(\S+)/
    // const [userInfo, host, port, pluginArgs, name] = uri.match(regex) ?? []
    const ssUrl = new URL(uri)
    const userInfo = decode(ssUrl.username).split(':')
    const host = ssUrl.hostname
    const port = parseInt(ssUrl.port)
    const pluginArgs = new URLSearchParams(ssUrl.query).get('plugin') || ''
    const name = ssUrl.hash.slice(1)
    console.log(userInfo[0], userInfo[1], host, port, pluginArgs, name)
    return {
      type: 'ss',
      name,
      server: host,
      cipher: userInfo[0] as ClashProxy['cipher'],
      password: userInfo[1],
      port,
    }
  }
  return null
}


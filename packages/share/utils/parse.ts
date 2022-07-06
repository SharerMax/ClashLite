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
function parseShadowscoksLegacyUri(uri: string) {
  console.log(uri)
  return null
}

// https://github.com/shadowsocks/shadowsocks-org/wiki/SIP002-URI-Scheme
// https://shadowsocks.org/guide/sip002.html
function parseShadowsocksSIP002URI(uri: string) {
  console.log(uri)
  return null
}


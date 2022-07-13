import { describe, expect, test } from 'vitest'
import { parseHttpUri, parseShadowsocksLegacyUri, parseShadowsocksSIP002URI, parseSocksUri, parseTrojanUri, parseVmessUri } from '../../utils/parse'
import type { OrdinaryTrojanProxy, OrdinaryVmessProxy, TrojanWebsocketProxy, VmessGrpcProxy, VmessH2Proxy, VmessHttpProxy, VmessWebsocketProxy } from '@/share/type'

describe('utils:parse', () => {
  test('parseShadowsocksSIP002UR', () => {
    const result = parseShadowsocksSIP002URI('ss://cmM0LW1kNTpwYXNzd2Q@us.proxy.com:8888#Example2')
    expect(result).toEqual({
      type: 'ss',
      name: 'Example2',
      server: 'us.proxy.com',
      cipher: 'rc4-md5',
      password: 'passwd',
      port: 8888,
    })
    const withV2rayResult = parseShadowsocksSIP002URI('ss://MjAyMi1ibGFrZTMtYWVzLTI1Ni1nY206WWN0UFo2VTd4UFBjVSUyQmdwM3UlMkIwdHglMkZ0Uml6Sk45Szh5JTJCdUtsVzJxamxJJTNE@192.168.100.1:8888/?plugin=v2ray-plugin%3Btls%3Bhost%3Dcn.bing.com#Example3')
    expect(withV2rayResult).toEqual({
      'type': 'ss',
      'name': 'Example3',
      'server': '192.168.100.1',
      'cipher': '2022-blake3-aes-256-gcm',
      'password': 'YctPZ6U7xPPcU+gp3u+0tx/tRizJN9K8y+uKlW2qjlI=',
      'port': 8888,
      'plugin': 'v2ray-plugin',
      'plugin-opt': {
        mode: 'websocket',
        host: 'cn.bing.com',
        tls: true,
        path: '',
      },
    })
    const withSimpleObfsResult = parseShadowsocksSIP002URI('ss://cmM0LW1kNTpwYXNzd2Q@us.proxy.com:8888/?plugin=obfs-local%3Bobfs%3Dhttp#Example2')
    expect(withSimpleObfsResult).toEqual({
      'type': 'ss',
      'name': 'Example2',
      'server': 'us.proxy.com',
      'cipher': 'rc4-md5',
      'password': 'passwd',
      'port': 8888,
      'plugin': 'obfs',
      'plugin-opt': {
        mode: 'http',
        host: '',
      },
    })
  })
  test('parseShadowsocksLegacyUri', () => {
    const result = parseShadowsocksLegacyUri('ss://cmM0LW1kNTp0ZXN0LyFAIzpAMTkyLjE2OC4xMDAuMTo4ODg4#Example1')
    expect(result).toEqual({
      type: 'ss',
      name: 'Example1',
      server: '192.168.100.1',
      cipher: 'rc4-md5',
      password: 'test/!@#',
      port: 8888,
    })
  })
  test('parseHttpProxy', () => {
    const nullResult = parseHttpUri('')
    expect(nullResult).toBeNull()
    const httpResult = parseHttpUri('http://user:password@192.168.1.2:8888#Example')
    expect(httpResult).toBeTruthy()
    expect(httpResult).toEqual({
      'type': 'http',
      'server': '192.168.1.2',
      'port': 8888,
      'username': 'user',
      'password': 'password',
      'name': 'Example',
      'skip-cert-verify': false,
      'tls': false,
    })
    const httpsResult = parseHttpUri('https://user:password@192.168.1.2:8888#Example')
    expect(httpsResult).toBeTruthy()
    expect(httpsResult).toEqual({
      'type': 'http',
      'server': '192.168.1.2',
      'port': 8888,
      'username': 'user',
      'password': 'password',
      'name': 'Example',
      'skip-cert-verify': false,
      'tls': true,
    })
  })

  test('parseSocksProxy', () => {
    const nullSocksResult = parseSocksUri('')
    expect(nullSocksResult).toBeNull()
    const socksResult = parseSocksUri('socks5://username:password@192.168.100.123:8000#Example')
    expect(socksResult).toEqual({
      'type': 'socks5',
      'name': 'Example',
      'server': '192.168.100.123',
      'port': 8000,
      'username': 'username',
      'password': 'password',
      'tls': false,
      'skip-cert-verify': false,
      'udp': true,
      'sni': '',
    })
  })

  test('parseTrojanProxy', () => {
    const emptyResult = parseTrojanUri('')
    expect(emptyResult).toBeNull()
    const originResult = parseTrojanUri('trojan://password1234@google.com:8443')
    expect(originResult).toEqual<OrdinaryTrojanProxy>({
      'type': 'trojan',
      'skip-cert-verify': false,
      'alpn': ['h2', 'http/1.1'],
      'name': 'google.com',
      'password': 'password1234',
      'port': 8443,
      'server': 'google.com',
      'udp': true,
    })
    const trojanResult = parseTrojanUri('trojan-go://password1234@google.com/?sni=microsoft.com&type=ws&host=youtube.com&path=%2Fgo&encryption=ss%3Baes-256-gcm%3Afuckgfw')
    expect(trojanResult).toEqual<TrojanWebsocketProxy>({
      'type': 'trojan',
      'name': 'google.com',
      'skip-cert-verify': false,
      'network': 'ws',
      'password': 'password1234',
      'server': 'google.com',
      'port': 443,
      'sni': 'microsoft.com',
      'udp': true,
      'ws-opts': {
        path: '/go',
        headers: {
          Host: 'youtube.com',
        },
      },
    })
  })
  test('parseVmessProxy', () => {
    const nullResult = parseVmessUri('')
    expect(nullResult).toBeNull()
    const ordinaryVmessProxy = parseVmessUri('vmess://eyJ2IjoiMiIsInBzIjoiXHU5OTk5XHU2ZTJmIFx1MDBiNyAxOCIsImFkZCI6Imdvb2dsZS5jb20iLCJwb3J0IjoiODAiLCJpZCI6IjA0OWMzYmI2LWU3NzEtNDI4Ni1iNmYyLTMzODdmOGE2NmIxMyIsImFpZCI6IjAiLCJuZXQiOiJ0Y3AiLCJ0eXBlIjoibm9uZSIsImhvc3QiOiIiLCJwYXRoIjoiIiwidGxzIjoiIn0=')
    expect(ordinaryVmessProxy).toEqual<OrdinaryVmessProxy>({
      'type': 'vmess',
      'name': '香港 · 18',
      'skip-cert-verify': false,
      'tls': false,
      'alertId': 0,
      'cipher': 'auto',
      'port': 80,
      'server': 'google.com',
      'udp': true,
      'uuid': '049c3bb6-e771-4286-b6f2-3387f8a66b13',
      'servername': 'google.com',
    })
    const websocketVmessProxy = parseVmessUri('vmess://eyJ2IjoiMiIsInBzIjoiXHU1M2YwXHU2ZTdlIFx1MDBiNyA4IiwiYWRkIjoiZ29vZ2xlLmNvbSIsInBvcnQiOiIxMDEiLCJpZCI6IjA0OWMzYmI2LWU3NzEtNDI4Ni1iNmYyLTMzODdmOGE2NmIxMyIsImFpZCI6IjAiLCJuZXQiOiJ3cyIsInR5cGUiOiJub25lIiwiaG9zdCI6IiIsInBhdGgiOiIiLCJ0bHMiOiIifQ==')
    expect(websocketVmessProxy).toEqual<VmessWebsocketProxy>({
      'type': 'vmess',
      'name': '台湾 · 8',
      'skip-cert-verify': false,
      'tls': false,
      'alertId': 0,
      'cipher': 'auto',
      'port': 101,
      'server': 'google.com',
      'udp': true,
      'uuid': '049c3bb6-e771-4286-b6f2-3387f8a66b13',
      'servername': 'google.com',
      'network': 'ws',
      'ws-opts': {
        path: '/',
        headers: {
          Host: 'google.com',
        },
      },
    })
  })
  const h2VmessProxy = parseVmessUri('vmess://eyJ2IjoiMiIsInBzIjoiRXhhbXBsZSIsImFkZCI6Imdvb2dsZS5jb20iLCJwb3J0IjoiNDQzIiwiaWQiOiIwNDljM2JiNi1lNzcxLTQyODYtYjZmMi0zMzg3ZjhhNjZiMTMiLCJhaWQiOiIwIiwibmV0IjoiaDIiLCJ0eXBlIjoibm9uZSIsImhvc3QiOiJmYWNlYm9vay5jb20iLCJwYXRoIjoiIiwidGxzIjoidGxzIiwgInNuaSI6ICJiaW5nLmNvbSIsICJzY3kiOiAibm9uZSJ9')
  expect(h2VmessProxy).toEqual<VmessH2Proxy>({
    'type': 'vmess',
    'name': 'Example',
    'skip-cert-verify': false,
    'tls': true,
    'alertId': 0,
    'cipher': 'none',
    'port': 443,
    'server': 'google.com',
    'udp': true,
    'uuid': '049c3bb6-e771-4286-b6f2-3387f8a66b13',
    'servername': 'bing.com',
    'network': 'h2',
    'h2-opts': {
      path: '/',
      host: ['facebook.com'],
    },
  })
  const httpVmessProxy = parseVmessUri('vmess://eyJ2IjoiMiIsInBzIjoiRXhhbXBsZSIsImFkZCI6Imdvb2dsZS5jb20iLCJwb3J0IjoiODAiLCJpZCI6IjA0OWMzYmI2LWU3NzEtNDI4Ni1iNmYyLTMzODdmOGE2NmIxMyIsImFpZCI6IjAiLCJuZXQiOiJ0Y3AiLCJ0eXBlIjoiaHR0cCIsImhvc3QiOiJmYWNlYm9vay5jb20iLCJwYXRoIjoiL2ZpbGUiLCAic2N5IjogImFlcy0xMjgtZ2NtIn0=')
  expect(httpVmessProxy).toEqual<VmessHttpProxy>({
    'type': 'vmess',
    'name': 'Example',
    'alertId': 0,
    'cipher': 'aes-128-gcm',
    'port': 80,
    'server': 'google.com',
    'udp': true,
    'uuid': '049c3bb6-e771-4286-b6f2-3387f8a66b13',
    'network': 'http',
    'http-opts': {
      method: 'PUT',
      path: ['/file'],
      headers: {
        Host: ['facebook.com'],
      },
    },
  })
  const grpcVmessProxy = parseVmessUri('vmess://eyJ2IjoiMiIsInBzIjoiRXhhbXBsZSIsImFkZCI6Imdvb2dsZS5jb20iLCJwb3J0IjoiODAiLCJpZCI6IjA0OWMzYmI2LWU3NzEtNDI4Ni1iNmYyLTMzODdmOGE2NmIxMyIsImFpZCI6IjAiLCJuZXQiOiJncnBjIiwidHlwZSI6Imh0dHAiLCJob3N0IjoiZmFjZWJvb2suY29tIiwicGF0aCI6Ikd1blNlcnZpY2UiLCAic2N5IjogImFlcy0xMjgtZ2NtIn0=')
  expect(grpcVmessProxy).toEqual<VmessGrpcProxy>({
    'type': 'vmess',
    'name': 'Example',
    'alertId': 0,
    'tls': false,
    'skip-cert-verify': false,
    'cipher': 'aes-128-gcm',
    'port': 80,
    'server': 'google.com',
    'servername': 'google.com',
    'udp': true,
    'uuid': '049c3bb6-e771-4286-b6f2-3387f8a66b13',
    'network': 'grpc',
    'grpc-opts': {
      'grpc-service-name': 'GunService',
    },
  })
})

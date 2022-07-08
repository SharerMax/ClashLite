import { describe, expect, test } from 'vitest'
import { parseShadowsocksLegacyUri, parseShadowsocksSIP002URI } from '../../utils/parse'

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
    const withUrlEncodeResult = parseShadowsocksSIP002URI('ss://MjAyMi1ibGFrZTMtYWVzLTI1Ni1nY206WWN0UFo2VTd4UFBjVSUyQmdwM3UlMkIwdHglMkZ0Uml6Sk45Szh5JTJCdUtsVzJxamxJJTNE@192.168.100.1:8888/?plugin=v2ray-plugin%3Bserver#Example3')
    expect(withUrlEncodeResult).toEqual({
      type: 'ss',
      name: 'Example3',
      server: '192.168.100.1',
      cipher: '2022-blake3-aes-256-gcm',
      password: 'YctPZ6U7xPPcU+gp3u+0tx/tRizJN9K8y+uKlW2qjlI=',
      port: 8888,
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
})


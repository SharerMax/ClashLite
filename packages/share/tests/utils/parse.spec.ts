import { describe, expect, test } from 'vitest'
import { parseShadowscoksLegacyUri, parseShadowsocksSIP002URI } from '../../utils/parse'

describe('utils:parse', () => {
  test('parseShadowsocksSIP002UR', () => {
    const result = parseShadowsocksSIP002URI('ss://cmM0LW1kNTpwYXNzd2Q@us.proxy.com:8888/?plugin=obfs-local%3Bobfs%3Dhttp#Example2')
    expect(result).toEqual({
      type: 'ss',
      name: 'Example2',
      server: 'us.proxy.com',
      cipher: 'rc4-md5',
      password: 'passwd',
      port: 8888,
    })
  })
  test('parseShadowscoksLegacyUri', () => {
    const result = parseShadowscoksLegacyUri('ss://cmM0LW1kNTp0ZXN0LyFAIzpAMTkyLjE2OC4xMDAuMTo4ODg4#Example1')
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


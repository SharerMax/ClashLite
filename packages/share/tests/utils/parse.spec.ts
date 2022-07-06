import { describe, expect, test } from 'vitest'
import { parseShadowsocksSIP002URI } from '../../utils/parse'

describe('utils:parse', () => {
  test('parseShadowsocksSIP002URI', () => {
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
})


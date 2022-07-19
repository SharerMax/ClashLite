export interface AppSetting {
  autoStartClash: boolean
  autoStartApp: boolean
  themeStyle: 'dark' | 'light' | 'system'
}

export interface ClashSettingSubscribe {
  url: string
  period: number // unit is minutes
  type: 'plain' | 'base64' | 'sip008' | 'clash'
}
export interface ClashSettings {
  listenProt: number
  listenType: 'http' | 'socks5' | 'mixed'
  allowLan: boolean
  autoStart: boolean
  subscribe?: ClashSettingSubscribe
}

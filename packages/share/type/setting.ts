export interface AppSetting {
  autoStartClash: boolean
  autoStartApp: boolean
  themeStyle: 'dark' | 'light' | 'system'
}
export interface ClashSettings {
  listenProt: number
  listenType: 'http' | 'socks5' | 'mixed'
  allowLan: boolean
  autoStart: boolean
}

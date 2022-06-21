export type AppSetting = {
  autoStartClash: boolean,
  autoStartApp: boolean,
  themeStyle: 'dark' | 'light' | 'system'
}
export type ClashSettings = {
  listenProt: number,
  listenType: 'http' | 'socks5' | 'mixed',
  allowLan: boolean,
  autoStart: boolean
}

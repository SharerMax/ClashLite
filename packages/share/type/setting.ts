import type { RouterRuleType, RuleSetBehaviorType, RunMode } from './clash'

export interface AppSetting {
  autoStartClash: boolean
  autoStartApp: boolean
  themeStyle: 'dark' | 'light' | 'system'
}

export interface ClashSettingSubscribe {
  url: string
  period: number // unit is minutes
  type: 'plain' | 'base64' | 'sip008' | 'clash'
  updateTime?: number
}

export interface ClashSettingRule {
  name: string
  url: string
  type: RouterRuleType
  behavior: RuleSetBehaviorType
}

export interface ClashSettings {
  mode: RunMode
  listenProt: number
  listenType: 'http' | 'socks5' | 'mixed'
  allowLan: boolean
  autoStart: boolean
  subscribe?: ClashSettingSubscribe
  rules?: ClashSettingRule[]
}

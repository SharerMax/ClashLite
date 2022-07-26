import { clipboard, contextBridge, ipcRenderer } from 'electron'
import { internalIpV4 } from 'internal-ip'
import Store from 'electron-store'
import { domReady } from './utils'
import { useLoading } from './loading'
import type { ClashSettingRule, ClashSettingSubscribe, ClashSettings, ClashStartInfo, Event, RunMode } from '@/share/type'

const clashStore = new Store<ClashSettings>({
  name: 'clash_config',
})

function copyTextToClipboard(text: string) {
  clipboard.writeText(text)
}

function sendClashEventToMain(eventName: Event.MainEvent.ClashEventName, ...args: any) {
  ipcRenderer.send(eventName, args)
}

function sendClashInvokeEventToMain(eventName: Event.MainEvent.ClashInvokeEventName, ...args: any) {
  return ipcRenderer.invoke(eventName, args)
}

const clashExpose = {
  start: () => (sendClashInvokeEventToMain('clash:start') as Promise<ClashStartInfo>).then((info) => {
    localStorage.setItem('ext-ctl', info.controllerUrl)
    localStorage.setItem('ctl-secret', info.apiSecret)
    return !!info.controllerUrl
  }),
  stop: () => sendClashEventToMain('clash:stop'),
  saveRunMode(mode: RunMode) {
    clashStore.set('mode', mode)
  },
  getRunMode() {
    return clashStore.get('mode', 'direct')
  },
  saveProxySubscribe(subscribe: ClashSettingSubscribe) {
    sendClashEventToMain('clash:proxySubscribeChange')
    clashStore.set('subscribe', subscribe)
  },
  getProxySubscribe() {
    return clashStore.get('subscribe', { period: 10, url: '', type: 'plain' })
  },
  setRuleSet(ruleSet: ClashSettingRule[]) {
    clashStore.set('rules', ruleSet)
    sendClashEventToMain('clash:ruleSetChange')
  },
  getRuleSet() {
    return clashStore.get('rules', [])
  },
  changeRuleSet(name: string, saveClashSetting: ClashSettingRule) {
    const currentRuleSets = clashExpose.getRuleSet()
    const newRuleSets = currentRuleSets.filter(ruleSet => ruleSet.name !== name).push(saveClashSetting)
    clashStore.set('rules', newRuleSets)
    sendClashEventToMain('clash:ruleSetChange')
  },
  addRuleSet(rule: ClashSettingRule) {
    clashStore.set('rules', [...clashExpose.getRuleSet(), rule])
    sendClashEventToMain('clash:ruleSetChange')
  },
  removeRuleSet(name: string) {
    clashStore.set('rules', clashExpose.getRuleSet().filter(ruleSet => ruleSet.name !== name))
    sendClashEventToMain('clash:ruleSetChange')
  },
}

export type Expose = typeof clashExpose

async function obtainLocalIPv4() {
  return await internalIpV4()
}
const { appendLoading, removeLoading } = useLoading()
contextBridge.exposeInMainWorld('removeLoading', removeLoading)
contextBridge.exposeInMainWorld('copyTextToClipboard', copyTextToClipboard)
contextBridge.exposeInMainWorld('localIPv4', obtainLocalIPv4)
contextBridge.exposeInMainWorld('clash', clashExpose)
domReady().then(appendLoading)

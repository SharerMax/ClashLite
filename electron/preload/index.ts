import { clipboard, contextBridge, ipcRenderer } from 'electron'
import { internalIpV4 } from 'internal-ip'
import Store from 'electron-store'
import { domReady } from './utils'
import { useLoading } from './loading'
import type { BaseClashConfig, ClashStartInfo, RunMode } from '@/share/type'

const clashStore = new Store<BaseClashConfig>({
  name: 'clash_config',
})

function copyTextToClipboard(text: string) {
  clipboard.writeText(text)
}

const clashExpose = {
  start: () => (ipcRenderer.invoke('clash:start') as Promise<ClashStartInfo>).then((info) => {
    localStorage.setItem('ext-ctl', info.controllerUrl)
    localStorage.setItem('ctl-secret', info.apiSecret)
    return !!info.controllerUrl
  }),
  stop: () => ipcRenderer.send('clash:stop'),
  saveRunMode(mode: RunMode) {
    clashStore.set('mode', mode)
  },
  getRunMode() {
    return clashStore.get('mode', 'direct')
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

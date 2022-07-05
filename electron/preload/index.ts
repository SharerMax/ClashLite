import { clipboard, contextBridge, ipcRenderer } from 'electron'
import { internalIpV4 } from 'internal-ip'
import type { ClashStartInfo } from '../../packages/share/type'
import { domReady } from './utils'
import { useLoading } from './loading'

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

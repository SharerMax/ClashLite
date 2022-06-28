import { contextBridge, clipboard, ipcRenderer } from 'electron'
import { domReady } from './utils'
import { useLoading } from './loading'
import { ClashStartInfo } from '../../packages/share/type'

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

const { appendLoading, removeLoading } = useLoading()
contextBridge.exposeInMainWorld('removeLoading', removeLoading)
contextBridge.exposeInMainWorld('copyTextToClipboard', copyTextToClipboard)
contextBridge.exposeInMainWorld('clash', clashExpose)
domReady().then(appendLoading)

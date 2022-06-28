import { contextBridge, clipboard, ipcRenderer } from 'electron'
import { domReady } from './utils'
import { useLoading } from './loading'

function copyTextToClipboard(text: string) {
  clipboard.writeText(text)
}
const { appendLoading, removeLoading } = useLoading()
contextBridge.exposeInMainWorld('removeLoading', removeLoading)
contextBridge.exposeInMainWorld('copyTextToClipboard', copyTextToClipboard)
contextBridge.exposeInMainWorld('clash', {
  start: () => ipcRenderer.invoke('clash:start') as Promise<boolean>,
  stop: () => ipcRenderer.send('clash:stop'),
})

domReady().then(appendLoading)

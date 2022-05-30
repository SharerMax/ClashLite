import { contextBridge, clipboard } from 'electron'
import { domReady } from './utils'
import { useLoading } from './loading'

function copyTextToClipboard(text: string) {
  clipboard.writeText(text)
}
const { appendLoading, removeLoading } = useLoading()
contextBridge.exposeInMainWorld('removeLoading', removeLoading)
contextBridge.exposeInMainWorld('copyTextToClipboard', copyTextToClipboard)

domReady().then(appendLoading)

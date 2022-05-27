import { contextBridge } from 'electron'
import { domReady } from './utils'
import { useLoading } from './loading'

const { appendLoading, removeLoading } = useLoading()
contextBridge.exposeInMainWorld('removeLoading', removeLoading)

domReady().then(appendLoading)

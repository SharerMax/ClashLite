// import { spawn } from 'node:child_process'
import process from 'process'
import { ipcMain } from 'electron'
import { IpcMainEvent } from 'electron/main'

function on(api: string, listener: (event: IpcMainEvent, ...arg:any[]) => void) {
  ipcMain.on(`clash:${api}`, listener)
}
export function startClash() {
  console.log(process.resourcesPath)
}

export function stopClash() {
  console.log('stop clash')
}
export function init() {
  on('start', startClash)
  on('stop', stopClash)
}

export default {
  startClash,
  init,
}

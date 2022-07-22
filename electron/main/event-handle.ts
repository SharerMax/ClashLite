import { ipcMain } from 'electron'
import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { handleProxySubscribeChange, startClash, stopClash } from './clash'
import type { Event } from '@/share/type/clash'

function defineClashOnEventHandler(eventName: Event.MainEvent.ClashEventName, fn: (event: IpcMainEvent, ...args: any) => void) {
  ipcMain.on(eventName, fn)
}

function defineClashInvokeEventHandler<T>(eventName: Event.MainEvent.ClashInvokeEventName, fn: (event: IpcMainInvokeEvent, ...args: any) => Promise<T>) {
  ipcMain.handle(eventName, fn)
}
// Clash event handle define
export function defineClashEventHandler() {
  defineClashInvokeEventHandler('clash:start', startClash)
  defineClashOnEventHandler('clash:stop', stopClash)
  defineClashOnEventHandler('clash:proxySubscribeChange', handleProxySubscribeChange)
}

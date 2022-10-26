import { ipcMain } from 'electron'
import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import type { Event } from 'share/dist/type'
import { handleProxySubscribeChange, handleRuleSetChange, startClash, stopClash } from './clash'

function defineClashOnEventHandler(eventName: Event.ClashEventName, fn: (event: IpcMainEvent, ...args: any) => void) {
  ipcMain.on(eventName, fn)
}

function defineClashInvokeEventHandler<T>(eventName: Event.ClashInvokeEventName, fn: (event: IpcMainInvokeEvent, ...args: any) => Promise<T>) {
  ipcMain.handle(eventName, fn)
}
// Clash event handle define
export function defineClashEventHandler() {
  defineClashInvokeEventHandler('clash:start', startClash)
  defineClashOnEventHandler('clash:stop', stopClash)
  defineClashOnEventHandler('clash:proxySubscribeChange', handleProxySubscribeChange)
  defineClashOnEventHandler('clash:ruleSetChange', handleRuleSetChange)
}

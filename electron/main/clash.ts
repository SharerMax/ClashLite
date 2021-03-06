// import { spawn } from 'node:child_process'
import process from 'process'
import path from 'path'
import type { ChildProcess } from 'child_process'
import { spawn } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { app, ipcMain } from 'electron'
import type { IpcMainEvent } from 'electron'
import yaml from 'js-yaml'
import getPort, { portNumbers } from 'get-port'
import Store from 'electron-store'

import type { BaseClashConfig, ClashStartInfo } from '../../packages/share/type/clash'

let clashProcess: ChildProcess | null = null

type EventName = 'start' | 'stop'

export type ClashEventName = `clash:${EventName}`

function on(api: EventName, listener: (event: IpcMainEvent, ...arg: any[]) => void) {
  ipcMain.on(`clash:${api}`, listener)
}

function handle<T>(api: EventName, listener: (event: IpcMainEvent, ...arg: any[]) => T) {
  ipcMain.handle(`clash:${api}`, listener)
}

function getBinDirPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'bin')
  }

  return path.join(process.cwd(), 'extra/bin')
}

function getClashConfigDirPath() {
  if (process.platform !== 'win32') {
    return path.join(app.getPath('userData'), 'config')
  }

  return path.join(getBinDirPath(), 'config')
}

function getClashDefaultConfigPath() {
  return path.join(getClashConfigDirPath(), 'config.yaml')
}

function getClashExecPath() {
  if (process.platform !== 'win32') {
    return path.join(getBinDirPath(), 'clash')
  }

  return path.join(getBinDirPath(), 'clash.exe')
}
// 1. check config
// 2. generate basic config

export async function startClash() {
  // console.log(process.resourcesPath)
  // console.log(app.getAppPath())
  // console.log(process.cwd())
  const clashPath = getClashExecPath()
  console.log(clashPath)
  return getPort({
    port: portNumbers(3000, 65535),
    exclude: [7890],
  }).then(portNumber => new Promise<ClashStartInfo>((resolve, reject) => {
    const extCtl = `127.0.0.1:${portNumber}`

    console.log(extCtl)
    clashProcess = spawn(clashPath, ['-d', getClashConfigDirPath(), '-ext-ctl', extCtl], {
      stdio: 'inherit',
    })
    clashProcess.on('error', (error) => {
      console.error(error)
      reject(new Error(error.message))
    })
    clashProcess.once('exit', (code, signal) => {
      console.log('exit', code, signal)
    })
    clashProcess.once('spawn', () => {
      resolve({
        controllerUrl: `http://${extCtl}`,
        apiSecret: '',
      })
    })
  }))
}

export function stopClash() {
  console.log('stop clash')
  if (clashProcess) {
    clashProcess.kill()
  }
}

function generateDefaultClashConfig() {
  const defaultConfig: BaseClashConfig = {
    'mode': 'direct',
    'mixed-port': 7890,
    'port': 0,
    'socks-port': 0,
    'allow-lan': false,
    'bind-address': '*',
    'log-level': 'debug',
    'redir-port': 0,
    'authentication': [],
  }
  const yamlContent = yaml.dump(defaultConfig)
  const configDirPath = getClashConfigDirPath()
  if (!existsSync(configDirPath)) {
    console.log('--', configDirPath)
    mkdirSync(configDirPath)
  }
  // TODO: ????????????
  writeFileSync(getClashDefaultConfigPath(), yamlContent, { encoding: 'utf-8' })
}

export function init() {
  console.log('config dir: ', getClashDefaultConfigPath())
  if (!existsSync(getClashDefaultConfigPath())) {
    generateDefaultClashConfig()
  }

  handle('start', startClash)
  on('stop', stopClash)
  Store.initRenderer()
}

export default {
  startClash,
  init,
}

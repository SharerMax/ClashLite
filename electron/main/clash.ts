// import { spawn } from 'node:child_process'
import process from 'process'
import { ipcMain, app, IpcMainEvent } from 'electron'
import path from 'path'
import { ChildProcess, spawn } from 'child_process'
import { existsSync, writeFileSync } from 'fs'
import yaml from 'js-yaml'
import getPort, { portNumbers } from 'get-port'

import type { BaseClashConfig } from '../../packages/share/type/clash'

let clashProcess: ChildProcess | null = null

function on(api: string, listener: (event: IpcMainEvent, ...arg:any[]) => void) {
  ipcMain.on(`clash:${api}`, listener)
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

export function startClash() {
  // console.log(process.resourcesPath)
  // console.log(app.getAppPath())
  // console.log(process.cwd())
  const clashPath = getClashExecPath()
  console.log(clashPath)
  getPort({
    port: portNumbers(1080, 65535),
    exclude: portNumbers(7890, 7890),
  }).then((portNumber) => {
    const extCtl = `127.0.0.1:${portNumber}`

    console.log(extCtl)
    clashProcess = spawn(clashPath, ['-d', getClashConfigDirPath(), '-ext-ctl', extCtl], {
      stdio: 'inherit',
    })
    clashProcess.on('error', (error) => {
      console.error(error)
    })
    clashProcess.on('close', (code, signal) => {
      console.log('close', code, signal)
    })
    clashProcess.once('exit', (code, signal) => {
      console.log('close', code, signal)
    })
  })
}

export function stopClash() {
  console.log('stop clash')
  if (clashProcess) {
    clashProcess.kill()
  }
}

function generateDefaultClashConfig() {
  const defaultConfig: BaseClashConfig = {
    mode: 'direct',
    'mixed-port': 7890,
    port: 0,
    'socks-port': 0,
    'allow-lan': false,
    'bind-address': '*',
    'log-level': 'debug',
    'redir-port': 0,
    authentication: [],
  }
  const yamlContent = yaml.dump(defaultConfig)
  // TODO: 异常处理
  writeFileSync(getClashDefaultConfigPath(), yamlContent, { encoding: 'utf-8' })
}

export function init() {
  if (!existsSync(getClashDefaultConfigPath())) {
    generateDefaultClashConfig()
  }
  on('start', startClash)
  on('stop', stopClash)
}

export default {
  startClash,
  init,
}

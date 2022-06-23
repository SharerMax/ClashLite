// import { spawn } from 'node:child_process'
import process from 'process'
import { ipcMain, app, IpcMainEvent } from 'electron'
import path from 'path'
import { ChildProcess, spawn } from 'child_process'

let clashProcess: ChildProcess | null = null

function on(api: string, listener: (event: IpcMainEvent, ...arg:any[]) => void) {
  ipcMain.on(`clash:${api}`, listener)
}

function getBinPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'bin')
  }
  return path.join(process.cwd(), 'extra/bin')
}

function getClashPath() {
  return path.join(getBinPath(), 'clash.exe')
}

export function startClash() {
  // console.log(process.resourcesPath)
  // console.log(app.getAppPath())
  // console.log(process.cwd())
  const clashPath = getClashPath()
  console.log(clashPath)
  clashProcess = spawn(clashPath, ['-d', getBinPath()], {
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
}

export function stopClash() {
  console.log('stop clash')
  if (clashProcess) {
    clashProcess.kill()
  }
}
export function init() {
  on('start', startClash)
  on('stop', stopClash)
}

export default {
  startClash,
  init,
}

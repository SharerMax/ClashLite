import {
  app, BrowserWindow, shell, session,
} from 'electron'
import { release } from 'os'
import { join } from 'path'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

// const APP_USER_MODEL_ID = 'com.saeratom.clashlite'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}
// eslint-disable-next-line @typescript-eslint/dot-notation
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// app.setAppUserModelId(APP_USER_MODEL_ID)

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      // https://www.electronjs.org/zh/docs/latest/tutorial/security#%E9%9A%94%E7%A6%BB%E4%B8%8D%E5%8F%97%E4%BF%A1%E4%BB%BB%E7%9A%84%E5%86%85%E5%AE%B9
      nodeIntegration: false,
      contextIsolation: true,
    },
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#101014',
    // transparent: true,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: 'red',
    //   symbolColor: 'white',
    // },
  })
  // nativeTheme.themeSource = 'light'
  win.setMenuBarVisibility(false)
  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin 对比
    // console.dir(process.env.VITE_DEV_SERVER_HOST)
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    // eslint-disable-next-line @typescript-eslint/dot-notation
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
    win.loadURL(url)
  }

  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  createWindow()
  if (!app.isPackaged) {
    session.defaultSession.setProxy({
      mode: 'fixed_servers',
      proxyRules: 'socks5://127.0.0.1:7890',
    })
    installExtension(VUEJS_DEVTOOLS.id)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err))
  }
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

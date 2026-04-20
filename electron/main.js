const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

// In dev: electron runs alongside `next dev` on port 3000
// In production (packaged): launch Next.js standalone server bundled in extraResources
const isDev = !app.isPackaged

let nextProcess = null

function startNextServer() {
  return new Promise((resolve, reject) => {
    // Dev mode: Next dev server is already running
    if (isDev) {
      resolve('http://localhost:3000')
      return
    }

    // Production: run the standalone Next.js server from extraResources
    const resourcesPath = process.resourcesPath
    const serverScript  = path.join(resourcesPath, 'app', 'server.js')
    const dataDir       = path.join(app.getPath('userData'), 'data')

    nextProcess = spawn(process.execPath, [serverScript], {
      cwd: path.join(resourcesPath, 'app'),
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: '3100',
        HOSTNAME: '127.0.0.1',
        DB_PATH: dataDir,
        // Tell Next standalone where its static files are
        NEXT_SHARP_PATH: path.join(resourcesPath, 'app', 'node_modules', 'sharp'),
      },
      stdio: 'pipe',
    })

    nextProcess.stdout.on('data', (data) => {
      const msg = data.toString()
      if (msg.includes('Ready') || msg.includes('ready') || msg.includes('started')) {
        resolve('http://127.0.0.1:3100')
      }
    })

    nextProcess.stderr.on('data', () => {})

    nextProcess.on('error', reject)

    // Fallback: wait 5s and try anyway
    setTimeout(() => resolve('http://127.0.0.1:3100'), 5000)
  })
}

async function createWindow() {
  const url = await startNextServer()

  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 680,
    minHeight: 560,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#0f172a',
    show: false,
  })

  win.loadURL(url)
  win.once('ready-to-show', () => win.show())
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Dev tools in development
  if (isDev) {
    win.webContents.on('did-fail-load', () => {
      setTimeout(() => win.loadURL(url), 2000)
    })
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (nextProcess) nextProcess.kill()
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('before-quit', () => {
  if (nextProcess) nextProcess.kill()
})

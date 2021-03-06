/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow } from 'electron'
import sourceMapSupport from 'source-map-support'
import electronDebug from 'electron-debug'

import MenuBuilder from './menu'

let mainWindow = null

if (process.env.NODE_ENV === 'production') {
  sourceMapSupport.install()
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  electronDebug()
  /*  const path = require('path')
    const p    = path.join(__dirname, '..', 'app', 'node_modules')
    require('module').globalPaths.push(p) */
}

const installExtensions = async() => {
  const installer = require('electron-devtools-installer') // eslint-disable-line global-require

  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions    = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS',
  ]

  return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload)))
}

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', async() => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions()
  }

  mainWindow = new BrowserWindow({
    show           : false,
    minWidth       : 1330,
    width          : 1330,
    minHeight      : 745,
    height         : 745,
    center         : true,
    backgroundColor: '#252525',
    webPreferences : {
      darkTheme             : true,
      'web-preferences'     : { 'web-security': false },
      scrollBounce          : true,
      overlayFullscreenVideo: false,
    },
  })

  mainWindow.loadURL(`file://${__dirname}/app.html`)

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }

    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()
})

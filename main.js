const { app, BrowserWindow } = require('electron/main')
const { ipcMain } = require('electron');
const electron = require('electron')
const settings = require('electron-settings');

if(require('electron-squirrel-startup')) {
  app.quit();
}

//Simple window creation with browserWindow loading layout from index 
  const createWindow = () => {
  const win = new BrowserWindow({//define window size
     // remove the default titlebar
    titleBarStyle: 'hidden',
    // expose window controls in Windows/Linux
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
    icon: './src/images/Icon_V2',
    webPreferences: {
      preload: '/src/preload.js',
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  

  win.loadFile('src/index.html')
  win.setMinimumSize(800, 600)
  
  if (process.platform !== 'darwin') {
    win.setTitleBarOverlay({
    color: '#28282B',
    symbolColor: "#ccc", // symbol color here
    })
  }
}



//MacOS window managment  
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

//Windows and Linux operating system process killer when windows are closed
app.on('window-all-closed', () => {
  //if (process.platform !== 'darwin') {
    app.quit()
  //}
})



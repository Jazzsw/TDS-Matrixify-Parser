const { app, BrowserWindow } = require('electron/main')
const { ipcMain } = require('electron');
const electron = require('electron')
const settings = require('electron-settings');
const { autoUpdater, AppUpdater } = require('electron-updater');

const { updateElectronApp } = require('update-electron-app');
updateElectronApp();
console.log("app version: " + app.getVersion());




// document.getElementById('verDisplay').innerText = `Version: ${app.getVersion()}`;

if (require('electron-squirrel-startup')) {
  app.quit();
}

// app.setAppUserModelId("com.squirrel.AppName.AppName");

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
    symbolColor: "#ccc",
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



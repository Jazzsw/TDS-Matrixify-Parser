const { app, BrowserWindow } = require('electron/main')
const { ipcMain } = require('electron');
const electron = require('electron')
const settings = require('electron-settings');
const { autoUpdater, AppUpdater } = require('electron-updater');

const { updateElectronApp } = require('update-electron-app');
updateElectronApp();
console.log("app version: " + app.getVersion());
// const updateElectronApp = updateElectronAppRaw.default || updateElectronAppRaw;
// updateElectronApp();




// autoUpdater.autoDownload = true; // Enable auto download of updates
// autoUpdater.autoInstallOnAppQuit = true; // Install updates on app quit


// autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//   const dialogOpts = {
//     type: 'info',
//     buttons: ['Restart', 'Later'],
//     title: 'Application Update',
//     message: process.platform === 'win32' ? releaseNotes : releaseName,
//     detail:
//       'A new version has been downloaded. Restart the application to apply the updates.'
//   }

//   dialog.showMessageBox(dialogOpts).then((returnValue) => {
//     if (returnValue.response === 0) autoUpdater.quitAndInstall()
//   })
// })




// const { updateElectronApp } = require('update-electron-app')
  
// if (process.platform !== 'darwin') {
//   updateElectronApp()
// }



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

  win.webContents.openDevTools();

  console.log("Main process is running");
  

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



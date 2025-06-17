const { app, BrowserWindow } = require('electron/main')


//Simple window creation with browserWindow loading layout from index 
  const createWindow = () => {
  const win = new BrowserWindow({//define window size
     // remove the default titlebar
    titleBarStyle: 'hidden',
    // expose window controls in Windows/Linux
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})
  })

  win.loadFile('src/index.html')
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
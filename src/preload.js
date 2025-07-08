const { contextBridge, ipcRenderer } = require('electron');
const settings = require('electron-settings');

contextBridge.exposeInMainWorld('electronAPI', {
  getSetting: (key) => settings.get(key),
  setSetting: (key, value) => settings.set(key, value),
});

const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  reloadApp: () => ipcRenderer.send('reload-app')
});
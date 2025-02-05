// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getShortcuts: () => ipcRenderer.invoke("get-shortcuts"),
  saveShortcuts: (shortcuts) => ipcRenderer.invoke("save-shortcuts", shortcuts),
  getFolders: () => ipcRenderer.invoke("get-folders"),
  saveFolders: (folders) => ipcRenderer.invoke("save-folders", folders),
});

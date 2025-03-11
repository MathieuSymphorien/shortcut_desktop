// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getShortcuts: () => ipcRenderer.invoke("get-shortcuts"),
  saveShortcuts: (shortcuts) => ipcRenderer.invoke("save-shortcuts", shortcuts),
  getFolders: () => ipcRenderer.invoke("get-folders"),
  saveFolders: (folders) => ipcRenderer.invoke("save-folders", folders),
});

contextBridge.exposeInMainWorld("env", {
  API_URL: process.env.API_URL,
  API_TOKEN: process.env.API_TOKEN,
});

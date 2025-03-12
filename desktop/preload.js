// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getShortcuts: () => ipcRenderer.invoke("get-shortcuts"),
  saveShortcuts: (shortcuts) => ipcRenderer.invoke("save-shortcuts", shortcuts),
  getFolders: () => ipcRenderer.invoke("get-folders"),
  saveFolders: (folders) => ipcRenderer.invoke("save-folders", folders),
});

let storedToken = null;

contextBridge.exposeInMainWorld("env", {
  API_URL: process.env.API_URL,
  API_USER: process.env.API_USER,
  API_PASS: process.env.API_PASS,
  getToken: () => storedToken,
  setToken: (newToken) => {
    storedToken = newToken;
  },
});

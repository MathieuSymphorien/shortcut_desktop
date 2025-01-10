const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  readData: () => ipcRenderer.invoke("read-data"),
  saveData: (data) => ipcRenderer.invoke("save-data", data),
  showInputDialog: async (options) =>
    ipcRenderer.invoke("show-input-dialog", options),
});

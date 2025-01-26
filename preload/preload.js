const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Auth
  registerUser: (data) => ipcRenderer.invoke("register-user", data),
  loginUser: (data) => ipcRenderer.invoke("login-user", data),
  logoutUser: () => ipcRenderer.invoke("logout-user"),

  // Folders
  getFolders: (username) => ipcRenderer.invoke("get-folders", username),
  addFolder: (data) => ipcRenderer.invoke("add-folder", data),

  // Shortcuts
  getShortcuts: (folderId) => ipcRenderer.invoke("get-shortcuts", folderId),
  addShortcut: (data) => ipcRenderer.invoke("add-shortcut", data),
  updateShortcut: (data) => ipcRenderer.invoke("update-shortcut", data),
  deleteShortcut: (shortcutId) =>
    ipcRenderer.invoke("delete-shortcut", shortcutId),
  updateShortcutsOrder: (newOrder) =>
    ipcRenderer.invoke("update-shortcuts-order", newOrder),
  updateShortcutCategory: (data) =>
    ipcRenderer.invoke("update-shortcut-category", data),

  // Categories
  getCategories: (folderId) => ipcRenderer.invoke("get-categories", folderId),
  addCategory: (data) => ipcRenderer.invoke("add-category", data),
  updateCategory: (data) => ipcRenderer.invoke("update-category", data),
  deleteCategory: (categoryId) =>
    ipcRenderer.invoke("delete-category", categoryId),
  updateCategoriesOrder: (newOrder) =>
    ipcRenderer.invoke("update-categories-order", newOrder),
});

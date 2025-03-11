// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Store = require("electron-store");

// On sauvegarde dans "folders". Le store créera un fichier JSON (par exemple folders.json).
const store = new Store({ name: "folders" });
require("dotenv").config();

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, "assets", "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Fournir l'objet folders (avec un dossier "Blender" et le thème "Edition" par défaut si vide)
ipcMain.handle("get-folders", () => {
  return store.get("folders", { Blender: { Edition: [] } });
});

// Sauvegarder l'objet folders
ipcMain.handle("save-folders", (event, folders) => {
  store.set("folders", folders);
  return true;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

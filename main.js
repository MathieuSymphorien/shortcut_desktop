const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(app.getPath("userData"), "data.json");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("index.html");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC pour lire les données
ipcMain.handle("read-data", async () => {
  try {
    console.log("Lecture des données...");
    if (!fs.existsSync(DATA_PATH)) {
      fs.writeFileSync(
        DATA_PATH,
        JSON.stringify({ folders: {}, currentFolder: null }, null, 2)
      );
    }
    const data = fs.readFileSync(DATA_PATH);
    return JSON.parse(data);
  } catch (err) {
    console.error("Erreur de lecture des données :", err);
    return { folders: {}, currentFolder: null };
  }
});

// IPC pour sauvegarder les données
ipcMain.handle("save-data", async (event, data) => {
  try {
    console.log("Sauvegarde des données...");
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (err) {
    console.error("Erreur de sauvegarde des données :", err);
    return { success: false };
  }
});

ipcMain.handle("show-input-dialog", async (event, options) => {
  const { title, message, defaultValue } = options;
  const result = await dialog.showMessageBox(mainWindow, {
    type: "question",
    buttons: ["OK", "Cancel"],
    defaultId: 0,
    title: title || "Input",
    message: message || "Enter your input:",
    input: true,
  });

  if (result.response === 0) {
    return result.inputValue || defaultValue || "";
  }
  return null; // Annulé
});

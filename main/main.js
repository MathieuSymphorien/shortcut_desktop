const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { Client } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Configuration de la base de données
const dbConfig = {
  user: process.env.POSTGRES_USER,
  host: "localhost",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
};

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("./renderer/login.html");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Gestion des utilisateurs
ipcMain.handle("register-user", async (event, { username, password }) => {
  if (!username || !password)
    return { success: false, message: "Données invalides." };

  const client = new Client(dbConfig);
  try {
    await client.connect();
    const passwordHash = await bcrypt.hash(password, 10);
    await client.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, passwordHash]
    );
    return { success: true };
  } catch (err) {
    console.error("Erreur lors de l'enregistrement:", err);
    return { success: false, message: "Erreur lors de l'enregistrement." };
  } finally {
    await client.end();
  }
});

ipcMain.handle("login-user", async (event, { username, password }) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return { success: false, message: "Identifiants invalides." };
    }

    const token = jwt.sign({ username: user.username }, "secret-key", {
      expiresIn: "1h",
    });
    return { success: true, token };
  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    return { success: false, message: "Erreur lors de la connexion." };
  } finally {
    await client.end();
  }
});

// Gestion des raccourcis
ipcMain.handle("get-folders", async (event, username) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query(
      "SELECT * FROM folders WHERE username = $1",
      [username]
    );
    return { success: true, folders: result.rows };
  } catch (err) {
    console.error("Erreur lors de la récupération des dossiers:", err);
    return {
      success: false,
      message: "Erreur lors de la récupération des dossiers.",
    };
  } finally {
    await client.end();
  }
});

ipcMain.handle("add-folder", async (event, { username, folderName }) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    await client.query("INSERT INTO folders (name, username) VALUES ($1, $2)", [
      folderName,
      username,
    ]);
    return { success: true };
  } catch (err) {
    console.error("Erreur lors de l'ajout du dossier:", err);
    return { success: false, message: "Erreur lors de l'ajout du dossier." };
  } finally {
    await client.end();
  }
});

ipcMain.handle("logout-user", async () => {
  return { success: true };
});

ipcMain.handle("get-shortcuts", async (event, folderId) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query(
      'SELECT * FROM shortcuts WHERE folder_id = $1 ORDER BY category_id, "order"',
      [folderId]
    );
    return { success: true, shortcuts: result.rows };
  } catch (err) {
    console.error("Erreur lors de la récupération des raccourcis:", err);
    return {
      success: false,
      message: "Erreur lors de la récupération des raccourcis.",
    };
  } finally {
    await client.end();
  }
});

ipcMain.handle(
  "add-shortcut",
  async (event, { folderId, shortcutKey, explanation, categoryId }) => {
    const client = new Client(dbConfig);
    try {
      await client.connect();
      await client.query(
        "INSERT INTO shortcuts (folder_id, shortcut_key, explanation, category_id) VALUES ($1, $2, $3, $4)",
        [folderId, shortcutKey, explanation, categoryId]
      );
      return { success: true };
    } catch (err) {
      console.error("Erreur lors de l'ajout du raccourci:", err);
      return {
        success: false,
        message: "Erreur lors de l'ajout du raccourci.",
      };
    } finally {
      await client.end();
    }
  }
);

ipcMain.handle(
  "update-shortcut",
  async (event, { shortcutId, shortcutKey, explanation }) => {
    const client = new Client(dbConfig);
    try {
      await client.connect();
      await client.query(
        "UPDATE shortcuts SET shortcut_key = $1, explanation = $2 WHERE id = $3",
        [shortcutKey, explanation, shortcutId]
      );
      return { success: true };
    } catch (err) {
      console.error("Erreur lors de la modification du raccourci:", err);
      return {
        success: false,
        message: "Erreur lors de la modification du raccourci.",
      };
    } finally {
      await client.end();
    }
  }
);

ipcMain.handle("delete-shortcut", async (event, shortcutId) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    await client.query("DELETE FROM shortcuts WHERE id = $1", [shortcutId]);
    return { success: true };
  } catch (err) {
    console.error("Erreur lors de la suppression du raccourci:", err);
    return {
      success: false,
      message: "Erreur lors de la suppression du raccourci.",
    };
  } finally {
    await client.end();
  }
});

ipcMain.handle("update-shortcuts-order", async (event, newOrder) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    await client.query("BEGIN");
    for (const { id, order } of newOrder) {
      await client.query('UPDATE shortcuts SET "order" = $1 WHERE id = $2', [
        order,
        id,
      ]);
    }
    await client.query("COMMIT");
    return { success: true };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(
      "Erreur lors de la mise à jour de l'ordre des raccourcis:",
      err
    );
    return {
      success: false,
      message: "Erreur lors de la mise à jour de l'ordre des raccourcis.",
    };
  } finally {
    await client.end();
  }
});

// Gestion des catégories
ipcMain.handle("get-categories", async (event, folderId) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query(
      'SELECT * FROM categories WHERE folder_id = $1 ORDER BY "order"',
      [folderId]
    );
    return { success: true, categories: result.rows };
  } catch (err) {
    console.error("Erreur lors de la récupération des catégories:", err);
    return {
      success: false,
      message: "Erreur lors de la récupération des catégories.",
    };
  } finally {
    await client.end();
  }
});

ipcMain.handle("add-category", async (event, { folderId, categoryName }) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    await client.query(
      "INSERT INTO categories (name, folder_id) VALUES ($1, $2)",
      [categoryName, folderId]
    );
    return { success: true };
  } catch (err) {
    console.error("Erreur lors de l'ajout de la catégorie:", err);
    return {
      success: false,
      message: "Erreur lors de l'ajout de la catégorie.",
    };
  } finally {
    await client.end();
  }
});

ipcMain.handle(
  "update-category",
  async (event, { categoryId, categoryName }) => {
    const client = new Client(dbConfig);
    try {
      await client.connect();
      await client.query("UPDATE categories SET name = $1 WHERE id = $2", [
        categoryName,
        categoryId,
      ]);
      return { success: true };
    } catch (err) {
      console.error("Erreur lors de la modification de la catégorie:", err);
      return {
        success: false,
        message: "Erreur lors de la modification de la catégorie.",
      };
    } finally {
      await client.end();
    }
  }
);

ipcMain.handle("delete-category", async (event, categoryId) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    await client.query("DELETE FROM categories WHERE id = $1", [categoryId]);
    return { success: true };
  } catch (err) {
    console.error("Erreur lors de la suppression de la catégorie:", err);
    return {
      success: false,
      message: "Erreur lors de la suppression de la catégorie.",
    };
  } finally {
    await client.end();
  }
});

ipcMain.handle("update-categories-order", async (event, newOrder) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    await client.query("BEGIN");
    for (const { id, order } of newOrder) {
      await client.query('UPDATE categories SET "order" = $1 WHERE id = $2', [
        order,
        id,
      ]);
    }
    await client.query("COMMIT");
    return { success: true };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(
      "Erreur lors de la mise à jour de l'ordre des catégories:",
      err
    );
    return {
      success: false,
      message: "Erreur lors de la mise à jour de l'ordre des catégories.",
    };
  } finally {
    await client.end();
  }
});

ipcMain.handle(
  "update-shortcut-category",
  async (event, { shortcutId, categoryId }) => {
    const client = new Client(dbConfig);
    try {
      await client.connect();
      await client.query(
        "UPDATE shortcuts SET category_id = $1 WHERE id = $2",
        [categoryId, shortcutId]
      );
      return { success: true };
    } catch (err) {
      console.error(
        "Erreur lors de la mise à jour de la catégorie du raccourci:",
        err
      );
      return {
        success: false,
        message: "Erreur lors de la mise à jour de la catégorie du raccourci.",
      };
    } finally {
      await client.end();
    }
  }
);

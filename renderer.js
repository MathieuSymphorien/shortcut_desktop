console.log("renderer.js est chargé");
let data = { folders: {}, currentFolder: null };

const foldersList = document.getElementById("folders-list");
const mainTitle = document.getElementById("main-title");
const shortcutsList = document.getElementById("shortcuts-list");
const addFolderButton = document.getElementById("add-folder");
const addShortcutButton = document.getElementById("add-shortcut");

console.log(addFolderButton);
// Ajouter un dossier
addFolderButton.addEventListener("click", async () => {
  console.log("Bouton cliqué");
  const folderName = await window.electronAPI.showInputDialog({
    title: "Nouveau dossier",
    message: "Entrez le nom du dossier :",
    defaultValue: "",
  });

  if (folderName && !data.folders[folderName]) {
    data.folders[folderName] = [];
    renderFolders();
  }
});

// Afficher les dossiers
function renderFolders() {
  foldersList.innerHTML = "";
  Object.keys(data.folders).forEach((folder) => {
    const li = document.createElement("li");
    li.textContent = folder;
    li.addEventListener("click", () => selectFolder(folder));
    foldersList.appendChild(li);
  });
}

// Sélectionner un dossier
function selectFolder(folder) {
  data.currentFolder = folder;
  mainTitle.textContent = `Raccourcis pour ${folder}`;
  renderShortcuts();
}

// Ajouter un raccourci
addShortcutButton.addEventListener("click", () => {
  if (!data.currentFolder) {
    alert("Veuillez sélectionner un dossier.");
    return;
  }
  const keys = prompt("Entrez les touches du raccourci (ex: Ctrl+Z):");
  const description = prompt("Entrez une description pour ce raccourci :");
  if (keys && description) {
    data.folders[data.currentFolder].push({ keys, description });
    renderShortcuts();
  }
});

// Afficher les raccourcis
function renderShortcuts() {
  shortcutsList.innerHTML = "";
  if (!data.currentFolder) return;
  data.folders[data.currentFolder].forEach((shortcut) => {
    const li = document.createElement("li");
    li.textContent = `${shortcut.keys} - ${shortcut.description}`;
    shortcutsList.appendChild(li);
  });
}

// Charger les données au démarrage
async function loadData() {
  data = await window.electronAPI.readData();
  renderFolders();
  if (data.currentFolder) {
    selectFolder(data.currentFolder);
  }
}

// Sauvegarder les données
async function saveData() {
  await window.electronAPI.saveData(data);
}

// Ajouter un dossier
addFolderButton.addEventListener("click", async () => {
  const folderName = prompt("Nom du nouveau dossier :");
  if (folderName && !data.folders[folderName]) {
    data.folders[folderName] = [];
    await saveData();
    renderFolders();
  }
});

// Ajouter un raccourci
addShortcutButton.addEventListener("click", async () => {
  if (!data.currentFolder) {
    alert("Veuillez sélectionner un dossier.");
    return;
  }
  const keys = prompt("Entrez les touches du raccourci (ex: Ctrl+Z):");
  const description = prompt("Entrez une description pour ce raccourci :");
  if (keys && description) {
    data.folders[data.currentFolder].push({ keys, description });
    await saveData();
    renderShortcuts();
  }
});

// Charger les données au démarrage
loadData();
renderFolders();

/********************
 * Variables Globales
 ********************/
let folders = {};
let currentFolder = "Blender"; // dossier par défaut

/********************
 * Sauvegarde & Chargement
 ********************/
async function saveFolders() {
  await window.electronAPI.saveFolders(folders);
}

async function autoLogin() {
  const apiUrl = window.env.API_URL;
  const username = window.env.API_USER;
  const password = window.env.API_PASS;
  // On appelle l'endpoint de login pour obtenir le token
  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(
        `Échec du login: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    window.env.setToken(data.token);
    console.log(data.token);
    console.log("Login auto réussi. Token =", data.token);
  } catch (error) {
    console.error("Erreur lors du login automatique :", error);
    // Ici tu peux gérer l'erreur : afficher un message, etc.
  }
}

async function loadFolders() {
  folders = await window.electronAPI.getFolders();
  // Si aucun dossier n'existe, on crée "Blender" avec le thème "Edition"
  if (Object.keys(folders).length === 0) {
    folders["Blender"] = { Edition: [] };
  }
  currentFolder = folders["Blender"] ? "Blender" : Object.keys(folders)[0];
  document.getElementById("currentFolderName").textContent =
    "Dossier : " + currentFolder;
  // Si le dossier courant n'a aucun thème, on ajoute un thème par défaut
  if (Object.keys(folders[currentFolder]).length === 0) {
    folders[currentFolder]["Default"] = [];
  }
  updateThemeDropdowns();
  renderFolderList();
  renderThemes();
}

/********************
 * Gestion des Dossiers
 ********************/
function renderFolderList() {
  const folderList = document.getElementById("folderList");
  folderList.innerHTML = "";
  for (const folder in folders) {
    // Création d'un élément li avec disposition en flex
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";

    // Zone cliquable pour sélectionner le dossier
    const span = document.createElement("span");
    span.textContent = folder;
    span.style.cursor = "pointer";
    span.addEventListener("click", () => {
      currentFolder = folder;
      document.getElementById("currentFolderName").textContent =
        "Dossier : " + currentFolder;
      // Si le dossier sélectionné n'a aucun thème, on en crée un par défaut
      if (Object.keys(folders[currentFolder]).length === 0) {
        folders[currentFolder]["Default"] = [];
      }
      updateThemeDropdowns();
      renderThemes();
      // Fermer l'offcanvas
      const offcanvasEl = document.getElementById("offcanvasMenu");
      const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (offcanvas) offcanvas.hide();
    });
    li.appendChild(span);

    // Bouton de suppression, affiché uniquement s'il y a plus d'un dossier
    if (Object.keys(folders).length > 1) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-sm btn-danger";
      deleteBtn.textContent = "Supprimer";
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Empêche la sélection du dossier lors du clic sur le bouton
        if (confirm(`Voulez-vous supprimer le dossier "${folder}" ?`)) {
          deleteFolder(folder);
        }
      });
      li.appendChild(deleteBtn);
    }

    folderList.appendChild(li);
  }
}

function deleteFolder(folderName) {
  // Empêcher la suppression du dernier dossier
  if (Object.keys(folders).length <= 1) {
    alert("Vous ne pouvez pas supprimer le dernier dossier.");
    return;
  }
  // Suppression du dossier
  delete folders[folderName];
  // Si le dossier supprimé était le dossier courant, on sélectionne le premier existant
  if (currentFolder === folderName) {
    currentFolder = Object.keys(folders)[0];
    document.getElementById("currentFolderName").textContent =
      "Dossier : " + currentFolder;
  }
  updateThemeDropdowns();
  renderFolderList();
  renderThemes();
  saveFolders();
}

document.getElementById("folderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const folderName = document.getElementById("folderName").value;
  if (!folders[folderName]) {
    folders[folderName] = { Default: [] };
    renderFolderList();
    await saveFolders();
  }
  e.target.reset();
});

/********************
 * Gestion des Thèmes
 ********************/
// Met à jour les listes déroulantes du formulaire d'ajout et du modal d'édition
function updateThemeDropdowns() {
  const shortcutThemeSelect = document.getElementById("shortcutTheme");
  const editShortcutThemeSelect = document.getElementById("editShortcutTheme");
  shortcutThemeSelect.innerHTML = "";
  editShortcutThemeSelect.innerHTML = "";
  const themes = Object.keys(folders[currentFolder] || {});
  themes.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme;
    shortcutThemeSelect.appendChild(option);

    const optionEdit = document.createElement("option");
    optionEdit.value = theme;
    optionEdit.textContent = theme;
    editShortcutThemeSelect.appendChild(optionEdit);
  });
}

document.getElementById("themeForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const themeName = document.getElementById("themeName").value;
  if (!folders[currentFolder][themeName]) {
    folders[currentFolder][themeName] = [];
    updateThemeDropdowns();
    renderThemes();
    await saveFolders();
  }
  e.target.reset();
});

/********************
 * Gestion des Raccourcis & Affichage par Thème
 ********************/
// Affiche pour chaque thème du dossier courant un titre et la liste des raccourcis
function renderThemes() {
  const searchQuery = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const container = document.getElementById("themesContainer");
  container.innerHTML = "";
  const themes = folders[currentFolder] || {};

  Object.keys(themes).forEach((theme) => {
    // Filtrer les raccourcis de ce thème en fonction de la recherche
    const matchingShortcuts = themes[theme].filter((shortcut) => {
      if (!searchQuery) return true; // aucun filtre, on affiche tout
      return (
        shortcut.key.toLowerCase().includes(searchQuery) ||
        shortcut.description.toLowerCase().includes(searchQuery)
      );
    });

    if (matchingShortcuts.length > 0) {
      // Création de la section du thème
      const section = document.createElement("div");
      section.classList.add("mb-4");
      const header = document.createElement("h4");
      header.textContent = theme;
      section.appendChild(header);

      // Conteneur pour la liste des raccourcis du thème filtré
      const list = document.createElement("div");
      list.id = "theme-container-" + theme;
      list.classList.add("list-group");

      matchingShortcuts.forEach((shortcut) => {
        const card = document.createElement("div");
        card.classList.add("list-group-item");
        card.dataset.id = shortcut.id;
        card.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>${shortcut.key}</strong><br>
              <small>${shortcut.description}</small>
            </div>
            <div>
              <button class="btn btn-sm btn-warning me-2" onclick="editShortcut('${shortcut.id}')">Modifier</button>
              <button class="btn btn-sm btn-danger" onclick="deleteShortcut('${shortcut.id}', '${theme}')">Supprimer</button>
            </div>
          </div>
        `;
        list.appendChild(card);
      });

      section.appendChild(list);
      container.appendChild(section);

      // Initialise SortableJS pour ce conteneur (pour conserver le glisser/déposer)
      new Sortable(list, {
        group: "shared",
        animation: 150,
        onEnd: function (evt) {
          updateThemeOrder(theme, list);
        },
      });
    }
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  renderThemes();
});

// Mise à jour de l'ordre des raccourcis dans un thème en se basant sur l'ordre dans le DOM
function updateThemeOrder(theme, list) {
  const newOrder = [];
  Array.from(list.children).forEach((child) => {
    const id = child.dataset.id;
    const shortcut = folders[currentFolder][theme].find((s) => s.id === id);
    if (shortcut) newOrder.push(shortcut);
  });
  folders[currentFolder][theme] = newOrder;
  saveFolders();
}

// Ajout d'un raccourci via le formulaire
document
  .getElementById("shortcutForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const theme = document.getElementById("shortcutTheme").value;
    const key = document.getElementById("shortcutKey").value;
    const description = document.getElementById("shortcutDescription").value;
    const id = Date.now().toString(); // ID simple unique
    if (!folders[currentFolder][theme]) {
      folders[currentFolder][theme] = [];
    }
    folders[currentFolder][theme].push({ id, key, description });
    renderThemes();
    await saveFolders();

    if (currentFolder === "Anglais") {
      try {
        await sendShortcutToApi({ id, key, description, theme });
      } catch (error) {
        console.error("Erreur lors de l’envoi à l’API :", error);
      }
    }

    e.target.reset();
  });

//Envoi d'un raccourci à l'API
async function sendShortcutToApi(shortcutData) {
  const apiUrl = window.env.API_URL;
  const token = window.env.getToken();
  // Construisez l’URL selon votre Spring Boot (ex: "/shortcuts")
  const endpoint = `${apiUrl}/english-words`;
  const payload = {
    id: Number(shortcutData.id),
    theme: shortcutData.theme,
    word: shortcutData.key,
    translation: shortcutData.description,
    learningLevel: 1,
  };
  console.log(payload);
  // Exemple avec fetch :
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status} - ${response.statusText}`);
  } else {
    console.log("Raccourci envoyé à l’API avec succès !");
  }
}

// Suppression d'un raccourci
async function deleteShortcut(id, theme) {
  folders[currentFolder][theme] = folders[currentFolder][theme].filter(
    (s) => s.id !== id
  );
  renderThemes();
  saveFolders();

  if (currentFolder === "Anglais") {
    try {
      await sendShortcutToApi({ key, description, theme });
    } catch (error) {
      console.error("Erreur lors de l’envoi à l’API :", error);
    }
  }
}

/********************
 * Modification d'un Raccourci (via Modal)
 ********************/
// Ouvre le modal en remplissant les champs avec les données du raccourci
async function editShortcut(id) {
  const themes = folders[currentFolder];
  let foundShortcut = null;
  let currentTheme = null;
  Object.keys(themes).forEach((theme) => {
    const s = themes[theme].find((sc) => sc.id === id);
    if (s) {
      foundShortcut = s;
      currentTheme = theme;
    }
  });
  if (!foundShortcut) return;

  document.getElementById("editShortcutId").value = id;
  document.getElementById("editShortcutKey").value = foundShortcut.key;
  document.getElementById("editShortcutDescription").value =
    foundShortcut.description;
  document.getElementById("editShortcutTheme").value = currentTheme;

  const editModal = new bootstrap.Modal(document.getElementById("editModal"));
  editModal.show();
  if (currentFolder === "Anglais") {
    try {
      await sendShortcutToApi({ key, description, theme });
    } catch (error) {
      console.error("Erreur lors de l’envoi à l’API :", error);
    }
  }
}

// Enregistrement des modifications effectuées dans le modal
document
  .getElementById("saveEditBtn")
  .addEventListener("click", async function () {
    const id = document.getElementById("editShortcutId").value;
    const newKey = document.getElementById("editShortcutKey").value;
    const newDesc = document.getElementById("editShortcutDescription").value;
    const newTheme = document.getElementById("editShortcutTheme").value;

    let foundShortcut = null;
    // Recherche et suppression du raccourci dans son thème d'origine
    Object.keys(folders[currentFolder]).forEach((theme) => {
      const index = folders[currentFolder][theme].findIndex(
        (sc) => sc.id === id
      );
      if (index !== -1) {
        foundShortcut = folders[currentFolder][theme][index];
        folders[currentFolder][theme].splice(index, 1);
      }
    });
    if (foundShortcut) {
      foundShortcut.key = newKey;
      foundShortcut.description = newDesc;
      // Ajoute le raccourci dans le thème choisi (en fin de liste)
      if (!folders[currentFolder][newTheme]) {
        folders[currentFolder][newTheme] = [];
      }
      folders[currentFolder][newTheme].push(foundShortcut);
    }
    renderThemes();
    updateThemeDropdowns();
    saveFolders();
    const modalEl = document.getElementById("editModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();

    if (currentFolder === "Anglais") {
      try {
        await sendShortcutToApi({ key, description, theme });
      } catch (error) {
        console.error("Erreur lors de l’envoi à l’API :", error);
      }
    }
  });

// Ajout de l'écouteur pour le bouton d'export
document.getElementById("exportBtn").addEventListener("click", function () {
  const dataStr = JSON.stringify(folders, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "shortcuts.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

document.getElementById("importBtn").addEventListener("click", function () {
  document.getElementById("importInput").click();
});

document.getElementById("importInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    try {
      const importedFolders = JSON.parse(evt.target.result);
      if (
        confirm(
          "Importer ce fichier va remplacer vos raccourcis actuels. Continuer ?"
        )
      ) {
        folders = importedFolders;
        // Définir le dossier courant sur le premier dossier importé (ou sur "Blender" par défaut)
        currentFolder = Object.keys(folders)[0] || "Blender";
        document.getElementById("currentFolderName").textContent =
          "Dossier : " + currentFolder;
        updateThemeDropdowns();
        renderFolderList();
        renderThemes();
        saveFolders();
      }
    } catch (error) {
      alert(
        "Erreur lors de l'importation : le fichier n'est pas un JSON valide."
      );
    }
  };
  reader.readAsText(file);
  // Réinitialiser le champ pour pouvoir réimporter le même fichier si besoin
  e.target.value = "";
});

/********************
 * Initialisation
 ********************/
window.addEventListener("DOMContentLoaded", async () => {
  await autoLogin();
  await loadFolders();
});

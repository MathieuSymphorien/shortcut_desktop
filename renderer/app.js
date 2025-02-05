// app.js

function showMessage(msg, isError) {
  const notification = document.getElementById("notification");
  notification.textContent = msg;

  if (isError) {
    notification.classList.remove("success");
    notification.classList.add("error");
  } else {
    notification.classList.remove("error");
    notification.classList.add("success");
  }

  setTimeout(() => {
    notification.textContent = "";
    notification.classList.remove("error", "success");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", async () => {
  const logoutButton = document.getElementById("logout-button");
  const foldersList = document.getElementById("folders-list");
  const folderInput = document.getElementById("folder-input");
  const addFolderButton = document.getElementById("add-folder-button");

  // Zone raccourcis
  const selectedFolderNameSpan = document.getElementById(
    "selected-folder-name"
  );
  const shortcutsList = document.getElementById("shortcuts-list");
  const shortcutKeyInput = document.getElementById("shortcut-key-input");
  const shortcutExplanationInput = document.getElementById(
    "shortcut-explanation-input"
  );
  const addShortcutButton = document.getElementById("add-shortcut-button");
  const searchInput = document.getElementById("search-input");

  // Zone catégories
  const categoryInput = document.getElementById("category-input");
  const addCategoryButton = document.getElementById("add-category-button");
  const categoriesList = document.getElementById("categories-list");
  const categorySelect = document.getElementById("category-select");

  const token = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");

  // 1. Vérification de la connexion
  if (!token || !username) {
    window.location.href = "login.html";
    return;
  }

  // Variables globales
  let selectedFolderId = null;
  let selectedCategoryId = null;

  // 2. Charger la liste des dossiers
  async function loadFolders() {
    const response = await window.electronAPI.getFolders(username);
    if (response.success) {
      foldersList.innerHTML = "";

      response.folders.forEach((folder) => {
        const li = document.createElement("li");
        li.textContent = folder.name;
        li.classList.add("folder-item");
        // On stocke l'ID dans un attribut data
        li.dataset.folderId = folder.id;
        li.dataset.folderName = folder.name;

        // Quand on clique, on sélectionne ce folder et on charge ses raccourcis
        li.addEventListener("click", () => {
          selectedFolderId = folder.id;
          selectedFolderNameSpan.textContent = folder.name;
          loadCategoriesAndShortcuts(folder.id);
        });

        foldersList.appendChild(li);
      });
    } else {
      showMessage(
        response.message || "Erreur lors du chargement des dossiers.",
        true
      );
    }
  }

  // 3. Charger les catégories et les raccourcis pour un folder
  async function loadCategoriesAndShortcuts(folderId) {
    const categoriesResponse = await window.electronAPI.getCategories(folderId);
    const shortcutsResponse = await window.electronAPI.getShortcuts(folderId);

    if (categoriesResponse.success && shortcutsResponse.success) {
      shortcutsList.innerHTML = "";
      categorySelect.innerHTML =
        '<option value="">Sélectionner une catégorie</option>';

      const categories = categoriesResponse.categories;
      const shortcuts = shortcutsResponse.shortcuts;

      categories.forEach((category) => {
        const categoryLi = document.createElement("li");
        categoryLi.classList.add("category-title");
        categoryLi.dataset.categoryId = category.id;

        const categoryNameInput = document.createElement("input");
        categoryNameInput.type = "text";
        categoryNameInput.value = category.name;
        categoryNameInput.classList.add("category-name-input");
        categoryNameInput.addEventListener("blur", () =>
          updateCategory(category.id, categoryNameInput.value)
        );

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () =>
          deleteCategory(category.id)
        );

        categoryLi.appendChild(categoryNameInput);
        categoryLi.appendChild(deleteButton);

        shortcutsList.appendChild(categoryLi);

        const categoryShortcuts = shortcuts.filter(
          (sc) => Number(sc.category_id) === Number(category.id)
        );

        // Pour chaque raccourci de la catégorie en cours
        categoryShortcuts.forEach((sc) => {
          // Création de l'élément li avec une classe dédiée
          const shortcutLi = document.createElement("li");
          shortcutLi.classList.add("shortcut-item");
          shortcutLi.dataset.shortcutId = sc.id;

          // 1. Création du drag handle
          const dragHandle = document.createElement("div");
          dragHandle.classList.add("drag-handle");
          dragHandle.innerHTML = '<i class="fas fa-grip-lines"></i>';

          // 2. Création de la zone de contenu
          const shortcutContent = document.createElement("div");
          shortcutContent.classList.add("shortcut-content");

          const shortcutKeyInput = document.createElement("input");
          shortcutKeyInput.type = "text";
          shortcutKeyInput.value = sc.shortcut_key;
          shortcutKeyInput.classList.add("shortcut-key-input");
          shortcutKeyInput.addEventListener("blur", () =>
            updateShortcut(sc.id, shortcutKeyInput.value, sc.explanation)
          );

          const shortcutExplanationInput = document.createElement("input");
          shortcutExplanationInput.type = "text";
          shortcutExplanationInput.value = sc.explanation;
          shortcutExplanationInput.classList.add("shortcut-explanation-input");
          shortcutExplanationInput.addEventListener("blur", () =>
            updateShortcut(
              sc.id,
              sc.shortcut_key,
              shortcutExplanationInput.value
            )
          );

          shortcutContent.appendChild(shortcutKeyInput);
          shortcutContent.appendChild(shortcutExplanationInput);

          // 3. Création de la zone d'actions
          const shortcutActions = document.createElement("div");
          shortcutActions.classList.add("shortcut-actions");

          const categorySelectInput = document.createElement("select");
          categorySelectInput.classList.add("shortcut-category-select");
          categories.forEach((cat) => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            if (cat.id === sc.category_id) {
              option.selected = true;
            }
            categorySelectInput.appendChild(option);
          });
          categorySelectInput.addEventListener("change", (event) =>
            updateShortcutCategory(sc.id, event.target.value)
          );

          const deleteShortcutButton = document.createElement("button");
          deleteShortcutButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
          deleteShortcutButton.classList.add("delete-button");
          deleteShortcutButton.addEventListener("click", () =>
            deleteShortcut(sc.id)
          );

          shortcutActions.appendChild(categorySelectInput);
          shortcutActions.appendChild(deleteShortcutButton);

          // Assemblage de l'élément raccourci
          shortcutLi.appendChild(dragHandle);
          shortcutLi.appendChild(shortcutContent);
          shortcutLi.appendChild(shortcutActions);

          // Ajout dans la liste globale
          shortcutsList.appendChild(shortcutLi);
        });

        // Ajouter la catégorie à la liste déroulante
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });

      // Initialiser SortableJS pour les raccourcis
      const sortableShortcuts = new Sortable(shortcutsList, {
        animation: 150,
        onEnd: async (evt) => {
          const newOrder = Array.from(shortcutsList.children).map(
            (li, index) => ({
              id: li.dataset.shortcutId,
              order: index,
            })
          );

          const response = await window.electronAPI.updateShortcutsOrder(
            newOrder
          );
          if (response.success) {
            showMessage("Ordre des raccourcis mis à jour avec succès !", false);
          } else {
            showMessage(
              response.message ||
                "Erreur lors de la mise à jour de l'ordre des raccourcis.",
              true
            );
          }
        },
      });
    } else {
      showMessage(
        categoriesResponse.message ||
          shortcutsResponse.message ||
          "Erreur lors du chargement des catégories et des raccourcis.",
        true
      );
    }
  }

  // 4. Ajouter un dossier
  addFolderButton.addEventListener("click", async () => {
    const folderName = folderInput.value.trim();
    if (!folderName) return;

    const response = await window.electronAPI.addFolder({
      username,
      folderName,
    });
    if (response.success) {
      folderInput.value = "";
      showMessage("Dossier ajouté avec succès !", false);
      loadFolders();
    } else {
      showMessage(
        response.message || "Erreur lors de l'ajout du dossier.",
        true
      );
    }
  });

  // 5. Ajouter une catégorie
  addCategoryButton.addEventListener("click", async () => {
    if (!selectedFolderId) {
      showMessage("Veuillez d'abord sélectionner un dossier.", true);
      return;
    }
    const categoryName = categoryInput.value.trim();
    if (!categoryName) return;

    const response = await window.electronAPI.addCategory({
      folderId: selectedFolderId,
      categoryName,
    });
    if (response.success) {
      categoryInput.value = "";
      showMessage("Catégorie ajoutée avec succès !", false);
      loadCategoriesAndShortcuts(selectedFolderId);
    } else {
      showMessage(
        response.message || "Erreur lors de l'ajout de la catégorie.",
        true
      );
    }
  });

  // 6. Ajouter un raccourci
  addShortcutButton.addEventListener("click", async () => {
    if (!selectedFolderId) {
      showMessage("Veuillez d'abord sélectionner un dossier.", true);
      return;
    }
    const shortcutKey = shortcutKeyInput.value.trim();
    const explanation = shortcutExplanationInput.value.trim();

    if (!shortcutKey || !explanation) {
      return;
    }

    // Assurez-vous que selectedCategoryId est défini
    selectedCategoryId = categorySelect.value;
    if (!selectedCategoryId) {
      showMessage("Veuillez d'abord sélectionner une catégorie.", true);
      return;
    }

    const response = await window.electronAPI.addShortcut({
      folderId: selectedFolderId,
      shortcutKey,
      explanation,
      categoryId: selectedCategoryId,
    });
    if (response.success) {
      shortcutKeyInput.value = "";
      shortcutExplanationInput.value = "";
      showMessage("Raccourci ajouté avec succès !", false);
      loadCategoriesAndShortcuts(selectedFolderId);
    } else {
      showMessage(
        response.message || "Erreur lors de l'ajout du raccourci.",
        true
      );
    }
  });

  // 7. Déconnexion
  logoutButton.addEventListener("click", async () => {
    await window.electronAPI.logoutUser();
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    window.location.href = "login.html";
  });

  // 8. Modifier une catégorie
  async function updateCategory(categoryId, categoryName) {
    const response = await window.electronAPI.updateCategory({
      categoryId,
      categoryName,
    });
    if (response.success) {
      showMessage("Catégorie modifiée avec succès !", false);
      loadCategoriesAndShortcuts(selectedFolderId);
    } else {
      showMessage(
        response.message || "Erreur lors de la modification de la catégorie.",
        true
      );
    }
  }

  // 9. Supprimer une catégorie
  async function deleteCategory(categoryId) {
    const response = await window.electronAPI.deleteCategory(categoryId);
    if (response.success) {
      showMessage("Catégorie supprimée avec succès !", false);
      loadCategoriesAndShortcuts(selectedFolderId);
    } else {
      showMessage(
        response.message || "Erreur lors de la suppression de la catégorie.",
        true
      );
    }
  }

  // 10. Modifier un raccourci
  async function updateShortcut(shortcutId, shortcutKey, explanation) {
    const response = await window.electronAPI.updateShortcut({
      shortcutId,
      shortcutKey,
      explanation,
    });
    if (response.success) {
      showMessage("Raccourci modifié avec succès !", false);
      loadCategoriesAndShortcuts(selectedFolderId);
    } else {
      showMessage(
        response.message || "Erreur lors de la modification du raccourci.",
        true
      );
    }
  }

  // 11. Supprimer un raccourci
  async function deleteShortcut(shortcutId) {
    const response = await window.electronAPI.deleteShortcut(shortcutId);
    if (response.success) {
      showMessage("Raccourci supprimé avec succès !", false);
      loadCategoriesAndShortcuts(selectedFolderId);
    } else {
      showMessage(
        response.message || "Erreur lors de la suppression du raccourci.",
        true
      );
    }
  }

  // 12. Mettre à jour la catégorie d'un raccourci
  async function updateShortcutCategory(shortcutId, categoryId) {
    const response = await window.electronAPI.updateShortcutCategory({
      shortcutId,
      categoryId,
    });
    if (response.success) {
      showMessage("Catégorie du raccourci mise à jour avec succès !", false);
      loadCategoriesAndShortcuts(selectedFolderId);
    } else {
      showMessage(
        response.message ||
          "Erreur lors de la mise à jour de la catégorie du raccourci.",
        true
      );
    }
  }

  // 13. Rechercher un raccourci
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredShortcuts = Array.from(shortcutsList.children).filter((li) =>
      li.textContent.toLowerCase().includes(query)
    );

    shortcutsList.innerHTML = "";
    filteredShortcuts.forEach((li) => shortcutsList.appendChild(li));
  });

  // Initial load
  loadFolders();
});

document.addEventListener("DOMContentLoaded", () => {
  const burgerMenuButton = document.getElementById("burger-menu");
  const foldersSection = document.querySelector(".folders-section");

  burgerMenuButton.addEventListener("click", () => {
    foldersSection.classList.toggle("active");
  });
});

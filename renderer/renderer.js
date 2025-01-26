document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const emailInputRegister = document.getElementById("email-register");
  const passwordInputRegister = document.getElementById("password-register");
  const registerButton = document.getElementById("register-button");

  const emailInputLogin = document.getElementById("email-login");
  const passwordInputLogin = document.getElementById("password-login");
  const loginButton = document.getElementById("login-button");

  // Fonction pour s'enregistrer
  registerButton.addEventListener("click", async () => {
    const email = emailInputRegister.value;
    const password = passwordInputRegister.value;

    const response = await window.electronAPI.registerUser({ email, password });

    if (response.success) {
      alert("Enregistrement réussi ! Vous pouvez maintenant vous connecter.");
      emailInputRegister.value = "";
      passwordInputRegister.value = "";
    } else {
      alert(response.message || "Erreur lors de l'enregistrement.");
    }
  });

  // Fonction pour se connecter
  loginButton.addEventListener("click", async () => {
    const email = emailInputLogin.value;
    const password = passwordInputLogin.value;

    const response = await window.electronAPI.loginUser({ email, password });

    if (response.success) {
      alert("Connexion réussie !");
      loadFolders(email);
    } else {
      alert(response.message || "Erreur lors de la connexion.");
    }
  });

  async function loadFolders(email) {
    const response = await window.electronAPI.getFolders(email);

    if (response.success) {
      const foldersList = document.getElementById("folders-list");
      foldersList.innerHTML = "";
      response.folders.forEach((folder) => {
        const li = document.createElement("li");
        li.textContent = folder.name;
        foldersList.appendChild(li);
      });
    } else {
      alert("Erreur lors du chargement des dossiers.");
    }
  }
});

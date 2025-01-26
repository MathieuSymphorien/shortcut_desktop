// login.js

// 1) Fonction pour afficher un message temporaire
function showMessage(msg, isError) {
  const notification = document.getElementById("notification");
  notification.textContent = msg;

  // Ajout/Suppression de classe selon le type d'info
  if (isError) {
    notification.classList.remove("success");
    notification.classList.add("error");
  } else {
    notification.classList.remove("error");
    notification.classList.add("success");
  }

  // Affichage automatique (le CSS fera la transition)
  // Puis effacement après 3 secondes
  setTimeout(() => {
    notification.textContent = "";
    notification.classList.remove("error", "success");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const registerButton = document.getElementById("register-button");
  const loginButton = document.getElementById("login-button");

  const usernameInputRegister = document.getElementById("username-register");
  const passwordInputRegister = document.getElementById("password-register");
  const usernameInputLogin = document.getElementById("username-login");
  const passwordInputLogin = document.getElementById("password-login");

  // 2) Enregistrement
  registerButton.addEventListener("click", async () => {
    const username = usernameInputRegister.value;
    const password = passwordInputRegister.value;

    const response = await window.electronAPI.registerUser({
      username,
      password,
    });

    if (response.success) {
      // Affiche un message de succès via showMessage
      showMessage(
        "Enregistrement réussi ! Vous pouvez maintenant vous connecter.",
        false
      );
      usernameInputRegister.value = "";
      passwordInputRegister.value = "";
    } else {
      // Affiche un message d’erreur
      showMessage(response.message || "Erreur lors de l'enregistrement.", true);
    }
  });

  // 3) Connexion
  loginButton.addEventListener("click", async () => {
    const username = usernameInputLogin.value;
    const password = passwordInputLogin.value;

    const response = await window.electronAPI.loginUser({ username, password });

    if (response.success) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("username", username);

      window.location.href = "app.html";
    } else {
      showMessage(response.message || "Erreur lors de la connexion.", true);
    }
  });
});

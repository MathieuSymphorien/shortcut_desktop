# Gestionnaire de raccourcis

Cette application de bureau, développée avec [Electron](https://www.electronjs.org/), permet de gérer et mémoriser vos raccourcis clavier. Vous pouvez organiser vos raccourcis en dossiers et en thèmes, les modifier, les réorganiser par glisser/déposer et importer/exporter vos données au format JSON.

## Installation en développement

1. **Installez les dépendances :**

```bash
npm install
```

2. **Lancez l'application :**

```bash
npm start
```

## Structure du projet

- `main.js` : Point d'entrée du processus principal d’Electron.
- `preload.js` : Pont sécurisé entre le processus principal et le renderer.
- `index.html` : Interface utilisateur principale.
- `style.css` : Feuille de styles personnalisée.
- `renderer.js` : Logique de l’application (gestion des dossiers, thèmes, raccourcis, import/export, etc.).

## Utilisation

### Ajouter un dossier

Utilisez le formulaire dans le menu burger (offcanvas) pour ajouter un nouveau dossier.

### Supprimer un dossier

Pour chaque dossier (sauf le dernier), un bouton « Supprimer » est affiché dans le menu burger. Cliquez dessus pour supprimer le dossier après confirmation.

### Ajouter un thème et des raccourcis

Dans l’interface principale, ajoutez des thèmes et des raccourcis dans le dossier sélectionné. Le menu déroulant vous permet de choisir le thème de destination.

### Modification et réorganisation

Utilisez les boutons « Modifier » et « Supprimer » sur chaque raccourci pour les éditer ou les supprimer. Réorganisez-les par glisser/déposer.

### Export/Import JSON

- **Exporter** : Cliquez sur le bouton « Exporter JSON » pour télécharger vos raccourcis au format JSON.
- **Importer** : Cliquez sur le bouton « Importer JSON » et sélectionnez un fichier JSON pour charger une configuration externe (attention, l’importation remplace les données actuelles après confirmation).

## Installation de l'application (Packaging & Installation)

Pour transformer l'application en installateur exécutable, nous utilisons electron-builder.

1. **Installer electron-builder en tant que dépendance de développement :**

```bash
npm install --save-dev electron-builder
```

2. **Configurer le fichier `package.json`**

Ajoutez ou modifiez la section "build" dans votre `package.json` pour inclure votre configuration NSIS et l'icône personnalisée :

```json
"build": {
  "appId": "com.votreentreprise.gestionnairederaccourcis",
  "productName": "Gestionnaire de Raccourcis",
  "directories": {
   "output": "dist"
  },
  "files": [
   "**/*"
  ],
  "icon": "assets/icon.png",
  "win": {
   "target": "nsis"
  },
  "mac": {
   "target": "dmg"
  },
  "linux": {
   "target": "AppImage"
  },
  "nsis": {
   "oneClick": false,
   "perMachine": true,
   "allowElevation": true,
   "createDesktopShortcut": true,
   "createStartMenuShortcut": true,
   "shortcutName": "Gestionnaire de Raccourcis"
  }
}
```

3. **Construire l'installateur :**

```bash
npm run build
```

4. **Installer l'application :**

Lancez l'installateur généré (situé dans le dossier `dist`) et suivez les instructions.

Si l'option `oneClick` est désactivée, un assistant d'installation s'affichera vous permettant de choisir le dossier d'installation, de créer des raccourcis, etc.

Une fois l'installation terminée, l'application sera accessible depuis le menu Démarrer ou le dossier d'installation par défaut (par exemple, `C:\Program Files\`).

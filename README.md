# Electron Shortcuts App

## Description

Electron Shortcuts App est une application de bureau construite avec Electron.js. Elle permet de gérer et de mémoriser les raccourcis clavier pour différents logiciels de manière simple et intuitive.

## Fonctionnalités

- **Gestion de dossiers** : Créez plusieurs dossiers pour organiser les raccourcis selon les applications (par exemple, Blender, Photoshop, etc.).
- **Affichage des raccourcis** : Affichez une liste des raccourcis pour chaque dossier avec leurs descriptions.
- **Création de nouveaux raccourcis** : Ajoutez des raccourcis avec une description personnalisée.
- **Burger Menu** : Naviguez entre les différents dossiers via un menu latéral interactif.

## Prérequis

- **Node.js** : Assurez-vous d'avoir installé [Node.js](https://nodejs.org) sur votre machine.

## Installation

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Lancez l'application :
   ```bash
   npm start
   ```

## Création d’un installateur (Build de l’application)

Pour créer un installateur utilisable sur Windows, suivez les étapes ci-dessous :

Installez les dépendances nécessaires pour le build (si ce n’est pas déjà fait) :

npm install
Créez l’installateur de l’application :

npm run build
Une fois la commande terminée, un fichier exécutable sera disponible dans le dossier dist :

dist/ShortcutDesktopApp Setup 1.0.0.exe
Double-cliquez sur le fichier ShortcutDesktopApp Setup 1.0.0.exe pour lancer l’installation.

Suivez les instructions de l’installateur. Un raccourci sera créé sur le bureau si tout est bien configuré.

## Structure du Projet

```
.
├── main.js         # Fichier principal d'Electron
├── index.html      # Page principale
├── renderer.js     # Logique de l'interface utilisateur
├── package.json    # Configuration du projet
└── .gitignore      # Exclusions Git
```

## .gitignore

```
# Node.js
node_modules/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Electron
*.asar

# Système
.DS_Store
Thumbs.db
```

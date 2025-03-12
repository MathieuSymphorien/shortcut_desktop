#!/usr/bin/env node
// json2csv.js
//
// Lance-le via: `node jsontocsv.js data.json english_words.csv`

const fs = require("fs");
const path = require("path");

if (process.argv.length < 4) {
  console.error("Usage: node json2csv.js <input.json> <output.csv>");
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

// Lecture du JSON
const rawData = fs.readFileSync(inputFile, "utf8");
const data = JSON.parse(rawData);

// On prépare un tableau pour stocker toutes les lignes CSV
// On va inclure un HEADER pour nos colonnes :
const csvLines = [];
csvLines.push("id,theme,word,translation,learningLevel");
// Ajuste l'ordre et les colonnes selon tes besoins

// Parcours des langues (ex: "Anglais"), si tu en as plusieurs
for (const languageKey of Object.keys(data)) {
  const languageObj = data[languageKey];
  // Parcours des thèmes : (ex: "Default", "Expression", "Animals", etc.)
  for (const theme of Object.keys(languageObj)) {
    const entries = languageObj[theme]; // tableau d'objets {id, key, description, ...}
    if (!Array.isArray(entries)) {
      continue;
    }

    // Pour chaque objet dans le tableau
    for (const item of entries) {
      // Récupère id, key, description. learningLevel par défaut = 1 (?)
      const id = item.id || "";
      const word = item.key ? item.key.replace(/,/g, " ") : ""; // enlever les virgules si besoin
      const translation = item.description
        ? item.description.replace(/,/g, " ")
        : "";
      const learningLevel = 1;
      // Ajoute la ligne CSV
      // N'oublie pas d'échapper les champs s'il y a des virgules, guillemets, etc.
      // Ci-dessous c'est simplifié, on fait juste un join par virgule :
      csvLines.push(`${id},${theme},${word},${translation},${learningLevel}`);
    }
  }
}

// Écriture du CSV sur disque
fs.writeFileSync(outputFile, csvLines.join("\n"), "utf8");
console.log(`Fichier CSV généré: ${outputFile}`);

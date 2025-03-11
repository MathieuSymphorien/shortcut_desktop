#!/usr/bin/env python3
import json
import sys

def transform_json(input_file, output_file):
    # Lecture du fichier JSON d'entrée
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Extraction de la liste de raccourcis (sous la clé "shortcuts")
    shortcuts = data.get("shortcuts", [])

    # Transformation de chaque raccourci : on garde uniquement 'shortcut_key' et 'explanation'
    # On génère un nouvel id pour chaque élément (ici de manière séquentielle)
    new_shortcuts = []
    for i, item in enumerate(shortcuts, start=1):
        new_shortcut = {
            "id": str(i),
            "key": item.get("shortcut_key", ""),
            "description": item.get("explanation", "")
        }
        new_shortcuts.append(new_shortcut)

    # Création de la structure finale attendue par l'application
    # Tous les raccourcis sont placés dans le dossier "Blender" et le thème "Default"
    output_data = {
        "Blender": {
            "Default": new_shortcuts
        }
    }

    # Écriture du résultat dans le fichier de sortie
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"Transformation terminée. Fichier généré : {output_file}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage : python transform_json.py input.json output.json")
        sys.exit(1)
    
    input_filename = sys.argv[1]
    output_filename = sys.argv[2]
    transform_json(input_filename, output_filename)

// =================================================
// ============ CORE VARIABLES

const _version = "1.6.1";
const _github = "<a target=\"_blank\" href=\"https://github.com/n-deleforge/class-manager-generator\">GitHub</a>";
const _home = "<a target=\"_blank\" href=\"https://nicolas-deleforge.fr/\">ND</a>";

const _french = {
    'reset' : "Effacer",
    'generate' : "Générer",
    'error' : "Tous les champs sont nécessaires.",
    'downloading' : "Génération réussie.",
    'footer' : "Disponible sur " + _github + " (v " + _version + ") ©  " + _home,
    'dataTitle' : "Données",
    'tableNameLabel' : "► NOM DE LA TABLE",
    'tableNameDesc' : "Nom de table qui correspond au nom tel qu'il est dans votre base de données SQL.",
    'tableIdLabel' : "► NOM DU CHAMP ID",
    'tableIdDesc' : "Champ ID de votre table SQL",
    'columnsNameLabel' : "► NOM DE TOUTES LES COLONNES",
    'columnsNameDesc' : "Les différentes colonnes de votre table SQL (doit respecter le format exact suivant : col1,col2,col3).",
    'classNameLabel' : "► NOM CLASS/MANAGER",
    'classNameDesc' : "Nom de la Class et du Manager que vous allez créer (une majuscule est automatiquement appliquée).",
    'optionsTitle' : "Options",
    'dbTypeLabel' : "Type de base de données",
    'dbTypeOption1' : "MariaDB",
    'dbTypeOption2' : "SQLite3",
    'dbConnectLabel' : "Inclure DbConnect.Class ?",
    'dbConnectOption1' : "Non",
    'dbConnectOption2' : "Oui"
};

const _english = {
    'reset' : "Reset",
    'generate' : "Generate",
    'error' : "All the fields have to be filled.",
    'downloading' : "Success generation.",
    'footer' : "Available on " + _github + " (v " + _version + ") ©  " + _home,
    'dataTitle' : "Data",
    'tableNameLabel' : "➡ TABLE NAME",
    'tableNameDesc' : "Name of the table in your database.",
    'tableIdLabel' : "➡ ID FIELD NAME",
    'tableIdDesc' : "Name of the ID field of your table.",
    'columnsNameLabel' : "➡ COLUMNS NAMES",
    'columnsNameDesc' : "All the columns' names of your table. Must respect this format : col1,col2,col3",
    'classNameLabel' : "➡ CLASS/MANAGER NAME",
    'classNameDesc' : "Name of the Class and the Manager.",
    'optionsTitle' : "Options",
    'dbTypeLabel' : "Database type",
    'dbTypeOption1' : "MariaDB",
    'dbTypeOption2' : "SQLite3",
    'dbConnectLabel' : "Include DbConnect.Class ?",
    'dbConnectOption1' : "No",
    'dbConnectOption2' : "Yes"
};

// =================================================
// ============ CORE INITIALISATION

// Determine the language of the application
const _content = (navigator.language == "fr" || navigator.language == "fr-FR") ? _french : _english;
let names = Object.keys(_content); let values = Object.values(_content);

for (let i = 0; i < names.length; i++) {
    if (get("#" + names[i]))  get("#" + names[i]).innerHTML = values[i];
}
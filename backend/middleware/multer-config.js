//Importer multer le package de gestion des fichirs
//Sa méthode diskStorage() configure le chemin et le nom de fichier pour les fichiers entrants.
//Sa méthode single()  crée un middleware qui capture les fichiers d'un certain type
//(passé en argument), et les enregistre au système de fichiers du serveur à l'aide du storage configuré.
const multer = require('multer');

//Configurer le middleware de gestion des fichiers
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Créer un objet de configuration pour multer
//constante STORAGE pour indiquer à multer où enregistrer les fichiers entrants 
//la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
//la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores 
//et d'ajouter un timestamp Date.now() comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME 
//pour résoudre l'extension de fichier appropriée.
const storage = multer.diskStorage({
  destination: (req, file, callback) => { //Destination :Ou mettre le fichier
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // nouveau nom du fichier image pour éviter les doublons
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//exporter middleware multer
//Méthode single
module.exports = multer({storage: storage}).single('image');



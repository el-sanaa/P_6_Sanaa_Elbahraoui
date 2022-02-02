//Mettre les routes dans le routeur
//Créer un routeur express 
const express = require('express');

//Fonction Router
const router = express.Router();

//Importer middleware pour authentifier les pages de l'application
const auth = require('../middleware/auth');

//Middleware pour définir la destination et le nom de fichier des images 
const multer = require('../middleware/multer-config');

//Importer controllers sauce
const sauceCtrl = require('../controllers/sauce');

//Appliquer le middleware aux routes pour les protéger
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);

//Exporter routeur
module.exports = router;
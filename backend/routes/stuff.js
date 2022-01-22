//Mettre les routes dans le routeur
//Créer un routeur express 
const express = require('express');
const router = express.Router();

//Ajouter le middleware à la route post dans ce routeur stuff 
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');

//Appliquer le middleware à toutes les routes
router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/', auth, multer, stuffCtrl.createSauces);
router.get('/:id', auth, stuffCtrl.getOneSauces);
router.put('/:id', auth, multer, stuffCtrl.modifySauces);
router.delete('/:id', auth, stuffCtrl.deleteSauces);


//Exporter routeur
module.exports = router;
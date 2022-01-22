//Mettre les routes dans le routeur
//Créer un routeur express 
const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/sauces');

const auth = require('../middleware/auth');

//Ajouter le middleware à la route post dans ce routeur stuff 
const multer = require('../middleware/multer-config');


//Appliquer le middleware à toutes les routes
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);

//Exporter routeur
module.exports = router;
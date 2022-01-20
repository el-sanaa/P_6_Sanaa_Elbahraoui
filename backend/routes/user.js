
//routes user.js
//Importer framwork expresss
const express = require('express');

//Fonction router()
const router = express.Router();

//Importer controller user.js
const userCtrl = require('../controllers/user');

//Créer les routes post //méthode signup et login
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//Exporter module(router)
module.exports = router; 

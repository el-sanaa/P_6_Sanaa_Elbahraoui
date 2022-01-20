//routes user.js
//Importer framwork expresss
const express = require('express');

//Importer controller user.js
const userCtrl = require('../controllers/user');

//Fonction Router()
const router = express.Router();

//Créer les routes post //méthode signup et login
router.post('/signup', userCtrl.signup);
//router.post('/login', userCtrl.login);

//Exporter module(router)
module.exports = router; 

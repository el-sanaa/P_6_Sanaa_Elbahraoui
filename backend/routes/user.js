
//Importer framwork expresss
const express = require('express');

//Fonction Router()
const router = express.Router();

//Importer controller user.js
const userCtrl = require('../controllers/user');


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//Exporter module(router)
module.exports = router;


//Controller de la route
//Importer models de la base de donnée User.js
const User = require('../models/User');

//Importer bcrypt
const bcrypt = require('bcrypt');

//Importer jwt
//const jwt = require('jsonwebtoken');

//Fonction signup pour enregistrer des nouveaux utilisateurs
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};



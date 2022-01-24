//Importer bcrypt
const bcrypt = require('bcrypt');

const dotenv = require("dotenv");
const result = dotenv.config();

//Importer models de la base de donnée User.js
const User = require('../models/User');

//Importer jwt
const jwt = require('jsonwebtoken');

//Fonction asynchrome signup pour enregistrer des nouveaux utilisateurs
//Méthode hash de bcrypt
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // Saler le mot de passe 10 fois
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
     
      });
      //Méthode save pour enregistrer l'utilisateur ds la base de donnée mongodb  
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  };

//Fonction login pour connecter les utilisateurs existants
//vérifier si l'utilisateur qui tente de se connecter dispose d'identifiants valides.
//Implémenter la fonction login
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};









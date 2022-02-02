//Importer bcrypt
const bcrypt = require('bcrypt');

const dotenv = require("dotenv");
const result = dotenv.config();

//Importer models de la base de donnée User.js
const User = require('../models/User');

//Importer jwt
const jwt = require('jsonwebtoken');

//Fonction asynchrome signup pour enregistrer des nouveaux utilisateurs
//Méthode hash () de bcrypt crée un hash crypté des mots de passe 
/////des utilisateurs pour les enregistrer de manière sécurisée dans la base de données.
exports.signup = (req, res, next) => { 
  bcrypt.hash(req.body.password, 10) // Saler le mot de passe 10 fois
    .then(hash => {
      const user = new User({ //Créer un new utilisateur
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

//Implémenter la Fonction login pour connecter les utilisateurs existants
//vérifier si l'utilisateur qui tente de se connecter dispose d'identifiants valides.

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) //Si l'email de l'utilisatuer est présent ds la base de donnée
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)//Comparer les mots de passe
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({ //Si le mot de passe est bon
            userId: user._id,
            token: jwt.sign( //Fonction sign de jsonwebtoken pour encoder un nouveau token
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',//chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder le token
              { expiresIn: '24h' } //Connection (token) limitée à 24h
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};






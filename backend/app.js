//Importer express
const express = require('express');

//Imporet morgan logger http
const morgan = require("morgan");

//Importer connection base de donnée mongoDB
const mongoose = require("./db/db");

//Importer le chemin
const path = require('path');

//Importer les routes sauce et user
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const mongoSanitize = require('express-mongo-sanitize');
//const helmet = require("helmet");

//Créer une application express
const app = express();

//Régler problème CORS pour le partage des ressources entre les serveurs 
//Fonction Middeware général avec des les headers qui permettent 
//d'accéder à l'API depuis n'importe quelle origine ( '*' )
//d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
//d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
app.use((req, res, next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Analyser (parser) le corps de la requete avec express.json
//Transformer le corps (le body) en json objet javascript utilisable 
app.use(express.json());

//Logger (journalisation) les reponses et les requetes
app.use(morgan("dev"));

//Mongoose option debug
mongoose.set('debug', true);

app.use(mongoSanitize()); 
//Securiser express
//app.use(helmet()); 

//Enregistrer le routeur pour toutes les demandes effectuées vers /api/sauces  
//Ajouter le gestionnaire de routage
app.use('/images', express.static(path.join(__dirname, 'images')));
console.log(__dirname);
app.use('/api/sauces', saucesRoutes); // Route sauce
app.use("/api/auth", userRoutes);//Route d'authentification

//Exporter appli app.js
module.exports = app;
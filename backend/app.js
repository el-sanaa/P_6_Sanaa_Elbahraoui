//Importer express
const express = require('express');

//Imporet morgan logger http
const morgan = require("morgan");

//Importer mongoose dans le fichier app.js
const mongoose = require("./db/db");

const path = require('path');

const saucesRoutes = require('./routes/sauce');
//Importer les routes
const userRoutes = require('./routes/user');

//const mongoSanitize = require('express-mongo-sanitize');

//const helmet = require("helmet");


//Créer une application express
const app = express();



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
app.use(express.json());


//Logger les reponses et les requetes
app.use(morgan("dev"));

//Mongoose option debug
mongoose.set('debug', true);


//app.use(mongoSanitize()); 
//app.use(helmet()); 

//Enregistrer le routeur pour toutes les demandes effectuées vers /api/sauces  
//Ajouter le gestionnaire de routage
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use("/api/auth", userRoutes);

//Exporter appli app.js
module.exports = app;
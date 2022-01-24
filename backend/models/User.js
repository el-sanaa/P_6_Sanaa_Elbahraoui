//Partie identification
//Importer mongoose
const mongoose = require('mongoose');

//Importer package uniqueValidator pour valider l'unicité de l'email
const uniqueValidator = require('mongoose-unique-validator');

//Créer schema de données pour la base de données MongoDB.
//Définir la forme du documents
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },//adresse e-mail de l'utilisateur [unique]
  password: { type: String, required: true }// mot de passe de l'utilisateur haché
   
});

//Appliquer uniqueValidator au schèma
userSchema.plugin(uniqueValidator);


//Exporter mongoose.model
module.exports = mongoose.model("User", userSchema); 

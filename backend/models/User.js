//Partie identification
//Importer mongoose
const mongoose = require('mongoose');

//Créer schema de données pour la base de données MongoDB.
//Définir la forme du documents
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
   
});



//Exporter mongoose.model
module.exports = mongoose.model("user", userSchema); 
//module.exports = mongoose.model("user", userSchema);
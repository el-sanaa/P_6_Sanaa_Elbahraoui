//Importer mongoose
const mongoose = require('mongoose');

//Data ModelsSauce
//Créer schema de données 
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String },
    heat: { type: Number },
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0 },
    userId: { type: String },
    usersLiked: [String],
    usersDisliked: [String] , 
});



//Exporter mongoose.modele // La méthode  model  transforme ce modèle en un modèle utilisable
module.exports = mongoose.model('Sauce', sauceSchema);

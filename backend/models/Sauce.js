//Importer mongoose
const mongoose = require('mongoose');

//Data ModelsSauce
//Créer schema de données 
const saucesSchema = mongoose.Schema({
    userId: { type: String }, //'identifiant MongoDB unique de l'utilisateur qui a créé la
    name: { type: String, required: true }, //nom de la sauce
    manufacturer: { type: String, required: true }, //Fabriqant de la sauce
    description: { type: String, required: true },//Description de la sauce
    mainPepper: { type: String, required: true },//le principal ingrédient épicé de la sauce
    imageUrl: { type: String }, // l'URL de l'image de la sauce téléchargée par l'utilisateu
    heat: { type: Number },// nombre entre 1 et 10 décrivant la sauce
    likes: { type: Number, default: 0},// nombre d'utilisateurs qui aiment (= likent) la sauce
    dislikes: { type: Number, default: 0 },// nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
    usersLiked: [String], // [ "String <userId>" ] — tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce
    usersDisliked: [String] , //[ "String <userId>" ] — tableau des identifiants des
                                //utilisateurs qui n'ont pas aimé (= disliked) la sauce
    
});

//Exporter mongoose.modele // La méthode  model  transforme ce modèle en un modèle utilisable
module.exports = mongoose.model('Sauce', saucesSchema);

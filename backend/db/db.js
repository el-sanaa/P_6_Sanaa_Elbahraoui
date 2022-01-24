//Importer le package pour utiliser les variables d'environnement
const dotenv = require("dotenv");
const result = dotenv.config();

//Importer mongoose pour se connecter à la base db
//Variables d'environnement pour le password, le user et le nom de la base de donnée
const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority` ,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Exporter mongoose
module.exports = mongoose;  
//Importer model sauces
const Sauces = require('../models/sauces');

//Importer le package fs de node pour modifier ou supprimer des fichiers
const fs = require('fs');

exports.createSauces = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauces);
    delete saucesObject._id;
    const sauces = new Sauces({ // créer un nouveau objet sauces
      ...saucesObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauces.save() // sauvegarder la sauce ds la base de donnée
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.modifySauce = (req, res, next) => {
const sauceObject = req.file ? // Vérifier si la modification concerne le body ou un nouveau fichier image
{
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
} : { ...req.body };
Sauce.updateOne({ _id: req.params.id} , {...sauceObject, _id: req.params.id})
.then(()=> res.status(200).json({ message: 'Sauce modified'}))
.catch(()=> res.status(400).json({ error}))
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // Identifier la sauce
    .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1]; // Récuperer l'adresse de l'image
    fs.unlink(`images/${filename}`, () => { //Supprimer image du serveur
    Sauce.deleteOne({_id: req.params.id}) // Supprimer la sauce de la base de donnée
    .then(()=> res.status(200).json({ message: 'Sauce deleted'}))
    .catch(error => res.status(400).json({ error}))
    });
})
};

exports.likeSauce = (req, res, next) => {    
    const like = req.body.like;
    if(like === 1) { // Like option 
        Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'You like this sauce' }))
        
        .catch( error => res.status(400).json({ error}))
    } else if(like === -1) { // Dislike option 
        Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'You don\'t like this sauce' }))
        .catch( error => res.status(400).json({ error}))

    } else {    //Annuler les likes et les dislikes
        Sauce.findOne( {_id: req.params.id})
        .then( sauce => {
            if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
                 Sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
                .then( () => res.status(200).json({ message: 'You don\'t like this sauce anymore ' }))
                .catch( error => res.status(400).json({ error}))
                }
            else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
                Sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
                .then( () => res.status(200).json({ message: 'You might like this sauce now ' }))
                .catch( error => res.status(400).json({ error}))
                }           
        })
        .catch( error => res.status(400).json({ error}))             
    }   
};

exports.getAllSauces = (req, res, next) => { // Récuperer toutes les sauces
    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch( error => res.status(400).json({ error }))
};
exports.getOneSauce = (req, res, next) => {  // Récuperer une seule sauce
    Sauce.findOne({_id : req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch( error => res.status(404).json({ error }))

};

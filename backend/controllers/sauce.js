//Importer models Sauce
const Sauce = require('../models/Sauce');

//Importer le package fs de node pour modifier ou supprimer des fichiers
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;    
    const sauce = new Sauce({ // Créer un nouvel objet sauce
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,   // l'image du dossier images du serveur est aussi stockée dans la base de donnée      
       
    });
    sauce.save() // Sauvegarder la sauce ds la base de donée
      //envoyer une réponse au frontend avec un statut 201 sinon on a une expiration de la requête  
    .then( () => res.status(201).json({ message: 'Sauce saved'}))
      //Code error si un problème   
    .catch( error => res.status(400).json({ error }))
    
    
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
    // Trouver l'objet pour trouver l'url de l'image et supprimer le fichier image de la base
    Sauce.findOne({
        _id: req.params.id
      })
      .then(sauce => {
        // Extraire le fichier => récupèrer l'url de la sauce + spliter le nom du fichier
        const filename = sauce.imageUrl.split('/images/')[1];
        // Appeller unlink pour supprimer le fichier
        fs.unlink(`images/${filename}`, () => {
          // Supprimer la sauce correspondante de la base de donnée
          Sauce.deleteOne({
              _id: req.params.id
            })
            .then(() => res.status(200).json({
              message: 'Sauce supprimée !'
            }))
            .catch(error => res.status(400).json({
              error
            }));
        });
      })
      .catch(error => res.status(500).json({
        error
      }));
  };

  exports.likeSauce = (req, res, next) => {    
    const like = req.body.like;
    if(like === 1) { // like option
        Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'You like this sauce' }))
        .catch( error => res.status(400).json({ error}))
   
    } else if(like === -1) { // dislike option
        Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'You don\'t like this sauce' }))
        .catch( error => res.status(400).json({ error}))

    } else { //Annuler like et dislike
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



exports.getAllSauces = (req, res, next) => { //Récupérer toutes les sauces
    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch( error => res.status(400).json({ error }))
};
exports.getOneSauce = (req, res, next) => {  //Récuperer une seule sauce
    Sauce.findOne({_id : req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch( error => res.status(404).json({ error }))
};

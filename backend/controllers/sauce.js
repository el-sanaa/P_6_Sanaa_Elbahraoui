//Importer models Sauce
const Sauce = require('../models/sauce');

//Importer le package fs de node pour modifier ou supprimer des fichiers
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;    
    const sauce = new Sauce({ // Créer un nouvel objet sauce
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,   // l'image du dossier images du serveur est aussi stockée dans la base de donnée      
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
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

exports.likeDislike = (req, res, next) => {
    // Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
    // Like présent dans le body
    let like = req.body.like
    // On prend le userID
    let userId = req.body.userId
    // On prend l'id de la sauce
    let sauceId = req.params.id
  
    if (like === 1) { // Si il s'agit d'un like
      Sauce.updateOne({
          _id: sauceId
        }, {
          // On push l'utilisateur et on incrémente le compteur de 1
          $push: {
            usersLiked: userId
          },
          $inc: {
            likes: +1
          }, // On incrémente de 1
        })
        .then(() => res.status(200).json({
          message: 'j\'aime ajouté !'
        }))
        .catch((error) => res.status(400).json({
          error
        }))
    }
    if (like === -1) {
      Sauce.updateOne( // S'il s'agit d'un dislike
          {
            _id: sauceId
          }, {
            $push: {
              usersDisliked: userId
            },
            $inc: {
              dislikes: +1
            }, // On incrémente de 1
          }
        )
        .then(() => {res.status(200).json({ message: 'Dislike ajouté !'})})
        .catch((error) => res.status(400).json({error}))
    }
    if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
            Sauce.updateOne({ _id: sauceId}, {
                $pull: {usersLiked: userId},
                $inc: {likes: -1}, // On incrémente de -1
              })
              .then(() => res.status(200).json({message: 'Like retiré !'}))
              .catch((error) => res.status(400).json({error}))
            }
          if (sauce.usersDisliked.includes(userId)) { // Si il s'agit d'annuler un dislike
            Sauce.updateOne({ _id: sauceId}, {
                $pull: {usersDisliked: userId},
                $inc: {dislikes: -1 }, // On incrémente de -1
              })
              .then(() => res.status(200).json({ message: 'Dislike retiré !'}))
              .catch((error) => res.status(400).json({error}))
            }
        })
        .catch((error) => res.status(404).json({error }))
    }
  }

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

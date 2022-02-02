//Importer models Sauce
const Sauce = require('../models/Sauce');

//Importer le package fs de node pour modifier ou supprimer des fichiers
const fs = require('fs');

exports.createSauce = (req, res, next) => {

    //Json.parse analyser l'objet sauce (qui est envoyé sous form data par le frontend )
      //transforme un objet stringifié en Object JavaScript exploitable.
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;    
    const sauce = new Sauce({ // Créer un nouvel objet sauce 

        ...sauceObject, 
        //Résoudre l'URL complète de l'image,car req.file.filename ne contient que le segment filename. 
          // Utiliser req.protocol pour obtenir le premier segment (dans notre cas 'http') Ajoutons '://'
            //puis utiliser req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000')
              //Ajouter finalement '/images/'et le nom de fichier pour compléter l'URL
            
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,   // l'image du dossier images du serveur est aussi stockée dans la base de donnée      
       
    });
    sauce.save() // Sauvegarder la sauce ds la base de donée
      //envoyer une réponse au frontend avec un statut 201 sinon on a une expiration de la requête  
    .then( () => res.status(201).json({ message: 'Sauce enregistrée'}))
      //Code error si un problème   
    .catch( error => res.status(400).json({ error }))
    
    
};

//Voir voir si nous avons reçu ou non un nouveau fichier, et répondre en conséquence
//on crée un objet thingObject qui regarde si req.file existe ou non. 
  //S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant.
      // On crée ensuite une instance Thing à partir de thingObject , puis on effectue la modification.
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then((sauce) =>{
    if (!sauce) {
      res.status(404).json({
        error: new Error( 'No such Sauce')
      });
    }
    if (sauce.userId !== req.auth.userId){
      res.status(400).json({
        error: new Error('Unauthorized request!')
      });
    }
  
    

    // Vérifier si la modification concerne le body ou un nouveau fichier image      
    const sauceObject = req.file ? 
      {
          //Récuperer toutes les infos sur l'bojet qui sont ds cette requete
          ...JSON.parse(req.body.sauce),
          //Générer (modifier) l'image de l'url
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
        
      Sauce.updateOne({ _id: req.params.id} , {...sauceObject, _id: req.params.id})
      .then(()=> res.status(200).json({ message: 'Sauce modifiée'}))
      .catch(()=> res.status(400).json({error}));
   
  })
};

exports.deleteSauce = (req, res, next) => {
    // Trouver l'objet pour trouver l'url de l'image et supprimer le fichier image de la base
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) =>{
      if (!sauce) {
        res.status(404).json({error: new Error( 'No such Sauce')});
      }
      if (sauce.userId !== req.auth.userId){
        res.status(400).json({ error: new Error('Unauthorized request!')});
      }
        
      // Extraire le fichier => récupèrer l'url de la sauce + spliter le nom du fichier
          const filename = sauce.imageUrl.split('/images/')[1];
          // Appeller unlink pour supprimer le fichier
          fs.unlink(`images/${filename}`, () => {
            // Supprimer la sauce correspondante de la base de donnée
            Sauce.deleteOne({ _id: req.params.id})
              .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
              .catch(error => res.status(400).json({ error}));
          });
    })
        .catch(error => res.status(500).json({ error }));

    
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

exports.getAllSauces = (req, res, next) => { //Récuperer toutes les sauces
  Sauce.find()
  .then( sauces => res.status(200).json(sauces))
  .catch( error => res.status(400).json({ error }))
};

exports.getOneSauce = (req, res, next) => {  //Récupérer une seule sauce
  Sauce.findOne({_id : req.params.id})
  .then( sauce => res.status(200).json(sauce))
  .catch( error => res.status(404).json({ error }))
};

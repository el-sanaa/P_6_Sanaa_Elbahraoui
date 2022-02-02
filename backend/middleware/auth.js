 //Package jsonwebtoken
 const jwt = require('jsonwebtoken');

 //exporter middleware pour protéger les routes sélectionnées et vérifier que l'utilisateur
      //est authentifié avant d'autoriser l'envoi de ses requêtes.
 
 //Extraire le token du header Authorization de la requête entrante
 //Utiliser la fonction split pour récupérer tout après l'espace dans le header
 //Utiliser ensuite la fonction verify pour décoder notre token. 
      //Si celui-ci n'est pas valide, une erreur sera générée.

//Extraire l'ID utilisateur de notre token ;
//si la demande contient un ID utilisateur, nous le comparons à celui extrait du token.
     //S'ils sont différents, nous générons une erreur ;
//dans le cas contraire l'utilisateur est authentifié.
    // Nous passons l'exécution de ses requete à l'aide de la fonction next() .
 module.exports = (req, res, next) => { //Fonction req, res, next
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
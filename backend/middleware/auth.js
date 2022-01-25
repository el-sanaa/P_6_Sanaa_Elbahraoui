//Middleware pour protéger les routes sélectionnées et vérifier que l'utilisateur
//est authentifié avant d'autoriser l'envoi de ses requêtes.
 
 //Package jsonwebtoken
 const jwt = require('jsonwebtoken');

 //exporter middleware
 //Fonction req, res, next
 module.exports = (req, res, next) => {
   try { //Bloc try pour récuperer le token du header Authorization
     const token = req.headers.authorization.split(' ')[1];
     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//Vérifier le token
     const userId = decodedToken.userId;
     req.auth = { userId };
     if (req.body.userId && req.body.userId !== userId) { // Si les id sont différents
       throw 'Invalid user ID';
        
      } else {
       next();
     }
   } catch { //Bloc catch pour gerer les erreurs
     res.status(401).json({error: new Error('Invalid request!')});
   }
 };
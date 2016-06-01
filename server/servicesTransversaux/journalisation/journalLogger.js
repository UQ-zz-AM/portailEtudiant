
/*  @license

    Copyright 2014-2016 Université du Québec à Montréal (UQAM)

    This file is part of Portail Étudiant.

    Portail Étudiant is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Portail Étudiant is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Portail Étudiant. If not, see <http://www.gnu.org/licenses/>.


    Ce fichier fait partie de l'application Portail Étudiant.

    Portail Étudiant est un logiciel libre ; vous pouvez le redistribuer ou
    le modifier suivant les termes de la GNU General Public License telle que
    publiée par la Free Software Foundation ; soit la version 3 de la licence,
    soit (à votre gré) toute version ultérieure.

    Portail Étudiant est distribué dans l'espoir qu'il sera utile, mais
    SANS AUCUNE GARANTIE ; sans même la garantie tacite de QUALITÉ MARCHANDE
    ou d'ADÉQUATION à UN BUT PARTICULIER. Consultez la GNU General Public
    License pour plus de détails.

    Vous devez avoir reçu une copie de la GNU General Public License en même
    temps que Portail Étudiant ; si ce n'est pas le cas,
    consultez <http://www.gnu.org/licenses>.
*/

'use strict';

// Logger simple
//
// Pour la journalisation des événements
//
var moment = require('moment'),
   stringifySafe = require('json-stringify-safe'),
   MongoDB = require('winston-mongodb').MongoDB,
   winston = require('winston');


var dateDuJour = function() {
   return moment().format('YYYY-MM-DD HH:mm:ss::SS');
}

// logger specifique pour la journalisation
var loggerJournalisation = winston.loggers.add('journalisation', {});

// logger specifique pour voir
var loggervoir = winston.loggers.add('voir', {});

// logger spécifique pour les statistiques de fureteur
var loggerFureteur = winston.loggers.add('fureteur', {});

var courriel = require('../courriel/');
var util = require('../../config/util');

var configServicesTransversaux = util.obtenirConfig().servicesTransversaux;
var configJournalisation = configServicesTransversaux.journalisation;
var configvoir = configServicesTransversaux.voir;
var configCourriel = configServicesTransversaux.courriel;

var infoSysteme = null;

var environnement = 'development';
var listeRoutesAjournaliser = null;

var NIVEAU_ERREUR = 'Erreur';
var NIVEAU_AVERTISSEMENT = 'Warn';
var NIVEAU_TRACE = 'Trace';

// setup e-mail data with unicode symbols
var mailOptions = {
   from: configCourriel.courrielJournal, // sender address
   to: configCourriel.courrielJournal, // list of receivers
   subject: "Portail étudiant : Erreur fatale", // Subject line
   text: "Erreur fatale", // plaintext body
   html: "<b>Erreur fatale</b>" // html body
};

// Le load-balancer nous retourne gentiment l'adresse IP du client
// dans req.headers['ns-client-ip'].
var getIpClient = function(req) {
   if (req.headers) {
      if (req.headers['ns-client-ip']) {
         return req.headers['ns-client-ip'];
      }
   }
   return '-';
}

var infoBase = function() {
   return {
      'Serveur': 'Portail étudiant',
      'horodatage': dateDuJour(),
      'environnement': environnement
   };
};

// Si 'req' (request) est présent, on ajoute les infos qu'il contient
var ajouteInfoRequete = function(info, req) {

   info.nomServeur = util.obtenirConfig().nomServeur;

   if (req) {
      info.IP = req.ip;
      info.IPclient = getIpClient(req);
      info.user_agent = req.headers['user-agent'];
      info.url = req.url;

      // Attention, dépendance au fichier auth.js (via jwt-express)
      // qui ajoute à 'req' un objet 'user'.
      // Le code permanent va être journalisé ici
      if (req.user) {
         info.identifiant = req.user.identifiant;
      } else
      // sinon, le code permanent peut aussi être caché ici
      if (req.body.username) {
         info.identifiant = req.body.username;
      }
   }
   return info;
};


var journalise = function(niveau, message, req) {

   var infoJournal = infoBase();
   infoJournal.niveau = niveau;
   infoJournal.message = message;
   ajouteInfoRequete(infoJournal, req);

   // Dans un fichier et mongoDB (avec winston)
   loggerJournalisation.info(infoJournal);

   if (infoJournal.niveau === NIVEAU_ERREUR) {
      //console.log(" Envoi courriel ici ======================================================");

      if (configJournalisation.adresseCourrielLogErreur[environnement].actif) {

         infoJournal.infoSysteme = infoSysteme;

         // send mail with defined transport object
         mailOptions.html = "<b>Erreur fatale</b><p>" +
            "Heure : " + dateDuJour() + "<p>" +
            stringifySafe(infoJournal, null, 3);

         courriel.sendMail(mailOptions, function(error, response) {
            if (error) {
               console.log("Échec de l'envoi par courriel d'une erreur fatale : " + error);
            } else {
               console.log('Erreur fatale envoyée par courriel à : ' + configCourriel.courrielJournal + ' : ' + response.message);
            }

         });
      }
   }
};

//
// Ce module 'exporte' 5 fonctions
//   - journalInit(environnement) // setup de la journalisation (selon l'environnement)
//   - journalMiddleware()  // pour la journalisation automatique via les middleware 'express'
//
//   - journalisation(message)    // pour la journalisation manuelle (en JSON)
//   - journalisationAvertissement(message)
//   - journalisationErreur(message)
//
//
module.exports = {

   fureteurInit: function(p_environnement) {
      // pas sur la console
      loggerFureteur.remove(winston.transports.Console);

      // TODO à paramétriser
      if (false) {
         loggerFureteur.add(winston.transports.File, {
            'filename': configJournalisation.fichier[p_environnement] + '_F',
            'timestamp': function() { return dateDuJour(); }
         });
         console.log(" Journalisation pour statistiques fureteurs activé sur fichier:" +
            configJournalisation.fichier[p_environnement] + '_F');
      }

   },

   voirInit: function(p_environnement) {
      // pas sur la console
      loggervoir.remove(winston.transports.Console);

      if (configvoir.viaFichier) {
         loggervoir.add(winston.transports.File, {
            'filename': configvoir.fichier[p_environnement],
            'timestamp': function() { return dateDuJour(); }
         });
         console.log(" voir activé sur fichier:" +
            configvoir.fichier[p_environnement]);
      }

      if (configvoir.viaMongoDb) {
         // fixer le log dans mongoDB
         loggervoir.add(MongoDB, {
            host: configvoir.mongoDbvoir.dbHost,
            port: configvoir.mongoDbvoir.dbPort,
            safe: false,
            storeHost: true,
            db: configvoir.mongoDbvoir.nomBD,
            collection: configvoir.mongoDbvoir.collectionvoir,
            username: configvoir.mongoDbvoir.user,
            password: util.decrypte(configvoir.mongoDbvoir.pwd, process.env.libreDaMotConfig),
            'timestamp': function() { return dateDuJour(); }
         });

         console.log(" voir activé sur mongoDB:" +
            configvoir.mongoDbvoir.dbHost);
      }

   },

   voir: function(messagevoir) {
      loggervoir.info(messagevoir);
   },

   journalInit: function(p_environnement, p_listeRoutesAjournaliser, p_infoSysteme) {

      listeRoutesAjournaliser = p_listeRoutesAjournaliser;
      infoSysteme = p_infoSysteme;

      // fixer courriel log erreur
      mailOptions.from = configJournalisation.adresseCourrielLogErreur[p_environnement].adresse;
      mailOptions.to = configJournalisation.adresseCourrielLogErreur[p_environnement].adresse;

      if (configJournalisation.viaFichier) {
         loggerJournalisation.add(winston.transports.File, {
            'filename': configJournalisation.fichier[p_environnement],
            'timestamp': function() {
               return dateDuJour();
            }
         });
         console.log(" Journalisation activé sur fichier:" +
            configJournalisation.fichier[p_environnement]);
      }

      if (configJournalisation.viaMongoDb) {
         // fixer le log dans mongoDB
         loggerJournalisation.add(MongoDB, {
            host: configJournalisation.mongoDbJournalisation.dbHost,
            port: configJournalisation.mongoDbJournalisation.dbPort,
            safe: false,
            storeHost: true,
            db: configJournalisation.mongoDbJournalisation.nomBD,
            collection: configJournalisation.mongoDbJournalisation.collectionLog,
            username: configJournalisation.mongoDbJournalisation.user,
            password: util.decrypte(configJournalisation.mongoDbJournalisation.pwd, process.env.libreDaMotConfig),
            'timestamp': function() {
               return dateDuJour();
            }
         });

         console.log(" Journalisation activé sur mongoDB:" +
            configJournalisation.mongoDbJournalisation.dbHost);

      }

      // pas sur la console
      loggerJournalisation.remove(winston.transports.Console);
   },

   journalMiddleware: function() {

      return function(req, res, next) {

         if (configJournalisation.middlewareExpressJournalisationComplete) {
            // On force la journalisation complète de tout ce qui se passe
            journalise(NIVEAU_TRACE, 'express middleware', req);
         } else {
            // seulement ce qui nous intéresse
            //    Par exemple, les requêtes sur favicon.ico ne sont pas journalisées
            if (req.url && listeRoutesAjournaliser) {
               for (var i in listeRoutesAjournaliser) {
                  var debutRoute = listeRoutesAjournaliser[i];
                  if (req.url.indexOf(debutRoute) === 0) {
                     // cette route nous intéresse !
                     journalise(NIVEAU_TRACE, 'express middleware', req);
                  }
               }
            } else {
               // On journalise les imprévus
               journalise(NIVEAU_TRACE, 'express middleware', req);
            }

         }

         next();
      };
   },

   journalisation: function(message, req) {
      journalise(NIVEAU_TRACE, message, req);
   },

   journalisationAvertissement: function(message, req) {
      journalise(NIVEAU_AVERTISSEMENT, message, req);
   },

   journalisationErreur: function(message, req) {
      journalise(NIVEAU_ERREUR, message, req);
   },

   dateDuJour: dateDuJour,

   getIpClient: getIpClient

};

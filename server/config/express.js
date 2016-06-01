/**
 * Express configuration
 */

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

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var moment = require('moment');
var compression = require('compression');
var bodyParser = require('body-parser');
//var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
// var passport = require('passport');
var expressJwt = require('express-jwt'); //https://npmjs.org/package/express-jwt

var journalLogger = require('../servicesTransversaux/journalisation/journalLogger');

module.exports = function(app) {

   // app.set('views', app.configPortailEtudiant.root + '/server/views');
   //
   // Inutile, on ne fait pas de template EJS ni de template JADE
   // app.engine('html', require('ejs').renderFile);
   // app.set('view engine', 'html');

   // morgan affiche l'heure UTC par défaut
   // on ajoute à morgan l'affichage de l'heure de 'montreal'
   morgan.token('dateHeure', function(req, res) {
      return moment().format('YYYY-MM-DD HH:mm:ss::SS')
   });

   // Selon le type d'appel, req.body.identifiant contient le code permanent
   var getCodePermanent = function(req) {
      if (req.body) {
         if (req.body.identifiant) {
            return req.body.identifiant;
         }
      }

      if (req.user && req.user.identifiant) {
         return req.user.identifiant;
      }
      return '-';
   }

   // On ajoute à morgan l'affichage du code permanent si il est présent
   morgan.token('codePermanent', function(req, res) {
      return getCodePermanent(req);
   });

   // On ajoute à morgan l'affichage de l'adresse IP du client
   // s'il y a lieu
   morgan.token('IpClient', function(req, res) {
      return journalLogger.getIpClient(req);
   });

   // Les réponses du serveur plus grosses que 1K seront compressées
   app.use(compression());

   app.use(bodyParser.urlencoded({
      extended: false
   }));
   app.use(bodyParser.json());

   // Inutile, aucune simulation de DELETE ou PUT ne sera utilisée
   // app.use(methodOverride());

   app.use(cookieParser());

   // +++++++++++++++++ IMPORTANT +++++++++++++++
   //
   // Toutes les routes sous /apis sont protégés ici
   app.use('/apis', expressJwt({
      secret: app.configPortailEtudiant.motsSecretsMagiques.motMagiqueToken
   }));

   // Initialisation du journal
   //    On fournit la liste des routes que l'on veut journaliser
   journalLogger.journalInit(
      process.env.NODE_ENV, ['/authentification', '/apis', '/recuImpot'],
      app.configPortailEtudiant.infoSysteme);


   journalLogger.voirInit(process.env.NODE_ENV);
   // Initialisation journal des fureteurs
   journalLogger.fureteurInit(process.env.NODE_ENV);

   // On journalise le startup du serveur avec les infos systèmes
   journalLogger.voir({
      'startupDuServeur': app.configPortailEtudiant.infoSysteme
   });
   journalLogger.journalisation({
      'startupDuServeur': app.configPortailEtudiant.infoSysteme
   });

   // Le middleware Express du journal
   app.use(journalLogger.journalMiddleware());

   // On capte toutes les erreurs de express ici.
   // Selon le guide Express : http://expressjs.com/guide/error-handling.html
   app.use(function(err, req, res, next) {

      // Une structure d'information qui peuvent être intéressante
      var infoErreur ={
         ' Date et heure ': moment().format('YYYY-MM-DD HH:mm:ss::SS'),
         ' IP ': req.ip,
         ' Ip client ': journalLogger.getIpClient(req),
         ' Code permanent ': getCodePermanent(req),
         ' Url ': req.url
      };

      // D'abord, comme c'est grave, on écrit à la console
      console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++');
      console.log(JSON.stringify(err, null, 3));
      console.log(JSON.stringify(infoErreur, null, 3));
      console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++');

      // Puis, on journalise
      //journalLogger.journalisationErreur('(' + JSON.stringify(err) + ')', req);

      // Et les tentatives d'utiliser des routes sans
      // authentification sont interceptés ici
      if (err.name === 'UnauthorizedError') {

         res.status(401).send(' Authentification nécessaire ');
         // res.sendfile(app.get('appPath') + '/index.html');

      } else if (req.xhr) {

         // Il s'agit d'un appel REST
         res.status(500).send('Un problème est survenu (apis)');
      } else {

         res.status(500).send('Un problème est survenu');
      }
      next(err);
   });

   // On ne veut pas de trace de l'autocompletion, car il y en a trop
   // À chaque 20 requêtes d'autocompletion, on va permettre une trace de la requête
   var nbSkipAutocompletion = 0;
   // On va fournir cette méthode à morgan
   var skip = function(req, res) {
      if (req.url.indexOf('autocompletion')<0) {
         return false;
      }
      nbSkipAutocompletion += 1;
      if (nbSkipAutocompletion>20) {
         nbSkipAutocompletion = 0;
         return false;
      }
      // On ne trace pas !
      return true;
   }

   if ('production' === process.env.NODE_ENV) {
      app.use(favicon(path.join(app.configPortailEtudiant.root, 'public', 'favicon.ico')));
      app.use(express.static(path.join(app.configPortailEtudiant.root, 'public')));
      app.set('appPath', app.configPortailEtudiant.root + '/public');

      // Trace courte + code permanent + la date et heure
      app.use(morgan(':remote-addr :IpClient :remote-user :method :url :codePermanent HTTP/:http-version :status :res[content-length] - :response-time ms [:dateHeure]',
                   { skip: skip }));
   }

   if ('development' === process.env.NODE_ENV || 'test' === process.env.NODE_ENV) {
      app.use(require('connect-livereload')());
      app.use(express.static(path.join(app.configPortailEtudiant.root, '.tmp')));
      app.use(express.static(path.join(app.configPortailEtudiant.root, 'client')));
      app.set('appPath', app.configPortailEtudiant.root + '/client');

      //app.use(morgan('dev')); // trace plus courte et en couleur
      app.use(morgan(':method :url :codePermanent :status :response-time ms - :res[content-length] [:dateHeure]',
                   { skip: skip }));

      // Ici, une gestion d'erreur en mode développement seulement
      // Envoie au client le 'full stack trace'
      // Ne pas utiliser en production
      app.use(errorHandler()); // Error handler - has to be last
   }
};

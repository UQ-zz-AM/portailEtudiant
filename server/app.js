/**
 * Application principale
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

var util = require('./config/util');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 9000;

// Setup server
var app = express();

// Extraction de la configuration
app.configPortailEtudiant = util.obtenirConfig();

var server;

if (app.configPortailEtudiant.HTTPS_MODE) {

   var https = require('https');
   var fs = require('fs');
   var key = fs.readFileSync(__dirname + '/config/https/autosigne-key.pem');
   var cert = fs.readFileSync(__dirname + '/config/https/autosigne-cert.pem');
   var https_options = {
      key: key,
      cert: cert
   };

   https.globalAgent.maxSockets = 20;
   server = https.createServer(https_options, app);

} else {

   var http = require('http');
   http.globalAgent.maxSockets = 20;
   server = http.createServer(app);

}

require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(process.env.PORT, null, function() {
   console.log('Express server écoute sur le port %d, en mode %s ', process.env.PORT, process.env.NODE_ENV);
});

// Expose app
exports = module.exports = app;


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
var moment = require('moment');
var fs = require('fs');

var router = express.Router();

var jsend = require('jsend');

var journalLogger = require('../../servicesTransversaux/journalisation/journalLogger');

/**
*
* On retourne le contenu du ficher messages.json
* Le format est le suivant:

{
   'messages' : [{
         'niveau': 'critique',
         'dateDeb': '20150928 00:00:00',
         'dateFin': '20151222 00:00:00',
         'message': 'Le portail étudiant n\'est pas disponible, nous sommes actuellement en période d\'entretien. Veuillez revenir un peu plus tard.'
      }, {
         'niveau': 'avertissement',
         'dateDeb': '20150928 00:00:00',
         'dateFin': '20151222 00:00:00',
         'message': ' Le portail sera innaccessible du 12 au 14 octobre.'
      }, {
         'niveau': 'information',
         'dateDeb': '20150928 00:00:00',
         'dateFin': '20151222 00:00:00',
         'message': ' Le relevé d\'impôts est maintenant disponible.'
      }]
}

**/

var pathConfigPortail = process.env.libreDaPathConfigPortail || '../../../../configPortailEtudiant/';

router.get('/', function(req, res, next) {

   var retour = {};

   retour.heureMontreal = moment().format('YYYYMMDD HH:mm:ss');

   // On tente de lire le fichier messages.json
   // mais si on ne le trouve pas, on s'en fiche
   // ce n'est qu'un warning
   try {
      // require garde en cache
      // On prends donc fs.readFileSync
      retour.messages = JSON.parse(fs.readFileSync(pathConfigPortail + 'configPortailEtudiant/messages.json')).messages;  // require('./messages.json');
   } catch(e) {
      journalLogger.journalisationAvertissement(' Incapable de récupérer les messages généraux (fichier messages.json) : ' + e, req);
      retour.messages = [];
   }

   return res.json(jsend.success(retour));
});


module.exports = router;

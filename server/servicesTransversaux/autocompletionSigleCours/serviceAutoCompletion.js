
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

// Chargement de la liste des cours
//
//

var moment = require('moment');
var fs = require('fs');
var jsend = require('jsend');
var stringifySafe = require('json-stringify-safe');

var config = require('../../config/util').obtenirConfig();
var apiInstitutions = require('../../apis/api');
var journalLogger = require('../journalisation/journalLogger');

// On ne retourne pas plus de 200 cours
var NB_SIGLES_MAXIMUM = 200;

var NB_MINUTES_RECHARGEMENT = 5;

// On conserve en mémoire la liste des cours, selon le trimestre
var coursEnMemoire = {};


// ==============================================================================
//   Chargement par trimestre
//
var chargerUnTrimestre = function(trimestre) {

   // L'objet req doit être vide, on n'a pas besoin d'authentification
   var req = {
      'user': {},
      'params': {'trimestre': trimestre}
   };
   apiInstitutions.obtenirServicesCommun(
      'obtenirListeCours',
      req,
      function(reponse) {

         if (reponse.status === 'success') {
            coursEnMemoire[trimestre] = reponse.data[trimestre];

            // On affiche dans le log
            var afficheMemoire = '';
            for (var x in coursEnMemoire) {
               afficheMemoire += ' (Trimestre:' + x + ': = ' + coursEnMemoire[x].length + ' cours en mémoire)'
            }
            journalLogger.journalisation('    Chargement ' + trimestre + ' réussi =' + afficheMemoire);
         } else {
            coursEnMemoire[trimestre] = [];
            // Sur les erreurs, on retourne un tableau vide, l'étudiant devra entrer le sigle à la main
            // Todo notification ???
            var laDate = moment().format('YYYY-MM-DD HH:mm:ss');
            journalLogger.journalisationErreur('    ==== Échec au chargement de la liste des cours du trimestre ' + trimestre + '===== ' + laDate);
            journalLogger.journalisationErreur('    ' + stringifySafe(reponse));
            journalLogger.journalisationErreur('    ==== Échec au chargement de la liste des cours du trimestre ' + trimestre + '=====');

            console.log('    ==== Échec au chargement de la liste des cours du trimestre ' + trimestre + '===== ' + laDate);
            console.log('    ' + stringifySafe(reponse));
            console.log('    ==== Échec au chargement de la liste des cours du trimestre ' + trimestre + '=====');

         }

      });

};


var obtenirTrimestreSelonDate = function(laDate) {

   var annee = laDate.format('YYYY');
   var mois = laDate.format('MM');

   if (mois < '05') {
      return annee + '1'; // Hiver
   }
   if (mois < '09') {
      return annee + '2'; // Été
   }
   return annee + '3'; // Automne
}


var chargerTroisTrimestres = function() {

   // Selon la date du jour, on charge le trimestre courant et les deux suivants
   var aujourdhui = moment();
   chargerUnTrimestre(obtenirTrimestreSelonDate(aujourdhui));
   chargerUnTrimestre(obtenirTrimestreSelonDate(aujourdhui.add(4, 'months')));  // Un trimestre plus tard
   chargerUnTrimestre(obtenirTrimestreSelonDate(aujourdhui.add(4, 'months')));  // 2 trimestres plus tard

};

// On charge au départ du serveur
chargerTroisTrimestres();


// Intervalle   On Recharge à chaque 5 minutes
setInterval(function() {

   console.log('');
   console.log('==== Chargement de la liste des cours : ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ====');
   journalLogger.journalisation('==== Chargement de la liste des cours : ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ====');

   chargerTroisTrimestres();

}, 1000 * 60 * NB_MINUTES_RECHARGEMENT);






// ==============================================================================
//     Recherche des sigles partiels
//
var retour = {};
// Recherche des sigles qui commence par le siglePartiel
var obtenirListeSigles = function(trimestre, siglePartiel, callback) {


   // Le retour a la forme suivante :
   // var retour = {
   //    'statut': '',  //  'Erreur'   'AucunCours'  'TropDeCours' 'PremierAppel' 'Succes'
   //    'tabCours' : [];
   // };

   retour.tabCours = [];

   if (!coursEnMemoire || !coursEnMemoire[trimestre]) {
      chargerUnTrimestre(trimestre);
      // On n'attends pas, on retourne un tableau vide
      // Tant pis pour cet étudiant
      retour.statut = 'PremierAppel';
      return callback(retour);
   }

   // On recherche le sigle partiel
   var longueur = coursEnMemoire[trimestre].length;
   siglePartiel = siglePartiel.toUpperCase();
   for (var i = 0; i < longueur; i++) {
      if (coursEnMemoire[trimestre][i].indexOf(siglePartiel) === 0) {
         retour.tabCours.push(coursEnMemoire[trimestre][i].trim());
      }
   }

   if (retour.tabCours.length > NB_SIGLES_MAXIMUM) {
      // Trop !
      retour.statut = 'TropDeCours';
      retour.nbSigles = retour.tabCours.length;
      retour.tabCours = [];
      return callback(retour);
   }

   if (retour.tabCours.length > 0) {
      // Ok!
      retour.statut = 'Succes';
      return callback(retour);
   }

   retour.statut = 'AucunCours';
   return callback(retour);
};



// ==============================================================================
module.exports = {
   obtenirListeSigles: obtenirListeSigles
};

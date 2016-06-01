/*jshint camelcase:false, unused:false */
/*global angular*/

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

angular.module('pelApp').controller('ResultatsCtrl', function($scope, moment, APP, $timeout, $window, $routeParams, resumeResultat, DossierModel, UtilisateurModel) {

   var cache,
      affecterScope,
      erreurGenerique ='Une erreur est survenue, veuillez essayer plus tard.',
      ajusterTelephone = function(){
         $timeout(function() {
            if ($window.innerWidth <= APP.GLOBAL.resolutionTel){
               $scope.$apply(function(){
                  $scope.telephone = true;
               });
            }else {
               $scope.$apply(function(){
                  $scope.telephone = false;
               });
            }
         });
      };


   // Ajuster si téléphone.
   ajusterTelephone();

   // Pour détecter la rotation du téléphone
   jQuery(window).on('resize.doResize', function (){
      ajusterTelephone();
   });

   if (!$routeParams.trimestre) {
      $scope.err = 'Aucun trimestre';
      return;
   }

   // Initialisation du cache
   cache = DossierModel.getDossierPart(APP.RESUMERESULTATS.nomService);

   // Puisque nous devons imprimer l'en-tête comme pour le RIF
   // lors de l'impression, nous devons accéder aux infos
   // de l'utilisateur et créer la date d'impression
   $scope.utilisateur = UtilisateurModel.getUtilisateur;
   $scope.dateImpression = moment().format('YYYYMMDD');

   $scope.trimestreCourant = null;
   $scope.strucTrimestreCourant = null;

   // Bascule ouvrir tout ou fermer tout.
   $scope.ouvrirTout = true;
   $scope.actionnerBoutonTout = function() {
      //todo;
      $scope.ouvrirTout = !$scope.ouvrirTout;
   };


   affecterScope = function(lesResultats) {

      $scope.trimestreCourant = $routeParams.trimestre;

      $scope.strucTrimestreCourant = null;

      // On trappe ici l'absence de résultats
      if (lesResultats.activites===null) {
         return;
      }

      // On recherche le trimestre courant dans tous lesResultats
      lesResultats.forEach(function(unTrimestre) {
         if (unTrimestre.trimestre.toString() === $scope.trimestreCourant) {
            $scope.strucTrimestreCourant = unTrimestre;
         }
      });

   };

   // Aller chercher les données ou les récupérer du cache.
   if (cache !== null) {
      affecterScope(cache);
   } else {

      resumeResultat.get({
            'identifiant': 'identifiant'
         }, function(data) {

            if (data.resultats) { // OK
               // On met en cache
               cache = data.resultats;
               affecterScope(data.resultats);
            } else if (data.message) { // fail de jsend un message seulement.
               if (data.reponseService) {
                  $scope.avertissements = [data.reponseService.err];
               } else {
                  $scope.avertissements = [data.message];
               }
            } else if (data.err) {
               $scope.err = erreurGenerique;
            } else {
               $scope.err = erreurGenerique;
            }

         },
         function(err) {
            $scope.err = erreurGenerique;
         });

   }

   // Gestion des +/- pour le détail des notes.
   $scope.toggle = {
      'cours': {}
   };

   $scope.changeToggle = function(element, toggleProp) {
      if (typeof $scope.toggle[element] !== 'undefined') {

         if (toggleProp !== undefined) {
            if ($scope.toggle[element].hasOwnProperty(toggleProp)) {
               if ($scope.toggle[element][toggleProp] === true) {
                  $scope.toggle[element][toggleProp] = false;
               } else {
                  $scope.toggle[element][toggleProp] = true;
               }
               // Creer l'élément si première fois.
            } else {
               $scope.toggle[element][toggleProp] = true;
            }
         } else {
            if ($scope.toggle[element]) {
               $scope.toggle[element] = false;
            } else {
               $scope.toggle[element] = true;
            }
         }

      }
   };


});

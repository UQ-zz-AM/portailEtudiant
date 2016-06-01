/*jshint camelcase:false, unused:false */

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

angular.module('pelApp').controller('RifCtrl', function($scope, rif, APP, UtilisateurModel, DossierModel, $routeParams) {

   var cache = DossierModel.getDossierPart(APP.RIF.nomService),
      errGenerique = 'Une erreur est survenue, veuillez essayer plus tard.',
      parametresService = {
         'identifiant': 'identifiant'
      },
      affecterScope = function(data) {
         $scope.rifCourant = data;
         $scope.trimestreCourant = data.generale.trimestre;
         $scope.utilisateur = UtilisateurModel.getUtilisateur;
      };


   $scope.titreGlobal = 'Facture courante et solde';
   $scope.trimestreFactureHistorique = null;
   $scope.dateProductionFactHisto = null;

   // Traitement des factures antérieures
   if ($routeParams) {
      if ($routeParams.dateProduction) {
         // Ok, on est sur une facture historique
         cache = null;
         $scope.trimestreFactureHistorique = $routeParams.trimestre;
         $scope.dateProductionFactHisto = $routeParams.dateProduction;
         $scope.titreGlobal = 'Facture antérieure du ';
         // On ajoute les deux paramètres nécessaire pour trouver la facture historique
         parametresService.p_session = $routeParams.trimestre;
         parametresService.p_dateProduction = $routeParams.dateProduction;
      }
   }

   if (cache !== null) {
      affecterScope(cache);
   } else {

      rif.get(parametresService, function(data) {

            if (data.generale) { // OK
               affecterScope(data);
               //Cacher la réponse
               if (!$scope.trimestreFactureHistorique) {
                  DossierModel.setDossierPart(APP.RIF.nomService, data, APP.RIF.delaiCache);
               }

            } else if (data.message) { // fail de jsend un message seulement.
               $scope.avertissements = [data.message];
            } else if (data.messageMauvaiseCreance) {
               $scope.avertissements = data.messageMauvaiseCreance;
            } else if (data.err) {
               $scope.err = errGenerique;
            } else {
               $scope.err = errGenerique;
            }

         },
         function(err) {
            $scope.err = errGenerique;
         });

   }


   // Les PLUS dans l'interface
   $scope.toggle = {
      'trimestreAnterieur': false,
      'paiement': false,
      'droitScolarite': {},
      'coursTrimestre': {}
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

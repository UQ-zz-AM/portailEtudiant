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


angular.module('pelApp').controller('HoraireCtrl', function($scope, horaire, horaireUtil, APP, moment, DossierModel, $routeParams, UtilisateurModel) {

   var cache,
      affecterScope,
      changerEtatAccordeon,
      errGenerique = 'Une erreur est survenue, veuillez essayer plus tard.';


   // Initialisation du cache
   cache = DossierModel.getDossierPart(APP.HORAIRE.nomService);

   // Sert pour le libellé lorsqu'il n'y a pas de d'horaire
   // pour un trimestre sélectionné dans le menu.
   if ( $routeParams.trimestre ) {
      $scope.trimestreCourant = $routeParams.trimestre;
   }

   // Puisque nous devons imprimer l'en-tête comme pour le RIF
   // lors de l'impression, nous devons accéder aux infos
   // de l'utilisateur et créer la date d'impression
   $scope.utilisateur = UtilisateurModel.getUtilisateur;
   $scope.dateImpression = moment().format('YYYYMMDD');


   affecterScope = function(data) {

      // Initialiser horaireCourant sur le scope. Nous avons
      // besoin de cette structure pour l'affichage conditionnelle.
      $scope.horaireCourant = {programme:[]};

      // Selon le trimestre qui est passé en paramètre réduire
      // à ce trimestre s'il est présent.
      angular.forEach(data.trimestre, function(t) {
         if ( t.trim_num === $routeParams.trimestre) {
            $scope.horaireCourant = t;
            // Initialisation du contrôle accodéon.
            for (var i = 0; i < t.programme.length; i++) {
               $scope.etatAccordeon.push({
                  'cours': []
               });
               for (var j = 0; j < t.programme[i].cours.length; j++) {
                  $scope.etatAccordeon[i].cours[j] = false;
               }
            }
         }
      });

   };

   changerEtatAccordeon = function(etat) {
      angular.forEach($scope.etatAccordeon, function(obj) {
         for (var i = 0; i < obj.cours.length; i++) {
            obj.cours[i] = etat;
         }
      });
   };

   // Initialisation du scope
   // Contient l'état de chacun des éléments de l'accordéon.
   $scope.etatAccordeon = [];

   // Bascule ouvrir tout ou fermer tout.
   $scope.ouvrirTout = true;
   $scope.actionnerBoutonTout = function() {
      changerEtatAccordeon($scope.ouvrirTout);
      $scope.ouvrirTout = !$scope.ouvrirTout;
   };


   // Aller chercher les données ou les récupérer du cache.
   if (cache !== null) {
      affecterScope(cache);
   } else {

      horaire.get({'identifiant': 'identifiant'}, function(data) {

         if (data.code_perm) { // OK

            // Cette procédure traite les dates de rencontre, s'il y en a
            horaireUtil.ajouteLieu(data);

            //Cacher la réponse
            DossierModel.setDossierPart(APP.HORAIRE.nomService, data, APP.HORAIRE.delaiCache);
            affecterScope(data);
         } else if (data.message) { // fail de jsend un message seulement.
            if (data.reponseService){
               if (data.reponseService.err && data.reponseService.err === 'Aucun horaire n\'est présent au dossier') {
                  $scope.horaireCourant = {programme:[]};
               }
            } else{
               $scope.avertissements = [data.message];
            }
         } else if (data.err) {
            $scope.err = errGenerique;
         } else {
            $scope.err = errGenerique;
         }

      },
      function(err) {
         // TODO
         $scope.err = errGenerique;
      });

   }


});

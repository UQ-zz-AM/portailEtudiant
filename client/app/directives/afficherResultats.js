/*jshint unused:false */

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

angular.module('pelApp').directive('afficherResultats', function($log, APP, resultatActivite, DossierModel) {

   var linkFunction = function(scope) {
      scope.afficheCommentaire = !scope.boutonCommentaire();
   };

   // Il faut charger les données de résultat
   var controller = ['$scope', function($scope) {

      var erreurGenerique = 'Une erreur est survenue lors de la récupération des résultats. Veuillez essayer plus tard.';

         // Pour identifier de façon unique le cache
         var libelleCache = APP.RESULTATSACTIVITE.nomService +
            $scope.paramResultats.trimestre +
            $scope.paramResultats.sigle +
            $scope.paramResultats.groupe;

      var affecterScope = function(leDetail) {
         $scope.resultatDetail = leDetail;
      };

      // Si on a déjà les données, on ne les recherche pas du coté serveur
      var cache = DossierModel.getDossierPart(libelleCache);

      if (cache) {
         affecterScope(cache);
      } else {

         // Appel du service du coté serveur : on a besoin de ces paramètres
         var serviceArguments = {
            'identifiant': 'identifiant',
            'Pc_trimestre': $scope.paramResultats.trimestre,
            'Pc_sigle': $scope.paramResultats.sigle,
            'Pc_groupe': $scope.paramResultats.groupe
         };

         resultatActivite.get(serviceArguments, function(data) {

               if (data.resultats) { // OK

                  var detail;

                  try {
                     detail = data.resultats[0].programmes[0].activites[0];

                     //Cacher la réponse
                     DossierModel.setDossierPart(libelleCache, detail, APP.RESULTATSACTIVITE.delaiCache);

                     affecterScope(detail);

                  } catch (e) {
                     $scope.err = erreurGenerique;
                  }

               } else if (data.message) { // fail de jsend un message seulement.
                  if (data.reponseService) {
                     $scope.err = [data.reponseService.err];
                  } else {
                     $scope.err = [data.message];
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

   }];


   return {
      scope: {
         // Il faut utiliser 2 way binding.
         paramResultats: '=paramResultats',
         noteAuDossier: '=noteAuDossier',
         boutonCommentaire: '&boutonCommentaire'
      },
      restrict: 'A',
      link: linkFunction,
      controller: controller,
      templateUrl: 'app/directives/afficherResultats.html'
   };
});

/*jshint unused:false*/

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

angular.module('pelApp')
   .controller('MainCtrl', function ($timeout, $scope, $window, $location,$http, serviceMessagesGlobaux, configClient, Auth, UtilisateurModel, APP, DossierModel, moment) {



      $scope.isConsentement = UtilisateurModel.isConsentement;

      $scope.messagesGlobaux = [];
      $scope.maintenanceCritique = false;


      // Chargement des messages globaux, s'il y a lieu
      var affecterScope = function(listeMessagesGlobaux) {

         if (listeMessagesGlobaux && listeMessagesGlobaux.messages && listeMessagesGlobaux.messages.length > 0) {

            var dateNode = moment(listeMessagesGlobaux.heureMontreal, 'YYYYMMDD HH:mm:ss');

            for (var i = 0; i < listeMessagesGlobaux.messages.length; i++) {

               // On affiche seulement les messages avec le bon intervalle de date
               var debut = moment(listeMessagesGlobaux.messages[i].dateDeb, 'YYYYMMDD HH:mm:ss');
               var fin = moment(listeMessagesGlobaux.messages[i].dateFin, 'YYYYMMDD HH:mm:ss');

               if (debut.isValid() && fin.isValid() && debut <= dateNode && fin >= dateNode) {

                  $scope.messagesGlobaux.push(listeMessagesGlobaux.messages[i]);
                  if (listeMessagesGlobaux.messages[i].niveau === 'critique') {
                     $scope.maintenanceCritique = true;
                  }
               }

            }

            if ($scope.maintenanceCritique) {
               // On va enlever les messages non critiques
               for (i = $scope.messagesGlobaux.length - 1; i >= 0; i--) {
                  if ($scope.messagesGlobaux[i].niveau!=='critique') {
                     $scope.messagesGlobaux[i].niveau='message annulé';
                  }
               }
               // On débranche l'utilisateur
               Auth.logout({});
            }
         }
      };

      // On conserve les messages globaux dans le cache
      var listeMessagesGlobaux = DossierModel.getDossierPart(APP.MESSAGESGLOBAUX.nomService);
      if (listeMessagesGlobaux) {
         affecterScope(listeMessagesGlobaux);
      } else {

         serviceMessagesGlobaux.get({}, function(data) {

               DossierModel.setDossierPart(APP.MESSAGESGLOBAUX.nomService,
                  data,
                  1920);

               affecterScope(data);

            },
            function(err) {
               // Sur toutes les erreurs, on ne fait rien
            });

      }


      $scope.login = function (form) {
         $scope.submitted = true;
         $scope.err = undefined;
         if (form.$valid) {

            $http.post('/authentification', {
               identifiant: $scope.user.codePermanent,
               motDePasse: $scope.user.password
            }).success(function(reponse) {

               // Analyser jsend si erreur.
               if (reponse.status === 'error') {
                  Auth.logout({'url':'/difficulte'});
               }

               if ( reponse.status === 'fail'){

                  // Réponse avec err du service.
                  if ( reponse.data.reponseService){
                     $scope.err = reponse.data.reponseService.err;
                  }
                  // validation du format du nip ou cp dans nodeJS.
                  else if (reponse.data.message){
                     $scope.err = reponse.data.message;
                  } else {
                     Auth.logout({'url':'/difficulte'});
                  }

               }

            }).error(function(data, status, headers, config) {
               Auth.logout({'url':'/difficulte'});
            });

         }


      };

      // raccourcis de dévelopment (selon configClient.js)
      $scope.raccourciDev = false;
      if (configClient.replace || $window.configClient) {
         $scope.raccourciDev = true;
         $scope.placeRaccourci = function (codePerm, mdp) {
            $scope.user = {
               'codePermanent': codePerm,
               'password': mdp
            };
            $timeout(function () {
               $scope.login($scope.form);
            });

         };
         if ($window.configClient){
            $scope.configClient = $window.configClient;
         }else {
            $scope.configClient = configClient;
         }
      }

   });

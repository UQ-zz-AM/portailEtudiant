/* jshint unused:false */

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

   angular.module('pelApp').controller('RecuCtrl', function($scope, $http, $location, UtilisateurModel, appUtil) {

   var releve,
       messagesImpots,
       caching=true,
       messageErreur = 'Désolé, il est impossible de récupérer les relevés d\'impôts pour le moment. Veuillez essayer un peu plus tard.';

   // Si refresh je n'ai pas les données comme dans une compsante avec
   // un service pour retourner chercher les données.
   releve = UtilisateurModel.getReleve();
   if (releve === undefined){
      $location.path('/');
   }

   messagesImpots = UtilisateurModel.getMessagesImpots();
   if (messagesImpots) {
      $scope.messageImpot = messagesImpots.messageImpots;
      $scope.messageBoursier = messagesImpots.messageBoursier;
   }


   // Ajouter le token et l'url dans chacune des occurences.
   // afin d'identifier l'utilisateur.
   angular.forEach(releve, function(value, key) {
      value.url= '/apis/impots';
   });

   $scope.releves = releve;

   $scope.download = function(url, annee){
      var antiBlockedPopup;

      // Le fureteur va bloquer un window.open s'il est appellé avec un appel async.
      // On va donc créer la fenêtre avant.
      if (! appUtil.isIE() ){
         if (  ($scope.touch && appUtil.isChrome()) ||
               ($scope.touch && appUtil.isIpadIos71()) ) {
            antiBlockedPopup = window.open('','_self','status=yes,menubar=yes,resizable=yes, width=612, height=792');
         }else{
            antiBlockedPopup = window.open('','RelevePDF','status=yes,menubar=yes,resizable=yes, width=612, height=792');
         }
      }

      $http.get(url + '/' + annee,
                {cache:caching, responseType: 'arraybuffer', 'headers' : {'Accept': 'application/pdf'}})
      .success(function (data, status, headers, config ) {

         if ( headers()['content-type'].indexOf('application/pdf') !== -1 ) {

            var blob = new Blob([data], {type: 'application/pdf'});
            if ( ! appUtil.isIE() ){
               antiBlockedPopup.location = window.URL.createObjectURL( blob );
               antiBlockedPopup.focus();
            }else{
               navigator.msSaveOrOpenBlob( blob, 'Releve.pdf');
            }
            caching = true;

         } else {
            caching = false;
            if ( (! appUtil.isIE()) &&
                 (! ($scope.touch && appUtil.isIpadIos71())) &&
                 (! ($scope.touch && appUtil.isChrome())) ){
               antiBlockedPopup.close();
            }
            $scope.err = messageErreur;
         }

      }).error(function(data, status, headers, config) {

         if ( (! appUtil.isIE()) &&
              (! ($scope.touch && appUtil.isIpadIos71())) &&
              (! ($scope.touch && appUtil.isChrome())) ){
            antiBlockedPopup.close();
         }
         $scope.err = messageErreur;

      });

   };


});

/*jshint camelcase:false, unused:false */
/*global listeCoursEvalEt*/

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

angular.module('pelApp').controller('EvaluationCtrl', function($scope, $location, $filter, appUtil, evaluation, moment) {

   var erreurGenerique ='Une erreur est survenue, veuillez essayer plus tard.',
       affecterScope,
       separerListe;


   $scope.coursAevaluer  = [];
   $scope.coursCompletee = [];
   $scope.evaluation = {};


   separerListe = function(data){
      for (var i = 0; i < data.length; i++) {
         var cours = data[i];
         if (cours.ind_saisie === 'N'){
            $scope.coursAevaluer.push(cours);
         }else{
            $scope.coursCompletee.push(cours);
         }
      }
   };


   affecterScope = function(data) {
      separerListe(data.liste_cours);
      $scope.evaluation = data;
   };


   $scope.getDate = function(date) {
      var d = moment(date);

      if (d !== null && d.isValid()) {
         var dateFormattee = appUtil.getDate(date);
         var heure = moment(date).format('HH');
         var min = moment(date).format('mm');
         return appUtil.getDate(date) + ' à ' + heure + 'h' + min ;
      }
      return '';
   };


   $scope.afficherQuestionnaire = function(cours){
      var url = '/faireeval/' + cours.id_enseignement + '/' + encodeURI(cours.sigle + '-' + $filter('trimGroupe')(cours.groupe)) + '/' + encodeURI(cours.nom_enseignant) + '/' + encodeURI(cours.titre) + '/' + encodeURI(cours.trim_txt);
      $location.path(url);
   };


   ////////////////////////////////////// Exécution immédiate //////////////////////////////////////
   evaluation.get({'identifiant': 'identifiant'}, function(data) {
      
      if (data.liste_cours) { // OK

         affecterScope(data);

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


});

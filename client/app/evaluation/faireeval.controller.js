/*jshint camelcase:false, unused:false */
/*global questionnaire */

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

angular.module('pelApp').controller('FaireEvalCtrl', function($scope, $rootScope, $routeParams, $http, $anchorScroll, $location, questionnaire, Auth) {

   var erreurGenerique ='Une erreur est survenue, veuillez essayer plus tard.',
       affecterScope,
       ajoutNumero,
       idEvaluation;


   $scope.mobileStep=-1;             // Le contrôleur du wizard. -1 représente la
                                     // page de présentation.

   $scope.choix = [];                // Liste des questions.
   $scope.choixMobile = [];          // Liste des questions - la question head.

   $location.hash('scrollID');       // Pour scroller jusqu'au début de la question
                                     // suivante lorsqu'on presse sur le bouton suivant
                                     // dans l'interface mobile.
                                     //   Dans la définition de la route, on
                                     //   ajoute : reloadOnSearch: false
                                     //   pour empêcher le rechargement de la page

   $scope.evaluation = {};           // Contient le résultat de l'évaluation.
   $scope.faireeval = {};            // Contient le questionnaire complet.


   //
   // Ajout d'un index pour les questions de type numérique.
   // Ajouter également un flag pour distinguer le premier
   // message (indice 0) de catégorie SUP afin de l'afficher
   // correctement hors de la liste pour la version Bureau
   // et mobile.
   //
   ajoutNumero = function(data) {
      if ( data.length > 0){
         var index = 1;
         for (var i = 0; i < data.length; i++) {
            // Ajout de l'index.
            if (data[i].type_question === 'num' ){
               data[i].index = index++;
            }
            // Premier message.
            if (data[i].type_question === 'msg' && i === 0 && data[i].categorie === 'SUP'){
               data[i].categorie = 'head';
               //console.log('HEAD:' + data[i].texte);
            }
         }
      }
      return data;
   };


   affecterScope = function(data) {
      $scope.faireeval = data;

      $scope.choix = ajoutNumero($scope.faireeval.liste_question);
      for (var i = 0; i < $scope.choix.length; i++) {
         if ($scope.choix[i].categorie !== 'head'){
            $scope.choixMobile.push($scope.choix[i]);
         }
      }

   };


   // Extraction des paramètres.
   // Format => :id/:sigle/:nom/:titre
   // console.log(JSON.stringify($routeParams));
   // Tous obligatoire!
   if ( $routeParams.id.length > 0  &&
        $routeParams.trimestre.length > 0 &&
        $routeParams.sigle.length > 0  &&
        $routeParams.nom.length > 0  &&
        $routeParams.titre.length > 0 ) {

      idEvaluation = $routeParams.id;

      //TODO  À tester avec tous les browsers !!
      $scope.evaluation.sigle = decodeURI($routeParams.sigle);
      $scope.evaluation.nom = decodeURI($routeParams.nom);
      $scope.evaluation.titre = decodeURI($routeParams.titre);
      $scope.evaluation.trimestre = decodeURI($routeParams.trimestre);

   }else {
      // Nous devrions pas arriver là.
      $scope.err = erreurGenerique;
      return;
   }


   // Formattage dynamique des éléments du choix de réponses numériques.
   $scope.formatterReponse = function(question, reponse){
      if ( question.hasOwnProperty('classe') ){
         if (question.classe[reponse]){
            return 'background-color:#002E3E;';
         }
      }
      return 'background-color:#0681AE;';
   };


   // Contrôles pour l'interface mobile.
   $scope.suivant = function(){
      $scope.mobileStep++;
      $anchorScroll();
   };
   $scope.precedent = function(){
      $scope.mobileStep--;
      $anchorScroll();
   };


   // Enregistrer la réponse dans la propriété réponse.
   // La propriété classe sert à réfléter l'état des
   // boutons radios.
   $scope.evaluer = function(question, reponse){
      // Initialiser la classe pour la couleur.
      question.classe = [false,false,false,false,false];
      // Enregistrer la réponse et la classe sélectionnée.
      question.reponse = reponse;
      question.classe[reponse]=true;
   };


   // Transmettre le résultat au service et afficher le dialogue
   // avec le résultat.
   $scope.transmettre = function(){
      var message='',
          titre = '',
          laBoiteOK = {},
          laBoiteErr = {},
          lesboites = [],
          reponse=[];

      // La boite d'erreur
      laBoiteErr = {
         titre: 'Attention',
         style: 'bg-danger',
         messages:['Désolé, votre évaluation n\'a pas été correctement transmise.']
      };

      // La boîte de confirmation.
      titre    = 'Évaluation de « ' + $scope.evaluation.nom + ' » pour le cours-groupe ' + $scope.evaluation.sigle + ' ';
      titre   += 'au trimestre d\'' + $scope.evaluation.trimestre.toLowerCase();
      message  = 'Une fois l\'évaluation transmise, il vous sera impossible de la modifier, même si elle est incomplète. ';
      message += 'Appuyez sur CONFIRMER pour transmettre l\'évaluation ou ANNULER pour faire des modifications.';

      laBoiteOK = {
         titre: titre,
         style: 'bg-warning',
         messages:[message]
      };

      // Call back de confirmation et erreur.
      var cb = function(){


         $rootScope.dlog.hideMessages();
         lesboites = [];

         // Bâtir la réponse.
         for (var i = 0; i < $scope.faireeval.liste_question.length; i++) {
            var tempo = $scope.faireeval.liste_question[i];
            if ( tempo.type_question !== 'msg' ){
               if ( tempo.type_question === 'txt' ){
                  if (tempo.hasOwnProperty('reponse') ){
                     reponse.push({'id_ligne':tempo.id_ligne, typeQuestion:tempo.type_question, 'reponse': tempo.reponse});
                  } else{
                     reponse.push({'id_ligne':tempo.id_ligne, typeQuestion:tempo.type_question, 'reponse': ''});
                  }
               } else {
                  if (tempo.hasOwnProperty('reponse') ){
                     reponse.push({'id_ligne':tempo.id_ligne, typeQuestion:tempo.type_question, 'reponse': tempo.reponse});
                  } else{
                     reponse.push({'id_ligne':tempo.id_ligne, typeQuestion:tempo.type_question, 'reponse': ''});
                  }
               }
            }
         }

         // Envoyer les réponses du questionnaire au service.
         $http.post('/apis/enregistrerEvaluation', {
            identifiant: 'identifiant',
            Pn_id_enseignement: idEvaluation,
            evaluation: reponse
         }).success(function(reponse) {

            if (reponse.status === 'success') {

               $location.path('/evaluation');
               laBoiteOK = {
                  titre: 'Confirmation',
                  style: 'bg-success',
                  messages:['Votre évaluation a été correctement transmise.']
               };
               lesboites.push(laBoiteOK);
               $rootScope.dlog.showMessages(lesboites);

            }else {

               if ( reponse.status === 'fail' ) {
                  // TODO Si en dehors des heures mettre le message, sinon message générique
                  if (reponse.data.reponseService){
                     laBoiteErr.messages.push(reponse.data.reponseService.err);
                  }
                  lesboites.push(laBoiteErr);
                  $rootScope.dlog.showMessages(lesboites);
                  $location.path('/evaluation');
               } else if( reponse.status === 'error' ){
                  // Message générique.
                  lesboites.push(laBoiteErr);
                  $rootScope.dlog.showMessages(lesboites);
                  $location.path('/evaluation');
               }
               // Ne devrait jamais arriver.
               else {
                  Auth.logout({'url':'/difficulte'});
               }

            }
         }).error(function(data, status, headers, config) {
            Auth.logout({'url':'/difficulte'});
         });


      };

      lesboites.push(laBoiteOK);
      $rootScope.dlog.showMessages(lesboites, cb);


   };



   /* ---------------------- Récupérer le questionnaire ----------------------*/
   questionnaire.get({'identifiant': 'identifiant', 'Pn_id_enseignement': idEvaluation}, function(data) {
         
      if (data.id_questionnaire) { // OK
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
      // Mobile. Lorsqu'on vient d'une liste de plusieurs évaluations, si on presse «Évaluer»
      // d'une des dernières, la page questionnaire est affichée plus bas que le
      // début. Nous devons donc remonter en haut.
      window.scrollTo(0,0);

   },
   function(err) {
      $scope.err = erreurGenerique;
   });


});

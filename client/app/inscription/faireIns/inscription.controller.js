/*jshint camelcase:false, unused: false*/
/*global angular, testProgrammeInsAutori */

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

/////////////////////////////////////////////////////////////////////////////
// InscriptionCtrl
//
// Notes.
//
// On utilise 2 contrôleurs pour l'inscription. Ce premier contrôleur « parent »
// contient les listes de cours au dossier (inscrits) et les cours
// modifiés/remplacés/etc. Il contient également la section des périodes
// d'inscription.
//
// Les contrôleurs enfants (un par cours) correspondent à l'éditeur pour
// ajouter, remplacer et modifier un cours. On procède ainsi parce que
// le code du contrôleur enfant est utilisé pour créer plusieurs instances
// dont une pour ajouter et plusieurs autres (un par cours) pour modifier
// ou remplacer un cours. Cette approche simplifie le code et
// rend le code plus apte pour la création de tests unitaires par rapport
// à une directive.
//
/////////////////////////////////////////////////////////////////////////////

'use strict';

angular.module('pelApp').controller('InscriptionCtrl', function($scope, $rootScope, $location, $route, $routeParams, $timeout, $window, moment, APP, reglesIns,
   arbreDecisionInscription, validationInscription, transactionCours, transactionLot, DossierModel, UtilisateurModel) {

   // Puisque nous devons imprimer l'en-tête comme pour le RIF
   // lors de l'impression, nous devons accéder aux infos
   // de l'utilisateur et créer la date d'impression
   $scope.utilisateur = UtilisateurModel.getUtilisateur;
   $scope.dateImpression = moment().format('YYYYMMDD');

   // Flag collapse mobile pour la section des cours au dossier.
   $scope.showCdFlag = false;
   $scope.showCd = function(){
      $scope.showCdFlag = !$scope.showCdFlag;
   };
   // Flag collapse mobile pour la section des cours modifiés
   $scope.showMaaFlag = false;
   $scope.showMaa = function(){
      $scope.showMaaFlag = !$scope.showMaaFlag;
   };
   $scope.isMobile=false;

   // Traitement en cours. Pour éviter les doubles clic.
   $scope.traitementEnCours = false;

   // ==================================================================================================================
   // ==================================================================================================================
   // ==================================================================================================================
   /* TEST pour l'ajout multiple. */

   $scope.ajms = [{
         'indice': 1,
         'statut': 'none'
      }, {
         'indice': 2,
         'statut': 'none'
      }, {
         'indice': 3,
         'statut': 'none'
      }, {
         'indice': 4,
         'statut': 'none'
      }, {
         'indice': 5,
         'statut': 'none'
      }
   ];

   $scope.isAjoutMultipleValid = function(nb){
      var unStatutValide = 0;
      var unStatutInvalide = 0;

      for (var i = 0; i < $scope.ajms.length; i++) {
         if ( $scope.ajms[i].statut === 'valide' ){
            unStatutValide++;
         }
      }

      for (i = 0; i < $scope.ajms.length; i++) {
         if ( $scope.ajms[i].statut === 'invalide' ){
            unStatutInvalide++;
         }
      }

      // Retourne le nombre de cours à ajouter
      if (nb === undefined){
         if ( unStatutValide > 1 && unStatutInvalide === 0 ){
            return unStatutValide;
         }
      }

      if ( unStatutValide >= nb && unStatutInvalide === 0 ){
         return true;
      }

      return false;
   };

   $scope.isDoublon = function(){

      var sigles = [];
      var isDoublon = false;

      // Bâtir un array;
      for (var i = 0; i < $scope.ajms.length; i++) {
         if ( $scope.ajms[i].statut === 'valide' ){
            sigles.push($scope.ajms[i].cours.sigle);
         }
      }

      // Vérifier doublons.
      for (i = 0; i < sigles.length; i++) {
         for (var j = 0; j < sigles.length; j++) {
            if (i !== j) {
               if (sigles[i] === sigles[j]) {
                 isDoublon = true;
               }
            }
         }
      }
      return isDoublon;

   };

   $scope.isCoursDeLangue = function(){
      for (var i = 0; i < $scope.ajms.length; i++) {
         if ( $scope.ajms[i].statut === 'valide' && $scope.ajms[i].cours ){
            if ($scope.ajms[i].cours.sigle.substr(0,3) === 'ANG' ||
                $scope.ajms[i].cours.sigle.substr(0,3) === 'ESP' ) {
               return true;
            }
         }
      }
      return false;
   };

   $scope.ajouterMultiple = function() {
      var listeCours = '';
      for (var i = 0; i < $scope.ajms.length; i++) {
         if ( $scope.ajms[i].cours && $scope.ajms[i].cours !== undefined){
            if (listeCours.length>0){ listeCours += '|';}
            listeCours += $scope.ajms[i].cours.sigle + '_' + $scope.ajms[i].cours.groupe;
         }
      }
      //console.log('LOT.\nCours:' + listeCours);

      // Éviter doubleclick
      $scope.traitementEnCours = true;
      traiterInscriptionLot (listeCours);
   };



   // ==================================================================================================================
   // ==================================================================================================================
   // ==================================================================================================================


   var erreurGenerique = 'Une erreur est survenue, veuillez essayer plus tard.',
      erreurGeneriqueInscription = 'Une erreur est survenue, veuillez essayer plus tard.',
      dateNode,
      //obtPremierePeriode,
      traiteReponseInscription,
      affecterScope = function(data) {

         var progrTrimestre = {};
         // La date noe est la date qui provient des services.
         dateNode = moment(data.validerInscription.heureMontreal, 'YYYYMMDD');


         // TODO à repenser. Est-ce que ces tests sont nécessaires ???
         if (!$scope.programmeCourant) {
            if (data.periodesIns.programmes.length > 0) {
               progrTrimestre = reglesIns.getProgrEtTrimestre($routeParams.programme, $routeParams.trimestre, data.periodesIns.programmes);

               if ( progrTrimestre !== {}){
                  $scope.programmeCourant = progrTrimestre.programme;
                  $scope.trimestreCourant = progrTrimestre.trimestre;

                  $scope.decisionProg = arbreDecisionInscription.construireArbreDecision(data);
                  $scope.resultatVI = data.validerInscription;

                  // Listes
                  $scope.coursInscrits = data.validerInscription.coursInscrits;
                  $scope.coursAnnules = data.validerInscription.coursAnnules;

               }
            } else {
               $location.path('/inscription/autori/landing');
            }
         }
         $scope.autorisation = data;
      },
      ajusterMobile = function(){
         $timeout(function() {
            if ($window.innerWidth >= 992){
               $scope.$apply(function(){
                  $scope.showCdFlag = true;
                  $scope.showMaaFlag = true;
                  $scope.isMobile = false;
               });
            }else {
               $scope.$apply(function(){
                  $scope.isMobile = true;
               });
            }
         });
      };



   // ==================================================================================================================
   // Section des périodes.

   // On détermine ici si on doit activer l'onglet d'ajout de cours.
   // Est-il permis d'ajouter un cours ?
   $scope.isAjoutPermis = function(){
      return ( $scope.decisionProg.isInscriptionPermise && (! $scope.decisionProg.isPeriodeAbandon) );
   };


   // Cette fonction est utilisée pour afficher la date des périodes.
   $scope.getDate = function(date) {
      var d = moment(date, 'YYYY-MM-DD');
      if (d !== null && d.isValid()) {
         return moment(date).format('Do MMM YYYY');
      }
   };


   // Cette fonction sert principalement pour retourner les remarques
   // dans la zone des messages.
   $scope.isMsgOfTypeForTab = function(tableau, typeMsg){
      if (tableau && typeMsg){
         for (var i = 0; i < tableau.length; i++) {
            if (tableau[i].typeMsg === typeMsg){
               return true;
            }
         }
      }
      return false;
   };


   // ------------------------------------------------------------------------
   // Cette fonction formatte seulement la chaîne 1ER. Le er devient
   // plus petit.
   // Attention, la directive ng-bind-html d'AngularJS permet seulement
   // de passer l'attribut class et non style.
   // Martin
   // ------------------------------------------------------------------------
   $scope.formatterDate = function(dateString){
      if (dateString && dateString.substring(0,3).toUpperCase() === '1ER') {
         return '1<span class="premier">er</span>' + dateString.substring(3);
      }
      return dateString;
   };


   // ==================================================================================================================




   // ==================================================================================================================
   // Section liste des cours inscrits.

   // Cette fonction calcule le nombre total des crédits inscrits,
   // c'est pour l'afficher dans le titre de cette section.
   // ex. COURS À MON DOSSIER - AUTOMNE 2015  |  15 CRÉDITS INSCRITS
   $scope.creditsInscrits = function(){
      var nbCredits = 0;
      if ( $scope.coursInscrits ){
         for (var i = 0; i < $scope.coursInscrits.length; i++) {
            var credit = parseInt ($scope.coursInscrits[i].credit);
            if (! isNaN(credit) ){
               nbCredits += credit;
            }
         }
      }
      return nbCredits;
   };


   // Efface les éléments action et mode de l'ensemble des cours inscrits.
   // Voir prochaine fonction.
   $scope.effacerActionEtmode = function(){
      if ($scope.coursInscrits.length > 0){
         for (var i = 0; i < $scope.coursInscrits.length; i++) {
            var localCours = $scope.coursInscrits[i];
            localCours.action = '';
            localCours.mode = '';
         }
      }
   };


   // Cette fonction est appelée lorsque l'utilisateur clique sur le
   // bouton «Modifier le groupe», «Modifier le cours», «Annuler le cours»
   // et «Abandonner le cours».
   //
   // Cette fonction ajuste l'interface.
   // Elle permet d'afficher l'éditeur pour modifier ou remplacer un cours ou
   // d'afficher la boîte de confirmation pour l'annulation ou l'abandon.
   // Elle permet aussi de rendre plus foncé le bouton qui a été pressé.
   //
   // Elle permet aussi d'initialiser le contrôleur enfant lorsqu'il est
   // réutilisé dans le cas ou l'action est modifier ou remplacer. Voir le
   // code de «EditCtrl» pour plus d'information.
   //
   $scope.ajusterEdition = function(cours, action){

      $scope.effacerActionEtmode();
      cours.action = action;
      cours.mode = 'edition';

      // On appelle la fonction init de l'éditeur,
      // cette instance est réinitialisée avec les donnnées du bon cours.
      if (cours.edtidorRef && action === 'remplacer' ){
         cours.edtidorRef.init();
      }else {
         cours.edtidorRef= undefined;
      }

   };

   // Cette fonction est appelée seulement pour les transactions de type
   // «abandonner» et «annuler».
   // Cet appel se fait à partir de la boîte de confirmation de l'abandon
   // de l'annulation.
   $scope.anAbAction = function(cours){
      var action;
      if (cours && cours.action && cours.sigle && cours.groupe){

         // Éviter doubleclick
         $scope.traitementEnCours = true;
         // On ne fait pas la distinction entre abandonner et
         // annuler du côté serveur.
         action = (cours.action === 'abandonner') ? 'annuler' : cours.action;
         traiterInscription (action, cours.sigle, cours.groupe, ' ', ' ');
      }
   };


   // Cette fonction sert à composer le premier message qui va dans la boîte
   // cours.
   var batirPremierMessage = function(transaction){
      var message = '';

      if (transaction.codeRetour === 'SUCCES'){

         if (transaction.codeTransaction === 'ajouter' ){
            // Le cours XXX, groupe xx a été ajouté à votre dossier.
            message = 'Le cours ' + transaction.sigle + ', groupe ' + transaction.groupe + ' a été ajouté à votre dossier.';
         }

         if (transaction.codeTransaction === 'modifier' ){
            //Le groupe xx a été modifié pour le groupe xx du cours XXX.
            message = 'Le groupe ' + transaction.groupeAnc + ' a été modifié pour le groupe ' + transaction.groupe + ' du cours ' + transaction.sigle + '.';
         }

         if (transaction.codeTransaction === 'remplacer' ){
            //Le cours XXX, groupe xx a été ajouté à votre dossier en remplacement du cours XXX, groupe xx.
            message = 'Le cours ' + transaction.sigle + ', groupe ' + transaction.groupe + ' a été ajouté à votre dossier en remplacement du cours ' +
                       transaction.sigleAnc + ', groupe ' + transaction.groupeAnc + '.';
         }

         if (transaction.codeTransaction === 'annuler' ){
            //Le cours XXX, groupe xx a été annulé.
            message = 'Le cours ' + transaction.sigle + ', groupe ' + transaction.groupe  + ' a été annulé.';
         }

      }

      if (transaction.codeRetour === 'ECHEC'){

         if (transaction.codeTransaction === 'ajouter' ){
            // Le cours XXX, groupe xx n'a pas été ajouté à votre dossier.
            message = 'Le cours ' + transaction.sigle + ', groupe ' + transaction.groupe + ' n\'a pas été ajouté à votre dossier.';
         }

         if (transaction.codeTransaction === 'modifier' ){
            //Le groupe xx n'a pas été modifié pour le groupe xx du cours XXX.
            message = 'Le groupe ' + transaction.groupeAnc + ' n\'a pas été modifié pour le groupe ' + transaction.groupe + ' du cours ' + transaction.sigle + '.';
         }

         if (transaction.codeTransaction === 'remplacer' ){
            //Le cours XXX, groupe xx n'a pas été ajouté à votre dossier en remplacement du cours XXX, groupe xx.
            message = 'Le cours ' + transaction.sigle + ', groupe ' + transaction.groupe + ' n\'a pas été ajouté à votre dossier en remplacement du cours ' +
                       transaction.sigleAnc + ', groupe ' + transaction.groupeAnc + '.';
         }

         if (transaction.codeTransaction === 'annuler' ){
            //Le cours XXX, groupe xx n'a pas été annulé.
            message = 'Le cours ' + transaction.sigle + ', groupe ' + transaction.groupe  + ' n\'a pas été annulé.';
         }

      }

      return message;
   };
   // ==================================================================================================================



   traiteReponseInscription = function(data){

      //////////////////////////////////////////////////////////////////////////
      // La boîte de dialogue de réponse à l'étudiant peut contenir une ou
      // plusieurs boîtes cours. Ces boîtes cours comportent un titre, un
      // type de boîte (rouge ou verte avec une icône) et un ou plusieurs
      // messages.
      var boiteCours,        // Contient une seule boîte cours.
          boitesCours = [],  // Contient l'ensemble des boîtes cours.
          titreBoite,        // Le titre de la boîte. Sigle et succès ou échec.
          transaction;       // Raccourci pour référencer un élément d'array.


      /* DEBUG */
      //console.log(JSON.stringify(data));

       // DATA OK.
       if (data  && data.codeRetour) {

          // SUCCES. Lorsque SUCCES, transactions est toujours là dans ce cas.
          if (data.codeRetour === 'SUCCES') {

             // Composer une boîte cours pour l'ensemble des transactions.
             for (var i = 0; i < data.transactions.length; i++) {
                transaction = data.transactions[i];

                if ( transaction.codeRetour === 'SUCCES'){
                   titreBoite = transaction.sigle + ' | opération réussie';
                }else {
                   titreBoite = transaction.sigle + ' | opération échouée';
                }

                // La boîte du cours.
                boiteCours = {
                   titre: titreBoite,
                   style: transaction.codeRetour === 'SUCCES'?'bg-success':'bg-danger',
                   messages:[]
                };
                // Bâtir le premier message de la réponse.
                boiteCours.messages.push(batirPremierMessage(transaction));

                // Ajouter les messages dans la boîte du cours.
                if (transaction.messages && transaction.messages.length > 0) {
                   for (var j = 0; j < transaction.messages.length; j++) {
                     boiteCours.messages.push(transaction.messages[j].texteMsg);
                  }
               }
               // Ajouter la boîte cours à la liste.
               boitesCours.push(boiteCours);
            }

         }

         // ÉCHEC
         // Si message système, on arrête là.
         // Sinon on affiche le message programme qui est toujours là
         // lorqu'il a a ECHEC sans message système. Attention, il y
         // a q'un seul message (messagesProgramme[0].texteMsg).
         if (data.codeRetour === 'ECHEC') {

            // Vérifier si nous avons un message système.
            if (data.messageSysteme.texteMsg) {
               boiteCours = {titre: 'Attention', style: 'bg-danger', messages: []};
               boiteCours.messages.push(data.messageSysteme.texteMsg);
            }

            // Sinon, il DOIT y avoir un message programme.
            else if (data.messagesProgramme.length > 0) {
               boiteCours = {titre: 'Attention', style: 'bg-danger', messages: []};
               boiteCours.messages.push(data.messagesProgramme[0].texteMsg);
            }

            // On devrait pas passer ici.
            else {
               boiteCours = {titre: 'Attention', style: 'bg-danger', messages: []};
               boiteCours.messages.push(erreurGeneriqueInscription);
            }

            boitesCours.push(boiteCours);

         }

         // Afficher la boîte de dialogue.
         $rootScope.dlog.showMessages(boitesCours);

         // On efface le dossier de l'étudiant en cache, car on veut le recharger après l'inscription...
         DossierModel.effacerDossier();

         // Recharger le dossier de l'étudiant.
         $route.reload();

         // Mauvais DATA.
      } else {
         $scope.err = erreurGeneriqueInscription;
      }

      $scope.traitementEnCours = false;

   };

   // ==================================================================================================================
   // Service traiteInscription

   /////////////////////////////////////////////////////////////////////////////
   // On appelle le serveur d'inscription ici.
   // Cette fonction peut être appelée d'ici ou du contrôleur enfaut.
   // Ici l'appel se fait de la fonction anAbAction(AnnulerAbandonner) et
   // se fait de traiteInscription dans le contrôleur de l'éditeur pour
   // l'ajout, la modification et le remplacement.

   var traiterInscription = function(codeTrans, sigle, groupe, sigleAncien, groupeAncien) {

      transactionCours.get({
         'identifiant': 'identifiant',
         'programme': $scope.programmeCourant.code_prog,
         'trimestre': $scope.trimestreCourant.an_ses_num.toString(),
         'codeTrans': codeTrans,
         'sigle': sigle,
         'groupe': groupe,
         'sigleAncien': sigleAncien,
         'groupeAncien': groupeAncien
      }, function(data) {

         traiteReponseInscription(data);

      });
   };


   // ==========================================================================
   /* L'ajout multiple. */
   var traiterInscriptionLot = function(lot){

      transactionLot.get({
         'identifiant': 'identifiant',
         'programme': $scope.programmeCourant.code_prog,
         'trimestre': $scope.trimestreCourant.an_ses_num.toString(),
         'codeTrans': 'ajouter',
         'lot': lot
      }, function(data) {

         traiteReponseInscription(data);

      });
   };
   // ==========================================================================


   // Pour rendre accessible cette fonction à partir du scope.
   $scope.traiterInscription = traiterInscription;
   // ==================================================================================================================



   // ==================================================================================================================
   ////////////////////////////////////// Exécution immédiate //////////////////////////////////////

   // Vérifier que les paramètres sont pas forgés.
   if ( ! (/^[0-9|a-z|A-Z]{4}$/.test($routeParams.programme) &&
           /^[0-9]{5}$/.test($routeParams.trimestre) ) ){
      $location.path('/inscription/autori/landing');
   }


   // PAS DE CHACHE POUR l'INSCRIPTION


   validationInscription.get({
         'identifiant': 'identifiant',
         'programme': $routeParams.programme,
         'trimestre': $routeParams.trimestre,
         'avecAutorisation': 'O'
      }, function(data) {
         //////////////////////////////////////////////////////////////////////////
         //console.log(APP.INSCRIPTION.nomService + '(controlleur):' + JSON.stringify(data));

         if (data.periodesIns && data.validerInscription) { // OK

            // Trier les programmes.
            reglesIns.trierProgramme(data.periodesIns.programmes);

            // Date du jour au niveau du serveur.
            dateNode = moment(data.validerInscription.heureMontreal, 'YYYYMMDD');
            //console.log('heureMontreal:' + data.validerInscription.heureMontreal);

            // Pour chacun des programmes, retirer toutes les périodes d'un trimestre
            // si toutes ces périodes sont inactives.
            reglesIns.retirerPeriodesInactives(data.periodesIns.programmes, dateNode);

            // Patch pour écraser les messages, demande de Lucie C.-L. au Registrariat.
            data.libellesMethodeIns = reglesIns.libellesMethodeIns;
            // Messages notes pour historique
            data.messagePatchNote = reglesIns.messagePatchNote;

            affecterScope(data);

         } else if (data.message) { // fail de jsend un message seulement.
            $scope.avertissements = [data.message];
         } else if (data.err) {
            $scope.err = erreurGenerique;
         } else {
            $scope.err = erreurGenerique;
         }

      },
      function(err) {
         $scope.err = erreurGenerique;
      }
   );


   // Pour détecter la rotation de la tablette.
   jQuery(window).on('resize.doResize', function (){
      jQuery(window).on('resize.doResize', function (){
         ajusterMobile();
      });
   });

   ajusterMobile();

   // Pour affecter l'erreur dans ce scope à partir des
   // contrôleurs-enfants.
   $scope.doParentErr = function(message){
      $scope.err = message;
   };


});

/*jshint camelcase:false, unused: false*/
/*global angular */

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

angular.module('pelApp').controller('AutoriCtrl',
   function($scope, $routeParams, APP, moment, appUtil, reglesIns, autorisation, DossierModel, UtilisateurModel) {

      var erreurGenerique = 'Une erreur est survenue, veuillez essayer plus tard.',
         affecterScope,
         cache = DossierModel.getDossierPart(APP.AUTORISATION.nomService),
         //date nodeJS 20150925 09:14:40
         dateNode;

      // Puisque nous devons imprimer l'en-tête comme pour le RIF
      // lors de l'impression, nous devons accéder aux infos
      // de l'utilisateur et créer la date d'impression
      $scope.utilisateur = UtilisateurModel.getUtilisateur;
      $scope.dateImpression = moment().format('YYYYMMDD');


      affecterScope = function(data) {

         //console.debug($routeParams);
         // Date du jour au niveau du serveur.
         // On recalcule cette date pour la fonction isPeriodeTermine
         dateNode = moment(data.heureMontreal, 'YYYYMMDD');

         // Gestion des routes
         //  - landing : page accueil.html
         //  - autori: page autori.html
         //  - autori pour un programme d'étude: page autori.html
         if ($routeParams.landing){

            // Route landing : on montre l'accueil de l'inscription
            // Cloner le data afin de ne pas modifier le cache.
            var dataLocal = JSON.parse(JSON.stringify(data));

            // Ne pas afficher tout les trimestres d'été.
            // On doit le faire ICI pour ne pas modifier le cache !!
            reglesIns.mergerFenProgTrimIdentique(dataLocal.programmes);
            $scope.periode = dataLocal;

            // Calcul des compteurs
            $scope.nbProgIcodeNonNull=0;
            $scope.nbProgIcodeNull=0;
            if (dataLocal.programmes && dataLocal.programmes.length>0) {
               for (var j = 0; j < dataLocal.programmes.length ; j++) {
                  if (dataLocal.programmes[j].icode && isIcodeValid(dataLocal.programmes[j].icode)) {
                     $scope.nbProgIcodeNonNull += 1;
                  } else {
                     if (!dataLocal.programmes[j].icode) {
                        $scope.nbProgIcodeNull += 1;
                     }
                  }

               }
            }

         } else {

            if ($routeParams.codeProgramme) {

               $scope.programmeCourant = [];
               // Route spécifique à un programme d'étude
               // On l'active si on le trouve
               for (var i = 0; i < data.programmes.length; i++) {
                  if (data.programmes[i].code_prog === $routeParams.codeProgramme) {
                     $scope.programmeCourant = data.programmes[i];
                     $scope.progSelectionne = data.programmes[i];
                  }
               }

            } else {
               // Route normale : On active le premier programme du tableau s'il y en a un
               if (!$scope.programmeCourant) {
                  if (data.programmes.length > 0) {
                     $scope.programmeCourant = data.programmes[0];
                     $scope.progSelectionne = data.programmes[0];
                  } else {
                     // Pour vérifier dans le HTML si on a au moins un programme
                     $scope.programmeCourant = [];
                  }
               }
            }


         }
         $scope.autorisation = data;
      };


      // ------------------------------------------------------------------------
      // Fabrique la liste des programmes actifs ou nouveaux.
      // De cette façon, dans le HTML nous pouvons utiliser $index,
      // puisque le ng-repeat contient l'ensemble des occurrences
      // visibles. Plus besoin de filtrer dans avec le ng-repeat avec un ng-if.
      // ------------------------------------------------------------------------
      $scope.listeProgFiltre = function(type) {

         var result=[],
            programme;

         if ($scope.periode && $scope.periode.programmes) {
            for (var i = 0; i < $scope.periode.programmes.length; i++) {
               programme = $scope.periode.programmes[i];
               if (isIcodeValid(programme.icode) && !!programme.icode && type === 'actif'){
                  result.push(programme);
               }
               if (isIcodeValid(programme.icode) && !programme.icode && type === 'nouveau'){
                  result.push(programme);
               }
            }
         }
         return result;

      };



      // ------------------------------------------------------------------------
      // Retourne une position pour sortedBy dans ng-repeat.
      // 1 en premier et 99 suivant. On place ainsi les programmes
      // avec des périodes devant ceux qui n'en on pas sans toucher
      // au tri original.
      // ------------------------------------------------------------------------
      $scope.periodeAvecFenetre = function(programme){

         if (programme) {
            if ( !$scope.isPeriodePourProgramme(programme) ){
               //console.log(programme.code_prog + ' 99');
               return 99;
            }

            if (programme && programme.trimestres){
               for (var i = 0; i < programme.trimestres.length; i++) {
                  var trimestre = programme.trimestres[i];

                  if (trimestre.an_ses_num && trimestre.fenetres){
                     //console.log(programme.code_prog + ' 1');
                     return 1;
                  }
               }
            }
            //console.log(programme.code_prog + ' 99');
            return 99;
         }

      };



      // ------------------------------------------------------------------------
      // Appel lors de la sélection d'un item dans le popup des programmes.
      // ------------------------------------------------------------------------
      $scope.changerProgramme = function() {
         for (var i = 0; i < $scope.autorisation.programmes.length; i++) {
            if ($scope.autorisation.programmes[i] === $scope.progSelectionne) {
               $scope.programmeCourant = $scope.autorisation.programmes[i];
            }
         }
      };


      // ------------------------------------------------------------------------
      // Vérifier s'il y a une période d'inscription pour un programme.
      // C'est pour déterminer le type de message que l'on affiche aux
      // nouveaux étudiants.
      // ------------------------------------------------------------------------
      $scope.isPeriodePourProgramme = function(programme) {
         if (programme !== undefined && programme.trimestres){
            for (var i = 0; i < programme.trimestres.length; i++) {
               var trimestre = programme.trimestres[i];
               if (trimestre.fenetres && trimestre.fenetres.length > 0 ) {
                  return true;
               }
            }
         }
         return false;
      };


      // ------------------------------------------------------------------------
      // Pour la page d'acceuil.
      // Voir commentaire de reglesIns.isPeriode.
      // ------------------------------------------------------------------------
      $scope.isPeriode = function() {
         return reglesIns.isPeriode($scope.autorisation, dateNode);
      };


      // ------------------------------------------------------------------------
      // Cette fonction vérifie dans la liste des périodes s'il y a un type
      // de periode en ligne pour un programme donné. Afin de cacher un message
      // dans le HTML lorsqu'il y a aucune periode en ligne.
      // ------------------------------------------------------------------------
      $scope.isPeriodeEnLigne = function(programme) {
         for (var i = 0; i < $scope.autorisation.programmes.length; i++) {
            if ($scope.autorisation.programmes[i].code_prog === programme) {
               var trimestres = $scope.autorisation.programmes[i].trimestres;
               for (var j = 0; j < trimestres.length; j++) {
                  if (trimestres[j].mode_inscription === 'WEB') {
                     return true;
                  }
               }
            }
         }
         return false;
      };

      $scope.getJour = function(dateDuJour) {
         return appUtil.getJour(dateDuJour);
      };

      $scope.getDate = function(date) {
         return appUtil.getDate(date);
      };

      // ------------------------------------------------------------------------
      // Cette fonction formatte seulement la chaîne 1ER. Le er devient
      // plus petit.
      // Attention, la directive ng-bind-html d'AngularJS permet seulement
      // de passer l'attribut class et non style.
      // ------------------------------------------------------------------------
      $scope.formatterDate = function(dateString){
         return appUtil.formatterDate(dateString);
      };


      // ------------------------------------------------------------------------
      // Cette fonction détermine uniquement si on affiche ou non les périodes.
      // ------------------------------------------------------------------------
      var isIcodeValid = function(icode) {
         return reglesIns.isIcodeValid(icode);
      };
      $scope.isIcodeValid = isIcodeValid;

      // ------------------------------------------------------------------------
      // Cette fonction détermine si la periode est terminé.
      // ------------------------------------------------------------------------
      $scope.isPeriodeTermine = function(dateFin){
         var dateFinPeriode = moment(dateFin, 'YYYY-MM-DD');
         if (dateFinPeriode && dateFinPeriode.isValid()){
            if (dateNode > dateFinPeriode ){
               return true;
            }else {
               return false;
            }
         }
      };

      ////////////////////////////////////// Exécution immédiate //////////////////////////////////////
      // Aller chercher les données ou les récupérer du cache.
      if (cache !== null) {
         // Récupérer le data qui est déjà dans le cache
         affecterScope(cache);
      } else {

         autorisation.get({
               'identifiant': 'identifiant'
            }, function(data) {


               if (data.programmes) { // OK

                  // Trier les programmes.
                  reglesIns.trierProgramme(data.programmes);

                  // Date du jour au niveau du serveur.
                  dateNode = moment(data.heureMontreal, 'YYYYMMDD');

                  // Pour chacun des programmes, retirer toutes les périodes d'un trimestre
                  // si toutes ces périodes sont inactives.
                  reglesIns.retirerPeriodesInactives(data.programmes, dateNode);

                  // Patch pour écraser les messages.
                  data.libellesMethodeIns = reglesIns.libellesMethodeIns;

                  //Cacher la réponse
                  DossierModel.setDossierPart(APP.AUTORISATION.nomService, data, APP.AUTORISATION.delaiCache);

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

      }


   });

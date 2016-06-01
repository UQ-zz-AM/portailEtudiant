/*jshint unused:vars, camelcase:false*/

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

angular.module('pelApp').factory('UtilisateurModel', function($http, Auth, $log, $location) {
   'use strict';

   var utilisateur = {};

   var utilisateurRecupere = false;

   /* Les données de l'utilisateur ne sont pas récupérées tant
    * que l'utilisateur n'est pas authentifié. Si nous utilisons le projet
    * usager, il faudra retirer: la condition Auth.isLoggedIn(),
    * la dépendance Auth et modifier la fonction resetUtilisateur.
    */

   var init = function() {

      $http.get('/apis/resume/identifiant')
         .success(function(res, status, headers, config) {

            // Comme ces informations sont essentielles au fonctionnement
            // du portail nous n'analysons pas le retour jsend comme
            // dans une composante, nous retournons simplement vers
            // une page d'erreur si fail ou err de jsend.

            if (res.status && res.status === 'success') {

               utilisateur = res.data.resume.socio;

               if (utilisateur.adresse_l1 && utilisateur.adresse_l2) {
                  if (utilisateur.adresse_l1.trim()==='ADRESSE INCONNUE' && utilisateur.adresse_l2.trim()==='ADRESSE INCONNUE') {
                     utilisateur.adresse_l2='';
                  }
               }
               if (utilisateur.adresse_l1 && utilisateur.adresse_l3) {
                  if (utilisateur.adresse_l1.trim()==='ADRESSE INCONNUE' && utilisateur.adresse_l3.trim()==='ADRESSE INCONNUE') {
                     utilisateur.adresse_l3='';
                  }
               }

               utilisateur.recu = res.data.resume.finance.sommaireFinance.liste_releves_impots;
               utilisateur.factHisto = res.data.resume.finance.sommaireFinance.liste_factures_anterieures;

               // Messages pour les impôts des étudiants et des boursiers
               utilisateur.messagesImpots = res.data.resume.finance.generale.impots;

               utilisateur.trimestresCourants = res.data.resume.trimestresCourants;
               //$log.log(res.data.resume.trimestresCourants);

               if (res.data.resume.finance.generale.dateConsentement !== 'aucune') {
                  utilisateur.consentementFinance = true;
               } else {
                  utilisateur.consentementFinance = false;
               }

               if (!utilisateur.consentementFinance) {
                  $location.path('/consentement');
               }

            } else {
               Auth.logout({'url':'/difficulte'});
            }
         })
         .error(function(data, status, headers, config) {
            Auth.logout({'url':'/difficulte'});
         });
   };

   var getUtilisateur = function() {
      if (Auth.isLoggedIn()) {
         if (!utilisateur.hasOwnProperty('nom') && !utilisateurRecupere) {
            init();
            utilisateurRecupere = true;
         }
      }
      return utilisateur;
   };

   var getReleve = function() {
      return utilisateur.recu;
   };

   var getFactHisto = function() {
      return utilisateur.factHisto;
   };

   var getMessagesImpots = function() {
      return utilisateur.messagesImpots;
   };


   var setConsentement = function(newConsentement) {

      $http.get('/apis/resume/identifiant/accepter/' + moment().format('YYYYMMDD'))
         .success(function(res, status, headers, config) {

            if (res.status !== 'success') {
               Auth.logout({'url':'/difficulte'});
            } else {

               if (res.data.dateConsentement) {
                  utilisateur.consentementFinance = true;
               } else {
                  Auth.logout({'url':'/difficulte'});
               }

            }

         })
         .error(function(data, status, headers, config) {
            Auth.logout({'url':'/difficulte'});
         });

   };

   var isConsentementFinance = function() {
      return utilisateur.consentementFinance;
   };

   var effacerUtilisateur = function() {
      utilisateur = {};
      utilisateurRecupere = false;
   };

   return {
      setConsentement: setConsentement,
      isConsentement: isConsentementFinance,
      getReleve: getReleve,
      getFactHisto: getFactHisto,
      getMessagesImpots: getMessagesImpots,
      getUtilisateur: getUtilisateur,
      effacerUtilisateur: effacerUtilisateur
   };

});

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

/*
Notes en vrac.

L'application web pour produire l'attestation OPUS est utilisée en guise de
service pour le portail étudiant. Comme cette application devra être réécrite
pour utiliser un service de la STM (en collaboration avec Concordia), nous ne
la modifierons pas  pour le moment et nous allons la reproduire telle
quelle dans le portail.

Voici l'URL actuelle pour l'application web:
   https://....

Et voici l'URL du service opus qui est utilisée ici:
    /apis/opus/identifiant/Hiver/2015

Voici les particularités de ce service:
  - il retourne du HTML.

C'est la procédure «valide_info» PL/SQL qui génère la page HTML pour
l'attestation. Cette page peut contenir une attestation, un message pour
l'étudiant ou une erreur Oracle qui est également affichée à l'étudiant pour
le moment. Toutes les réponses utilisent HTP.PRINT. Elles se retrouvent donc
toutes dans la réponse jsend-> success.

La procédure PL/SQL «valide_info» fait appel à 3 autres procédures :
- L_Valide_trimestre: qui valide le trimestre avec la table rwe_sessions.
- L_Valide_Regime_Etudes qui valide le régime d'études de l'étudiant;
       -- Régime d'études retourné par le package
       --   0 : indefini ou ne s'applique pas
       --   1 : temps complet
       --   2 : temps partiel
       --   3 : redaction de these
- L_Affiche_attestation produit l'attestation (HTML) suite aux validations
  réussies.

-- La page HTML qui est retournée
Chacune des procédures précédentes peut mettre à jour le paramètre
«Pc_msg_err» qui provient de «valide_info» (Lc_msg_err). Il y a 2 possibilités
de retour de message:
  - un message qui doit être affiché à l'utilisateur;
  - un message pour une erreur Oracle, donc fatal.

Comme ces 2 messages sont retournés dans le HTML au même titre que
l'attestation, il faut donc interpréter la réponse pour distinguer l'attestation
d'un message, mais aussi distinguer le type de messages, un message pour
l'utilisateur ou une erreur Oracle. Il faut également interpréter les
messages destinés à l'étudiant.

- Implémentation de la vue
Il est évidemment possible d'utiliser un iframe avec l'attribut srcDoc afin
d'afficher le contenu HTML complet avec les feuilles de style s'appliquant
automatiquement dans le iFrame.

    MAIS IE 9,10 et 11 NE SUPPORTENT PAS CE TAG !!!

Mais même avec un iframe, nous aurions eu à interpréter les erreurs, car
elles contiennent des informations déjà présentes dans le portail comme
le trimestre que nous ne voulons pas afficher.

IMPORTANT. Tous les messages de cette applications web sont dans le code PL/SQL.

*/

angular.module('pelApp').controller('OpusCtrl', function($scope, $routeParams, opus, APP, DossierModel) {

   var cache = null,
       extraction ='',
       erreurGenerique ='Une erreur est survenue, veuillez essayer plus tard.',
       annee,
       trimestre,
       trimTexte={'1':'Hiver', '2':'Ete', '3':'Automne'}, // Attention service OPUS pas d'accent.
       messageHTML,
       affecterScope;


   $scope.opus = {};

   // Valider la présence et le format du trimestre et extraire les arguments
   // pour faire l'appel au service.
   if ( $routeParams.trimestre && /\d{5}/.test($routeParams.trimestre) ) {
      $scope.trimestreCourant = $routeParams.trimestre; // Affichage du titre, le trimestre.
      annee = $routeParams.trimestre.substr(0,4);
      trimestre = trimTexte[$routeParams.trimestre.substr(4,1)];
      cache = DossierModel.getDossierPart(APP.OPUS.nomService + $routeParams.trimestre);
   }else{
      $scope.err = erreurGenerique;
      return;
   }

   affecterScope = function(data) {
      $scope.opus.html = data;
   };

   // Aller chercher les données ou les récupérer du cache.
   if (cache !== null) {
      affecterScope(cache);
   } else {
      opus.get({'identifiant': 'identifiant', 'trimestre':trimestre, 'annee':annee}, function(data) {

         if (data.html) { // OK
            extraction = data.html;

            // La présence de l'étiquette <table> signifie une attestation.
            // Sinon il s'agit d'un message à l'étudiant ou une erreur Oracle.
            if (extraction.indexOf('<table>') <= 0 ) {

               // 2 type de messages avec ce package/service:
               //  1. Message d'erreur pour l'utilisateur.
               //  2. Message d'erreur Oracle WHEN OTHERS donc fatal.
               //     Ils commencent tous par Erreur à l'éxécution de ...

               // Vérifier s'il s'agit d'une erreur Oracle.
               if ( extraction.indexOf('Erreur à l\'exécution de ') >= 0 ){
                  $scope.err = erreurGenerique;
               } else {

                  // Message que nous devons afficher à l'utilisateur.

                  // Il faut adapter si la réponse comporte les trimestres.
                  // Voir le code PL/SQL.
                  if (extraction.indexOf('temps complet au trimestre ->') >=0 ){
                     // Selon nos dossiers vous n'êtes pas inscrit(e) à temps complet au trimestre ->Ete 2015\n
                     // Devient: Selon nos dossiers vous n'êtes pas inscrit(e) à temps complet.
                     messageHTML = extraction.substring(0, extraction.indexOf(' au trimestre ->')) + '.';
                     // Si 2e cycle voir le code PL/SQL.
                     // TODO ajouter la string en exemple.
                     if (extraction.indexOf('<br><br>Si ceci') ){
                        messageHTML +=  extraction.substr(extraction.indexOf('<br><br>Si ceci'));
                     }
                     $scope.avertissements = [messageHTML];
                  }else{
                     $scope.avertissements = [extraction];
                  }
               }

            // Nous avons une Attestation. Nous l'affichons telle quelle à la demande du registrariat.
            }else{
               extraction = extraction.substring(extraction.indexOf('<body>')+ 6, extraction.indexOf('</body>'));
               DossierModel.setDossierPart(APP.OPUS.nomService + $routeParams.trimestre, extraction, APP.OPUS.delaiCache);
               affecterScope(extraction);
            }
         } else if (data.message) { // fail de jsend un message seulement.
            // Vérifier si c'est possible..
            if (data.reponseService){
               $scope.avertissements = [data.reponseService.err];
            } else{
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

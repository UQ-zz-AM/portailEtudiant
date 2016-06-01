/*jshint unused:false, camelcase:false*/
/*globals alert*/

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
// EditCtrl
//
// Notes.
//
// On utilise ** controller as ** (EditCtrl as ajEditor) pour créer le
// contrôleur. « this » réfère donc à cette instance précise du $scope,
// on l'utilise à la place de $scope, mais $scope doit tout
// de même être injecté afin d'être en mesure de faire référence
// au contrôleur parent $scope.$parent ou $scope avec héritage.
//
// Il y a toujours une instance de ce contrôleur pour l'ajout. Il est
// instancié dans le HTML « EditCtrl as aj». C'est parce que l'éditeur Ajout
// est toujours visible dans la page de l'inscription qu'il est toujours
// instancié au départ.
//
// Pour la modification et le remplacement d'autres instances est utilisées
// ** par cours ** puisque l'utilisateur peut presser modifier le groupe et/ou
// remplacer le cours (MGRC) de chacun des cours-gr de la liste des cours à son
// dossier.
// Ces instances de l'éditeur sont instanciées la première fois que
// l'utilisateur presse un bouton MGRC d'un cours. Lors de l'instanciation,
// la fonction init du contrôleur est appelée à partir du HTML:
//       ng-init="cours.edtidorRef = mo; mo.init()"
// et par la suite lorsque l'utilisateur presse un autre bouton MGRC du cours,
// c'est le  contrôleur parent qui fait l'appel à la fonction
// d'initialisation à partir de sa fonction ajusterEdition:
//   if (cours.edtidorRef && (action === 'modifier' || action === 'remplacer')){
//      cours.edtidorRef.init();
//
// «controller as» semble supporté dans 1.2.x même si seulement documenté
// dans 1.3.x:
//   https://code.angularjs.org/1.3.18/docs/guide/controller (documenté)
//   https://code.angularjs.org/1.2.28/docs/guide/controller (non documenté)
//
/////////////////////////////////////////////////////////////////////////////

'use strict';

angular.module('pelApp').controller('EditCtrl', function($scope, $route, $http, $filter, $element, obtenirGroupeCours) {

   var that = this;
   var longMinSigle = 4;

   // Auto-complétion. On cache la dernière requête au serveur.
   var dernierTrimestre = null,
      dernierSiglePartiel = null,
      dernierResultat = null;

   var sigleCoursValide  = /^[a-z0-9\.]+$/i;

   var erreurGenerique = 'Une erreur est survenue, veuillez essayer plus tard.';


   // L'information du formulaire et du cours.
   // TODO pour l'ajout multiple toutes ces variables devront être dans un tableau
   // de longueur de 5 éléments (objets). Sauf le type de transaction. Il faudra
   // également boucler pour créer la nouvelle section de l'éditeur multiple.
   that.spinningGroupe = false;       // Spinning pendant ajax.

   that.sigleCourant=null;            // Le sigle de cours dans le formulaire.
   that.lastSigleCourant=null;        // Le dernier sigle de cours utilisé par getListeGroupes,
                                      // pour ne pas refaire la même requête plusieurs fois (cache).
   that.groupeSelectionne={};         // Contient le groupe présentement sélectionné.
   that.crsCourant=null;              // Obtenu avec getListeGroupes. Il s'agit du cours
                                      // avec ses informations correspondantes ainsi
                                      // que sa liste de groupes:
                                      //  "titre": "Outils de bureautique et Internet (hors programme)",
                                      //  "credit": "3",
                                      //  "etatCours": "VALIDE",
                                      //  "groupe": [
                                      //    {
                                      //       "noGroupe": "030",
                                      //       "nbPlace": "0",
                                      //       "statutInscription": "OUVERT_A_TOUS",
                                      //       "transgressionPermise": "OUI",
                                      //       "sousSession": "",
                                      //       "campus": "Campus à déterminer",
                                      //       "horaire": [
                                      //          {
                                      //             "jour": "Mercredi",
                                      //             "heurDebut": "09h30",
                                      //             "heureFin": "12h30",
                                      //             "local": ""
                                      //          }
                                      //       ]
                                      //    },
   that.typeTransaction = 'ajouter';  // Le type de transaction ajouter/modifier/remplacer/annuler.


   // ==================================================================================================================
   /////////////////////////////////////////////////////////////////////////////
   // Init.
   //
   // Cette fonction est appelée lorsqu'un bouton à la droite du cours
   // dans la liste des cours à son dossier est cliqué.
   // C'est la fonction ajusterEdition du contrôleur parent
   // qui va modifier cours.action.
   //
   that.init = function(){

      // Comme l'objet est réutilisable, on efface les données précédentes.
      that.crsCourant=undefined;
      that.sigleCourant=null;
      that.lastSigleCourant=null;
      that.groupeSelectionne={};


      if ($scope.cours){

         if ($scope.cours.action === 'remplacer'){

            that.typeTransaction = 'remplacer';
            this.crsCourant = {
               'titre': $scope.cours.titre,
               'credit': $scope.cours.credit,
               'etatCours': 'VALIDE'
            };
            this.sigleCourant = $scope.cours.sigle;
            // Aller chercher les groupes maintenant.
            that.onSelect();

         }

      }

   };
   // ==================================================================================================================




   // ==================================================================================================================
   // ==================================================================================================================
   // ==================================================================================================================
   // AJOUT MULTIPLE


   that.textePopUpGroupe = function(){
      var texte = '';
      if (that.crsCourant !== null ) {

         /* Groupe */
         texte = 'Groupe ' + $filter('trimGroupe')(that.groupeSelectionne.noGroupe);

         /* Campus */
         if ( that.groupeSelectionne.campus ) {
            texte += ' - ' + that.groupeSelectionne.campus;
         }

         /* Horaire, place */
         if (that.groupeSelectionne.horaire){
            /* Horaire */
            for (var i = 0; i < that.groupeSelectionne.horaire.length; i++) {
               var hor = that.groupeSelectionne.horaire[i];

               texte += ' - ' + $filter('capitalize')(hor.jour) + ', ' +
                               $filter('heureSansZero')(hor.heurDebut) + ' à ' +
                               $filter('heureSansZero')(hor.heureFin);
            }
            /* Places */
            if ( that.groupeSelectionne.nbPlace === '0' || that.groupeSelectionne.nbPlace === '1'){
               texte += ' - ' +  that.groupeSelectionne.nbPlace + ' place disponible pour votre programme. ';
            } else {
               texte += ' - ' + that.groupeSelectionne.nbPlace + ' places disponibles pour votre programme. ';
            }

         }

         /* message d'erreur */
         if ( that.groupeSelectionne.messageGroupe ) {
            texte += that.groupeSelectionne.messageGroupe + '.';
         }
      }
      return texte;
   };


   that.textePopUpSigle = function(){
      var texte = '';
      if (that.crsCourant !== null ) {
         if ( that.crsCourant.titre ) {
            texte = that.crsCourant.titre;
         }
         if (that.crsCourant.credit){
            if ( that.crsCourant.credit === '0' || that.crsCourant.credit === '1'){
               texte += ' – ' + that.crsCourant.credit + ' crédit';
            } else {
               texte += ' – ' + that.crsCourant.credit + ' crédits';
            }
         }

         if (that.crsCourant.messageCours){
            if ( texte.substr(texte.length,1) !== '.' && texte.length > 1 ){
               texte +=  '. ' + that.crsCourant.messageCours;
            } else {
               texte +=  that.crsCourant.messageCours;
            }

         }
      }
      return texte;
   };


   // C'est ici qu'on valide l'ensemble des cours-gr,
   that.changerGroupe = function(){

      if (that.indice){

         if ( that.isGroupeValide()){
            //console.log('changerGroupe - > ajouter cours');
            $scope.ajms[that.indice - 1].statut = 'valide';
            $scope.ajms[that.indice - 1].cours = {
               'sigle'  : that.sigleCourant,
               'groupe' : that.groupeSelectionne.noGroupe
            };
         }
         if ( that.isGroupeInvalide()){
            //console.log('changerGroupe - > retirer cours');
            $scope.ajms[that.indice - 1].statut = 'invalide';
            $scope.ajms[that.indice - 1].cours = undefined;
         }

      }



   };

   // Ajout multiple. Les messages popup doivent être affichés
   // à gauche pour le cinquième cours.
   that.afficherMessage5 = function(){
      //console.log('that.indice:' + that.indice);
      if ( that.indice === 5 ) {
         return 'left';
      }
      return 'top';
   };


   // ==================================================================================================================
   // ==================================================================================================================
   // ==================================================================================================================






   // ==================================================================================================================
   // Gestion de l'auto-complétion.

   // Cette fonction est appelée par l'auto-complétion lorsqu'un sigle est sélectionné.
   that.onSelect = function() {

      if (that.sigleCourant) {
          that.sigleCourant = that.sigleCourant.toUpperCase();
      }

      if ( that.lastSigleCourant === null || that.lastSigleCourant !== that.sigleCourant ){

         // Comme il n'y a pas de règle de saisie dans la banque de cours pour les sigles en dehors de la longueur,
         // on ne valide que la longueur (entre longMinSigle et 8) sans regex.

         if ( that.typeTransaction === 'ajouter' && $scope.coursInscrits ){
            for (var j = 0; j < $scope.coursInscrits.length; j++) {
               var theCours  = $scope.coursInscrits[j];
               if ( that.sigleCourant && that.sigleCourant === theCours.sigle ){
                  that.crsCourant= {'titre' : '', 'messageCours' : 'Vous êtes déjà inscrit à ce cours'};
               }
            }
         }


         if ( ! (that.crsCourant && that.crsCourant.messageCours) ){

            if (that.sigleCourant && that.sigleCourant.length >= longMinSigle && that.sigleCourant.length < 9 ){

               // S'il y a un cache et si le sigle n'est pas dans le cache, alors on intercepte cet appel, car
               // il est inutile, il s'agit d'un sigle partiel causé par le 'mousedown'
               //  Attention, si le cache est vide, on doit faire l'appel
               var appelNecessaire = true;
               if (dernierResultat &&
                  dernierResultat.tabCours &&
                  dernierResultat.tabCours.length > 0 &&
                  dernierTrimestre === $scope.trimestreCourant.an_ses_num) {

                     // On a un cache, si le cours n'est pas là, c'est un appel inutile
                     appelNecessaire = false;
                     var longueur = dernierResultat.tabCours.length;
                     for (var i = 0; i < longueur; i++) {
                        if (dernierResultat.tabCours[i] === that.sigleCourant) {
                           // Oh ! le cours est dans le cache, c'est donc un appel légitime
                           appelNecessaire = true;
                        }
                     }
               }

               if (appelNecessaire) {

                  // On s'assure que le sigle ne contient pas de junk
                  // avant de faire un appel au serveur d'inscription.
                  // Cours bidon pour afficher le message d'erreur.
                  if (! sigleCoursValide.test(that.sigleCourant)) {
                     that.crsCourant = {
                        'etatCours': 'INVALIDE',
                        'groupe': [],
                        'messageCours' :'Le sigle est erroné'
                     };
                     return;
                  }

                  that.spinningGroupe = true;
                  that.getListeGroupes($scope.programmeCourant.code_prog, $scope.trimestreCourant.an_ses_num, that.sigleCourant);
               }

            }

         }

      }

   };


   // Cette fonction sert uniquement lorsque l'utilisateur efface le sigle
   // précedemment saisie afin d'éviter de faire apparaîre les messages
   // sous la section du sigle.
   that.changeSigle = function(){


      //////////////////////////////////////
      // Ajout multiple
      /***************/
      if (that.indice >= 1 ){
         //console.log(JSON.stringify($scope.ajms));
         if (that.sigleCourant.length <= 0){
            $scope.ajms[that.indice - 1].statut = 'none';
            $scope.ajms[that.indice - 1].cours=undefined;
         }else{
            $scope.ajms[that.indice - 1].statut = 'invalide';
            $scope.ajms[that.indice - 1].cours=undefined;
         }
      }
      //////////////////////////////////////

      if (that.sigleCourant && that.sigleCourant.length < longMinSigle ){
         that.crsCourant=null;
         that.lastSigleCourant=null;
         that.groupeSelectionne={};
      }
   };


   that.getSigles = function(pSiglePartiel) {

      // Effacer le sigle et le groupe courants lorsqu'on change de sigle.
      that.groupeSelectionne={};
      that.crsCourant=null;
      that.lastSigleCourant=null;

      // Est-ce que l'on a déjà un résultat dans le cache ?
      // Si oui, on va filtrer ce que l'on a déjà, pas besoin de rappeler le serveur!
      if (dernierResultat && dernierSiglePartiel) {

         // Parle t'on du même sigle de cours ?
         if (dernierSiglePartiel.length < pSiglePartiel.length) {
            if (dernierSiglePartiel === pSiglePartiel.substring(0, dernierSiglePartiel.length)) {
               if (dernierTrimestre === $scope.trimestreCourant.an_ses_num) {

                  // Pas besoin d'aller au serveur, on va filtrer ce que l'on a déjà
                  var resultatFiltre = [];
                  var longueur = dernierResultat.tabCours.length;
                  for (var i = 0; i < longueur; i++) {
                     if (dernierResultat.tabCours[i].split(pSiglePartiel.toUpperCase()).length > 1) {
                        resultatFiltre.push(dernierResultat.tabCours[i]);
                     }
                  }

                  // Si c'est vide, on claire le cache, il devient inutile, car pSiglePartiel n'est pas dans le cache
                  if (resultatFiltre.length === 0) {
                     dernierTrimestre = null;
                     dernierSiglePartiel = null;
                     dernierResultat = null;
                  }
                  return resultatFiltre;
               }
            }
         }

      }

      // Ok, on a rien dans le cache, on va appeller le serveur !
      dernierTrimestre = null;
      dernierSiglePartiel = null;
      dernierResultat = null;

      // On s'assure que le sigle ne contient pas de junk
      // avant de faire un appel au service d'autocompletion
      //   On valide avec le regex
      if (! sigleCoursValide.test(pSiglePartiel)) {
         return [];
      }

      // Temps d'exécution de la requête http
      var avantAppelAuServeur = moment();

      // /apis/autocompletion/:identifiant/:trimestre/:siglePartiel
      return $http.get('/apis/autocompletion/identifiant/' + $scope.trimestreCourant.an_ses_num + '/' + pSiglePartiel)
         .then(function(reponse) {

            if (reponse.data && reponse.data.status === 'success') {

               //console.log(' Appel au serveur --> ' + moment.duration(moment().diff(avantAppelAuServeur)).milliseconds() + ' millisecondes');

               // Si le retour nous indique 'TropDeCours' ou 'PremierAppel', on claire le cache et on retourne un tableau vide
               if (reponse.data.data.listeSigle.statut === 'TropDeCours' ||
                  reponse.data.data.listeSigle.statut === 'PremierAppel') {
                  dernierTrimestre = null;
                  dernierSiglePartiel = null;
                  dernierResultat = null;
                  return [];
               }

               // On conserve le cache sur le client, au cas où l'on demande les mêmes premiers caractères du sigle partiel
               dernierTrimestre = $scope.trimestreCourant.an_ses_num;
               dernierSiglePartiel = pSiglePartiel;
               dernierResultat = reponse.data.data.listeSigle;

               return reponse.data.data.listeSigle.tabCours;
            } else {
               //  On ne provoque pas d'erreur, car le service d'autoCompletion n'est pas essentiel
               //  $scope.err = 'Attention une erreur est survenue, veuillez essayer plus tard:';
               return [];
            }
         });

   };
   // ==================================================================================================================



   // ==================================================================================================================
   // Gestion du formulaire.
   // L'état des contrôles (disabled ou non) est déterminé avec le
   // cours-groupe(s) en provenance du service getListeGroupes.

   // Ajuster le fond du input et le contour.
   // C'est la seule façon d'utiliser !important. Avec ng-style ce n'est pas
   // pris en compte car le DOM est déjà compilé. Il faudrait revoir les
   // couleurs avec angularjs valid et invalid d'une façon simple.
   that.statutCouleur = function(){
      if (that.sigleCourant && that.sigleCourant.length < longMinSigle){
         return 'border:;background:;';
      }
      if ( that.isCoursValide() ){
         return 'border:1px solid green;background:#e0ecdc;';
      }
      if ( that.isCoursInvalide() ){
         return 'border:1px solid #a71700!important;background:#F1DCD9;';
      }
   };


   // Permet d'afficher la boîte rouge sous le popup de sélection du groupe.
   that.isGroupeInvalide = function (){
      if (that.groupeSelectionne.statutInscription &&
            (that.groupeSelectionne.statutInscription !== 'OUVERT_A_TOUS' ||
             that.groupeSelectionne.nbPlace === '0')  ){
         return true;
      }
      return false;
   };


   // Permet d'afficher la boîte verte sous le popup de sélection du groupe.
   that.isGroupeValide = function (){
      if (that.groupeSelectionne.statutInscription &&
          that.groupeSelectionne.statutInscription === 'OUVERT_A_TOUS' &&
          that.groupeSelectionne.nbPlace !== '0') {
         return true;
      }
      return false;
   };


   // Permet d'afficher la boîte verte sous le sigle.
   that.isCoursValide = function(){
      return (that.crsCourant && that.crsCourant.messageCours === undefined && that.sigleCourant.length > 0);
   };


   // Permet d'afficher la boîte rouge sous le sigle.
   that.isCoursInvalide = function(){
      return (that.crsCourant && that.crsCourant.messageCours !== undefined);
   };


   // Permet d'afficher le message classement obligatoire sous l'éditeur pour
   // les cours d'anglais et d'espagnol.
   that.isCoursDeLangue = function() {
      if (that.sigleCourant){
         if (that.sigleCourant.substr(0,3) === 'ANG' ||
             that.sigleCourant.substr(0,3) === 'ESP' ) {
            return true;
         }
      }
      return false;
   };
   // ==================================================================================================================



   // ==================================================================================================================
   // Services.

   /////////////////////////////////////////////////////////////////////////////
   // getListeGroupes
   //
   // Ce service va chercher l'information du cours ainsi que
   // les informations de chacun des groupes dans l'horaire maître.
   //
   // On ajoute également un message pour le cours dans le cas ou ce
   // dernier n'est pas VALIDE. Ce message sera affiché sous le sigle.
   // messageCours
   //
   // On ajoute également un message pour chacun des groupes lorsque
   // le groupe n'est pas valide. messageGroupe
   //
   // On prépare le texte du menu de sélection du groupe.
   //
   // Ces différentes manipulations du courant (crsCourant)
   // ne sont faites que lorsqu'on sélectionne le groupe évitant ainsi
   // de manipuler les données à chaque fois qu'on sélectionne un
   // groupe différent.
   //
   //
   /////////////////////////////////////////////////////////////////////////////
   that.getListeGroupes = function(programme, trimestre, sigle) {

      var groupe,
          places,
          elem;

      obtenirGroupeCours.get({
            'identifiant': 'identifiant',
            'sigle': sigle,
            'programme': programme,
            'trimestre': trimestre
         }, function(data) {

            if (data.etatCours) { // OK
               //console.log('Editeur' + '(controlleur):' + JSON.stringify(data));
               // Affecter le cours courant.
               that.crsCourant = data;
               that.lastSigleCourant = that.sigleCourant;

               // Ajout du message cours si nécessaire.
               if (that.crsCourant) {
                  elem = $element.find('input')[0];

                  if (that.crsCourant.etatCours === 'INVALIDE'){
                     that.crsCourant.messageCours = 'Le sigle est erroné';
                     if (elem){elem.focus();}
                  }

                  if (that.crsCourant.etatCours === 'ABSENT_HORAIRE'){
                     that.crsCourant.messageCours = 'Le cours n\'est pas à l\'horaire';
                     if (elem){elem.focus();}
                  }

                  // ajout du message groupe si nessaire.
                  if (that.crsCourant.groupe.length > 0){
                     for (var i = 0; i < that.crsCourant.groupe.length; i++) {
                        groupe = that.crsCourant.groupe[i];
                        if (groupe.statutInscription === 'SUSPENDU'){
                           groupe.messageGroupe = 'L\'inscription à ce cours n\'est pas possible';
                        }
                        if (groupe.statutInscription === 'SUSPENDU_WEB'){
                           groupe.messageGroupe = 'L\'inscription à ce cours se fait auprès de votre programme';
                        }

                        // On le process une seule fois plutôt que dans le HTML.
                        if (groupe.nbPlace === '0'){
                           groupe.menuText = $filter('trimGroupe')(groupe.noGroupe) + ' - ' +  ' Complet';
                        }else{
                           if (groupe.nbPlace === '1') {
                              groupe.menuText = $filter('trimGroupe')(groupe.noGroupe) + ' - ' + groupe.nbPlace + ' place';
                           }else {
                              groupe.menuText = $filter('trimGroupe')(groupe.noGroupe) + ' - ' + groupe.nbPlace + ' places';
                           }
                        }

                        // Gérer le disabled.
                        groupe.disabled = false;

                        // Gérer le disabled du menu des groupes pour la modification.
                        if (that.typeTransaction !== 'ajouter' && $scope.cours && $scope.cours.groupe){
                           if ( groupe.noGroupe.replace(/^0+/,'') === $scope.cours.groupe &&
                                 sigle === $scope.cours.sigle ){
                              groupe.disabled = true;
                              groupe.menuText = $filter('trimGroupe')(groupe.noGroupe) + ' - ' +  ' inscrit';
                           }
                        }

                        // Gérer le disabled du menu des groupes pour l'ajout.
                        if ( that.typeTransaction === 'ajouter' && $scope.coursInscrits ){
                           for (var j = 0; j < $scope.coursInscrits.length; j++) {
                              var theCours  = $scope.coursInscrits[j];
                              if ( groupe.noGroupe.replace(/^0+/,'') === theCours.groupe &&
                                   sigle === theCours.sigle ){
                                 groupe.disabled = true;
                                 groupe.menuText = $filter('trimGroupe')(groupe.noGroupe) + ' - ' +  ' inscrit';
                              }
                           }
                        }

                     }
                  } else {
                     if (!that.crsCourant.messageCours){
                        that.crsCourant.messageCours = 'Il n\'y a aucun groupe à l\'horaire';
                     }
                  }

               }

            } else {  // ERR
               $scope.doParentErr(erreurGenerique);
            }
            that.spinningGroupe = false;

         },
         function(err) {
            $scope.doParentErr(erreurGenerique);
            that.spinningGroupe = false;
         }
      );
   };


   /////////////////////////////////////////////////////////////////////////////
   // traiteInscription
   //
   // Comme les transactions annuler et abandonner ne passent pas ici
   // le service traiteInscription est appelé au niveau du parent.
   // On prépare donc la transaction en affectant l'ancien sigle et/ou l'ancien
   // groupe au besoin.
   //
   /////////////////////////////////////////////////////////////////////////////
   that.traiteInscription = function() {

      var programme = $scope.programmeCourant.code_prog,
        trimestre = $scope.trimestreCourant.an_ses_num,
        sigle = that.sigleCourant,
        groupe = that.groupeSelectionne.noGroupe,
        sigleAncien = ' ',
        groupeAncien = ' ',
        transaction = that.typeTransaction;


      // Traitement en cours. Pour éviter les doubles clic.
      $scope.traitementEnCours = true;

      // Déperminer s'il s'agit d'une transaction de remplacement
      // ou d'une transaction de modification.
      if (that.typeTransaction === 'remplacer'){

         // Pour les transactions modifier et remplacer,
         // on a besoin de l'ancien sigle et/ou groupe.
         sigleAncien = $scope.cours.sigle;
         groupeAncien = $scope.cours.groupe;

         // Déterminer s'il s'agit d'une transaction de modification.
         if ( $scope.cours.sigle === sigle ){
            transaction = 'modifier';
         }
      }

      $scope.traiterInscription(transaction, sigle, groupe, sigleAncien, groupeAncien);

   };
   // ==================================================================================================================


});

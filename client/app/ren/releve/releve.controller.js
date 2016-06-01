/*jshint camelcase:false, unused:false */
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

angular.module('pelApp').controller('ReleveCtrl', function($scope, $timeout, $window, moment, APP, programmeIns, releve, appUtil, DossierModel, UtilisateurModel, trimestreTexte2numFilter) {

   var cache,
      cacheRelProgramme,
      affecterScope,
      obtReleve,
      erreurGenerique = 'Une erreur est survenue lors de la récupération du relevé de notes. Veuillez essayer plus tard.',

      // Cette fonction recherche un résultat pour un trimestre/prog/cours/.
      obtActiviteResultats = function(p_resultats, p_trimestre, p_sigle) {
         // p_resultats est un tableau, une entrée par trimestre
         for (var i = 0; i < p_resultats.length; i++) {
            var resultat = p_resultats[i];
            if (resultat.trimestre.toString() === p_trimestre) {
               // resultat.programmes est un tableau, une entrée par programme d'étude
               for (var j = 0; j < resultat.programmes.length; j++) {
                  var programme = resultat.programmes[j];

                     // On retourne la première activité,
                     // est-ce possible qu'il y ait plus d'une
                     // activité avec le même sigle? normalement non!
                     //
                     // programme.activites est un tableau, une entrée pour chaque cours
                     for (var k = 0; k < programme.activites.length; k++) {
                        var activite = programme.activites[k];
                        if (activite.sigle === p_sigle) {
                           return activite;
                        }
                     }

               }
            }
         } // for i
      },
      // Effectue la correspondance entre les cours du relevé et les
      // résultats. On ajoute les résultats dans cours.activite.
      ajouterActiviteResultats = function(v_releve, p_resultats) {
         // On boucle sur chaque provenance
         var p_releve = v_releve.provenance;
         // Vérifier si nous avons une provenance donc des cours.
         if (p_releve){
            for (var i = 0; i < p_releve.length; i++) {
               var provenance = p_releve[i];
               // On boucle sur chaque trimestre
               for (var j = 0; j < provenance.trimestre.length; j++) {
                  var trimestre = provenance.trimestre[j],
                     trimestreNum = trimestreTexte2numFilter(trimestre.trim_txt);
                  // On boucle sur chaque cours
                  for (var k = 0; k < trimestre.cours.length; k++) {
                     var cours = trimestre.cours[k];
                     // On recherche ce cours dans les 'resultat'
                     var activite = obtActiviteResultats(p_resultats,
                        trimestreNum,
                        cours.sigle
                     );
                     if (activite) {
                        // // Ajout d'un flag dans provenance pour savoir
                        // // si nous imprimons la colonne détail.
                        // provenance.activite = true;
                        cours.activite = activite;
                     }
                  }
               }
            }
         }
      },
      manipulerProvenance = function(data) {
         //
         // Cette fonction va modifier la structure de provenance afin de faciliter
         // la construction des tableaux HTML.
         //
         // 1. Déplacer no_ref_inst de 2 niveaux soit provenance, afin d'afficher
         //    seulement la légende dans la bonne provenance.
         // 2. Déplacer les cours et le libellé du trimestre de 2 niveaux soit
         //    au niveau de l'élément provenance afin qu'il y ait une seule
         //    boucle dans le tableau HTML.
         //
         // Vérifier si nous avons des cours.
         if (data.provenance) {
            for (var i = 0; i < data.provenance.length; i++) {
               var provenance = data.provenance[i];
               // var hack = [];
               for (var j = 0; j < provenance.trimestre.length; j++) {
                  var trimestre = provenance.trimestre[j];

                  for (var k = 0; k < trimestre.cours.length; k++) {
                     var cours = trimestre.cours[k];
                     if (cours.no_ref_inst.length > 0) {
                        provenance.transfert = true;
                     }
                     cours.trim_txt = trimestre.trim_txt;
                     // hack.push(cours);
                  }
                  // Ajouter une clé de tri.
                  //trimestre.tri = j+1;
               }
            }
         }
      },
      // scope.telephone détermine si téléphone ne mode
      // portrait.
      ajusterTelephone = function(){
         $timeout(function() {
            if ($window.innerWidth <= APP.GLOBAL.resolutionTel){
               $scope.$apply(function(){
                  $scope.telephone = true;
               });
            }else {
               $scope.$apply(function(){
                  $scope.telephone = false;
               });
            }
         });
      };

   // Sert à l'impression du relevé.
   // Cette variable est true seulement pendant l'impression
   // du releve.
   $scope.impressionReleve = false;

   // Cache (programme_ins)
   cache = DossierModel.getDossierPart(APP.RELEVE.nomService);

   // Ajuster si téléphone.
   ajusterTelephone();

   // Puisque nous devons imprimer l'en-tête comme pour le RIF
   // lors de l'impression, nous devons accéder aux infos
   // de l'utilisateur et créer la date d'impression
   $scope.utilisateur = UtilisateurModel.getUtilisateur;
   $scope.dateImpression = moment().format('YYYYMMDD');

   affecterScope = function(data) {
      // Sélectionner le programme courant
      if (!$scope.programmeCourant) {
         $scope.programmeCourant = data.programme[0];
         $scope.progSelectionne = data.programme[0];
         $timeout(function() {
            obtReleve(data.programme[0].code_prog);
         });
      }
      $scope.renProgramme = data;
   };

   $scope.changerProgramme = function() {
      for (var i = 0; i < $scope.renProgramme.programme.length; i++) {
         if ($scope.renProgramme.programme[i] === $scope.progSelectionne) {
            $scope.programmeCourant = $scope.renProgramme.programme[i];
            obtReleve($scope.programmeCourant.code_prog);
         }
      }
   };


   /////////////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////////////
   // Il est possible qu'il n'y ait pas de relevé, mais des données sur
   // les programmes. Alors ici on traite les erreurs différemment en plaçant
   // des messages d'avertissements ou d'erreur dans le scope.
   /////////////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////////////
   obtReleve = function(programme) {

      var releveArguments = {
            'identifiant': 'identifiant',
            'programme': programme,
            'resultat': 'N'
         },
         cacheResumeResultat = DossierModel.getDossierPart(APP.RESUMERESULTATS.nomService),
         nomCacheProg = 'relProg';


      // Avant chaque requête effacer les données du scope pour le relevé.
      delete $scope.releveCourant;
      delete $scope.avertissementsRevele;
      delete $scope.errReleve;

      cacheRelProgramme = DossierModel.getDossierPart(nomCacheProg + [releveArguments.programme]);
      if (cacheRelProgramme !== null) {
         $scope.releveCourant = cacheRelProgramme;
      } else {

         if (cacheResumeResultat === null) {
            releveArguments.resultat = 'O';
         }


         releve.get(releveArguments, function(data) {

            if (data.code_perm) { // OK

               if (releveArguments.resultat === 'O' && data.resultats.resultats ) {
                  // On l'ajoute au cache pour ne pas avoir à le rechercher de nouveau.

                  cacheResumeResultat = data.resultats.resultats;
                  DossierModel.setDossierPart(APP.RESUMERESULTATS.nomService, cacheResumeResultat, APP.RESUMERESULTATS.delaiCache);
               }

               // inclure les résultats dans le relevé de notes.
               if (cacheResumeResultat && cacheResumeResultat !== null){
                  ajouterActiviteResultats(data, cacheResumeResultat);
               }

               // Déplacer les éléments pour faciliter HTML.
               manipulerProvenance(data);

               $scope.releveCourant = data;

               // Cacher la réponse par programme
               DossierModel.setDossierPart(nomCacheProg + [releveArguments.programme], data, APP.RELEVE.delaiCache);

            } else if (data.message) { // fail de jsend un message seulement.
               if (data.reponseService) {
                  //$scope.avertissementsRevele = [data.reponseService.err];
                  $scope.avertissementsRevele = [erreurGenerique];
               } else {
                  $scope.avertissementsRevele = [data.message];
               }
            } else if (data.err) {
               $scope.errReleve = erreurGenerique;
            } else {
               $scope.errReleve = erreurGenerique;
            }

         },
         function(err) {
            $scope.errReleve = erreurGenerique;
         });

      }

   };

   // Impression du relevé non officiel
   $scope.imprimer = function(){
      // ATTENDRE LA VARIABLE impressionReleve.
      $timeout(function() {
         $window.print();
         // Toujours à true.
         $scope.impressionReleve = false;
         return false;
      });
   };

   // Ajout d'un événement pour détecter la rotation du téléphone
   // jQuery est plus performant que AngularJS ici.
   jQuery(window).on('resize.doResize', function (){
      ajusterTelephone();
   });

   // Gestion des +/- pour le détail des notes.
   $scope.toggle = {
      'cours': {}
   };
   // BUG Firefox. On doit compter pour le rowspan (par trimestre)
   $scope.compteToggleAffiche = function(leTrimestre) {
      var retour = 0;
      for (var prop in $scope.toggle.cours) {
         if ((prop.indexOf(leTrimestre)===0) && $scope.toggle.cours[prop]) {
            retour = retour + 1;
         }
      }
      return retour;
   };
   $scope.changeToggle = function(element, toggleProp) {
      if (typeof $scope.toggle[element] !== 'undefined') {

         if (toggleProp !== undefined) {
            if ($scope.toggle[element].hasOwnProperty(toggleProp)) {
               if ($scope.toggle[element][toggleProp] === true) {
                  $scope.toggle[element][toggleProp] = false;
               } else {
                  $scope.toggle[element][toggleProp] = true;
               }
               // Creer l'élément si première fois.
            } else {
               $scope.toggle[element][toggleProp] = true;
            }
         } else {
            if ($scope.toggle[element]) {
               $scope.toggle[element] = false;
            } else {
               $scope.toggle[element] = true;
            }
         }

      }
   };

   // Traitement visuel spécial pour certain programme qui n'ont pas
   // de cheminement en tant que tel.
   $scope.cheminementSpecial = function(){
      if ($scope.programmeCourant && $scope.programmeCourant.ty_diplome === 'AUC'){
         return true;
      }
      return false;
   };

   // Libellés pour les popovers.
   $scope.popoverCheminement = 'La barre de cheminement indique le nombre de crédits réussis, restants et en cours si applicable.';
   $scope.popoverCredits = 'Les crédits réussis sont calculés à la fin de chaque trimestre.';

   // Vérifie la présence d'un élément de la thèse.
   $scope.elementThese = function(elem){
      if ($scope.releveCourant && $scope.releveCourant.liste_these){
         for (var i=0; i < $scope.releveCourant.liste_these.length; i++){
            if ($scope.releveCourant.liste_these[i][elem]){
               return true;
            }
         }
      }
      return false;
   };


   ////////////////////////////////////// Exécution immédiate //////////////////////////////////////
   // Aller chercher les données ou les récupérer du cache.
   if (cache !== null) {
      affecterScope(cache);
   } else {

      programmeIns.get({
            'identifiant': 'identifiant'
         }, function(data) {

            if (data.code_perm) { // OK

               // Patch pour binding entier dans css
               // et l'ajusterment des crédits restants pour les programmes inactifs.
               for (var i = 0; i < data.programme.length; i++) {
                  var prog = data.programme[i];
                  prog.nb_cred_prog = parseInt(prog.nb_cred_prog);
                  if (prog.stat_prog === 'INACTIF'){
                     prog.nb_cred_res  = prog.nb_cred_prog - parseInt(prog.nb_cred_pot);
                     prog.pct_cred_res = 100 - parseInt(prog.pct_cred_pot);
                  }
               }

               DossierModel.setDossierPart(APP.RELEVE.nomService, data, APP.RELEVE.delaiCache);
               affecterScope(data);

            } else if (data.message) { // fail de jsend un message seulement.
               if (data.reponseService) {
                  $scope.avertissements = [data.reponseService.err];
               } else {
                  $scope.avertissements = [data.message];
               }
            } else if (data.err) {
               $scope.err = erreurGenerique + ' : ' + data.err;
            } else {
               $scope.err = erreurGenerique;
            }

         },
         function(err) {
            $scope.err = erreurGenerique;
         });

   }


});

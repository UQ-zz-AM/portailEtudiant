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
angular.module('pelApp').service('reglesIns', function(appUtil) {


   // Trier les programmes par icode.
   //0, 1, 4, 7, null, 5, 6, 2, 3, 8, 9
   var sorthash = {
         '0': 0,
         '1': 1,
         '4': 2,
         '7': 3,
         '': 4,
         '5': 5,
         '6': 6,
         '2': 7,
         '3': 8,
         '8': 9,
         '9': 10,
      };

      this.libellesMethodeIns = {
        'WEB': {
           'desc_courte': 'En ligne',
           'desc_longue': 'Vous devez faire votre inscription en ligne.'
        },
        'PRO': {
           'desc_courte': 'Au programme',
           'desc_longue': 'Vous devez faire votre inscription auprès de votre programme. Communiquez avec la direction de votre programme pour procéder.'
        },
        'REG': {
           'desc_courte': 'Au Registrariat',
           'desc_longue': 'Vous devez faire votre inscription au Registrariat. Communiquez avec le Registrariat pour procéder.'
        }
     };

     this.messagePatchNote = {
        'AX': 'Annulation avec remboursement des droits de scolarité.',
        'BX': 'Annulation avec remboursement des droits de scolarité suite à une grève (hiver 2005).',
        'CX': 'Annulation avec remboursement des droits de scolarité par l\'Université suite à la fermeture d\'un groupe.',
        'DX': 'Annulation avec remboursement des droits de scolarité par l\'Université.',
        'FX': 'Annulation avec remboursement des droits de scolarité par l\'Université suite à un défaut de paiement.',
        'GX': 'Annulation avec remboursement des droits de scolarité par l\'Université suite à une grève (hiver 1987).',
        'LX': 'Abandon sans remboursement des droits de scolarité. Le nombre d\'abandons prescrit par le règlement a été excédé.',
        'MX': 'Annulation avec remboursement des droits de scolarité par l\'Université suite à une décision du programme.',
        'PX': 'Annulation avec remboursement des droits de scolarité par l\'Université suite à un défaut de paiement.',
        'RX': 'Annulation avec remboursement des droits de scolarité par l\'Université suite à un préalable non satisfait.',
        'UX': 'Annulation avec remboursement des droits de scolarité par l\'Université.',
        'XE': 'Échec suite à un abandon excédant le nombre d\'abandons prescrit par le règlement.',
        'XX': 'Abandon sans remboursement des droits de scolarité.',
        'YX': 'Abandon sans remboursement des droits de scolarité suite à une grève (hiver 2005).'
     };


   // ------------------------------------------------------------------------
   // Cette fonction fait le tri selon le sorthash.
   // Martin
   // ------------------------------------------------------------------------
   this.trierProgramme = function(programmes) {
      // Trier les programmes.
      if (programmes.length > 1) {
         // injecter la clé de tri basée sur le hash.
         for (var inTri = 0; inTri < programmes.length; inTri++) {
            programmes[inTri].cle = sorthash[programmes[inTri].icode];
         }
         // On fait le tri ici afin que le premier programme suite au tri soit
         // sélectionné.
         programmes = appUtil.sortBy(programmes, 'cle', 'titre_prog');
      }
   };

   // ------------------------------------------------------------------------
   // Cette fonction détermine uniquement si on affiche ou non les périodes.
   //
   // Mise à jour certains icodes sont maintenant valides 2,3,9.
   //
   // icode:0 Dossier actif.
   //       1 Suspension finance (délinquant financier).
   //       2 Suspension comité de discipline.
   //       3 Exclusion pour condition d'admission.
   //       4 Finissant potentiel.
   //       5 Finissant soumis à la C.E..
   //       6 Diplomé.
   //       7 Soumis à la restriction de la poursuite des études.
   //       8 Dossier fermé.
   //       9 Exclusion pour des raisons d'ordre académique.
   // ------------------------------------------------------------------------
   this.isIcodeValid = function(icode) {
      if (
         icode === '5' ||
         icode === '6' ||
         icode === '8' )  {
         return false;
      } else {
         return true;
      }
   };

   // ------------------------------------------------------------------------
   // Pour chacun des programmes, retirer toutes les périodes d'un trimestre
   // si toutes ces périodes sont inactives.
   // ------------------------------------------------------------------------
   this.retirerPeriodesInactives = function(programmes, dateNode) {
      if (programmes && dateNode && programmes.length >= 1) {
         for (var i = 0; i < programmes.length; i++) {
            var programme = programmes[i];
            if (programme.trimestres && programme.trimestres.length >= 1) {
               for (var j = 0; j < programme.trimestres.length; j++) {
                  var trimestre = programme.trimestres[j];
                  var periodeActive = false; // flag présence de période(s).
                  if (trimestre.fenetres && trimestre.fenetres.length >= 1) {
                     // Vérifier si on a au moins une période valide dans le trimestre.
                     for (var k = 0; k < trimestre.fenetres.length; k++) {
                        var dateFinPeriode = moment(trimestre.fenetres[k].date_fin_fen, 'YYYY-MM-DD');
                        if (dateFinPeriode >= dateNode) {
                           periodeActive = true;
                        }
                     }
                     // S’il n'y a aucune période, les enlever toutes.
                     if (!periodeActive) {
                        trimestre.fenetres = [];
                     }
                  }
               }
            }
         }
      }
   };

   // ------------------------------------------------------------------------
   // Pour les trimestres en double, par exemple l'été (intensif et régulier),
   // retirer le doublon, mais avant « ajouter » les fenêtres à la première
   // occurrence programme/trimestres.
   // ------------------------------------------------------------------------
   this.mergerFenProgTrimIdentique = function(programmes) {
      var progTrimestre = {};
      if (programmes && programmes.length >= 1) {
         for (var i = 0; i < programmes.length; i++) {
            var programme = programmes[i];
            if (programme.trimestres && programme.trimestres.length >= 1) {
               for (var j = 0; j < programme.trimestres.length; j++) {
                  var trimestre = programme.trimestres[j];
                  if (progTrimestre['' + programme.code_prog + trimestre.an_ses_num]) {
                     //Merger les fenetres avec le programme.code_prog/trimestre.an_ses_num identique
                     for (var fen=0; fen < trimestre.fenetres.length; fen++){
                        if (trimestre.fenetres[fen]){
                           progTrimestre['' + programme.code_prog + trimestre.an_ses_num].fenetres.push(trimestre.fenetres[fen]);
                        }
                     }
                     // Retirer le trimestre
                     programmes[i].trimestres[j] = {};
                  } else {
                     progTrimestre['' + programme.code_prog + trimestre.an_ses_num] = programmes[i].trimestres[j];
                  }
               }
            }
         }
      }

   };

   // ------------------------------------------------------------------------
   // Extraire un programme. in progr_num
   // ------------------------------------------------------------------------
   this.getProgrEtTrimestre = function(programme_num, trimestre, programmes) {
      if (programmes && programmes.length >= 1) {
         for (var i = 0; i < programmes.length; i++) {
            if (programme_num === programmes[i].code_prog ){
               for (var j = 0; j < programmes[i].trimestres.length; j++) {
                  if (trimestre === programmes[i].trimestres[j].an_ses_num ){
                     return {'programme': programmes[i], 'trimestre': programmes[i].trimestres[j]};
                  }
               }
            }
         }
      }
      return {};
   };


   // ------------------------------------------------------------------------
   // Pour la page d'acceuil.
   // Vérifier s'il y a une période d'inscription valide (dateNode) pour
   // l'ensemble des programmes et que ce programme ait un icode valide.
   // ------------------------------------------------------------------------
   this.isPeriode = function(autorisation, dateNode) {
      if (autorisation && autorisation.programmes){
         for (var i = 0; i < autorisation.programmes.length; i++) {
            var programme = autorisation.programmes[i];
            // Seulement si iCode valide
            if (programme !== undefined && programme.trimestres && this.isIcodeValid(programme.icode)){
               for (var j = 0; j < programme.trimestres.length; j++) {
                  var trimestre = programme.trimestres[j];
                  if (trimestre.fenetres.length > 0 ) {
                     for (var fen=0; fen < trimestre.fenetres.length; fen++){
                        var fenetre = trimestre.fenetres[fen];
                        var dateDebutPeriode = moment(fenetre.date_deb_fen, 'YYYY-MM-DD');
                        // Vérifier si une période valide (présente ou future)
                        if (dateDebutPeriode <= dateNode ) {
                           return true;
                        }
                     }
                  }
               }
            }
         }
         return false;
      }
   };

});

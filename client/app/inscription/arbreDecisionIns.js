/*jshint camelcase:false */

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
   Arbre de décision : regroupe les règles de gestion de l'affichage et du déroulement de l'inscription
*/

angular.module('pelApp').factory('arbreDecisionInscription', function() {

   var ArbreDecisionInscription = {};


   // En entrée 'fenetres' est un tableau de 1 ou 2 fenetres
   // Si la sousSession en paramètre est présente dans ce tableau, alors on retourne vrai
   var isPeriodeActiveSelonSousSession = function(fenetres, sousSession) {
      // On cherche maintenant la bonne fenetre d'inscription, selon le type de fenetre
      // On fait cette recherche, car il se peut que 2 périodes se chevauchent l'été
      // L'été, il peut y avoir des périodes d'abandon d'une session régulière et intensive
      // qui ne sont pas identiques.
      //    On a les périodes actives dans 'periodeActive.fenetres'
      //    Il y a une ou deux fenetre dans periodeActive.fenetres
      if (sousSession !== 'Intensif') {
         sousSession = 'Régulier';
      }

      if (fenetres[0].sousSession === sousSession) {
         return true;
      }

      if (fenetres.length === 2) {
         if (fenetres[1].sousSession === sousSession) {
            return true;
         }
      }

      return false;
   };


   // -------------------------------------------------------------------------------
   // Recherche les périodes actives pour un programme et un trimestre
   // Si on trouve, on retourne un objet qui contient : le mode d'inscription, le statut des fenetres et
   //    un tableau de fenetre.
   //    ( On retourne un tableau car il y a presque toujours une seule fenetre active, sauf pour
   //      les périodes d'abandon, l'été, où on peut avoir
   //      le trimestre intensif d'été qui chevauche le trimestre régulier d'été)
   // --------------------------------------------------------------------------------
   var recherchePeriodesActives = function(periodesIns, dateNode, codeProg, trimestre) {

      var retour = {
         mode_inscription: null,
         statut: null,
         fenetres: []
      };

      if (periodesIns.programmes && dateNode && periodesIns.programmes.length >= 1) {

         for (var i = 0; i < periodesIns.programmes.length; i++) {
            var programme = periodesIns.programmes[i];
            if (programme.code_prog === codeProg && programme.trimestres && programme.trimestres.length >= 1) {

               for (var j = 0; j < programme.trimestres.length; j++) {

                  var leTrimestre = programme.trimestres[j];
                  if (leTrimestre.an_ses_num === trimestre && leTrimestre.fenetres && leTrimestre.fenetres.length >= 1) {

                     // Ok !
                     //    On a trouvé le bon programme d'étude et le bon trimestre
                     // Vérifier si on a au moins une fenêtre valide dans le trimestre.
                     for (var k = 0; k < leTrimestre.fenetres.length; k++) {
                        var dateDebutPeriode = moment(leTrimestre.fenetres[k].date_deb_fen, 'YYYY-MM-DD');
                        var dateFinPeriode = moment(leTrimestre.fenetres[k].date_fin_fen, 'YYYY-MM-DD');
                        if (dateDebutPeriode <= dateNode && dateFinPeriode >= dateNode) {

                           // On en a trouvé une !!
                           // On conserve le mode d'inscription et le statut
                           retour.mode_inscription = leTrimestre.mode_inscription;
                           retour.statut = leTrimestre.statut;
                           // On va greffer la sous session dans chaque fenêtre, qui est au niveau supérieur dans le JSON
                           leTrimestre.fenetres[k].sousSession = 'Régulier'; // régulier par défaut
                           if (leTrimestre.sous_ses_txt && leTrimestre.sous_ses_txt === 'Intensif') {
                              // C'est peut-être 'intensif'  INT
                              leTrimestre.fenetres[k].sousSession = 'Intensif';
                           }
                           retour.fenetres.push(leTrimestre.fenetres[k]);
                        }
                     }
                  }

               }
            }
         }

      }
      return retour;
   };

   // Recherche la première période inactive qui survient après la dateNode
   var rechercheUnePeriodeFuture = function(periodesIns, dateNode, codeProg, trimestre) {

      var retour = null;

      if (periodesIns.programmes && dateNode && periodesIns.programmes.length >= 1) {

         for (var i = 0; i < periodesIns.programmes.length; i++) {
            var programme = periodesIns.programmes[i];
            if (programme.code_prog === codeProg && programme.trimestres && programme.trimestres.length >= 1) {

               for (var j = 0; j < programme.trimestres.length; j++) {

                  var leTrimestre = programme.trimestres[j];
                  if (leTrimestre.an_ses_num === trimestre && leTrimestre.fenetres && leTrimestre.fenetres.length >= 1) {

                     // Ok !
                     //    On a trouvé le bon programme d'étude et le bon trimestre
                     for (var k = 0; k < leTrimestre.fenetres.length; k++) {
                        var dateDebutPeriode = moment(leTrimestre.fenetres[k].date_deb_fen, 'YYYY-MM-DD');
                        if (dateNode < dateDebutPeriode) {

                           // On a trouvé une période dans le futur!!
                           if(!retour) {
                              retour = leTrimestre.fenetres[k];
                           } else {
                              // On en a déjà une...
                              // Est-elle plus récente ?
                              var dateDebutDejaLa = moment(retour.date_deb_fen, 'YYYY-MM-DD');
                              if (dateDebutPeriode < dateDebutDejaLa) {
                                 // Oui, plus récente !
                                 retour = leTrimestre.fenetres[k];
                              }
                           }

                        }
                     }
                  }
               }
            }
         }

      }
      return retour;
   };



   // Pour chaque cours, on greffe l'arbre de décision avec un message particulier
   var ajouteArbreDecisionSurChaqueCours = function(validationInscription, periodeActive, pMessage, typeFenetre) {

      // On va chercher les paramètres d'appel
      var codeProg = validationInscription.validerInscription.parametresAppel.codeProgramme;

      //===================================================================
      // On boucle sur les cours inscrits
      //  ATTENTION : // On greffe la structure de décision par cours directement sur chaque cours
      //

      if (validationInscription.validerInscription.coursInscrits &&
         validationInscription.validerInscription.coursInscrits.length > 0) {

         for (var i = validationInscription.validerInscription.coursInscrits.length - 1; i >= 0; i--) {

            var leCours = validationInscription.validerInscription.coursInscrits[i];

            // La greffe se fait ici !
            // Par défaut, rien n'est permis, tous les boutons sont éteints !
            leCours.decisionCours = {
               messages: null, //{ url: '',  texte: '' },
               isRemplacerPermis: false,
               isAnnulationPermise: false,
               isAbandonPermis: false
            };


            if (leCours.codeProgramme !== codeProg) {
               // Cours dans un autre programme d'étude
               leCours.decisionCours.messages = {
                  'url': '/inscription/autori/landing',
                  'texte': 'Ce cours est inscrit dans un autre programme.'
               };
            } else if (pMessage) {
               // On greffe un message, donc tous les boutons reste à false
               leCours.decisionCours.messages = {
                  'texte': pMessage
               };
            } else if (typeFenetre && leCours.statutInscription === 'OUVERT_A_TOUS') {
               // Si typeFenetre est présent, c'est le cas Orange
               // Alors, on permet Annulation ou Abandon
               if (typeFenetre === 'ABA') {
                  leCours.decisionCours.isAbandonPermis = true;
               } else {
                  leCours.decisionCours.isAnnulationPermise = true;
               }
            } else if (!isPeriodeActiveSelonSousSession(periodeActive.fenetres, leCours.sousSession)) {
               // Vérifier les sessions d'été (intensive ou régulière)
               leCours.decisionCours.messages = {
                  'texte': 'Aucune opération n\'est possible pour ce cours.'
               };
            } else {

               // On commence par les boutons Annulation et Abandon
               // qui doivent être activé selon le type de fenetre
               if (periodeActive.fenetres[0].type_fenetre === 'ABA') {
                  leCours.decisionCours.isAbandonPermis = true;
               } else {
                  leCours.decisionCours.isAnnulationPermise = true;
               }
               if (leCours.statutInscription === 'SUSPENDU_WEB') {
                  // Martin. Le message est différent en fonction du type la période.
                  if (leCours.decisionCours.isAbandonPermis){
                     leCours.decisionCours.messages = {'texte': 'Vous pouvez seulement abandonner ce cours.'};
                  }else {
                     leCours.decisionCours.messages = {'texte': 'Vous pouvez seulement annuler ce cours.'};
                  }
               } else if (leCours.statutInscription === 'SUSPENDU') {
                  // Martin. Le message est différent en fonction du type la période.
                  if (leCours.decisionCours.isAbandonPermis){
                     leCours.decisionCours.messages = {'texte': 'Vous pouvez seulement abandonner ce cours.'};
                  }else {
                     leCours.decisionCours.messages = {'texte': 'Vous pouvez seulement annuler ce cours.'};
                  }
               } else if (leCours.statutInscription === 'SIPE_SEULEMENT') {
                  leCours.decisionCours.messages = {
                     'texte': 'Aucune opération n\'est possible pour ce cours.'
                  };
                  // Attention, SIPE_SEULEMENT, donc rien de permis
                  leCours.decisionCours.isAbandonPermis = false;
                  leCours.decisionCours.isAnnulationPermise = false;
               } else
               // Ouf, on arrive finalement à une situation normale d'inscription !
               // On active les bons boutons
               //  Abandon et annulation ont déjà été traité
               if (periodeActive.fenetres[0].type_fenetre !== 'ABA') {
                  leCours.decisionCours.isRemplacerPermis = true;
               }

            }

         }
      }

   };


   // ------------------------------------------------------------------------
   //   Arbre de décision principal
   //      En entrée : le Json du service validationInscription (flag avecAutorisation=O)
   // ------------------------------------------------------------------------
   ArbreDecisionInscription.construireArbreDecision = function(validationInscription) {

      // Sur les erreurs, on retourne null
      if (!validationInscription) {
         return null;
      }
      if (!validationInscription.periodesIns) {
         return null;
      }
      if (!validationInscription.validerInscription) {
         return null;
      }

      // On va chercher les paramètres d'appel
      var codeProg = validationInscription.validerInscription.parametresAppel.codeProgramme;
      var trimestre = validationInscription.validerInscription.parametresAppel.trimestre;

      var retour = {
         'messageBarreEtat': null, // On retourne toujours un message ici
         // 1- Message système s'il y a lieu
         // 2- Code retour ECHEC , prendre le
         //    premier (le seul) message de 'messagesProgramme'
         // 3- Succès , message selon la période et le mode d'inscription
         //             et selon le statutInscription
         'tableauMessages': null, // Les remarques associés à l'étudiant : aussi dans 'messagesProgramme'

         // Flags principaux
         'isInscriptionNonPermise': false, // rouge
         'isInscriptionPartielle': false, // orange
         'isInscriptionPermise': false, // vert

         // Autres flags
         'modeInscription': '', // REG, PRO ou WEB

         // Fenetres actives, s'il y a lieu
         //   la plupart du temps, une seule fenetre...
         //   il y en aura 2 l'été, lors que les fenetres d'abandon se chevaucheront
         'fenetresActives': [],

         // S'il y a lieu, lorsqu'aucune fenetre active n'est présente
         'premiereFenetreFuture': null,

         'isPeriodeAbandon': false, // fenetre d'inscription de type 'ABA'
      };

      // Il y a parfois des codes de messages et des messages
      //     Par exemple : "codeMsg": "DFP"   Défaut de paiement
      if (validationInscription.validerInscription.messagesProgramme) {
         retour.tableauMessages = validationInscription.validerInscription.messagesProgramme;
      }


      // Recherche d'une période active (donc selon la dateNode)
      var dateNode = moment(validationInscription.periodesIns.heureMontreal, 'YYYYMMDD');
      var periodeActive = recherchePeriodesActives(validationInscription.periodesIns, dateNode, codeProg, trimestre);
      retour.premiereFenetreFuture = rechercheUnePeriodeFuture(validationInscription.periodesIns, dateNode, codeProg, trimestre);

      // Aucune période d'inscription active ?
      if (!periodeActive.mode_inscription) {
         retour.isInscriptionNonPermise = true; // Rouge !!
         retour.messageBarreEtat = 'Vous n\'êtes pas à l\'intérieur des périodes d\'inscription qui vous ont été attribuées.';
         ajouteArbreDecisionSurChaqueCours(validationInscription, periodeActive, 'Aucune opération n\'est possible pour ce cours.');
         return retour;
      }

      retour.fenetresActives = periodeActive.fenetres;

      // Mode d'inscription n'est pas en ligne ?
      if (periodeActive.mode_inscription !== 'WEB') {
         retour.isInscriptionNonPermise = true; // Rouge !!

         ajouteArbreDecisionSurChaqueCours(validationInscription,
                                           periodeActive,
                                           'Aucune opération n\'est possible pour ce cours.');

         if (periodeActive.mode_inscription === 'REG') {
            retour.modeInscription = 'REG';
            retour.messageBarreEtat = 'Vous devez vous inscrire au Registrariat.';
         }
         if (periodeActive.mode_inscription === 'PRO') {
            retour.modeInscription = 'PRO';
            if (periodeActive.statut === 'MOYENNEINSUFFISANTE') {
               retour.messageBarreEtat =
                  'Votre inscription en ligne est suspendue pour ce trimestre à la demande de la direction de votre ' +
                  'programme ou en raison d\'une moyenne cumulative inférieure au seuil exigé. Vous devez contacter ' +
                  'votre programme pour vous inscrire.';

            } else {
               retour.messageBarreEtat = 'Vous devez vous inscrire à votre programme.';

            }
         }
         return retour;
      }

      // À partir d'ici, on est en ligne !!
      // et on est sur d'avoir au moins une fenetre active !
      retour.modeInscription = 'WEB';
      // On retourne le type de fenetre
      // (même s'il y en a 2, ce sera le même type de fenetre, on prends donc la première fenetre)
      if (periodeActive.fenetres[0].type_fenetre === 'ABA') {
         retour.isPeriodeAbandon = true;
      }


      // Si le retour de validerInscription est en échec, on ne désactive que partiellement si on a AnnulationPermise==='OUI'
      if (!validationInscription.validerInscription.codeRetour ||
         validationInscription.validerInscription.codeRetour === 'ECHEC') {

         if (validationInscription.validerInscription.messageSysteme &&
             validationInscription.validerInscription.messageSysteme.texteMsg) {
            retour.messageBarreEtat = validationInscription.validerInscription.messageSysteme.texteMsg;
            retour.isInscriptionNonPermise = true;
            ajouteArbreDecisionSurChaqueCours(validationInscription,
                                              periodeActive,
                                              'Aucune opération n\'est possible pour ce cours.');
            // TODO message  à valider par UX

            return retour;
         }

         retour.messageBarreEtat = 'Échec';
         if (validationInscription.validerInscription.messagesProgramme &&
            validationInscription.validerInscription.messagesProgramme.length > 0) {
            retour.messageBarreEtat = validationInscription.validerInscription.messagesProgramme[0].texteMsg;
         }

         if (validationInscription.validerInscription.annulationPermise &&
            validationInscription.validerInscription.annulationPermise === 'OUI') {

            retour.isInscriptionPartielle = true; // Orange !!

            ajouteArbreDecisionSurChaqueCours(validationInscription, periodeActive, null, periodeActive.fenetres[0].type_fenetre);
            return retour;
         }

         ajouteArbreDecisionSurChaqueCours(validationInscription,
                                           periodeActive,
                                           'Aucune opération n\'est possible pour ce cours.');
         retour.isInscriptionNonPermise = true;
         return retour;
      }


      // ==============    VERT  ====================
      retour.isInscriptionPermise = true;
      retour.messageBarreEtat = 'Vous pouvez ajouter, modifier et annuler des cours.';
      if (periodeActive.fenetres[0].type_fenetre === 'ABA') {
         retour.messageBarreEtat = 'Vous pouvez seulement abandonner des cours.';
      }

      ajouteArbreDecisionSurChaqueCours(validationInscription, periodeActive, null, null);

      return retour;


   };

   return ArbreDecisionInscription;

});

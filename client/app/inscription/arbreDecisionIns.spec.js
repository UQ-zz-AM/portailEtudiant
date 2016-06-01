
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

describe('factory: arbreDecisionInscription', function() {

   // load the service's module
   beforeEach(module('pelApp'));

   var arbreDecisionInscription;

   beforeEach(inject(function(_arbreDecisionInscription_) {
      arbreDecisionInscription = _arbreDecisionInscription_;
   }));


   var dataTest01 = {
      "periodesIns": {
         "libellesMethodeIns": {
            "REG": {
               "desc_courte": "Au Registrariat",
               "desc_longue": "Selon les plages de dates affichées, vous pouvez effectuer vos modifications auprès du registrariat."
            },
            "WEB": {
               "desc_courte": "En ligne",
               "desc_longue": "Selon les plages de dates affichées, vous pouvez effectuer vos modifications avec ce site."
            },
            "PRO": {
               "desc_courte": "Au programme",
               "desc_longue": "Selon les plages de dates affichées, vous pouvez effectuer vos modifications auprès de votre programme d'étude."
            }
         },
         "programmes": [{
            "code_prog": "C102",
            "titre_prog": "baccalauréat par cumul de programmes",
            "icode": "0",
            "fenetres": []
         }, {
            "code_prog": "4122",
            "titre_prog": "certificat en administration",
            "icode": "6",
            "fenetres": []
         }, {
            "code_prog": "4423",
            "titre_prog": "certificat en commerce international",
            "icode": "0",
            "trimestres": [{
               "an_ses_num": "20153",
               "sous_ses_txt": "",
               "mode_inscription": "WEB",
               "statut": "ACTIF",
               "fenetres": [{
                  "type_fenetre": "ABA",
                  "date_deb_fen": "2015-09-16",
                  "date_fin_fen": "2015-11-11"
               }]
            }]
         }, {
            "code_prog": "4728",
            "titre_prog": "certificat en technologies d'affaires",
            "icode": "0",
            "trimestres": [{
               "an_ses_num": "20153",
               "sous_ses_txt": "",
               "mode_inscription": "WEB",
               "statut": "ACTIF",
               "fenetres": [{
                  "type_fenetre": "ABA",
                  "date_deb_fen": "2015-09-16",
                  "date_fin_fen": "2015-11-11"
               }]
            }]
         }],
         "heureMontreal": "20151029 07:39:11"
      },
      "validerInscription": {
         "parametresAppel": {
            "codePermanent": "ZZZZ22099100",
            "codeProgramme": "4728",
            "trimestre": "20153"
         },
         "competencesLinguistiques": [{
            "titre": "TODO Titre de la compétence (à venir)",
            "resultat": "TODO Résultat de la compétence (à venir)",
            "raisonNonSatisfait": "TODO Raison de non satisfaction de la compétence (à venir)"
         }],
         "codeRetour": "SUCCES",
         "annulationPermise": "OUI",
         "messageSysteme": {},
         "messagesProgramme": [{
            "typeMsg": "REM",
            "codeMsg": "DIN",
            "texteMsg": "L'etud. tente de faire une double inscript."
         }],
         "coursInscrits": [{
            "sigle": "MET2101",
            "titre": "Architecture organisationnelle et modélisation sociale",
            "credit": "3",
            "groupe": "50",
            "sousSession": "",
            "statutInscription": "SUSPENDU_WEB",
            "codeProgramme": "4728",
            "historiqueAjout": "TODO historique de l'ajout (à venir)"
         },{
            "sigle": "MET2102",
            "titre": "Architecture organisationnelle et modélisation sociale 2",
            "credit": "3",
            "groupe": "30",
            "sousSession": "",
            "statutInscription": "SUSPENDU",
            "codeProgramme": "4728",
            "historiqueAjout": "TODO historique de l'ajout (à venir)"
         }, {
            "sigle": "MET4261",
            "titre": "Gestion des opérations",
            "credit": "3",
            "groupe": "10",
            "sousSession": "",
            "statutInscription": "OUVERT_A_TOUS",
            "codeProgramme": "4728",
            "historiqueAjout": "TODO historique de l'ajout (à venir)"
         }, {
            "sigle": "MET4902",
            "titre": "Introduction aux progiciels de gestion intégrés (PGI)",
            "credit": "3",
            "groupe": "40",
            "sousSession": "",
            "statutInscription": "OUVERT_A_TOUS",
            "codeProgramme": "4728",
            "historiqueAjout": "TODO historique de l'ajout (à venir)"
         }, {
            "sigle": "MET5201",
            "titre": "Management, information et systèmes",
            "credit": "3",
            "groupe": "41",
            "sousSession": "",
            "statutInscription": "OUVERT_A_TOUS",
            "codeProgramme": "9999",
            "historiqueAjout": "TODO historique de l'ajout (à venir)"
         }],
         "coursAnnules": [{
            "sigle": "LIN1002",
            "titre": "Connaissances de base en grammaire du français écrit (hors programme)",
            "credit": "3",
            "groupe": "20",
            "codeProgramme": "4423",
            "historiqueAjout": "TODO historique de l'ajout (à venir)",
            "historiqueAnnul": "TODO historique de l'annulation (à venir)"
         }, {
            "sigle": "MET5312",
            "titre": "Conception et développement d'application Workflow",
            "credit": "3",
            "groupe": "30",
            "codeProgramme": "4728",
            "historiqueAjout": "TODO historique de l'ajout (à venir)",
            "historiqueAnnul": "TODO historique de l'annulation (à venir)"
         }],
         "heureMontreal": "20151029 07:39:12"
      }
   };



   it('should do something', function() {
      expect(!!arbreDecisionInscription).toBe(true);
   });

   it(' Pas de données ', function() {
      var resultat = arbreDecisionInscription.construireArbreDecision(null);
      expect(resultat).toBe(null);
   });

   it(' Pas de données (periodeIns)', function() {
      var resultat = arbreDecisionInscription.construireArbreDecision({});
      expect(resultat).toBe(null);
   });

   it(' Pas de données (validationInscription)', function() {
      var resultat = arbreDecisionInscription.construireArbreDecision({'periodesIns':'test'});
      expect(resultat).toBe(null);
   });

   it(' Période d\'abandon', function() {
      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest01);
      expect(resultat.isInscriptionPermise).toBe(true);
      expect(resultat.isInscriptionNonPermise).toBe(false);
      expect(resultat.isInscriptionPartielle).toBe(false);
      expect(resultat.modeInscription).toBe('WEB');

      // le premier cours est Suspendu_web
      //expect(dataTest01.validerInscription.coursInscrits[0].decisionCours.messages.texte).toBe(
      //          'Les opérations pour ce cours se font auprès de votre programme.');
      // le 2e cours est Suspendu
      expect(dataTest01.validerInscription.coursInscrits[1].decisionCours.messages.texte).toBe(
                'Vous pouvez seulement abandonner ce cours.');

      // Le bouton abandon doit être allumé quand même pour le 1er et 2e cours
      expect(dataTest01.validerInscription.coursInscrits[0].decisionCours.isAbandonPermis).toBe(true);
      expect(dataTest01.validerInscription.coursInscrits[1].decisionCours.isAbandonPermis).toBe(true);
      // Le bouton annulation doit être éteint quand même pour le 1er et 2e cours
      expect(dataTest01.validerInscription.coursInscrits[0].decisionCours.isAnnulationPermise).toBe(false);
      expect(dataTest01.validerInscription.coursInscrits[1].decisionCours.isAnnulationPermise).toBe(false);

      // Pour le 3e cours, le bouton abandon doit être allumé
      expect(dataTest01.validerInscription.coursInscrits[2].decisionCours.isAbandonPermis).toBe(true);
      // et les autres boutons sont éteints
      expect(dataTest01.validerInscription.coursInscrits[2].decisionCours.isRemplacerPermis).toBe(false);
      expect(dataTest01.validerInscription.coursInscrits[2].decisionCours.isAnnulationPermise).toBe(false);
   });

   it(' Période d\'inscription', function() {
      // On triche sur le data
      // On change la fenetre de 'ABA' vers 'INS'
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.periodesIns.programmes[3].trimestres[0].fenetres[0].type_fenetre = 'INS';

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);
      expect(resultat.isInscriptionPermise).toBe(true);
      //expect(resultat.message).toBe('Inscription permise');
      expect(resultat.isInscriptionNonPermise).toBe(false);
      expect(resultat.isInscriptionPartielle).toBe(false);
      expect(resultat.modeInscription).toBe('WEB');

      // le premier cours est toujours Suspendu_web
      //expect(dataTest02.validerInscription.coursInscrits[0].decisionCours.messages.texte).toBe(
      //          'Les opérations pour ce cours se font auprès de votre programme.');
      // le 2e cours est Suspendu
      expect(dataTest02.validerInscription.coursInscrits[1].decisionCours.messages.texte).toBe(
                'Vous pouvez seulement annuler ce cours.');
      // Le bouton annulation doit être allumé quand même pour le 1er et 2e cours
      expect(dataTest02.validerInscription.coursInscrits[0].decisionCours.isAnnulationPermise).toBe(true);
      expect(dataTest02.validerInscription.coursInscrits[1].decisionCours.isAnnulationPermise).toBe(true);
      // Le bouton abandon doit être éteint quand même pour le 1er et 2e cours
      expect(dataTest02.validerInscription.coursInscrits[0].decisionCours.isAbandonPermis).toBe(false);
      expect(dataTest02.validerInscription.coursInscrits[1].decisionCours.isAbandonPermis).toBe(false);

      // Pour le 3e cours, le bouton abandon doit être éteint
      expect(dataTest02.validerInscription.coursInscrits[2].decisionCours.isAbandonPermis).toBe(false);
      // et les autres boutons sont allumés
      expect(dataTest02.validerInscription.coursInscrits[2].decisionCours.isRemplacerPermis).toBe(true);
      expect(dataTest02.validerInscription.coursInscrits[2].decisionCours.isAnnulationPermise).toBe(true);
   });

   it(' Période d\'inscription  SIPE_SEULEMENT', function() {
      // On triche sur le data
      // On change la fenetre de 'ABA' vers 'INS'
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.periodesIns.programmes[3].trimestres[0].fenetres[0].type_fenetre = 'INS';
      dataTest02.validerInscription.coursInscrits[0].statutInscription = 'SIPE_SEULEMENT';

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);

      // le premier cours est toujours Suspendu_web
      expect(dataTest02.validerInscription.coursInscrits[0].decisionCours.messages.texte).toBe(
                'Aucune opération n\'est possible pour ce cours.');
   });


   it(' Pas de période d\'inscription active', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.periodesIns.programmes[3].trimestres[0].fenetres[0].date_fin_fen = '2015-09-17';

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);
      expect(resultat.isInscriptionNonPermise).toBe(true);
      expect(resultat.isInscriptionPermise).toBe(false);
      expect(resultat.isInscriptionPartielle).toBe(false);

      //dataTest02 va avoir été modifié
      expect(dataTest02.validerInscription.coursInscrits[1].decisionCours.messages.texte).toBe(
                                          'Aucune opération n\'est possible pour ce cours.');
      expect(resultat.fenetresActives.length).toBe(0);
      expect(resultat.premiereFenetreFuture).toBe(null);
   });

   it(' Pas de période d\'inscription active, mais une dans le futur ! ', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.periodesIns.programmes[3].trimestres[0].fenetres[0].date_deb_fen = '2016-09-17';
      dataTest02.periodesIns.programmes[3].trimestres[0].fenetres[0].date_fin_fen = '2016-09-17';

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);
      expect(resultat.isInscriptionNonPermise).toBe(true);
      expect(resultat.isInscriptionPermise).toBe(false);
      expect(resultat.isInscriptionPartielle).toBe(false);

      //dataTest02 va avoir été modifié
      expect(dataTest02.validerInscription.coursInscrits[1].decisionCours.messages.texte).toBe(
                                          'Aucune opération n\'est possible pour ce cours.');
      expect(resultat.fenetresActives.length).toBe(0);
      expect(!!resultat.premiereFenetreFuture).toBe(true);
      expect(resultat.premiereFenetreFuture.date_deb_fen).toBe('2016-09-17');

   });

   it(' Pas de période d\'inscription active, mais 2 dans le futur ! ', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.periodesIns.programmes[3].trimestres[0].fenetres[0].date_deb_fen = '2016-09-17';
      dataTest02.periodesIns.programmes[3].trimestres[0].fenetres[0].date_fin_fen = '2016-09-17';

      // On ajoute une période dans le futur, un peu avant l'autre
      dataTest02.periodesIns.programmes[3].trimestres[0].fenetres[1] = {
         "type_fenetre": "ABA",
         "date_deb_fen": "2016-08-16",
         "date_fin_fen": "2016-08-19"
      };

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);
      expect(resultat.isInscriptionNonPermise).toBe(true);
      expect(resultat.isInscriptionPermise).toBe(false);
      expect(resultat.isInscriptionPartielle).toBe(false);

      //dataTest02 va avoir été modifié
      expect(dataTest02.validerInscription.coursInscrits[1].decisionCours.messages.texte).toBe(
                                          'Aucune opération n\'est possible pour ce cours.');
      expect(resultat.fenetresActives.length).toBe(0);
      expect(!!resultat.premiereFenetreFuture).toBe(true);
      expect(resultat.premiereFenetreFuture.date_deb_fen).toBe('2016-08-16');

   });


   it(' Mode inscription différent de WEB (REG)', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.periodesIns.programmes[3].trimestres[0].mode_inscription = 'REG';

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);
      expect(resultat.isInscriptionNonPermise).toBe(true);
      expect(resultat.isInscriptionPermise).toBe(false);
      expect(resultat.isInscriptionPartielle).toBe(false);

      //expect(resultat.messageBarreEtat).toBe('Vous devez vous inscrire via le registrariat');
      //dataTest02 va avoir été modifié
      expect(dataTest02.validerInscription.coursInscrits[1].decisionCours.messages.texte).toBe(
                                          'Aucune opération n\'est possible pour ce cours.');
      expect(resultat.fenetresActives.length).toBe(1);
   });

   it(' Mode inscription différent de WEB (PRO)', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.periodesIns.programmes[3].trimestres[0].mode_inscription = 'PRO';

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);
      expect(resultat.isInscriptionNonPermise).toBe(true);
      expect(resultat.isInscriptionPermise).toBe(false);
      expect(resultat.isInscriptionPartielle).toBe(false);

      //expect(resultat.messageBarreEtat).toBe('Vous devez vous inscrire via votre programme d\'étude');
      //dataTest02 va avoir été modifié
      expect(dataTest02.validerInscription.coursInscrits[1].decisionCours.messages.texte).toBe(
                                          'Aucune opération n\'est possible pour ce cours.');
      expect(resultat.fenetresActives.length).toBe(1);
   });


   it(' Mode inscription différent de WEB (PRO) et moyenne insuffisante ', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.periodesIns.programmes[3].trimestres[0].mode_inscription = 'PRO';
      dataTest02.periodesIns.programmes[3].trimestres[0].statut = 'MOYENNEINSUFFISANTE';

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);
      expect(resultat.isInscriptionNonPermise).toBe(true);
      expect(resultat.isInscriptionPermise).toBe(false);
      expect(resultat.isInscriptionPartielle).toBe(false);

      //expect(resultat.messageBarreEtat).toBe('Vous devez vous inscrire via votre programme d\'étude, car votre moyenne est insuffisante');
      //dataTest02 va avoir été modifié
      expect(dataTest02.validerInscription.coursInscrits[1].decisionCours.messages.texte).toBe(
                                          'Aucune opération n\'est possible pour ce cours.');
      expect(resultat.fenetresActives.length).toBe(1);
   });

   it(' Mode ECHEC et message système ', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.validerInscription.codeRetour = 'ECHEC';
      dataTest02.validerInscription.messageSysteme = {
         'typeMsg': 'REJ',
         'codeMsg': 'SV9',
         'texteMsg': 'Une maintenance est en cours'
      };

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);
      expect(resultat.isInscriptionNonPermise).toBe(true);
      expect(resultat.isInscriptionPermise).toBe(false);
      expect(resultat.isInscriptionPartielle).toBe(false);

      expect(resultat.messageBarreEtat).toBe('Une maintenance est en cours');
      //dataTest02 va avoir été modifié
      expect(dataTest02.validerInscription.coursInscrits[1].decisionCours.messages.texte).toBe(
                                          'Aucune opération n\'est possible pour ce cours.');
   });

   it(' Mode ECHEC et annulation permise (avec période abandon) ', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.validerInscription.codeRetour = 'ECHEC';

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);

      expect(resultat.isInscriptionNonPermise).toBe(false);
      expect(resultat.isInscriptionPermise).toBe(false);
      expect(resultat.isInscriptionPartielle).toBe(true);

   });
   it(' Mode ECHEC et annulation permise (avec période inscription normale)', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.validerInscription.codeRetour = 'ECHEC';
      dataTest02.periodesIns.programmes[3].trimestres[0].fenetres[0].type_fenetre = 'INS';

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);

      expect(resultat.isInscriptionNonPermise).toBe(false);
      expect(resultat.isInscriptionPermise).toBe(false);
      expect(resultat.isInscriptionPartielle).toBe(true);

   });

   it(' Mode ECHEC et annulation non permise ', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.validerInscription.codeRetour = 'ECHEC';
      dataTest02.validerInscription.annulationPermise = 'NON';

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);

      expect(resultat.isInscriptionNonPermise).toBe(true);
      expect(resultat.isInscriptionPermise).toBe(false);
      expect(resultat.isInscriptionPartielle).toBe(false);

   });



   it(' Mode normal Abandon ', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);

      expect(resultat.isInscriptionNonPermise).toBe(false);
      expect(resultat.isInscriptionPermise).toBe(true);
      expect(resultat.isInscriptionPartielle).toBe(false);

      expect(resultat.messageBarreEtat).toBe('Vous pouvez seulement abandonner des cours.');

   });


   it(' Mode normal Inscription ', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));
      dataTest02.periodesIns.programmes[3].trimestres[0].fenetres[0].type_fenetre = 'INS';

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);

      expect(resultat.isInscriptionNonPermise).toBe(false);
      expect(resultat.isInscriptionPermise).toBe(true);
      expect(resultat.isInscriptionPartielle).toBe(false);

      //expect(resultat.messageBarreEtat).toBe(
      //   'Vous pouvez ajouter, remplacer, modifier le groupe et annuler des cours à l\'aide de l\'interface plus bas');

   });


   it(' Trimestre intensif ', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));

      // Ouin, on triche , on teste les sessions intensives avec une session automne, mais c'est pas grave, on teste le code quand même
      dataTest02.validerInscription.coursInscrits[3].sousSession = 'Intensif';
      dataTest02.periodesIns.programmes[3] = {
         "code_prog": "4728",
         "titre_prog": "certificat en technologies d'affaires",
         "icode": "0",
         "trimestres": [{
            "an_ses_num": "20153",
            "sous_ses_txt": "",
            "mode_inscription": "WEB",
            "statut": "ACTIF",
            "fenetres": [{
               "type_fenetre": "ABA",
               "date_deb_fen": "2015-09-16",
               "date_fin_fen": "2015-11-11"
            }]
         }, {
            "an_ses_num": "20153",
            "sous_ses_txt": "Intensif",
            "mode_inscription": "WEB",
            "statut": "ACTIF",
            "fenetres": [{
               "type_fenetre": "ABA",
               "date_deb_fen": "2015-09-16",
               "date_fin_fen": "2015-11-11"
            }]
         }]
      };

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);

      expect(resultat.isInscriptionNonPermise).toBe(false);
      expect(resultat.isInscriptionPermise).toBe(true);
      expect(resultat.isInscriptionPartielle).toBe(false);

      expect(resultat.messageBarreEtat).toBe(
         'Vous pouvez seulement abandonner des cours.');

   });


   it(' Trimestre intensif (avec période intensive terminé)', function() {
      // On triche sur le data
      var dataTest02 = JSON.parse(JSON.stringify(dataTest01));

      // Ouin, on triche , on teste les sessions intensives avec une session automne, mais c'est pas grave, on teste le code quand même
      dataTest02.validerInscription.coursInscrits[3].sousSession = 'Intensif';
      dataTest02.periodesIns.programmes[3] = {
         "code_prog": "4728",
         "titre_prog": "certificat en technologies d'affaires",
         "icode": "0",
         "trimestres": [{
            "an_ses_num": "20153",
            "sous_ses_txt": "",
            "mode_inscription": "WEB",
            "statut": "ACTIF",
            "fenetres": [{
               "type_fenetre": "ABA",
               "date_deb_fen": "2015-09-16",
               "date_fin_fen": "2015-11-11"
            }]
         }, {
            "an_ses_num": "20153",
            "sous_ses_txt": "Intensif",
            "mode_inscription": "WEB",
            "statut": "ACTIF",
            "fenetres": [{
               "type_fenetre": "ABA",
               "date_deb_fen": "2015-09-16",
               "date_fin_fen": "2015-09-17"
            }]
         }]
      };

      var resultat = arbreDecisionInscription.construireArbreDecision(dataTest02);

      expect(resultat.isInscriptionNonPermise).toBe(false);
      expect(resultat.isInscriptionPermise).toBe(true);
      expect(resultat.isInscriptionPartielle).toBe(false);

      expect(resultat.messageBarreEtat).toBe(
         'Vous pouvez seulement abandonner des cours.');

   });


});

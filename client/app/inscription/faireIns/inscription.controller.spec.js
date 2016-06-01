/* jshint  unused:false, camelcase:false */
/* globals afterEach, spyOn */

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

describe('Controller: InscriptionCtrl', function() {

   var scope,
       rootScope,
       backendMock,
       inscription,
       erreurGenerique = 'Attention une erreur est survenue, veuillez essayer plus tard.',
       $timeout,
       inscriptionCtrl,
       routeParams = {'programme':'7111','trimestre':'20153'};

   var testInscription = {
      'status': 'success',
      'data': {

            'periodesIns': {
               'libellesMethodeIns': {
                  'REG': {
                     'desc_courte': 'Au Registrariat',
                     'desc_longue': 'Selon les plages de dates affichées, vous pouvez effectuer vos modifications auprès du registrariat.'
                  },
                  'WEB': {
                     'desc_courte': 'En ligne',
                     'desc_longue': 'Selon les plages de dates affichées, vous pouvez effectuer vos modifications avec ce site.'
                  },
                  'PRO': {
                     'desc_courte': 'Au programme',
                     'desc_longue': 'Selon les plages de dates affichées, vous pouvez effectuer vos modifications auprès de votre programme d\'étude.'
                  }
               },
               'programmes': [
                  {
                     'code_prog': '7111',
                     'titre_prog': 'baccalauréat en administration (finance)',
                     'icode': '0',
                     'trimestres': [
                        {
                           'an_ses_num': '20153',
                           'sous_ses_txt': '',
                           'mode_inscription': 'WEB',
                           'statut': 'ACTIF',
                           'fenetres': [
                              {
                                 'type_fenetre': 'INS',
                                 'date_deb_fen': '2015-08-13',
                                 'date_fin_fen': '2030-09-30'
                              },
                              {
                                 'type_fenetre': 'ABA',
                                 'date_deb_fen': '2030-10-15',
                                 'date_fin_fen': '2030-10-30'
                              }
                           ]
                        },
                        {
                           'an_ses_num': '20161',
                           'sous_ses_txt': '',
                           'mode_inscription': 'WEB',
                           'statut': 'ACTIF',
                           'fenetres': [
                              {
                                 'type_fenetre': 'INS',
                                 'date_deb_fen': '2015-08-13',
                                 'date_fin_fen': '2030-09-30'
                              },
                              {
                                 'type_fenetre': 'ABA',
                                 'date_deb_fen': '2030-10-15',
                                 'date_fin_fen': '2030-10-30'
                              }
                           ]
                        }
                     ]
                  },
                  {
                     'code_prog': '7330',
                     'titre_prog': 'baccalauréat en sciences comptables',
                     'icode': '0',
                     'trimestres': [
                        {
                           'an_ses_num': '20153',
                           'sous_ses_txt': '',
                           'mode_inscription': 'WEB',
                           'statut': 'ACTIF',
                           'fenetres': [
                              {
                                 'type_fenetre': 'INS',
                                 'date_deb_fen': '2015-08-13',
                                 'date_fin_fen': '2030-09-30'
                              },
                              {
                                 'type_fenetre': 'ABA',
                                 'date_deb_fen': '2030-10-15',
                                 'date_fin_fen': '2030-10-30'
                              }
                           ]
                        }
                     ]
                  },
                  {
                     'code_prog': '7370',
                     'titre_prog': 'b. en gest. tourisme et hôtellerie(g.org. & dest.tour. DEC-BAC)',
                     'icode': '8',
                     'fenetres': []
                  }
               ],
               'heureMontreal': '20151118 17:55:37'
            },
            'validerInscription': {
               'parametresAppel': {
                  'codePermanent': 'ZZZZ10559309',
                  'codeProgramme': '7111',
                  'trimestre': '20153'
               },
               'competencesLinguistiques': [
                  {
                     'titre': 'TODO Exigence français ligne 1 (à déterminer)',
                     'resultat': 'TODO Exigence français ligne 2 (à déterminer)',
                     'raisonNonSatisfait': 'TODO TODO Exigence français ligne 3 (à déterminer)'
                  }
               ],
               'codeRetour': 'SUCCES',
               'annulationPermise': 'OUI',
               'messageSysteme': {},
               'messagesProgramme': [
                  {
                     'typeMsg': 'REM',
                     'codeMsg': 'DIN',
                     'texteMsg': 'L\'etud. tente de faire une double inscript.',
                     'transgression': 'NON'
                  }
               ],
               'coursInscrits': [
                  {
                     'sigle': 'SCO2240',
                     'titre': 'Comptabilité financière intermédiaire I',
                     'credit': '3',
                     'groupe': '20',
                     'sousSession': '',
                     'statutInscription': 'OUVERT_A_TOUS',
                     'transgressionPermise': 'OUI',
                     'codeProgramme': '7330',
                     'historiqueAjout': 'TODO historique de l\'ajout (à venir)'
                  },
                  {
                     'sigle': 'SCO3006',
                     'titre': 'Systèmes d\'information comptable',
                     'credit': '3',
                     'groupe': '2',
                     'sousSession': '',
                     'statutInscription': 'OUVERT_A_TOUS',
                     'transgressionPermise': 'OUI',
                     'codeProgramme': '7330',
                     'historiqueAjout': 'TODO historique de l\'ajout (à venir)'
                  },
                  {
                     'sigle': 'SCO3008',
                     'titre': 'Impôt sur le revenu I',
                     'credit': '3',
                     'groupe': '22',
                     'sousSession': '',
                     'statutInscription': 'OUVERT_A_TOUS',
                     'transgressionPermise': 'OUI',
                     'codeProgramme': '7330',
                     'historiqueAjout': 'TODO historique de l\'ajout (à venir)'
                  }
               ],
               'coursAnnules': [
                  {
                     'sigle': 'LIN1002',
                     'titre': 'Connaissances de base en grammaire du français écrit (hors programme)',
                     'credit': '3',
                     'groupe': '20',
                     'codeProgramme': '7111',
                     'historiqueAjout': 'TODO historique de l\'ajout (à venir)',
                     'historiqueAnnul': 'TODO historique de l\'annulation (à venir)'
                  },
                  {
                     'sigle': 'SCO2001',
                     'titre': 'Comptabilité de management I',
                     'credit': '3',
                     'groupe': '40',
                     'codeProgramme': '7330',
                     'historiqueAjout': 'TODO historique de l\'ajout (à venir)',
                     'historiqueAnnul': 'TODO historique de l\'annulation (à venir)'
                  }
               ],
               'heureMontreal': '20151118 17:55:37'
            },
            '$promise': {},
            '$resolved': true
         }

   };

   var ajouterSucces = {
      'status': 'success',
      'data': {
         'parametresAppel': {
            'codePermanent': 'ZZZZ10559309',
            'codeProgramme': '7111',
            'trimestre': '20153',
            'transactions': [
               {
                  'codeTransaction': 'ajouter',
                  'sigle': 'INF0326',
                  'groupe': '64',
                  'sigleAnc': '',
                  'groupeAnc': '',
                  'rangCours': '',
                  'typeCours': '',
                  'noteAnnulation': ''
               }
            ]
         },
         'exigencesFrancais': [],
         'codeRetour': 'SUCCES',
         'messageSysteme': {},
         'messagesProgramme': [
            {
               'typeMsg': 'REM',
               'codeMsg': 'DIN',
               'texteMsg': '!!! Message introuvé dans REG_INSC_MESSAGE !!! Message temporaire: L\'etud. tente de faire une double inscript. (DIN)',
               'transgression': 'NON'
            }
         ],
         'transactions': [
            {
               'codeTransaction': 'ajouter',
               'sigle': 'INF0326',
               'titre': 'Outils de bureautique et Internet (hors programme)',
               'groupe': '64',
               'sigleAnc': '',
               'titreAnc': '',
               'groupeAnc': '',
               'codeRetour': 'SUCCES',
               'messages': [
                  {
                     'typeMsg': 'REM',
                     'codeMsg': 'CHO',
                     'texteMsg': 'En vous inscrivant à ce cours, vous vous placez en conflit d\'horaire avec le cours XXX, groupe xx auquel vous êtes déjà inscrit.',
                     'transgression': 'NON'
                  }
               ]
            }
         ],
         'coursInscrits': [
            {
               'sigle': 'INF0326',
               'titre': 'Outils de bureautique et Internet (hors programme)',
               'credit': '3',
               'groupe': '64',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7111',
               'historiqueAjout': ''
            },
            {
               'sigle': 'LIN1002',
               'titre': 'Connaissances de base en grammaire du français écrit (hors programme)',
               'credit': '3',
               'groupe': '2',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7111',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO2240',
               'titre': 'Comptabilité financière intermédiaire I',
               'credit': '3',
               'groupe': '20',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO3006',
               'titre': 'Systèmes d\'information comptable',
               'credit': '3',
               'groupe': '2',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO3008',
               'titre': 'Impôt sur le revenu I',
               'credit': '3',
               'groupe': '22',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            }
         ],
         'coursAnnules': [
            {
               'sigle': 'LIN1009',
               'titre': 'Apprentissage de la grammaire du français écrit I',
               'credit': '3',
               'groupe': '21',
               'note': 'AX',
               'codeProgramme': '7111',
               'historiqueAjout': '',
               'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
            },
            {
               'sigle': 'SCO2001',
               'titre': 'Comptabilité de management I',
               'credit': '3',
               'groupe': '40',
               'note': 'AX',
               'codeProgramme': '7330',
               'historiqueAjout': '',
               'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
            }
         ],
         'heureMontreal': '20151126 10:32:08',
         '$promise': {},
         '$resolved': true
      }
   };

   var ajouterEchec = {
      'status' :'success',
      'data' : {
         'parametresAppel': {
            'codePermanent': 'ZZZZ10559309',
            'codeProgramme': '7111',
            'trimestre': '20153',
            'transactions': [
               {
                  'codeTransaction': 'ajouter',
                  'sigle': 'PSY5000',
                  'groupe': '20',
                  'sigleAnc': '',
                  'groupeAnc': '',
                  'rangCours': '',
                  'typeCours': '',
                  'noteAnnulation': ''
               }
            ]
         },
         'exigencesFrancais': [],
         'codeRetour': 'SUCCES',
         'messageSysteme': {},
         'messagesProgramme': [
            {
               'typeMsg': 'REM',
               'codeMsg': 'DIN',
               'texteMsg': '!!! Message introuvé dans REG_INSC_MESSAGE !!! Message temporaire: L\'etud. tente de faire une double inscript. (DIN)',
               'transgression': 'NON'
            }
         ],
         'transactions': [
            {
               'codeTransaction': 'ajouter',
               'sigle': 'PSY5000',
               'titre': 'Les écoles psychanalytiques',
               'groupe': '20',
               'sigleAnc': '',
               'titreAnc': '',
               'groupeAnc': '',
               'codeRetour': 'ECHEC',
               'messages': [
                  {
                     'typeMsg': 'REJ',
                     'codeMsg': 'M15',
                     'texteMsg': 'Vous avez atteint le nombre maximum de crédits permis pour le trimestre. Veuillez annuler ou remplacer un des cours auxquels vous êtes déjà inscrits. Ou encore, contactez votre responsable de programme.',
                     'transgression': 'NON'
                  }
               ]
            }
         ],
         'coursInscrits': [
            {
               'sigle': 'LIN1002',
               'titre': 'Connaissances de base en grammaire du français écrit (hors programme)',
               'credit': '3',
               'groupe': '2',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7111',
               'historiqueAjout': ''
            },
            {
               'sigle': 'LIN1009',
               'titre': 'Apprentissage de la grammaire du français écrit I',
               'credit': '3',
               'groupe': '21',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7111',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO2240',
               'titre': 'Comptabilité financière intermédiaire I',
               'credit': '3',
               'groupe': '20',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO3006',
               'titre': 'Systèmes d\'information comptable',
               'credit': '3',
               'groupe': '2',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO3008',
               'titre': 'Impôt sur le revenu I',
               'credit': '3',
               'groupe': '22',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            }
         ],
         'coursAnnules': [
            {
               'sigle': 'INF0326',
               'titre': 'Outils de bureautique et Internet (hors programme)',
               'credit': '3',
               'groupe': '64',
               'note': 'AX',
               'codeProgramme': '7111',
               'historiqueAjout': '',
               'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
            },
            {
               'sigle': 'SCO2001',
               'titre': 'Comptabilité de management I',
               'credit': '3',
               'groupe': '40',
               'note': 'AX',
               'codeProgramme': '7330',
               'historiqueAjout': '',
               'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
            }
         ],
         'heureMontreal': '20151127 09:04:04',
         '$promise': {},
         '$resolved': true
      }
   };

   var remplacerSucces = {
      'status' : 'success',
      'data' : {
         'parametresAppel': {
            'codePermanent': 'ZZZZ10559309',
            'codeProgramme': '7111',
            'trimestre': '20153',
            'transactions': [
               {
                  'codeTransaction': 'remplacer',
                  'sigle': 'INF0326',
                  'groupe': '64',
                  'sigleAnc': 'LIN1002',
                  'groupeAnc': '2',
                  'rangCours': '',
                  'typeCours': '',
                  'noteAnnulation': ''
               }
            ]
         },
         'exigencesFrancais': [],
         'codeRetour': 'SUCCES',
         'messageSysteme': {},
         'messagesProgramme': [
            {
               'typeMsg': 'REM',
               'codeMsg': 'DIN',
               'texteMsg': '!!! Message introuvé dans REG_INSC_MESSAGE !!! Message temporaire: L\'etud. tente de faire une double inscript. (DIN)',
               'transgression': 'NON'
            }
         ],
         'transactions': [
            {
               'codeTransaction': 'remplacer',
               'sigle': 'INF0326',
               'titre': 'Outils de bureautique et Internet (hors programme)',
               'groupe': '64',
               'sigleAnc': 'LIN1002',
               'titreAnc': 'Connaissances de base en grammaire du français écrit (hors programme)',
               'groupeAnc': '2',
               'codeRetour': 'SUCCES',
               'messages': [
                  {
                     'typeMsg': 'REM',
                     'codeMsg': 'CDS',
                     'texteMsg': 'Vous avez suivi et complété ce cours antérieurement.',
                     'transgression': 'NON'
                  },
                  {
                     'typeMsg': 'REM',
                     'codeMsg': 'CHO',
                     'texteMsg': 'En vous inscrivant à ce cours, vous vous placez en conflit d\'horaire avec le cours XXX, groupe xx auquel vous êtes déjà inscrit.',
                     'transgression': 'NON'
                  }
               ]
            }
         ],
         'coursInscrits': [
            {
               'sigle': 'INF0326',
               'titre': 'Outils de bureautique et Internet (hors programme)',
               'credit': '3',
               'groupe': '64',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7111',
               'historiqueAjout': ''
            },
            {
               'sigle': 'LIN1009',
               'titre': 'Apprentissage de la grammaire du français écrit I',
               'credit': '3',
               'groupe': '21',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7111',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO2240',
               'titre': 'Comptabilité financière intermédiaire I',
               'credit': '3',
               'groupe': '20',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO3006',
               'titre': 'Systèmes d\'information comptable',
               'credit': '3',
               'groupe': '2',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO3008',
               'titre': 'Impôt sur le revenu I',
               'credit': '3',
               'groupe': '22',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            }
         ],
         'coursAnnules': [
            {
               'sigle': 'LIN1002',
               'titre': 'Connaissances de base en grammaire du français écrit (hors programme)',
               'credit': '3',
               'groupe': '2',
               'note': 'AX',
               'codeProgramme': '7111',
               'historiqueAjout': '',
               'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
            },
            {
               'sigle': 'SCO2001',
               'titre': 'Comptabilité de management I',
               'credit': '3',
               'groupe': '40',
               'note': 'AX',
               'codeProgramme': '7330',
               'historiqueAjout': '',
               'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
            }
         ],
         'heureMontreal': '20151127 09:10:17',
         '$promise': {},
         '$resolved': true
      }
   };

   var remplacerEchec = {
      'status' : 'success',
      'data' : {
         'parametresAppel': {
            'codePermanent': 'ZZZZ10559309',
            'codeProgramme': '7111',
            'trimestre': '20161',
            'transactions': [
               {
                  'codeTransaction': 'remplacer',
                  'sigle': 'LIN1002',
                  'groupe': '2',
                  'sigleAnc': 'INF0326',
                  'groupeAnc': '10',
                  'rangCours': '',
                  'typeCours': '',
                  'noteAnnulation': ''
               }
            ]
         },
         'exigencesFrancais': [],
         'codeRetour': 'SUCCES',
         'messageSysteme': {},
         'messagesProgramme': [],
         'transactions': [
            {
               'codeTransaction': 'remplacer',
               'sigle': 'LIN1002',
               'titre': 'Connaissances de base en grammaire du français écrit (hors programme)',
               'groupe': '2',
               'sigleAnc': 'INF0326',
               'titreAnc': 'Outils de bureautique et Internet (hors programme)',
               'groupeAnc': '10',
               'codeRetour': 'ECHEC',
               'messages': [
                  {
                     'typeMsg': 'REJ',
                     'codeMsg': 'CDI',
                     'texteMsg': 'Vous êtes déjà inscrit à ce cours.',
                     'transgression': 'NON'
                  }
               ]
            }
         ],
         'coursInscrits': [
            {
               'sigle': 'INF0326',
               'titre': 'Outils de bureautique et Internet (hors programme)',
               'credit': '3',
               'groupe': '10',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7111',
               'historiqueAjout': ''
            },
            {
               'sigle': 'LIN1002',
               'titre': 'Connaissances de base en grammaire du français écrit (hors programme)',
               'credit': '3',
               'groupe': '2',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7111',
               'historiqueAjout': ''
            }
         ],
         'coursAnnules': [],
         'heureMontreal': '20151127 08:52:16',
         '$promise': {},
         '$resolved': true
      }
   };

   var modifierGroupeSucces = {
      'status' :'success',
      'data' : {
         'parametresAppel': {
            'codePermanent': 'ZZZZ10559309',
            'codeProgramme': '7111',
            'trimestre': '20153',
            'transactions': [
               {
                  'codeTransaction': 'modifier',
                  'sigle': 'LIN1009',
                  'groupe': '20',
                  'sigleAnc': 'LIN1009',
                  'groupeAnc': '21',
                  'rangCours': '',
                  'typeCours': '',
                  'noteAnnulation': ''
               }
            ]
         },
         'exigencesFrancais': [],
         'codeRetour': 'SUCCES',
         'messageSysteme': {},
         'messagesProgramme': [
            {
               'typeMsg': 'REM',
               'codeMsg': 'DIN',
               'texteMsg': 'Vous êtes déjà inscrit à un autre programme et votre dossier ne satisfait pas aux exigences réglementaires de la double inscription.',
               'transgression': 'NON'
            }
         ],
         'transactions': [
            {
               'codeTransaction': 'modifier',
               'sigle': 'LIN1009',
               'titre': 'Apprentissage de la grammaire du français écrit I',
               'groupe': '20',
               'sigleAnc': 'LIN1009',
               'titreAnc': 'Apprentissage de la grammaire du français écrit I',
               'groupeAnc': '21',
               'codeRetour': 'SUCCES',
               'messages': [
                  {
                     'typeMsg': 'REM',
                     'codeMsg': 'CHO',
                     'texteMsg': 'En vous inscrivant à ce cours, vous vous placez en conflit d\'horaire avec le cours XXX, groupe xx auquel vous êtes déjà inscrit.',
                     'transgression': 'NON'
                  }
               ]
            }
         ],
         'coursInscrits': [
            {
               'sigle': 'LIN1009',
               'titre': 'Apprentissage de la grammaire du français écrit I',
               'credit': '3',
               'groupe': '20',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7111',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO2240',
               'titre': 'Comptabilité financière intermédiaire I',
               'credit': '3',
               'groupe': '20',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO3006',
               'titre': 'Systèmes d\'information comptable',
               'credit': '3',
               'groupe': '2',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO3008',
               'titre': 'Impôt sur le revenu I',
               'credit': '3',
               'groupe': '22',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            }
         ],
         'coursAnnules': [
            {
               'sigle': 'INF0326',
               'titre': 'Outils de bureautique et Internet (hors programme)',
               'credit': '3',
               'groupe': '64',
               'note': 'AX',
               'codeProgramme': '7111',
               'historiqueAjout': '',
               'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
            },
            {
               'sigle': 'LIN1002',
               'titre': 'Connaissances de base en grammaire du français écrit (hors programme)',
               'credit': '3',
               'groupe': '2',
               'note': 'AX',
               'codeProgramme': '7111',
               'historiqueAjout': '',
               'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
            },
            {
               'sigle': 'SCO2001',
               'titre': 'Comptabilité de management I',
               'credit': '3',
               'groupe': '40',
               'note': 'AX',
               'codeProgramme': '7330',
               'historiqueAjout': '',
               'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
            }
         ],
         'heureMontreal': '20151127 10:17:51',
         '$promise': {},
         '$resolved': true
      }
   };

   var modifierGroupeEchec = {
      'status' : 'success',
      'data' : {
         'parametresAppel': {
            'codePermanent': 'ZZZZ10559309',
            'codeProgramme': '7111',
            'trimestre': '20153',
            'transactions': [
               {
                  'codeTransaction': 'modifier',
                  'sigle': 'LIN1009',
                  'groupe': '20',
                  'sigleAnc': 'LIN1009',
                  'groupeAnc': '20',
                  'rangCours': '',
                  'typeCours': '',
                  'noteAnnulation': ''
               }
            ]
         },
         'exigencesFrancais': [],
         'codeRetour': 'SUCCES',
         'messageSysteme': {},
         'messagesProgramme': [
            {
               'typeMsg': 'REM',
               'codeMsg': 'DIN',
               'texteMsg': 'Vous êtes déjà inscrit à un autre programme et votre dossier ne satisfait pas aux exigences réglementaires de la double inscription.',
               'transgression': 'NON'
            }
         ],
         'transactions': [
            {
               'codeTransaction': 'modifier',
               'sigle': 'LIN1009',
               'titre': 'Apprentissage de la grammaire du français écrit I',
               'groupe': '20',
               'sigleAnc': 'LIN1009',
               'titreAnc': 'Apprentissage de la grammaire du français écrit I',
               'groupeAnc': '20',
               'codeRetour': 'ECHEC',
               'messages': [
                  {
                     'typeMsg': 'REJ',
                     'codeMsg': 'CDI',
                     'texteMsg': 'Vous êtes déjà inscrit à ce cours.',
                     'transgression': 'NON'
                  }
               ]
            }
         ],
         'coursInscrits': [
            {
               'sigle': 'LIN1009',
               'titre': 'Apprentissage de la grammaire du français écrit I',
               'credit': '3',
               'groupe': '20',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7111',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO2240',
               'titre': 'Comptabilité financière intermédiaire I',
               'credit': '3',
               'groupe': '20',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO3006',
               'titre': 'Systèmes d\'information comptable',
               'credit': '3',
               'groupe': '2',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            },
            {
               'sigle': 'SCO3008',
               'titre': 'Impôt sur le revenu I',
               'credit': '3',
               'groupe': '22',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7330',
               'historiqueAjout': ''
            }
         ],
         'coursAnnules': [
            {
               'sigle': 'INF0326',
               'titre': 'Outils de bureautique et Internet (hors programme)',
               'credit': '3',
               'groupe': '64',
               'note': 'AX',
               'codeProgramme': '7111',
               'historiqueAjout': '',
               'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
            },
            {
               'sigle': 'LIN1002',
               'titre': 'Connaissances de base en grammaire du français écrit (hors programme)',
               'credit': '3',
               'groupe': '2',
               'note': 'AX',
               'codeProgramme': '7111',
               'historiqueAjout': '',
               'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
            },
            {
               'sigle': 'SCO2001',
               'titre': 'Comptabilité de management I',
               'credit': '3',
               'groupe': '40',
               'note': 'AX',
               'codeProgramme': '7330',
               'historiqueAjout': '',
               'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
            }
         ],
         'heureMontreal': '20151127 10:25:21',
         '$promise': {},
         '$resolved': true
      }
   };

   var annulerSucces = {
      'status' : 'success',
      'data' : {
         'parametresAppel': {
            'codePermanent': 'ZZZZ10559309',
            'codeProgramme': '7111',
            'trimestre': '20153',
            'transactions': [
               {
                  'codeTransaction': 'annuler',
                  'sigle': 'INF0326',
                  'groupe': '64',
                  'sigleAnc': '',
                  'groupeAnc': '',
                  'rangCours': '',
                  'typeCours': '',
                  'noteAnnulation': ''
               }
            ]
         },
         'exigencesFrancais': [],
         'codeRetour': 'SUCCES',
         'messageSysteme': {},
         'messagesProgramme': [
            {
               'typeMsg': 'REM',
               'codeMsg': 'DIN',
               'texteMsg': '!!! Message introuvé dans REG_INSC_MESSAGE !!! Message temporaire: L\'etud. tente de faire une double inscript. (DIN)',
               'transgression': 'NON'
            }
         ],
         'transactions': [
            {
               'codeTransaction': 'annuler',
               'sigle': 'INF0326',
               'titre': 'Outils de bureautique et Internet (hors programme)',
               'groupe': '64',
               'sigleAnc': '',
               'titreAnc': '',
               'groupeAnc': '',
               'codeRetour': 'SUCCES',
               'messages': []
            }
         ],
         'coursInscrits': [],
         'coursAnnules': [],
      }
   };

   var annulerEchec = {
      'status' : 'success',
      'data' : {
        'parametresAppel': {
          'codePermanent': 'ZZZZ14578105',
          'codeProgramme': '4634',
          'trimestre': '20151',
          'transactions': [
            {
              'codeTransaction': 'annuler',
              'sigle': 'LIN1002',
              'groupe': '20',
              'sigleAnc': '',
              'groupeAnc': '',
              'rangCours': '',
              'typeCours': '',
              'noteAnnulation': ''
            }
          ]
        },
        'exigencesFrancais': [],
        'codeRetour': 'SUCCES',
        'messageSysteme': {},
        'messagesProgramme': [
          {
            'typeMsg': 'REM',
            'codeMsg': 'FPN',
            'texteMsg': 'Selon le nombre de crédits accumulés, vous êtes en voie de terminer votre programme.',
            'transgression': 'NON'
          }
        ],
        'transactions': [
          {
            'codeTransaction': 'annuler',
            'sigle': 'LIN1002',
            'titre': 'Connaissances de base en grammaire du français écrit (hors programme)',
            'groupe': '20',
            'sigleAnc': '',
            'titreAnc': '',
            'groupeAnc': '',
            'codeRetour': 'ECHEC',
            'messages': [
              {
                'typeMsg': 'REJ',
                'codeMsg': 'MAE',
                'texteMsg': 'La date limite de la période d\'annulation des cours est expirée.',
                'transgression': 'NON'
              }
            ]
          }
        ],
        'coursInscrits': [
          {
            'sigle': 'FFM3500',
            'titre': 'Stage en milieux de garde (0 - 5 ans)',
            'credit': '5',
            'groupe': '41',
            'sousSession': '',
            'statutInscription': 'OUVERT_A_TOUS',
            'transgressionPermise': 'OUI',
            'codeProgramme': '4634',
            'historiqueAjout': ''
          },
          {
            'sigle': 'KIN2350',
            'titre': 'L\'hygiène et la santé du jeune enfant',
            'credit': '3',
            'groupe': '1',
            'sousSession': '',
            'statutInscription': 'OUVERT_A_TOUS',
            'transgressionPermise': 'OUI',
            'codeProgramme': '4634',
            'historiqueAjout': ''
          }
        ],
        'coursAnnules': [
          {
            'sigle': 'FFM3501',
            'titre': 'Stage en milieux de garde (0 - 5 ans)',
            'credit': '3',
            'groupe': '1',
            'note': 'AX',
            'codeProgramme': '4634',
            'historiqueAjout': '',
            'historiqueAnnul': 'Annulation par l\'étudiant avec remboursement'
          }
        ]
      }
   };

   var abandonnerSucces = {
      'status' : 'success',
      'data' : {
         'parametresAppel': {
            'codePermanent': 'ZZZZ10559309',
            'codeProgramme': '7111',
            'trimestre': '20153',
            'transactions': [
               {
                  'codeTransaction': 'abandonner',
                  'sigle': 'INF0326',
                  'groupe': '64',
                  'sigleAnc': '',
                  'groupeAnc': '',
                  'rangCours': '',
                  'typeCours': '',
                  'noteAnnulation': ''
               }
            ]
         },
         'exigencesFrancais': [],
         'codeRetour': 'SUCCES',
         'messageSysteme': {},
         'messagesProgramme': [
            {
               'typeMsg': 'REM',
               'codeMsg': 'DIN',
               'texteMsg': '!!! Message introuvé dans REG_INSC_MESSAGE !!! Message temporaire: L\'etud. tente de faire une double inscript. (DIN)',
               'transgression': 'NON'
            }
         ],
         'transactions': [
            {
               'codeTransaction': 'abandonner',
               'sigle': 'INF0326',
               'titre': 'Outils de bureautique et Internet (hors programme)',
               'groupe': '64',
               'sigleAnc': '',
               'titreAnc': '',
               'groupeAnc': '',
               'codeRetour': 'SUCCES',
               'messages': []
            }
         ],
         'coursInscrits': [],
         'coursAnnules': [],
         'heureMontreal': '20151127 09:16:48',
         '$promise': {},
         '$resolved': true
      }
   };

   var traiteEchecMessageSysteme = {
      'status' :'success',
      'data' : {
         'parametresAppel': {
            'codePermanent': 'ZZZZ01010106',
            'codeProgramme': '7872',
            'trimestre': '20153',
            'transactions': [
               {
                  'codeTransaction': 'annuler',
                  'sigle': 'LIN1002',
                  'groupe': '20',
                  'sigleAnc': '',
                  'groupeAnc': '',
                  'rangCours': '',
                  'typeCours': '',
                  'noteAnnulation': ''
               }
            ]
         },
         'exigencesFrancais': [],
         'codeRetour': 'ECHEC',
         'annulationPermise': 'NON',
         'messageSysteme': {
            'typeMsg': 'REJ',
            'codeMsg': 'SV9',
            'texteMsg': 'L\'inscription en ligne n\'est pas disponible présentement.  Une maintenance est en cours ou vous êtes en dehors des heures d\'ouverture. Les heures d\'ouverture sont du lundi au samedi, de 6h00 à 22h00.',
            'transgression': 'NON'
         },
         'messagesProgramme': [],
         'coursInscrits': [
            {
               'sigle': 'LIN1002',
               'titre': 'Connaissances de base en grammaire du français écrit (hors programme)',
               'credit': '3',
               'groupe': '20',
               'sousSession': '',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'codeProgramme': '7872',
               'historiqueAjout': ''
            }
         ],
         'coursAnnules': [],
         'heureMontreal': '20151127 10:30:52',
         '$promise': {},
         '$resolved': true
      }
   };

   var traiteEchecSansMessage = {
      'status' :'success',
      'data' : {
         'parametresAppel': {
            'codePermanent': 'ZZZZ01010106',
            'codeProgramme': '7872',
            'trimestre': '20153',
            'transactions': [
               {
                  'codeTransaction': 'annuler',
                  'sigle': 'LIN1002',
                  'groupe': '20',
                  'sigleAnc': '',
                  'groupeAnc': '',
                  'rangCours': '',
                  'typeCours': '',
                  'noteAnnulation': ''
               }
            ]
         },
         'exigencesFrancais': [],
         'codeRetour': 'ECHEC',
         'annulationPermise': 'NON',
         'messageSysteme': {},
         'messagesProgramme': [],
         'coursInscrits': [],
         'coursAnnules': [],
         'heureMontreal': '20151127 10:30:52',
         '$promise': {},
         '$resolved': true
      }
   };

   var traiteEchecMessageProg = {
      'status' :'success',
      'data' : {
         'parametresAppel': {
            'codePermanent': 'ZZZZ01010106',
            'codeProgramme': '7872',
            'trimestre': '20153',
            'transactions': [
               {
                  'codeTransaction': 'annuler',
                  'sigle': 'LIN1002',
                  'groupe': '20',
                  'sigleAnc': '',
                  'groupeAnc': '',
                  'rangCours': '',
                  'typeCours': '',
                  'noteAnnulation': ''
               }
            ]
         },
         'exigencesFrancais': [],
         'codeRetour': 'ECHEC',
         'annulationPermise': 'NON',
         'messageSysteme': {},
         'messagesProgramme': [{'texteMsg':'message traiteEchecMessageProg'}],
         'coursInscrits': [],
         'coursAnnules': [],
         'heureMontreal': '20151127 10:30:52',
         '$promise': {},
         '$resolved': true
      }
   };

   var testErreur = {
      'status': 'error',
      'message': 'Erreur fatale dans le service.'
   };

   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
    */
   beforeEach(module('pelApp'));

   beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, _$timeout_) {
      scope = $rootScope.$new();
      rootScope = $rootScope;
      backendMock = _$httpBackend_;
      inscriptionCtrl = $controller('InscriptionCtrl', {
         $scope: scope,
         $routeParams: routeParams
      });

      backendMock.when('GET','app/main/main.html').respond({'status':'err'});

   }));

   /////////////////////////////////////////////////////////////////////////////
   /*
    * Effectuer et évaluer les TESTS.
    */

   it('InscriptionCtrl devrait être défini', function() {
      expect(inscriptionCtrl).toBeDefined();
      expect(scope).toBeTruthy();
      backendMock.verifyNoOutstandingRequest();
   });

   it('devrait appeler validerInscription lors du chargement de la page de l\'inscription.(insciption).', function() {
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond(testInscription);
      backendMock.flush();
      expect(scope.programmeCourant.code_prog).toBe('7111');
      expect(scope.trimestreCourant.an_ses_num).toBe('20153');
      expect(scope.decisionProg.isInscriptionNonPermise).toBe(false);
   });

   it('devrait appeler validerInscription lors du chargement avec erreur fatale.(insciption).', function() {
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond(testErreur);
      backendMock.flush();
      expect(scope.err).toContain('Une erreur est survenue');
   });

   it(' appel de getDate ', function() {
      expect(scope.getDate('2015-12-22')).toBe('22 déc. 2015');
   });

   it(' appel de isMsgOfTypeForTab et isAjoutPermis  ', function() {
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond(testInscription);
      backendMock.flush();
      expect(scope.isMsgOfTypeForTab(scope.decisionProg.tableauMessages, 'REM')).toBe(true);
      expect(scope.isMsgOfTypeForTab(scope.decisionProg.tableauMessages, 'REJ')).toBe(false);
      expect(scope.isAjoutPermis()).toBe(true);
   });

   it(' appel de creditsInscrits    ', function() {
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond(testInscription);
      backendMock.flush();
      expect(scope.creditsInscrits()).toBe(9);
   });

   it(' appel de effacerActionEtmode    ', function() {
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond(testInscription);
      backendMock.flush();
      expect(scope.effacerActionEtmode()).toBe(undefined);
   });

   it(' appel de ajusterEdition    ', function() {
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond(testInscription);
      backendMock.flush();
      expect(scope.ajusterEdition(scope.coursInscrits[0], 'remplacer')).toBe(undefined);
   });

   it(' appel de ajusterEdition  avec cours.edtidorRef  ', function() {
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond(testInscription);
      scope.coursInscrits = [];
      var cours = {
         'action' : 'remplacer',
         'edtidorRef': {
            'init' : function(){console.log('x');}
         }
      };
      scope.ajusterEdition(cours, 'remplacer');
      backendMock.flush();
      expect(cours.mode).toBe('edition');
   });


   /*********************************** traiterInscription /***********************************/

   it('Ajouter un cours avec le codeRetour SUCCES, transac. SUCCES.', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/7111/20153/ajouter/INF0326/64/%20/%20').respond(ajouterSucces);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête.
      scope.programmeCourant= {'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};

      // Appel de traiterInscription
      scope.traiterInscription('ajouter', 'INF0326', '64', ' ', ' ');
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(rootScope.dlog.content[0].titre).toBe('INF0326 | opération réussie');

   });

   it('Ajouter un cours avec le codeRetour SUCCES, transac. Echec.', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/7111/20153/ajouter/PSY5000/20/%20/%20').respond(ajouterEchec);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête.
      scope.programmeCourant= {'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};

      // Appel de traiterInscription
      scope.traiterInscription('ajouter', 'PSY5000', '20', ' ', ' ');
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(rootScope.dlog.content[0].titre).toBe('PSY5000 | opération échouée');

   });

   it('Remplacer un cours avec le codeRetour SUCCES, transac. SUCCES.', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/7111/20153/remplacer/LIN1002/2/INF0326/64').respond(remplacerSucces);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête. Voir $routeParams
      scope.programmeCourant= {'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};

      // Appel de traiterInscription
      scope.traiterInscription('remplacer', 'LIN1002', '2', 'INF0326', '64');
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(rootScope.dlog.content[0].titre).toBe('INF0326 | opération réussie');

   });

   it('Remplacer un cours avec le codeRetour SUCCES, transac. ECHEC.', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/7111/20161/remplacer/LIN1002/20/INF0326/10').respond(remplacerEchec);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête. Voir $routeParams
      scope.programmeCourant= {'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20161'};

      // Appel de traiterInscription
      scope.traiterInscription('remplacer', 'LIN1002', '20', 'INF0326', '10');
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(rootScope.dlog.content[0].titre).toBe('LIN1002 | opération échouée');

   });

   it('Modifier le groupe d\'un cours avec le codeRetour SUCCES, transac. SUCCES.', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/7111/20153/modifier/LIN1009/21/LIN1009/20').respond(modifierGroupeSucces);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête. Voir $routeParams
      scope.programmeCourant= {'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};

      // Appel de traiterInscription
      scope.traiterInscription('modifier', 'LIN1009', '21', 'LIN1009', '20');
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(rootScope.dlog.content[0].titre).toBe('LIN1009 | opération réussie');

   });

   it('Modifier le groupe d\'un cours avec le codeRetour SUCCES, transac. Echec.', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/7111/20153/modifier/LIN1009/20/LIN1009/20').respond(modifierGroupeEchec);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête. Voir $routeParams
      scope.programmeCourant= {'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};

      // Appel de traiterInscription
      scope.traiterInscription('modifier', 'LIN1009', '20', 'LIN1009', '20');
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(rootScope.dlog.content[0].titre).toBe('LIN1009 | opération échouée');

   });


   /* Annuler et abandonner */

   it('Annuler un cours avec le codeRetour SUCCES, transac. SUCCES.', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/7111/20153/annuler/INF0326/64/%20/%20').respond(annulerSucces);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête. Voir $routeParams
      scope.programmeCourant= {'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};

      // params pour anAbAction
      var cours = {
         'action' :'annuler',
         'sigle' : 'INF0326',
         'groupe' : '64'
      };

      // Appel de traiterInscription
      scope.anAbAction(cours);
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(rootScope.dlog.content[0].titre).toBe('INF0326 | opération réussie');

   });

   it('Annuler un cours avec le codeRetour SUCCES, transac. SUCCES.', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/4634/20151/annuler/LIN1002/20/%20/%20').respond(annulerEchec);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête. Voir $routeParams
      scope.programmeCourant= {'code_prog':'4634'};
      scope.trimestreCourant= {'an_ses_num':'20151'};

      // params pour anAbAction
      var cours = {
         'action' :'annuler',
         'sigle' : 'LIN1002',
         'groupe' : '20'
      };

      // Appel de traiterInscription
      scope.anAbAction(cours);
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(rootScope.dlog.content[0].titre).toBe('LIN1002 | opération échouée');

   });

   it('Abandonner un cours avec le codeRetour SUCCES, transac. SUCCES.', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/7111/20153/annuler/INF0326/64/%20/%20').respond(abandonnerSucces);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête. Voir $routeParams
      scope.programmeCourant= {'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};

      // params pour anAbAction
      var cours = {
         'action' :'abandonner',
         'sigle' : 'INF0326',
         'groupe' : '64'
      };

      // Appel de traiterInscription
      scope.anAbAction(cours);
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(rootScope.dlog.content[0].titre).toBe('INF0326 | opération réussie');

   });


   /* code de retour ECHEC */

   it('Annuler un cours avec le codeRetour ECHEC, avce messageSysteme.', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/7872/20153/annuler/LIN1002/20/%20/%20').respond(traiteEchecMessageSysteme);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête. Voir $routeParams
      scope.programmeCourant= {'code_prog':'7872'};
      scope.trimestreCourant= {'an_ses_num':'20153'};

      // params pour anAbAction
      var cours = {
         'action' :'annuler',
         'sigle' : 'LIN1002',
         'groupe' : '20'
      };

      // Appel de traiterInscription
      scope.anAbAction(cours);
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(rootScope.dlog.content[0].titre).toBe('Attention');

   });

   it('Annuler un cours avec le codeRetour ECHEC, avec message programme.', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/7872/20153/annuler/LIN1002/20/%20/%20').respond(traiteEchecMessageProg);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête. Voir $routeParams
      scope.programmeCourant= {'code_prog':'7872'};
      scope.trimestreCourant= {'an_ses_num':'20153'};

      // params pour anAbAction
      var cours = {
         'action' :'annuler',
         'sigle' : 'LIN1002',
         'groupe' : '20'
      };

      // Appel de traiterInscription
      scope.anAbAction(cours);
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(rootScope.dlog.content[0].titre).toBe('Attention');

   });

   it('Annuler un cours avec le codeRetour ECHEC, sans message.(devrait jamais arriver)', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/7872/20153/annuler/LIN1002/20/%20/%20').respond(traiteEchecSansMessage);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête. Voir $routeParams
      scope.programmeCourant= {'code_prog':'7872'};
      scope.trimestreCourant= {'an_ses_num':'20153'};

      // params pour anAbAction
      var cours = {
         'action' :'annuler',
         'sigle' : 'LIN1002',
         'groupe' : '20'
      };

      // Appel de traiterInscription
      scope.anAbAction(cours);
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(rootScope.dlog.content[0].titre).toBe('Attention');

   });

   /* erreur fatale */

   it('Annuler un cours avec erreur fatale.', function() {
      // Pour l'appel pour l'inscription.
      backendMock.when('GET','/apis/traiteIns/identifiant/7872/20153/annuler/LIN1002/20/%20/%20').respond(testErreur);

      // Pour l'appel de validerInscription -> $route.reload().
      backendMock.when('GET','/apis/validationIns/identifiant/7111/20153/O').respond({});
      backendMock.flush();

      // param pour la requête. Voir $routeParams
      scope.programmeCourant= {'code_prog':'7872'};
      scope.trimestreCourant= {'an_ses_num':'20153'};

      // params pour anAbAction
      var cours = {
         'action' :'annuler',
         'sigle' : 'LIN1002',
         'groupe' : '20'
      };

      // Appel de traiterInscription
      scope.anAbAction(cours);
      backendMock.flush();

      // Vérifier le contenu de la boîte de dialogue.
      expect(scope.err).toContain('Une erreur est survenue');


   });


});

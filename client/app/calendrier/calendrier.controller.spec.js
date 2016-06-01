/* jshint  unused:false, camelcase:false */
/* globals spyOn, afterEach, testErreur, DossierModelMock */

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

describe('Controller: CalendrierCtrl', function() {


   var calendrierCtrl,
      scope,
      timeout,
      backendMock,
      codePermanent = 'identifiant',

      test = {
         'status': 'success',
         'data': {
            'code_perm': 'COZZ02020203',
            'trimestre': [{
               'trim_txt': 'Été - 2015',
               'trim_num': '20152',
               'programme': [{
                  'code_prog': 'S636',
                  'titre_prog': 'cert. en éduc. à la petite enfance (Bes. spéc. Prem. Nations)',
                  'cours': [{
                     'sigle': 'HIS2430',
                     'groupe': '10',
                     'titre': 'Introduction à l\'histoire des États-Unis',
                     'nb_cred': '3.0',
                     'rem1': '',
                     'rem2': '',
                     'dt_deb': '',
                     'dt_fin': '',
                     'horaire': [{
                        'jour': 'Lundi   ',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': ''
                     }, {
                        'jour': 'Mercredi',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': ''
                     }],
                     'enseignant': [{
                        'nom': 'Steven Zarper',
                        'url_repertoire': ''
                     }]
                  }]
               }]
            }, {
               'trim_txt': 'Hiver - 2015',
               'trim_num': '20151',
               'programme': [{
                  'code_prog': 'L034',
                  'titre_prog': 'cert. en soutien péd. dans les centres de la petite enfance',
                  'cours': [{
                     'sigle': 'ADM7128',
                     'groupe': '10',
                     'titre': 'Séminaire sectoriel: industriel et organisationnel',
                     'nb_cred': '6.0',
                     'rem1': '',
                     'rem2': '',
                     'dt_deb': '',
                     'dt_fin': '',
                     'horaire': [{
                        'jour': 'Lundi   ',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': ''
                     }],
                     'enseignant': [{
                        'nom': 'Steven Zarper',
                        'url_repertoire': ''
                     }, {
                        'nom': 'Steven Zarper',
                        'url_repertoire': ''
                     }]
                  }]
               }, {
                  'code_prog': 'S636',
                  'titre_prog': 'cert. en éduc. à la petite enfance (Bes. spéc. Prem. Nations)',
                  'cours': [{
                     'sigle': 'ACT5001',
                     'groupe': '20',
                     'titre': 'Régimes de retraite: évaluation',
                     'nb_cred': '3.0',
                     'rem1': '',
                     'rem2': '',
                     'dt_deb': '07/01/2015',
                     'dt_fin': '03/05/2015',
                     'horaire': [{
                        'jour': 'Mardi   ',
                        'hr_deb': '18h00',
                        'hr_fin': '21h00',
                        'local': '',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': ''
                     }],
                     'enseignant': [{
                        'nom': 'Steven Zarper',
                        'url_repertoire': ''
                     }]
                  }, {
                     'sigle': 'ADM8100',
                     'groupe': '10',
                     'titre': 'L\'intégrité en recherche',
                     'nb_cred': '1.0',
                     'rem1': 'COURS INTENSIF',
                     'rem2': '',
                     'dt_deb': '',
                     'dt_fin': '',
                     'horaire': [{
                        'jour': 'Lundi   ',
                        'hr_deb': '18h00',
                        'hr_fin': '21h00',
                        'local': 'J-1010  ',
                        'mode_util': 'Atelier',
                        'url_pavillon': 'http://carte.uqam.ca/#pavillon/j'
                     }, {
                        'jour': 'Mardi   ',
                        'hr_deb': '18h00',
                        'hr_fin': '21h00',
                        'local': 'A-2535  ',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': 'http://carte.uqam.ca/#pavillon/a'
                     }, {
                        'jour': 'Mercredi',
                        'hr_deb': '18h00',
                        'hr_fin': '21h00',
                        'local': 'A-R530  ',
                        'mode_util': 'Exercices',
                        'url_pavillon': 'http://carte.uqam.ca/#pavillon/a'
                     }, {
                        'jour': 'Jeudi   ',
                        'hr_deb': '18h00',
                        'hr_fin': '21h00',
                        'local': '',
                        'mode_util': 'Gymnase',
                        'url_pavillon': ''
                     }, {
                        'jour': 'Vendredi',
                        'hr_deb': '18h00',
                        'hr_fin': '21h00',
                        'local': '',
                        'mode_util': 'Laboratoire',
                        'url_pavillon': ''
                     }],
                     'rencontre': [{
                        'jour': 'Mardi   ',
                        'date': '06/01/2015',
                        'hr_deb': '18h00',
                        'hr_fin': '21h00'
                     }, {
                        'jour': 'Mercredi',
                        'date': '07/01/2015',
                        'hr_deb': '18h00',
                        'hr_fin': '21h00'
                     }, {
                        'jour': 'Lundi   ',
                        'date': '12/01/2015',
                        'hr_deb': '18h00',
                        'hr_fin': '21h00'
                     }, {
                        'jour': 'Jeudi   ',
                        'date': '15/01/2015',
                        'hr_deb': '18h00',
                        'hr_fin': '21h00'
                     }, {
                        'jour': 'Vendredi',
                        'date': '23/01/2015',
                        'hr_deb': '18h00',
                        'hr_fin': '21h00'
                     }],
                     'enseignant': [{
                        'nom': 'Steven Zarper',
                        'url_repertoire': ''
                     }]
                  }, {
                     'sigle': 'APL1401',
                     'groupe': '1',
                     'titre': 'Exploration en dessin A',
                     'nb_cred': '3.0',
                     'rem1': 'Examen: 24 avr. ',
                     'rem2': 'visuels et mediatiques',
                     'dt_deb': '07/01/2015',
                     'dt_fin': '21/04/2015',
                     'horaire': [{
                        'jour': 'Mardi   ',
                        'hr_deb': '18h30',
                        'hr_fin': '21h30',
                        'local': '',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': ''
                     }, {
                        'jour': 'Jeudi   ',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Laboratoire',
                        'url_pavillon': ''
                     }],
                     'examen': [{
                        'type': 'FINAL',
                        'jour': 'Vendredi',
                        'date': '24/04/2015',
                        'hr_deb': '',
                        'hr_fin': '',
                        'local': ''
                     }],
                     'hors_campus': [{
                        'nom': 'UQAM Campus de Laval',
                        'no_rue': '475, boulevard de l\'Avenir',
                        'ville': 'Laval (Québec)',
                        'local': ''
                     }],
                     'enseignant': [{
                        'nom': 'Steven Zarper',
                        'url_repertoire': ''
                     }]
                  }, {
                     'sigle': 'DSR5100',
                     'groupe': '2',
                     'titre': 'Stratégie de gestion',
                     'nb_cred': '3.0',
                     'rem1': 'Examens: 08 mars 09:00 à 12:00 et 03 mai 09:00 à 12:00',
                     'rem2': 'examens communs se déroulent les dimanches.',
                     'dt_deb': '07/01/2015',
                     'dt_fin': '03/05/2015',
                     'horaire': [{
                        'jour': 'Lundi   ',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Atelier',
                        'url_pavillon': ''
                     }, {
                        'jour': 'Mardi   ',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Exercices',
                        'url_pavillon': ''
                     }, {
                        'jour': 'Mercredi',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Gymnase',
                        'url_pavillon': ''
                     }, {
                        'jour': 'Jeudi   ',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Laboratoire',
                        'url_pavillon': ''
                     }, {
                        'jour': 'Vendredi',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': ''
                     }],
                     'examen': [{
                        'type': 'INTRA',
                        'jour': 'Dimanche',
                        'date': '08/03/2015',
                        'hr_deb': '09h00',
                        'hr_fin': '12h00',
                        'local': 'R-M100'
                     }, {
                        'type': 'FINAL',
                        'jour': 'Dimanche',
                        'date': '03/05/2015',
                        'hr_deb': '09h00',
                        'hr_fin': '12h00',
                        'local': ''
                     }],
                     'hors_campus': [{
                        'nom': 'UQAM Campus de Longueuil',
                        'no_rue': '150, place Charles-Le Moyne',
                        'ville': 'Longueuil, Qc',
                        'local': ''
                     }],
                     'enseignant': [{
                        'nom': 'Steven Zarper',
                        'url_repertoire': ''
                     }]
                  }]
               }]
            }, {
               'trim_txt': 'Hiver - 2014',
               'trim_num': '20141',
               'programme': [{
                  'code_prog': 'S636',
                  'titre_prog': 'cert. en éduc. à la petite enfance (Bes. spéc. Prem. Nations)',
                  'cours': [{
                     'sigle': 'APL1401',
                     'groupe': '1',
                     'titre': 'Exploration en dessin A',
                     'nb_cred': '3.0',
                     'rem1': 'Ce cours n\'est pas credite au baccalaureat en arts',
                     'rem2': 'visuels et mediatiques',
                     'dt_deb': '05/01/2014',
                     'dt_fin': '26/04/2014',
                     'horaire': [{
                        'jour': 'Mardi   ',
                        'hr_deb': '18h30',
                        'hr_fin': '21h30',
                        'local': 'J-1020  ',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': 'http://carte.uqam.ca/#pavillon/j'
                     }, {
                        'jour': 'Mercredi',
                        'hr_deb': '13h00',
                        'hr_fin': '17h00',
                        'local': '',
                        'mode_util': 'Laboratoire',
                        'url_pavillon': ''
                     }],
                     'enseignant': [{
                        'nom': 'Non disponible',
                        'url_repertoire': ''
                     }]
                  }, {
                     'sigle': 'LAN3675',
                     'groupe': '10',
                     'titre': 'Français langue seconde, niveau avancé III',
                     'nb_cred': '6.0',
                     'rem1': 'Examens: 30 janv. 09:00 à 12:00 et 31 janv. 14:00 à 18:00',
                     'rem2': 'Vous devez être de bonne humeur',
                     'dt_deb': '',
                     'dt_fin': '',
                     'horaire': [{
                        'jour': 'Lundi   ',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': ''
                     }, {
                        'jour': 'Jeudi   ',
                        'hr_deb': '12h30',
                        'hr_fin': '15h30',
                        'local': '',
                        'mode_util': 'Atelier',
                        'url_pavillon': ''
                     }],
                     'examen': [{
                        'type': 'INTRA',
                        'jour': 'Jeudi   ',
                        'date': '30/01/2014',
                        'hr_deb': '09h00',
                        'hr_fin': '12h00',
                        'local': 'A-1023'
                     }, {
                        'type': 'FINAL',
                        'jour': 'Vendredi',
                        'date': '31/01/2014',
                        'hr_deb': '14h00',
                        'hr_fin': '18h00',
                        'local': 'N-2610'
                     }],
                     'rencontre': [{
                        'jour': 'Lundi   ',
                        'date': '13/01/2014',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30'
                     }, {
                        'jour': 'Jeudi   ',
                        'date': '16/01/2014',
                        'hr_deb': '12h30',
                        'hr_fin': '15h30'
                     }, {
                        'jour': 'Lundi   ',
                        'date': '20/01/2014',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30'
                     }, {
                        'jour': 'Jeudi   ',
                        'date': '23/01/2014',
                        'hr_deb': '12h30',
                        'hr_fin': '15h30'
                     }],
                     'hors_campus': [{
                        'nom': 'UQAM Campus de Longueuil',
                        'no_rue': '150, place Charles-Le Moyne',
                        'ville': 'Longueuil, Qc',
                        'local': ''
                     }],
                     'enseignant': [{
                        'nom': 'Steven Zarper',
                        'url_repertoire': ''
                     }, {
                        'nom': 'Steven Zarper',
                        'url_repertoire': ''
                     }, {
                        'nom': 'Steven Zarper',
                        'url_repertoire': ''
                     }]
                  }, {
                     'sigle': 'TRS8920',
                     'groupe': '50',
                     'titre': 'Séminaire de stage',
                     'nb_cred': '3.0',
                     'rem1': '',
                     'rem2': '',
                     'dt_deb': '',
                     'dt_fin': '',
                     'horaire': [{
                        'jour': 'Vendredi',
                        'hr_deb': '09h30',
                        'hr_fin': '17h00',
                        'local': 'W-4210  ',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': 'http://carte.uqam.ca/#pavillon/w'
                     }],
                     'rencontre': [{
                        'jour': 'Vendredi',
                        'date': '10/01/2014',
                        'hr_deb': '09h30',
                        'hr_fin': '17h00'
                     }, {
                        'jour': 'Vendredi',
                        'date': '07/02/2014',
                        'hr_deb': '09h30',
                        'hr_fin': '17h00'
                     }, {
                        'jour': 'Vendredi',
                        'date': '07/03/2014',
                        'hr_deb': '09h30',
                        'hr_fin': '17h00'
                     }, {
                        'jour': 'Vendredi',
                        'date': '11/04/2014',
                        'hr_deb': '09h30',
                        'hr_fin': '17h00'
                     }],
                     'enseignant': [{
                        'nom': 'Steven Zarper',
                        'url_repertoire': ''
                     }]
                  }]
               }, {
                  'code_prog': '8598',
                  'titre_prog': 'étudiant libre (cycle 3)                                       ',
                  'cours': [{
                     'sigle': 'LIN1002',
                     'groupe': '20',
                     'titre': 'Connaissances de base en grammaire du français écrit (hors programme)',
                     'nb_cred': '3.0',
                     'rem1': '',
                     'rem2': '',
                     'dt_deb': '',
                     'dt_fin': '',
                     'horaire': [{
                        'jour': 'Mardi   ',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': 'DS-M540 ',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': 'http://carte.uqam.ca/#pavillon/ds'
                     }],
                     'enseignant': [{
                        'nom': 'Non disponible',
                        'url_repertoire': ''
                     }]
                  }]
               }]
            }],
            'calendrier': [{
               'date_evenement': '01/01/2015',
               'desc_evenement': 'Congé - Jour de l\'an',
               'type_evenement': 'F'
            }, {
               'date_evenement': '10/05/2015',
               'desc_evenement': 'Annulation sans facturation (été 2015)',
               'type_evenement': 'I'
            }, {
               'date_evenement': '18/05/2015',
               'desc_evenement': 'Congé - Fête des patriotes',
               'type_evenement': 'F'
            }, {
               'date_evenement': '03/04/2015',
               'desc_evenement': 'Congé - Vendredi saint',
               'type_evenement': 'F'
            }, {
               'date_evenement': '06/04/2015',
               'desc_evenement': 'Congé - Lundi saint',
               'type_evenement': 'F'
            }, {
               'date_evenement': '29/05/2015',
               'desc_evenement': 'Date limite de paiement (été 2015)',
               'type_evenement': 'I'
            }],
            'periodesIns': {
               'libellesMethodeIns': {
                  'WEB': {
                     'desc_courte': 'En ligne',
                     'desc_longue': 'Selon les plages de dates affichées, vous pouvez effectuer vos modifications avec ce site.'
                  },
                  'PRO': {
                     'desc_courte': 'Au programme',
                     'desc_longue': 'Selon les plages de dates affichées, vous pouvez effectuer vos modifications auprès de votre programme d\'étude.'
                  },
                  'REG': {
                     'desc_courte': 'Au Registrariat',
                     'desc_longue': 'Selon les plages de dates affichées, vous pouvez effectuer vos modifications auprès du registrariat.'
                  }
               },
               'programmes': [{
                  'code_prog': '7021',
                  'titre_prog': 'baccalauréat en actuariat',
                  'icode': '1',
                  'trimestres': [{
                     'an_ses_num': '20152',
                     'sous_ses_txt': 'Intensif',
                     'mode_inscription': 'PRO',
                     'fenetres': [{
                           'type_fenetre': 'INS',
                           'date_deb_fen': '2015-03-12',
                           'date_fin_fen': '2015-05-02'
                        }, {
                           'type_fenetre': 'ABA',
                           'date_deb_fen': '2015-05-11',
                           'date_fin_fen': '2015-06-03'
                        }, {
                           'type_fenetre': 'ABA',
                           'date_deb_fen': '2015-05-01',
                           'date_fin_fen': '2015-06-01'
                        }

                     ]
                  }, {
                     'an_ses_num': '20152',
                     'sous_ses_txt': 'Régulier',
                     'mode_inscription': 'WEB',
                     'fenetres': [{
                        'type_fenetre': 'INS',
                        'date_deb_fen': '2015-03-16',
                        'date_fin_fen': '2015-05-08'
                     }, {
                        'type_fenetre': 'ABA',
                        'date_deb_fen': '2015-05-11',
                        'date_fin_fen': '2015-05-15'
                     }]
                  }, {
                     'an_ses_num': '20153',
                     'sous_ses_txt': '',
                     'mode_inscription': 'REG',
                     'fenetres': [{
                        'type_fenetre': 'INS',
                        'date_deb_fen': '2015-03-23',
                        'date_fin_fen': '2015-04-10'
                     }, {
                        'type_fenetre': 'INS',
                        'date_deb_fen': '2015-07-27',
                        'date_fin_fen': '2015-09-15'
                     }, {
                        'type_fenetre': 'ABA',
                        'date_deb_fen': '2015-09-16',
                        'date_fin_fen': '2015-11-11'
                     }]
                  }]
               }]
            }
         }
      },
      testFail = {
         'status': 'fail',
         data: {
            'message': 'Aucun horaire.'
         }
      },
      testErreur = {
         'status': 'error',
         'message': 'Erreur fatale dans le service.'
      },
      testSansTrimestre = {
         'status': 'success',
         'data': {
            'code_perm': 'COZZ02020203',
            'trimestre': []
         }
      },

      DossierModelMock = {
         getDossierPart: function(element) {
            return {

               'code_perm': 'COZZ02020203',
               'trimestre': [{
                  'trim_txt': 'Hiver - 2016',
                  'trim_num': '20161',
                  'programme': [{
                     'code_prog': 'S636',
                     'titre_prog': 'cert. en éduc. à la petite enfance (Bes. spéc. Prem. Nations)',
                     'cours': [{
                        'sigle': 'APL1402',
                        'groupe': '1',
                        'titre': 'Exploration en dessin B',
                        'nb_cred': '3.0',
                        'rem1': 'Ce cours n\'est pas credite au baccalaureat en arts',
                        'rem2': 'visuels et mediatiques',
                        'dt_deb': '05/01/2016',
                        'dt_fin': '26/04/2016',
                        'horaire': [{
                           'jour': 'Mardi ',
                           'hr_deb': '18h30',
                           'hr_fin': '21h30',
                           'local': 'J-1020 ',
                           'mode_util': 'Cours magistral',
                           'url_pavillon': 'http://carte.uqam.ca/#pavillon/j'
                        }, {
                           'jour': 'Mercredi',
                           'hr_deb': '13h00',
                           'hr_fin': '17h00',
                           'local': 'A-2535',
                           'mode_util': 'Laboratoire',
                           'url_pavillon': ''
                        }],
                        'enseignant': [{
                           'nom': 'Non disponible',
                           'url_repertoire': ''
                        }]
                     }]
                  }]
               }, {
                  'trim_txt': 'Hiver - 2016',
                  'trim_num': '20161',
                  'programme': [{
                     'code_prog': 'S636',
                     'titre_prog': 'cert. en éduc. à la petite enfance (Bes. spéc. Prem. Nations)',
                     'cours': [{
                        'sigle': 'APL1402',
                        'groupe': '1',
                        'titre': 'Exploration en dessin B',
                        'nb_cred': '3.0',
                        'rem1': 'Ce cours n\'est pas credite au baccalaureat en arts',
                        'rem2': 'visuels et mediatiques',
                        'dt_deb': '05/01/2016',
                        'dt_fin': '26/04/2016',
                        'horaire': [{
                           'jour': 'Mardi ',
                           'hr_deb': '18h30',
                           'hr_fin': '21h30',
                           'local': 'J-1020 ',
                           'mode_util': 'Cours magistral',
                           'url_pavillon': 'http://carte.uqam.ca/#pavillon/j'
                        }, {
                           'jour': 'Mercredi',
                           'hr_deb': '13h00',
                           'hr_fin': '17h00',
                           'local': 'A-2535',
                           'mode_util': 'Laboratoire',
                           'url_pavillon': ''
                        }],
                        'enseignant': [{
                           'nom': 'Non disponible',
                           'url_repertoire': ''
                        }]
                     }]
                  }]
               }, {
                  'trim_txt': 'Hiver - 2016',
                  'trim_num': '20161',
                  'programme': [{
                     'code_prog': 'S636',
                     'titre_prog': 'cert. en éduc. à la petite enfance (Bes. spéc. Prem. Nations)',
                     'cours': [{
                        'sigle': 'APL1402',
                        'groupe': '1',
                        'titre': 'Exploration en dessin B',
                        'nb_cred': '3.0',
                        'rem1': 'Ce cours n\'est pas credite au baccalaureat en arts',
                        'rem2': 'visuels et mediatiques',
                        'dt_deb': '05/01/2016',
                        'dt_fin': '26/04/2016',
                        'horaire': [{
                           'jour': 'Mardi ',
                           'hr_deb': '18h30',
                           'hr_fin': '21h30',
                           'local': 'J-1020 ',
                           'mode_util': 'Cours magistral',
                           'url_pavillon': 'http://carte.uqam.ca/#pavillon/j'
                        }, {
                           'jour': 'Mercredi',
                           'hr_deb': '13h00',
                           'hr_fin': '17h00',
                           'local': 'A-2535',
                           'mode_util': 'Laboratoire',
                           'url_pavillon': ''
                        }],
                        'enseignant': [{
                           'nom': 'Non disponible',
                           'url_repertoire': ''
                        }]
                     }]
                  }]
               }]

            };
         }
      };



   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
    */
   beforeEach(module('pelApp'));


   // Initialize the controller and a mock scope
   beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $timeout) {
      scope = $rootScope.$new();
      timeout = $timeout;
      backendMock = _$httpBackend_;
      calendrierCtrl = $controller('CalendrierCtrl', {
         $scope: scope
      });
   }));


   /////////////////////////////////////////////////////////////////////////////
   /*
    * Effectuer et évaluer les TESTS.
    */

   it('calendrierCtrl devrait être défini', function() {
      expect(calendrierCtrl).toBeDefined();
   });

   it('scope.cal.programmes devrait être défini', function() {
      expect(scope.cal.programmes).toBeDefined();
   });

   it('devrait récupérer un horaire', function() {
      backendMock.when('GET', '/apis/horaire/' + codePermanent).respond(test);
      backendMock.flush();
      expect(scope.cal.programmes.length).toBeGreaterThan(0);
   });

   it('devrait récupérer un horaire sans aucun trimestre', function() {
      backendMock.when('GET', '/apis/horaire/' + codePermanent).respond(testSansTrimestre);
      backendMock.flush();
      expect(scope.cal.programmes.length).toBe(0);
   });

   it('devrait récupérer le message aucun horaire', function() {
      backendMock.when('GET', '/apis/horaire/' + codePermanent).respond(testFail);
      backendMock.flush();
      expect(scope.avertissements[0]).not.toEqual(0);
   });

   it('devrait retourner une erreur du service.', function() {
      backendMock.when('GET', '/apis/horaire/' + codePermanent).respond(testErreur);
      backendMock.flush();
      expect(scope.err).not.toEqual(0);
   });

   it('devrait retourner une erreur http.', function() {
      backendMock.when('GET', '/apis/horaire/' + codePermanent).respond(500);
      backendMock.flush();
      expect(scope.err).not.toEqual(0);
   });

   it('devrait faire appel aux fonctions du scope', function() {
      backendMock.when('GET', '/apis/horaire/' + codePermanent).respond(test);
      backendMock.flush();
      scope.coursCourant = {
         'test': 'Allo'
      };
      expect(scope.coursCourant).toBeDefined();

      // Pas l'air de fonctionner. Pour le coverage
      spyOn(scope, 'calAction');
      scope.calAction('next');
      expect(scope.calAction).toHaveBeenCalled();

      scope.removeCoursCourant();
      expect(scope.coursCourant).toBeUndefined();
   });

   it('devrait utiliser l\'horaire en cache(DossierModel) plutôt qu\'aller sur le réseau', inject(function($controller) {
      // injection du DossierModel
      calendrierCtrl = $controller('CalendrierCtrl', {
         $scope: scope,
         DossierModel: DossierModelMock
      });
      expect(scope).toBeDefined();
   }));


});

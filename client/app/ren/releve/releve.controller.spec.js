/* jshint  unused:false, camelcase:false */
/* globals afterEach, testErreur, DossierModelMock */

'use strict';

describe('Controller: ReleveCtrl', function() {


   var releve,
      $timeout,
      APP,
      scope,
      backendMock,

      testCheminement = {
         'status': 'success',
         'data': {
            'code_perm': 'ZZZZ29568909',
            'programme': [{
               'code_prog': '7954',
               'titre_prog': 'baccalauréat en enseignement secondaire (mathématiques)',
               'code_ua': '0421',
               'nom_ua': 'Unité de programmes de 1er cycle en enseignement secondaire',
               'code_fac': '0400',
               'nom_fac': 'Faculté des sciences de l\'éducation',
               'cycle': '1',
               'grade': '',
               'nb_cred_prog': '120.0',
               'icode': '0',
               'stat_prog': 'ACTIF',
               'moy_acad': '2.45 / 4.3',
               'trim_fin_prevu': '',
               'nb_cred_crs': '33.0',
               'pct_cred_crs': '27.5',
               'nb_cred_reu': '69.0',
               'nb_cred_reu_tot': '69.0',
               'pct_cred_reu': '57.5',
               'nb_cred_pot': '102.0',
               'pct_cred_pot': '85.0',
               'nb_cred_res': '18.0',
               'pct_cred_res': '15.0',
               'mt_directeur': 'Steven Zarper',
               'mt_co_directeur': 'Steven Zarper',
               'mt_titre': 'Impact des programmes de mise à niveau sur la performance de la PME dans un environnement ouvert et intense : cas de l\'Algérie',
               'grille': {},
               'fenetre_autori': []
               }, {
               'code_prog': '9999',
               'titre_prog': 'étudiant libre (cycle 1)',
               'code_ua': '0912',
               'nom_ua': 'Étudiants libres et visiteurs ( premier cycle ) ',
               'code_fac': '0900',
               'nom_fac': 'Étudiants libres, visiteurs et autres',
               'cycle': '1',
               'grade': '',
               'nb_cred_prog': '30.0',
               'icode': '8',
               'stat_prog': 'INACTIF',
               'moy_acad': '3.20 / 4.3',
               'trim_fin_prevu': '',
               'nb_cred_crs': '0.0',
               'pct_cred_crs': '0.0',
               'nb_cred_reu': '15.0',
               'nb_cred_reu_tot': '15.0',
               'pct_cred_reu': '50.0',
               'nb_cred_pot': '15.0',
               'pct_cred_pot': '50.0',
               'nb_cred_res': '0.0',
               'pct_cred_res': '0.0',
               'grille': {},
               'fenetre_autori': []
               }, {
               'code_prog': '7021',
               'titre_prog': 'baccalauréat en actuariat',
               'code_ua': '0314',
               'nom_ua': 'Unité de programmes en mathématiques et en actuariat',
               'code_fac': '0300',
               'nom_fac': 'Faculté des sciences',
               'cycle': '1',
               'grade': '',
               'nb_cred_prog': '90.0',
               'icode': '9',
               'stat_prog': 'INACTIF',
               'moy_acad': '1.00 / 4.3',
               'trim_fin_prevu': '',
               'nb_cred_crs': '0.0',
               'pct_cred_crs': '0.0',
               'nb_cred_reu': '9.0',
               'nb_cred_reu_tot': '9.0',
               'pct_cred_reu': '10.0',
               'nb_cred_pot': '9.0',
               'pct_cred_pot': '10.0',
               'nb_cred_res': '0.0',
               'pct_cred_res': '0.0',
               'grille': {}
               }]
         }
      }, // testCheminement

      utilisateurA = {
         getUtilisateur: function() {
            return {
               'code_perm': 'ZZZZ29568909',
               'prenom': 'Qualité Deux',
               'nom': 'Contrôle',
               'adresse_l1': '0000 4E AV',
               'adresse_l2': 'MONTREAL H9Y 9W9',
               'adresse_l3': '',
               'tel_res': '(111) 111-1111',
               'tel_tra': '(514) 444-4444 Poste: 5555  ',
               'sexe': 'Masculin',
               'date_naiss': '2002-02-02',
               'courriel': 'controle.qualite_deux@exemple.ca',
               'confidentiel': 'O',
               'del_finance': 'N',
               'del_biblio': 'N',
               'regl_infra_conf': 'O',
               'trim_inscription': [
                  '20143',
                  '20141',
                  '20132'
               ],
               'recu': [],
               'factHisto': [],
               'trimestresCourants': [{
                  'trim_txt': 'Hiver 2015',
                  'trim_num': '20151',
                  'trim_def': 'N'
               }, {
                  'trim_txt': 'Été 2015',
                  'trim_num': '20152',
                  'trim_def': 'N'
               }, {
                  'trim_txt': 'Automne 2015',
                  'trim_num': '20153',
                  'trim_def': 'O'
               }],
               'consentementFinance': true
            };
         }
      },

      loginMock = {
         'token': 'eyJ0eXAiOiJKV1QiLCJh',
         'utilisateur': {
            'socio': {
               'code_perm': 'ZZZZ29568909',
               'nom': 'Paul',
               'prenom': 'Paul'
            },
            'prog': {
               'code_perm': 'ZZZZ29568909',
               'programme': [
                  {
                     'code_prog': '4117',
                     'titre_prog': 'certificat en français écrit',
                     'cycle': '1',
                     'nb_cred': '30',
                     'icode': '8',
                     'stat_prog': 'INACTIF'
                  },
                  {
                     'code_prog': '7177',
                     'titre_prog': 'baccalauréat en enseignement du français langue seconde',
                     'cycle': '1',
                     'nb_cred': '120',
                     'icode': '0',
                     'stat_prog': 'ACTIF'
                  }
               ]
            },
            'role': 'etudiant'
         }
      },

      releveSansResultat = {
         'status': 'success',
         'data': {
            'code_perm': 'ZZZZ29568909',
            'prenom': 'Qualité Deux',
            'nom': 'Contrôle',
            'date_emission': '8 juin 2015',
            'adresse_l1': '0000 4E AV',
            'adresse_l2': 'MONTREAL QC H6Y 2W6',
            'adresse_l3': '',
            'code_prog': 'S636',
            'titre_prog': 'cert. en éduc. à la petite enfance (Bes. spéc. Prem. Nations)',
            'nb_cred_reu': '0.0',
            'moy_acad': '0.00 / 4.3',
            'serveur': [{
               'code_erreur': '0',
               'msg_erreur': ''
            }],
            'message_resultat': [{
               'message': '(*) : Résultat non disponible'
            }],
            'these': {
               'trim_txt': '',
               'sigle': '',
               'credit': '',
               'categorie': '',
               'type_eval': '',
               'eval': '',
               'date_approb': '',
               'titre': ''
            },
            'provenance': [{
               'titre_provenance': 'Activités suivies depuis l\'admission au programme',
               'trimestre': [{
                  'trim_txt': 'Hiver - 2013',
                  'cours': [{
                     'sigle': 'FFM3750',
                     'nb_cred': '',
                     'titre': 'ACTIVITE D\'INTEGRATION, PROJETS DE FORMATION',
                     'moy_grp': 'N.A.',
                     'ind_hp': '',
                     'resultat': '*',
                     'no_ref_inst': ''
                  }]
               }, {
                  'trim_txt': 'Hiver - 2014',
                  'cours': [{
                     'sigle': 'APL1401',
                     'nb_cred': '',
                     'titre': 'EXPLORATION EN DESSIN A',
                     'moy_grp': 'N.A.',
                     'ind_hp': '',
                     'resultat': '*',
                     'no_ref_inst': ''
                  }, {
                     'sigle': 'LAN3675',
                     'nb_cred': '',
                     'titre': 'FRANCAIS LANGUE SECONDE, NIVEAU AVANCE III',
                     'moy_grp': '3.40',
                     'ind_hp': '',
                     'resultat': '*',
                     'no_ref_inst': ''
                  }, {
                     'sigle': 'TRS8920',
                     'nb_cred': '',
                     'titre': 'SEMINAIRE STAGE',
                     'moy_grp': 'N.A.',
                     'ind_hp': '',
                     'resultat': 'E',
                     'no_ref_inst': ''
                  }]
               }, {
                  'trim_txt': 'Automne - 2014',
                  'cours': [{
                     'sigle': 'ASS1025',
                     'nb_cred': '',
                     'titre': 'INTERVENTION EDUCATIVE: PLANS SERVICES ET INTERVENT.',
                     'moy_grp': 'N.A.',
                     'ind_hp': '',
                     'resultat': 'X',
                     'no_ref_inst': ''
                  }, {
                     'sigle': 'LIN1002',
                     'nb_cred': '',
                     'titre': 'CONNAIS. DE BASE EN GRAMMAIRE DU FR. ECRIT (H. PROG)',
                     'moy_grp': '2.69',
                     'ind_hp': '',
                     'resultat': '*',
                     'no_ref_inst': ''
                  }]
               }, {
                  'trim_txt': 'Hiver - 2015',
                  'cours': [{
                     'sigle': 'LIN1002',
                     'nb_cred': '',
                     'titre': 'CONNAIS. DE BASE EN GRAMMAIRE DU FR. ECRIT (H. PROG)',
                     'moy_grp': 'N.A.',
                     'ind_hp': '',
                     'resultat': 'X',
                     'no_ref_inst': ''
                  }]
               }]
            }],
            'resultats': {
               'resultats': {
                  'activites': null
               }
            },
            '$promise': {},
            '$resolved': true
         }
      },


      testFail = {
         'status': 'fail',
         'data': {
            'message': 'Problème'
         }
      },

      // Test à valider. Est-ce qu'on peut recevoir ça.
      testFailService = {
         'status': 'fail',
         'data': {
            'message': 'Problème',
            'reponseService': {
               'err': 'Problème avec un service'
            }
         }
      },
      testErreur = {
         'status': 'error',
         'message': 'Erreur fatale dans le service.'
      },

      testErreurInconnue = {
         'status': 'error'
      },


      testErreurContenuPasJSON = {
         'data': 'Voici le contenu'
      };

      //
      // devrait contenir BEAUCOUP plus de tests de résultats à merger dans le relevé.
      var releveAvecResultat = {
         'status': 'success',
         'data': {
            'code_perm': 'ZZZZ29568909',
            'prenom': 'Qualité Deux',
            'nom': 'Contrôle',
            'date_emission': '8 juin 2015',
            'adresse_l1': '0000 4E AV',
            'adresse_l2': 'MONTREAL QC H2Y 2D1',
            'adresse_l3': '',
            'code_prog': 'S636',
            'titre_prog': 'cert. en éduc. à la petite enfance (Bes. spéc. Prem. Nations)',
            'nb_cred_reu': '0.0',
            'moy_acad': '0.00 / 4.3',
            'serveur': [{
               'code_erreur': '0',
               'msg_erreur': ''
            }],
            'message_resultat': [{
               'message': '(*) : Résultat non disponible'
            }],
            'these': {
               'trim_txt': '',
               'sigle': '',
               'credit': '',
               'categorie': '',
               'type_eval': '',
               'eval': '',
               'date_approb': '',
               'titre': ''
            },
            'provenance': [{
               'titre_provenance': 'Activités suivies depuis l\'admission au programme',
               'trimestre': [{
                  'trim_txt': 'Hiver - 2013',
                  'cours': [{
                     'sigle': 'FFM3750',
                     'nb_cred': '',
                     'titre': 'ACTIVITE D\'INTEGRATION, PROJETS DE FORMATION',
                     'moy_grp': 'N.A.',
                     'ind_hp': '',
                     'resultat': '*',
                     'no_ref_inst': ''
                  }]
               }, {
                  'trim_txt': 'Hiver - 2014',
                  'cours': [{
                     'sigle': 'APL1401',
                     'nb_cred': '',
                     'titre': 'EXPLORATION EN DESSIN A',
                     'moy_grp': 'N.A.',
                     'ind_hp': '',
                     'resultat': '*',
                     'no_ref_inst': ''
                  }, {
                     'sigle': 'LAN3675',
                     'nb_cred': '',
                     'titre': 'FRANCAIS LANGUE SECONDE, NIVEAU AVANCE III',
                     'moy_grp': '3.40',
                     'ind_hp': '',
                     'resultat': '*',
                     'no_ref_inst': ''
                  }, {
                     'sigle': 'TRS8920',
                     'nb_cred': '',
                     'titre': 'SEMINAIRE STAGE',
                     'moy_grp': 'N.A.',
                     'ind_hp': '',
                     'resultat': 'E',
                     'no_ref_inst': ''
                  }]
               }, {
                  'trim_txt': 'Automne - 2014',
                  'cours': [{
                     'sigle': 'ASS1025',
                     'nb_cred': '',
                     'titre': 'INTERVENTION EDUCATIVE: PLANS SERVICES ET INTERVENT.',
                     'moy_grp': 'N.A.',
                     'ind_hp': '',
                     'resultat': 'X',
                     'no_ref_inst': ''
                  }, {
                     'sigle': 'LIN1002',
                     'nb_cred': '',
                     'titre': 'CONNAIS. DE BASE EN GRAMMAIRE DU FR. ECRIT (H. PROG)',
                     'moy_grp': '2.69',
                     'ind_hp': '',
                     'resultat': '*',
                     'no_ref_inst': ''
                  }]
               }, {
                  'trim_txt': 'Hiver - 2015',
                  'cours': [{
                     'sigle': 'LIN1002',
                     'nb_cred': '',
                     'titre': 'CONNAIS. DE BASE EN GRAMMAIRE DU FR. ECRIT (H. PROG)',
                     'moy_grp': 'N.A.',
                     'ind_hp': '',
                     'resultat': 'X',
                     'no_ref_inst': ''
                  }]
               }]
            }],
            'resultats': {
               'resultats':  [{
                     'trimestre': '20151',
                     'programmes': [{
                        'codeProg': 'S636',
                        'activites': [{
                           'trimestre': '20151',
                           'sigle': 'LIN1002',
                           'groupe': '80',
                           'titre': 'EVOLUTION ET SELECTION NATURELLE (2 CR)',
                           'programme': '7013',
                           'note': null,
                           'valeurNote': null,
                           'systemeResultats': 'O',
                           'total': null,
                           'ponderation': null,
                           'moyenne': null,
                           'ecartType': null,
                           'evaluations': null
                        }, {
                           'trimestre': '20151',
                           'sigle': 'BIA1301',
                           'groupe': '80',
                           'titre': 'DIVERSITE VEGETALE (7 CREDITS)',
                           'programme': '7013',
                           'note': 'E',
                           'valeurNote': '0',
                           'systemeResultats': 'O',
                           'total': '54.61',
                           'ponderation': '100',
                           'moyenne': '64.88',
                           'ecartType': '14.82',
                           'evaluations': [{
                              'id': '1',
                              'titre': 'Examen théorique de mi-unité',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '42,82',
                              'resultatNumerique': null,
                              'resultatMaximum': '100',
                              'moyenne': '64.69',
                              'moyenneNumerique': null,
                              'ecartType': '15.84',
                              'resultatPondere': '10.71',
                              'ponderation': '25',
                              'moyennePondere': '16.17',
                              'ecartTypePondere': '3.96'
                           }, {
                              'id': '2',
                              'titre': 'Examen théorique de fin ',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '49,95',
                              'resultatNumerique': null,
                              'resultatMaximum': '100',
                              'moyenne': '70.51',
                              'moyenneNumerique': null,
                              'ecartType': '14.19',
                              'resultatPondere': '12.49',
                              'ponderation': '25',
                              'moyennePondere': '17.63',
                              'ecartTypePondere': '3.55'
                           }, {
                              'id': '3',
                              'titre': 'Examen labo  mi-unité',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '6,5',
                              'resultatNumerique': null,
                              'resultatMaximum': '20',
                              'moyenne': '14.47',
                              'moyenneNumerique': null,
                              'ecartType': '3.56',
                              'resultatPondere': '3.25',
                              'ponderation': '10',
                              'moyennePondere': '7.23',
                              'ecartTypePondere': '1.78'
                           }, {
                              'id': '4',
                              'titre': 'Examen labo final morpho-taxo',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '14',
                              'resultatNumerique': null,
                              'resultatMaximum': '30',
                              'moyenne': '22.32',
                              'moyenneNumerique': null,
                              'ecartType': '4.87',
                              'resultatPondere': '4.43',
                              'ponderation': '9.5',
                              'moyennePondere': '7.07',
                              'ecartTypePondere': '1.54'
                           }, {
                              'id': '5',
                              'titre': 'Examen labo final Identif',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '4',
                              'resultatNumerique': null,
                              'resultatMaximum': '8',
                              'moyenne': '5.26',
                              'moyenneNumerique': null,
                              'ecartType': '1.76',
                              'resultatPondere': '1.25',
                              'ponderation': '2.5',
                              'moyennePondere': '1.64',
                              'ecartTypePondere': '.55'
                           }, {
                              'id': '6',
                              'titre': 'Rapport de labo',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '78,4',
                              'resultatNumerique': null,
                              'resultatMaximum': '100',
                              'moyenne': '78.82',
                              'moyenneNumerique': null,
                              'ecartType': '12.1',
                              'resultatPondere': '6.27',
                              'ponderation': '8',
                              'moyennePondere': '6.31',
                              'ecartTypePondere': '.97'
                           }, {
                              'id': '7',
                              'titre': 'S-ê Contrib efficacité Groupe',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '8,52',
                              'resultatNumerique': null,
                              'resultatMaximum': '10',
                              'moyenne': '8.15',
                              'moyenneNumerique': null,
                              'ecartType': '1.09',
                              'resultatPondere': '2.56',
                              'ponderation': '3',
                              'moyennePondere': '2.44',
                              'ecartTypePondere': '.33'
                           }, {
                              'id': '8',
                              'titre': 'Savoir-être au labo ',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '9',
                              'resultatNumerique': null,
                              'resultatMaximum': '10',
                              'moyenne': '9.34',
                              'moyenneNumerique': null,
                              'ecartType': '1.02',
                              'resultatPondere': '4.5',
                              'ponderation': '5',
                              'moyennePondere': '4.67',
                              'ecartTypePondere': '.51'
                           }, {
                              'id': '9',
                              'titre': 'S-ê Raisonn responsab scientif',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '7,39',
                              'resultatNumerique': null,
                              'resultatMaximum': '10',
                              'moyenne': '8.39',
                              'moyenneNumerique': null,
                              'ecartType': '.89',
                              'resultatPondere': '2.22',
                              'ponderation': '3',
                              'moyennePondere': '2.52',
                              'ecartTypePondere': '.27'
                           }, {
                              'id': '10',
                              'titre': 'S-ê Dével perso implic sociale',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '8,54',
                              'resultatNumerique': null,
                              'resultatMaximum': '10',
                              'moyenne': '8.72',
                              'moyenneNumerique': null,
                              'ecartType': '.68',
                              'resultatPondere': '2.56',
                              'ponderation': '3',
                              'moyennePondere': '2.62',
                              'ecartTypePondere': '.2'
                           }, {
                              'id': '11',
                              'titre': 'S-ê Assiduité aux tutorats',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '7,59',
                              'resultatNumerique': null,
                              'resultatMaximum': '10',
                              'moyenne': '9.39',
                              'moyenneNumerique': null,
                              'ecartType': '.91',
                              'resultatPondere': '2.28',
                              'ponderation': '3',
                              'moyennePondere': '2.82',
                              'ecartTypePondere': '.27'
                           }, {
                              'id': '12',
                              'titre': 'S-ê Autonomie',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '7',
                              'resultatNumerique': null,
                              'resultatMaximum': '10',
                              'moyenne': '8.77',
                              'moyenneNumerique': null,
                              'ecartType': '1',
                              'resultatPondere': '2.1',
                              'ponderation': '3',
                              'moyennePondere': '2.63',
                              'ecartTypePondere': '.3'
                           }]
                        }, {
                           'trimestre': '20151',
                           'sigle': 'BIA1400',
                           'groupe': '80',
                           'titre': 'DIVERSITE DES MICROORGANISMES (3 CREDITS)',
                           'programme': '7013',
                           'note': 'C-',
                           'valeurNote': '1.7',
                           'systemeResultats': 'O',
                           'total': '64.95',
                           'ponderation': '100',
                           'moyenne': '75.35',
                           'ecartType': '10.41',
                           'evaluations': [{
                              'id': '1',
                              'titre': 'Examen',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '20,9',
                              'resultatNumerique': null,
                              'resultatMaximum': '50',
                              'moyenne': '36.21',
                              'moyenneNumerique': null,
                              'ecartType': '7.65',
                              'resultatPondere': '20.9',
                              'ponderation': '50',
                              'moyennePondere': '36.21',
                              'ecartTypePondere': '7.65'
                           }, {
                              'id': '2',
                              'titre': 'savoir-être tuteur',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '10',
                              'resultatNumerique': null,
                              'resultatMaximum': '10',
                              'moyenne': '8.47',
                              'moyenneNumerique': null,
                              'ecartType': '1.39',
                              'resultatPondere': '10',
                              'ponderation': '10',
                              'moyennePondere': '8.47',
                              'ecartTypePondere': '1.39'
                           }, {
                              'id': '3',
                              'titre': 'savoir-être pairs',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '4,6',
                              'resultatNumerique': null,
                              'resultatMaximum': '5',
                              'moyenne': '4.3',
                              'moyenneNumerique': null,
                              'ecartType': '.4',
                              'resultatPondere': '4.6',
                              'ponderation': '5',
                              'moyennePondere': '4.3',
                              'ecartTypePondere': '.4'
                           }, {
                              'id': '4',
                              'titre': 'laboratoire',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '24,45',
                              'resultatNumerique': null,
                              'resultatMaximum': '30',
                              'moyenne': '24.35',
                              'moyenneNumerique': null,
                              'ecartType': '3.16',
                              'resultatPondere': '24.45',
                              'ponderation': '30',
                              'moyennePondere': '24.35',
                              'ecartTypePondere': '3.16'
                           }, {
                              'id': '5',
                              'titre': 'savoir-être labo',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '5',
                              'resultatNumerique': null,
                              'resultatMaximum': '5',
                              'moyenne': '4.89',
                              'moyenneNumerique': null,
                              'ecartType': '.36',
                              'resultatPondere': '5',
                              'ponderation': '5',
                              'moyennePondere': '4.89',
                              'ecartTypePondere': '.36'
                           }]
                        }, {
                           'trimestre': '20151',
                           'sigle': 'BIA1800',
                           'groupe': '80',
                           'titre': 'INTEGRATION ET EVALUATION II (1 CR)',
                           'programme': '7013',
                           'note': 'C',
                           'valeurNote': '2',
                           'systemeResultats': 'N',
                           'total': null,
                           'ponderation': null,
                           'moyenne': null,
                           'ecartType': null,
                           'evaluations': null
                        }, {
                           'trimestre': '20151',
                           'sigle': 'MAT1185',
                           'groupe': '30',
                           'titre': 'STAT.DESCRIPTIVE,TABLEAUX CROISES & INFERENCE (1CR.)',
                           'enseignant' : [
                             { 'nom': 'Steven Zarper', 'url_repertoire': ''},
                             { 'nom': 'Steven Zarper', 'url_repertoire': ''},
                             { 'nom': 'Steven Zarper', 'url_repertoire': ''},
                             { 'nom': 'Steven Zarper', 'url_repertoire': ''}
                             ],
                           'commentaireGroupe': ' Come on guys ! Wake up !!   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla  Come on guys ! Wake up !!   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla  Come on guys ! Wake up !!   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla  Come on guys ! Wake up !!   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla  Come on guys ! Wake up !!   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla  Come on guys ! Wake up !!   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla  Come on guys ! Wake up !!   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla  Come on guys ! Wake up !!   Bla bla   Bla bla   Vous auriez pu vous forcer un peu plus, gang de ...Bla bla   Bla blaBla bla   Vous auriez pu vous forcer un peu plus, gang de ...Bla bla   Bla blaBla bla   Vous auriez pu vous forcer un peu plus, gang de ...Bla bla   Bla blaBla bla   Vous auriez pu vous forcer un peu plus, gang de ...Bla bla   Bla blaBla bla   Vous auriez pu vous forcer un peu plus, gang de ...Bla bla   Bla blaBla bla   Vous auriez pu vous forcer un peu plus, gang de ...Bla bla   Bla blaBla bla   Vous auriez pu vous forcer un peu plus, gang de ...Bla bla   Bla blaBla bla   Vous auriez pu vous forcer un peu plus, gang de ...Bla bla   Bla blaBla bla   Vous auriez pu vous forcer un peu plus, gang de ...Bla bla   Bla blaBla bla   Vous auriez pu vous forcer un peu plus, gang de ...Bla bla   Bla blaBla  blaBla bla Vous auriez pu vous forcer un peu plus, gang de ...Bla bla Bla bla Bla bla Bla bla Bla bla Bla bla Bla bla Bla bla Bla bla Vous auriez pu ah ben tabernouche de simonac|!"/$%?><¨cô[]{}   blaBla bla Vous auriez pu vous forcer un peu plus, gang de ...Bla bla Bla bla Bla bla Bla 123456  bla Bla bla Bla bla Bla bla Bla bla Bla bla Vous auriez pu ah ben tabernouche de simonac|!"/$%?><¨cô[]{} bla   Vous auriez pu vous forcer un peu plus, gang de ...Bla bla   Bla blaBla bla   Vous auriez pu vous forcer un peu plus, gang de ...Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla   Bla bla  Vous auriez pu vous forcer un peu plus, gang de ...',
                           'programme': '7013',
                           'note': 'B',
                           'valeurNote': '3',
                           'systemeResultats': 'O',
                           'total': '78.25',
                           'ponderation': '100',
                           'moyenne': '75.19',
                           'ecartType': '10.37',
                           'graphes': [],
                           'evaluations': [{
                              'id': '1',
                              'titre': 'Devoir 1',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '74',
                              'resultatNumerique': null,
                              'resultatMaximum': '100',
                              'moyenne': '75.68',
                              'moyenneNumerique': null,
                              'ecartType': '15.51',
                              'resultatPondere': '18.5',
                              'ponderation': '25',
                              'moyennePondere': '18.92',
                              'ecartTypePondere': '3.88'
                           }, {
                              'id': '2',
                              'titre': 'Devoir 2',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '97',
                              'resultatNumerique': null,
                              'resultatMaximum': '100',
                              'moyenne': '87.06',
                              'moyenneNumerique': null,
                              'ecartType': '10.09',
                              'resultatPondere': '24.25',
                              'ponderation': '25',
                              'moyennePondere': '21.77',
                              'ecartTypePondere': '2.52'
                           }, {
                              'id': '3',
                              'titre': 'Examen',
                              'notation': 'C',
                              'modeEvaluation': 'I',
                              'resultat': '71',
                              'resultatNumerique': null,
                              'resultatMaximum': '100',
                              'moyenne': '71.47',
                              'moyenneNumerique': null,
                              'ecartType': '16.45',
                              'resultatPondere': '35.5',
                              'ponderation': '50',
                              'moyennePondere': '35.73',
                              'ecartTypePondere': '8.22'
                           }]
                        }]
                     }]
                  }, {
                     'trimestre': '20141',
                     'programmes': [{
                        'codeProg': '7013',
                        'activites': [{
                           'trimestre': '20141',
                           'sigle': 'BIA1001',
                           'groupe': '80',
                           'titre': 'ECHANTILLONNAGE ET OBSERVATIONS SUR LE TERRAIN',
                           'programme': '7013',
                           'note': null,
                           'valeurNote': null,
                           'systemeResultats': 'O',
                           'total': null,
                           'ponderation': null,
                           'moyenne': null,
                           'ecartType': null,
                           'evaluations': null
                        }, {
                           'trimestre': '20141',
                           'sigle': 'BIA1500',
                           'groupe': '80',
                           'titre': 'INTEGRATION ET EVALUATION I (1 CR)',
                           'programme': '7013',
                           'note': 'B-',
                           'valeurNote': '2.7',
                           'systemeResultats': 'O',
                           'total': null,
                           'ponderation': null,
                           'moyenne': null,
                           'ecartType': null,
                           'evaluations': null
                        }, {
                           'trimestre': '20141',
                           'sigle': 'BIA1601',
                           'groupe': '80',
                           'titre': 'DIVERSITE ANIMALE (7 CREDITS)',
                           'programme': '7013',
                           'note': 'E',
                           'valeurNote': '0',
                           'systemeResultats': 'O',
                           'total': null,
                           'ponderation': null,
                           'moyenne': null,
                           'ecartType': null,
                           'evaluations': null
                        }, {
                           'trimestre': '20141',
                           'sigle': 'BIA1700',
                           'groupe': '80',
                           'titre': 'ORGANISMES ET ENVIRONNEMENT (6 CREDITS)',
                           'programme': '7013',
                           'note': 'E',
                           'valeurNote': '0',
                           'systemeResultats': 'O',
                           'total': null,
                           'ponderation': null,
                           'moyenne': null,
                           'ecartType': null,
                           'evaluations': null
                        }, {
                           'trimestre': '20141',
                           'sigle': 'MAT1185',
                           'groupe': '50',
                           'titre': 'STAT.DESCRIPTIVE,TABLEAUX CROISES & INFERENCE (1CR.)',
                           'programme': '7013',
                           'note': 'E',
                           'valeurNote': '0',
                           'systemeResultats': 'O',
                           'total': null,
                           'ponderation': null,
                           'moyenne': null,
                           'ecartType': null,
                           'evaluations': null
                        }, {
                           'trimestre': '20141',
                           'sigle': 'MAT1285',
                           'groupe': '30',
                           'titre': 'ANALYSE DE VARIANCE & COMPARAISON DE MOYENNES (1CR.)',
                           'programme': '7013',
                           'note': 'E',
                           'valeurNote': '0',
                           'systemeResultats': 'O',
                           'total': null,
                           'ponderation': null,
                           'moyenne': null,
                           'ecartType': null,
                           'evaluations': null
                        }]
                     }]
                  }]



            }


         }
      };

   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
    */
   beforeEach(module('pelApp'));

   beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, _$timeout_) {
      scope = $rootScope.$new();
      backendMock = _$httpBackend_;
      $timeout= _$timeout_;
      releve = $controller('ReleveCtrl', {
         $scope: scope
      });
   }));


   /////////////////////////////////////////////////////////////////////////////
   /*
    * Effectuer et évaluer les TESTS.
    */

   it('renReleveCtrl devrait être défini', function() {
      expect(releve).toBeDefined();
   });

   it('programmeCourant ne devrait pas être défini', function() {
      expect(scope.programmeCourant).toBeUndefined();
   });

   it('devrait récupérer un programme (programme_ins).', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testCheminement);
      backendMock.flush();
      expect(scope.programmeCourant.code_prog).toBe('7954');
   });

   it('devrait retourner un fail  (programme_ins).', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testFail);
      backendMock.flush();
      expect(scope.avertissements).toContain('Problème');
   });

   it('devrait retourner un fail Service  (programme_ins).', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testFailService);
      backendMock.flush();
      expect(scope.avertissements).toContain('Problème avec un service');
   });

   it('devrait retourner une erreur (programme_ins).', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testErreur);
      backendMock.flush();
      expect(scope.err).toContain('Erreur fatale dans le service.');
   });

   it('devrait retourner une erreur inconnue (programme_ins).', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testErreurInconnue);
      backendMock.flush();
      expect(scope.err).toContain('Une erreur est survenue lors de la récupération du relevé de notes. Veuillez essayer plus tard.');
   });

   it('devrait retourner une erreur reponseHTTP/JSON invalide (programme_ins).', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testErreurContenuPasJSON);
      backendMock.flush();
      //console.log( angular.mock.dump(scope));
      expect(scope.err).toContain('Une erreur est survenue lors de la récupération du relevé de notes. Veuillez essayer plus tard. : Une erreur est survenue (2)');
   });

   it('devrait retourner une erreur du service REST programme_ins.', function() {
      //   Bug sur windoze : PhantomJS exited unexpectedly with exit code 3221225477
      //   Il ne faut pas utiliser : .respond(500,'Erreur');
      //   On enlève donc le 'Erreur'
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(500);
      backendMock.flush();
      expect(scope.err).toBe('Une erreur est survenue lors de la récupération du relevé de notes. Veuillez essayer plus tard.');
   });

   it('devrait récupérer un programme et un relevé sans résultat.', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testCheminement);
      backendMock.flush();
      backendMock.when('GET', '/apis/releve/identifiant/7954/O').respond(releveSansResultat);
      expect(scope.programmeCourant).toBeDefined();
      // Pour l'appel à obtReleve
      $timeout.flush();
      // /apis/releve/identifiant/7954/O
      backendMock.flush();
      expect(scope.releveCourant.code_perm).toBe('ZZZZ29568909');
   });

   it('devrait récupérer un programme et un relevé avec des résultats.', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testCheminement);
      backendMock.flush();
      backendMock.when('GET', '/apis/releve/identifiant/7954/O').respond(releveAvecResultat);
      expect(scope.programmeCourant).toBeDefined();
      // Pour l'appel à obtReleve
      $timeout.flush();
      // /apis/releve/identifiant/7954/O
      backendMock.flush();
      expect(scope.releveCourant.code_perm).toBe('ZZZZ29568909');
   });

   it('devrait récupérer un programme et un relevé avec un message d\'avertissement.', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testCheminement);
      backendMock.flush();
      backendMock.when('GET', '/apis/releve/identifiant/7954/O').respond(testFail);

      // Pour l'appel à obtReleve
      $timeout.flush();
      // /apis/releve/identifiant/7954/O
      backendMock.flush();
      expect(scope.avertissementsRevele).toContain('Problème');
   });

   it('devrait récupérer un programme et un relevé avec message d\'erreur.', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testCheminement);
      backendMock.flush();
      backendMock.when('GET', '/apis/releve/identifiant/7954/O').respond(testErreur);

      // Pour l'appel à obtReleve
      $timeout.flush();
      // /apis/releve/identifiant/7954/O
      backendMock.flush();
      expect(scope.errReleve).toContain('Une erreur est survenue lors de la récupération du relevé de notes. Veuillez essayer plus tard.');
   });

   it('devrait récupérer un programme et un relevé avec une erreur inconnue.', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testCheminement);
      backendMock.flush();
      backendMock.when('GET', '/apis/releve/identifiant/7954/O').respond(testErreurInconnue);

      // Pour l'appel à obtReleve
      $timeout.flush();
      // /apis/releve/identifiant/7954/O
      backendMock.flush();
      expect(scope.errReleve).toContain('Une erreur est survenue lors de la récupération du relevé de notes. Veuillez essayer plus tard.');
   });

   it('devrait retourner une erreur reponseHTTP/JSON invalide pour le releve.', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testCheminement);
      backendMock.flush();
      backendMock.when('GET', '/apis/releve/identifiant/7954/O').respond(testErreurContenuPasJSON);

      // Pour l'appel à obtReleve
      $timeout.flush();
      // /apis/releve/identifiant/7954/O
      backendMock.flush();
      expect(scope.errReleve).toContain('Une erreur est survenue lors de la récupération du relevé de notes. Veuillez essayer plus tard.');
   });

   it('devrait changer de programme.', function() {

      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testCheminement);
      backendMock.flush();
      expect(scope.programmeCourant.code_prog).toBe('7954');

      // pour obtReleve
      backendMock.when('GET', '/apis/releve/identifiant/9999/O').respond(releveSansResultat);
      expect(scope.programmeCourant.code_prog).toBe('7954');


      //changer de programme
      scope.progSelectionne = scope.renProgramme.programme[1];
      scope.changerProgramme();

      backendMock.flush();
      expect(scope.programmeCourant.code_prog).toBe('9999');

   });

   it('devrait changer un toggle et son type à plusieurs reprises + compteToggleAffiche', function() {
      // Ajouter un nouvel item vrai lors de la création
      scope.changeToggle('cours', 'Hiver - 2015LIN1002');
      expect(scope.toggle.cours['Hiver - 2015LIN1002']).toBeTruthy();
      // Le faire basculer à faux
      scope.changeToggle('cours', 'Hiver - 2015LIN1002');
      expect(scope.toggle.cours['Hiver - 2015LIN1002']).toBeFalsy();

      // Compte le nombre de + ouvert
      expect(scope.compteToggleAffiche('Hiver - 2015')).toBe(0);

      // Le faire basculer à vrai de nouveaux
      scope.changeToggle('cours', 'Hiver - 2015LIN1002');
      expect(scope.toggle.cours['Hiver - 2015LIN1002']).toBeTruthy();

      scope.changeToggle('cours', 'allo');
      expect(scope.toggle.cours.allo).toBeTruthy();

      // Compte le nombre de + ouvert
      expect(scope.compteToggleAffiche('Hiver - 2015')).toBe(1);

      // Modification d'un élément et non d'un tableau.
      // N'est pas utilisé dans releve seulement dans rif
      scope.changeToggle('cours');
      scope.changeToggle('cours');

   });

   it('devrait appeler "imprimer un relevé"".', function() {
      // Je sais pas trop pourquoi j'ai besoin de ça (backendMock).
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testCheminement);
      expect(scope.impressionReleve).toBeFalsy();
      scope.imprimer();
      $timeout.flush();
      expect(scope.impressionReleve).toBeFalsy();
   });


   it('devrait appeler un cheminement special.', function() {
      backendMock.when('GET', '/apis/programmeIns/identifiant').respond(testCheminement);
      backendMock.flush();
      expect(scope.programmeCourant.code_prog).toBe('7954');
      expect(scope.cheminementSpecial()).toBeFalsy();
      scope.programmeCourant.ty_diplome = 'AUC';
      expect(scope.cheminementSpecial()).toBeTruthy();
   });

});

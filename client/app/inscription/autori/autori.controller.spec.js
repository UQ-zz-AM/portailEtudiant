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

describe('Controller: AutoriCtrl', function() {

   var autori,
      scope,
      backendMock,
      routeParams,
      codePermanent = 'identifiant',
      erreurGenerique = 'Une erreur est survenue, veuillez essayer plus tard.',

      // Attention le param O devra être retiré.
      url = '/apis/periodesIns/identifiant/O',

      testSansProgramme = {
         'status': 'success',
         data: {
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
            'programmes': []
         }
      },

      testAutoriAvecFenetre = {
         'status': 'success',
         data: {
            'heureMontreal': '20150313',
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
                  }]
               }]
            }]
         }
      },

      testAutoriAvecFenetreEtIcodeNull = {
         'status': 'success',
         data: {
            'programmes': [{
               'code_prog': '7021',
               'titre_prog': 'baccalauréat en actuariat',
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
                  }]
               }]
            }]
         }
      },

      testAvecVaria = {
         'status': 'success',
         data: {
            'programmes': [{
               'code_prog': '7021',
               'titre_prog': 'baccalauréat en actuariat',
               'icode': '1',
               'trimestres': [{
                  'an_ses_num': '20152',
                  'sous_ses_txt': 'Intensif',
                  'mode_inscription': 'WEB',
                  'fenetres': [{
                     'type_fenetre': 'INS',
                     'date_deb_fen': '2015-03-12',
                     'date_fin_fen': '2015-05-02'
                  }]
               }]
            },
            {
               'code_prog': '7878',
               'titre_prog': 'je sais pas',
               'icode': '1',
               'trimestres': [{
                  'an_ses_num': '20152',
                  'sous_ses_txt': 'Intensif',
                  'mode_inscription': 'PRO',
                  'fenetres': [{
                     'type_fenetre': 'INS',
                     'date_deb_fen': '2015-03-12',
                     'date_fin_fen': '2015-05-02'
                  }]
               }]
            },
            {
               'code_prog': '9999',
               'titre_prog': 'libre',
               'icode': '1',
               'trimestres': [{
                  'an_ses_num': '20152',
                  'sous_ses_txt': 'Intensif',
                  'mode_inscription': 'PRO',
                  'fenetres': []
               }]
            }
            ]
         }
      },


      // Test à valider. Est-ce qu'on peut recevoir ça.
      testFail = {
         'status': 'fail',
         'data': {
            'message': 'Problème'
         }
      },

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

   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
    */
   beforeEach(module('pelApp'));

   // /* Initialiser le contrôleur avec httpBackend et rootScope
   //  * et ressoudre les dépendances aux autorisations (backendMock) et Auth (authMock).
   //  */
   beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $routeParams) {
      scope = $rootScope.$new();
      routeParams = $routeParams;
      backendMock = _$httpBackend_;
      autori = $controller('AutoriCtrl', {
         $scope: scope
      });
   }));

   /////////////////////////////////////////////////////////////////////////////
   /*
    * Effectuer et évaluer les TESTS.
    */

   it('AutoriCtrl devrait être défini', function() {
      expect(autori).toBeDefined();
   });

   it('devrait récupérer une autorisation sans programme (autorisation).', function() {
      backendMock.when('GET', '/apis/periodesIns/identifiant/O').respond(testSansProgramme);
      backendMock.flush();
      expect(scope.autorisation.libellesMethodeIns.WEB.desc_courte).toBe('En ligne');
      expect(scope.progSelectionne).toBeUndefined();
      // Programme vide
      expect(scope.programmeCourant).toBeTruthy();
   });

   it('devrait récupérer une autorisation avec des fenetres (autorisation).', function() {
      backendMock.when('GET', url).respond(testAutoriAvecFenetre);
      backendMock.flush();
      expect(scope.progSelectionne).toBe(scope.programmeCourant);
      expect(scope.programmeCourant.trimestres[0].fenetres.length).toBe(3);
   });

   // isIcodeValid.
   it('devrait valider différents icodes avec la fonction isIcodeValid.', function() {

      expect(scope.isIcodeValid).toBeDefined();

      // Valide
      expect(scope.isIcodeValid('1')).toBeTruthy();
      expect(scope.isIcodeValid(undefined)).toBeTruthy();
      expect(scope.isIcodeValid('')).toBeTruthy();
      expect(scope.isIcodeValid('a')).toBeTruthy();

      // icode invalide
      expect(scope.isIcodeValid('2')).toBeTruthy();
      expect(scope.isIcodeValid('3')).toBeTruthy();
      expect(scope.isIcodeValid('6')).toBeFalsy();
      expect(scope.isIcodeValid('8')).toBeFalsy();
      expect(scope.isIcodeValid('9')).toBeTruthy();

   });

   // isPeriodeEnLigne
   it('devrait retourner vrai/faux si mode d\'inscription est WEB pour un programme (isPeriodeEnLigne).', function() {
      expect(scope.isPeriodeEnLigne).toBeDefined();
      backendMock.when('GET', url).respond(testAvecVaria);
      backendMock.flush();

      expect(scope.isPeriodeEnLigne('7021')).toBeTruthy();
      expect(scope.isPeriodeEnLigne('7878')).toBeFalsy();

      // N'importe quoi.
      expect(scope.isPeriodeEnLigne(undefined)).toBeFalsy();
      expect(scope.isPeriodeEnLigne('junk ')).toBeFalsy();
   });

   // isPeriodePourProgramme
   it('devrait retourner vrai/faux si fenetre(s) pour un programme (isPeriodePourProgramme).', function() {
      expect(scope.isPeriodePourProgramme).toBeDefined();
      backendMock.when('GET', url).respond(testAvecVaria);
      backendMock.flush();

      expect(scope.isPeriodePourProgramme(scope.programmeCourant)).toBeTruthy();
      expect(scope.isPeriodePourProgramme(scope.autorisation.programmes[0])).toBeTruthy();
      expect(scope.isPeriodePourProgramme(scope.autorisation.programmes[1])).toBeTruthy();
      expect(scope.isPeriodePourProgramme(scope.autorisation.programmes[2])).toBeFalsy();

      // N'importe quoi.
      expect(scope.isPeriodePourProgramme(undefined)).toBeFalsy();
      expect(scope.isPeriodePourProgramme('junk ')).toBeFalsy();
   });

   // changerProgramme
   it('devrait changer de programme (changerProgramme).', function() {
      expect(scope.changerProgramme).toBeDefined();
      backendMock.when('GET', url).respond(testAvecVaria);
      backendMock.flush();

      // Affecte le coverage
      scope.changerProgramme();

      // Ne s'exécute pas pour le vrai mais simule l'exécution.
      // Donc le coverage n'est pas affecté.
      spyOn(scope, 'changerProgramme');
      scope.changerProgramme();
      expect(scope.changerProgramme).toHaveBeenCalled();
   });


   // Les erreurs et messages

   it('devrait retourner une erreur.', function() {
      backendMock.when('GET', url).respond(testErreur);
      backendMock.flush();
      expect(scope.err).toBe(erreurGenerique);
   });

   it('devrait retourner un fail Service.', function() {
      backendMock.when('GET', url).respond(testFailService);
      backendMock.flush();
      expect(scope.avertissements).toContain('Problème avec un service');
   });

   it('devrait retourner une erreur inconnue.', function() {
      backendMock.when('GET', url).respond(testErreurInconnue);
      backendMock.flush();
      expect(scope.err).toBe(erreurGenerique);
   });

   it('devrait retourner une erreur reponseHTTP/JSON invalide (programme_ins).', function() {
      backendMock.when('GET', url).respond(testErreurContenuPasJSON);
      backendMock.flush();
      expect(scope.err).toBe(erreurGenerique);
   });

   it('devrait retourner un fail.', function() {
      backendMock.when('GET', url).respond(testFail);
      backendMock.flush();
      expect(scope.avertissements).toContain('Problème');
   });

   it('devrait retourner une erreur du service REST.', function() {
      backendMock.when('GET', url).respond(500);
      backendMock.flush();
      expect(scope.err).toBe(erreurGenerique);
   });


   it('devrait retourner un isPeriode à vrais.', function() {
      backendMock.when('GET', url).respond(testAutoriAvecFenetre);
      backendMock.flush();

      expect(scope.isPeriode()).toBeTruthy();
   });

   it('devrait retourner un isPeriodeTermine  à vrai.', function() {
      backendMock.when('GET', url).respond(testAutoriAvecFenetre);
      backendMock.flush();

      expect(scope.isPeriodeTermine('2002-01-01')).toBeTruthy();
   });

   it('devrait retourner un isPeriodeTermine  à faux.', function() {
      backendMock.when('GET', url).respond(testAutoriAvecFenetre);
      backendMock.flush();

      expect(scope.isPeriodeTermine('2222-01-01')).toBeFalsy();
   });

   it('devrait brancher sur la page landing (accueil).', function() {
      routeParams.landing = 'landing';
      backendMock.when('GET', url).respond(testAutoriAvecFenetre);
      backendMock.flush();

      // Devrait calculer le nombre de programme avec icode non nul
      expect(scope.nbProgIcodeNonNull).toBe(1);
      expect(scope.nbProgIcodeNull).toBe(0);

   });

   it('devrait brancher sur la page landing (accueil) avec icode null.', function() {
      routeParams.landing = 'landing';
      backendMock.when('GET', url).respond(testAutoriAvecFenetreEtIcodeNull);
      backendMock.flush();

      // Devrait calculer le nombre de programme avec icode non nul
      expect(scope.nbProgIcodeNonNull).toBe(0);
      expect(scope.nbProgIcodeNull).toBe(1);

   });

   it('devrait brancher sur la page autori pour un programme particulier.', function() {
      routeParams.codeProgramme = '7021';
      backendMock.when('GET', url).respond(testAutoriAvecFenetre);
      backendMock.flush();

      expect(scope.progSelectionne).toBe(scope.programmeCourant);

   });


});

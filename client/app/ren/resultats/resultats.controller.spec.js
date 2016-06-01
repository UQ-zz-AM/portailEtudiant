/* jshint  unused:false, camelcase:false, quotmark:false */
/* globals afterEach, testErreur, DossierModelMock */

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

describe('Controller: ResultatsCtrl', function() {


   var resultatsCtrl,
      scope,
      backendMock,
      codePermanent = 'identifiant',
      testData = function() {
         return {
            'status': 'success',
            data: {
               "resultats": [{
                  "trimestre": 20151,
                  "programmes": [{
                     "codeProg": "4548",
                     "titreProgramme": "certificat de perfectionnement en gestion",
                     "activites": [{
                        "trimestre": 20151,
                        "sigle": "DSR5100",
                        "groupe": 44,
                        "titreActivite": "STRATEGIE DE GESTION",
                        "creditActivite": 3,
                        "programme": "4548",
                        "titreProgramme": "certificat de perfectionnement en gestion",
                        "systemeResultats": "O",
                        "compteurEvaluation": 8
                     }, {
                        "trimestre": 20151,
                        "sigle": "ECO1300",
                        "groupe": 14,
                        "titreActivite": "ANALYSE MICROECONOMIQUE",
                        "creditActivite": 3,
                        "programme": "4548",
                        "titreProgramme": "certificat de perfectionnement en gestion",
                        "systemeResultats": "O",
                        "compteurEvaluation": 2
                     }]
                  }]
               }, {
                  "trimestre": 20143,
                  "programmes": [{
                     "codeProg": "4548",
                     "titreProgramme": "certificat de perfectionnement en gestion",
                     "activites": [{
                        "trimestre": 20143,
                        "sigle": "MET1300",
                        "groupe": 32,
                        "titreActivite": "FONDEMENTS TECHNOLOGIQUES DES SYSTEMES D'INFORMATION",
                        "creditActivite": 3,
                        "programme": "4548",
                        "titreProgramme": "certificat de perfectionnement en gestion",
                        "systemeResultats": "O",
                        "compteurEvaluation": 6
                     }]
                  }, {
                     "codeProg": "4206",
                     "titreProgramme": "certificat en marketing",
                     "activites": [{
                        "trimestre": 20143,
                        "sigle": "MKG5311",
                        "groupe": 40,
                        "titreActivite": "METHODES QUANTITATIVES EN MARKETING",
                        "creditActivite": 3,
                        "programme": "4206",
                        "titreProgramme": "certificat en marketing",
                        "systemeResultats": "O",
                        "compteurEvaluation": 4
                     }]
                  }]
               }, {
                  "trimestre": 20141,
                  "programmes": [{
                     "codeProg": "4206",
                     "titreProgramme": "certificat en marketing",
                     "activites": [{
                        "trimestre": 20141,
                        "sigle": "MKG5305",
                        "groupe": 40,
                        "titreActivite": "COMPORTEMENT DU CONSOMMATEUR",
                        "creditActivite": 3,
                        "programme": "4206",
                        "titreProgramme": "certificat en marketing",
                        "systemeResultats": "O",
                        "compteurEvaluation": 0
                     }, {
                        "trimestre": 20141,
                        "sigle": "MKG5314",
                        "groupe": 40,
                        "titreActivite": "CIRCUITS DE DISTRIBUTION",
                        "creditActivite": 3,
                        "programme": "4206",
                        "titreProgramme": "certificat en marketing",
                        "systemeResultats": "O",
                        "compteurEvaluation": 0
                     }, {
                        "trimestre": 20141,
                        "sigle": "MKG5327",
                        "groupe": 30,
                        "titreActivite": "PUBLICITE",
                        "creditActivite": 3,
                        "programme": "4206",
                        "titreProgramme": "certificat en marketing",
                        "systemeResultats": "O",
                        "compteurEvaluation": 0
                     }, {
                        "trimestre": 20141,
                        "sigle": "MKG5392",
                        "groupe": 31,
                        "titreActivite": "EVENEMENTS SPECIAUX ET COMMANDITES EN REL. PUBLIQUES",
                        "creditActivite": 3,
                        "programme": "4206",
                        "titreProgramme": "certificat en marketing",
                        "systemeResultats": "O",
                        "compteurEvaluation": 0
                     }]
                  }]
               }, {
                  "trimestre": 20133,
                  "programmes": [{
                     "codeProg": "4206",
                     "titreProgramme": "certificat en marketing",
                     "activites": [{
                        "trimestre": 20133,
                        "sigle": "MKG5300",
                        "groupe": 30,
                        "titreActivite": "STRATEGIE DE MARKETING",
                        "creditActivite": 3,
                        "programme": "4206",
                        "titreProgramme": "certificat en marketing",
                        "systemeResultats": "O",
                        "compteurEvaluation": 0
                     }, {
                        "trimestre": 20133,
                        "sigle": "MKG5311",
                        "groupe": 20,
                        "titreActivite": "METHODES QUANTITATIVES EN MARKETING",
                        "creditActivite": 3,
                        "programme": "4206",
                        "titreProgramme": "certificat en marketing",
                        "systemeResultats": "O",
                        "compteurEvaluation": 0
                     }, {
                        "trimestre": 20133,
                        "sigle": "ORH1600",
                        "groupe": 31,
                        "titreActivite": "INTRODUCTION A LA GESTION DES RESSOURCES HUMAINES",
                        "creditActivite": 3,
                        "programme": "4206",
                        "titreProgramme": "certificat en marketing",
                        "systemeResultats": "O",
                        "compteurEvaluation": 0
                     }]
                  }]
               }]
            }
         };
      },
      testMessage = function() {
         return {
            'status': 'fail',
            data: {
               'message': ' Aucun résultat '
            }
         };
      },
      testErreur = function() {
         return {
            'status': 'error',
            'message': 'Erreur fatale dans le service.'
         };
      },

      DossierModelMock = {
         getDossierPart: function(element) {
            return testREN;
         }
      };


   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
    */
   beforeEach(module('pelApp'));

   beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      scope = $rootScope.$new();
      backendMock = _$httpBackend_;
      resultatsCtrl = $controller('ResultatsCtrl', {
         $scope: scope,
         $routeParams: {
            'trimestre': '20151'
         }
      });

   }));


   /////////////////////////////////////////////////////////////////////////////
   /*
    * Effectuer et évaluer les TESTS.
    */

   it('resultatsCtrl devrait être défini', function() {
      expect(resultatsCtrl).toBeDefined();
   });

   it('strucTrimestreCourant devrait être défini', function() {
      expect(scope.strucTrimestreCourant).toBeDefined();
   });

   it('devrait récupérer un résultat', function() {
      backendMock.when('GET','/apis/resumeResultat/' + codePermanent ).respond(testData());
      backendMock.flush();
      expect(scope.trimestreCourant).toBeDefined();
      expect(scope.strucTrimestreCourant).toBeDefined();
      expect(scope.strucTrimestreCourant.programmes).toBeDefined();
   });

   it('actionner le bouton tout', function() {
      backendMock.when('GET','/apis/resumeResultat/' + codePermanent ).respond(testData());
      backendMock.flush();
      scope.actionnerBoutonTout();
      expect(scope.ouvrirTout).toBeFalsy();
   });

   it('devrait récupérer un message', function() {
      backendMock.when('GET','/apis/resumeResultat/' + codePermanent ).respond(testMessage());
      backendMock.flush();
      expect(scope.avertissements).toBeDefined();
   });

   it('devrait traiter une erreur', function() {
      backendMock.when('GET','/apis/resumeResultat/' + codePermanent ).respond(testErreur());
      backendMock.flush();
      expect(scope.err).toBeDefined();
   });


});

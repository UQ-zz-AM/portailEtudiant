/* jshint  unused:false, camelcase:false */
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

describe('Controller: OpusCtrl', function() {

   var OpusCtrl,
      scope,
      backendMock,
      codePermanent = 'identifiant',
      erreurGenerique = 'Une erreur est survenue, veuillez essayer plus tard.',
      url = '/apis/opus/identifiant/Automne/2015',
      routeParams = {};

   var testFail = {
      'status': 'fail',
      data: {
         'message': 'Aucun attestation.'
      }
   };

   var testErreur = {
      'status': 'error',
      'message': 'Erreur fatale dans le service.'
   };

   var testErreurService = {
      'status': 'success',
      'data': {'message' : 'Erreur fatale dans le service.',
         'reponseService' :{'err':'Allô la visite !'}
      }
   };

   var testErreurInconnue = {
      'status': 'success',
      'data': {
         'BOO' :'Ne devrait pas arriver.'
      }
   };

   var htmlValideAA = {
      'status': 'success',
      'data': {
         'html': '<body><table><tr><td>Allô</td></tr></table></body>'
      }
   };

   // Erreur HTML
   var htmlErreurFatale = {
      'status': 'success',
      'data': {
         'html': 'Erreur à l\'exécution de '
      }
   };

   // Message HTML
   var htmlMessage = {
      'status': 'success',
      'data': {'html':'Selon nos dossiers vous n\'êtes pas inscrit(e) à temps complet au trimestre ->Hiver 2015\n'}
   };


   var htmlValideSA = {
      'status': 'success',
      'data': {
         'html': 'Message d\'erreur du service.'
      }
   };

   var DossierModelMock = {
      getDossierPart: function(element) {
         return {
            'data': 'Data'
         };
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
      OpusCtrl = $controller('OpusCtrl', {
         $scope: scope,
         $routeParams: routeParams
      });
   }));

   /////////////////////////////////////////////////////////////////////////////
   /*
    * Effectuer et évaluer les TESTS.
    */

   it('OpusCtrl devrait être défini', function() {
      expect(OpusCtrl).toBeDefined();
   });

   it('devrait retourner une erreur lorsqu\'il n\'y a pas de $routeParams.', function() {
      backendMock.when('GET', url).respond(testErreur);
      // Modifier les params pour le test suivant.
      routeParams = {'trimestre':'2a153'};
      expect(scope.err).toBe(erreurGenerique);
   });

   it('devrait retourner une erreur mauvaise valeurs dans $routeParams.', function() {
      backendMock.when('GET', url).respond(htmlValideAA);
      expect(scope.err).toBe(erreurGenerique);
      // Modifier les params pour les tests suivants.
      routeParams = {'trimestre':'20153'};
   });

   it('devrait retourner une erreur lorsqu\'il y un status error.', function() {
      backendMock.when('GET', url).respond(testErreur);
      backendMock.flush();
      expect(scope.err).toBe(erreurGenerique);
   });

   it('devrait retourner une erreur lorsqu\'il y un status fail.', function() {
      backendMock.when('GET', url).respond(testFail);
      backendMock.flush();
      expect(scope.opus.html).not.toBeDefined();
   });

   it('devrait retourner un html valide avec une attestation.', function() {
      backendMock.when('GET', url).respond(htmlValideAA);
      backendMock.flush();
      expect(scope.opus.html).toBeDefined();
   });

   it('devrait retourner un html valide sans attestation.', function() {
      backendMock.when('GET', url).respond(htmlValideSA);
      backendMock.flush();
      expect(scope.opus.html).not.toBeDefined();
      expect(scope.avertissements.length).toBeGreaterThan(0);
   });


   it('devrait retourner un html valide avec erreur fatale.', function() {
      backendMock.when('GET', url).respond(htmlErreurFatale);
      backendMock.flush();
      expect(scope.err).toContain(erreurGenerique);
   });


   it('devrait retourner un html avec un message pour l\'étudiant.', function() {
      backendMock.when('GET', url).respond(htmlMessage);
      backendMock.flush();
      console.log(angular.mock.dump(scope));
      //expect(scope.opus.html).toBeDefined();
      //expect(scope.err).toContain(erreurGenerique);
   });


   it('devrait retourner une erreur http.', function() {
      backendMock.when('GET', url).respond(500);
      backendMock.flush();
      //expect(scope.opus.html).not.toBeDefined();
      expect(scope.err).toBe(erreurGenerique);
   });

   it('devrait retourner une erreur http.', function() {
      backendMock.when('GET', url).respond(testErreurInconnue);
      backendMock.flush();
      expect(scope.err).toBe(erreurGenerique);
   });

   it('devrait utiliser une attestation en cache(DossierModel) plutôt qu\'aller sur le réseau', inject(function($controller) {
      // injection du DossierModel
      OpusCtrl = $controller('OpusCtrl', {
         $scope: scope,
         DossierModel: DossierModelMock,
         $routeParams: routeParams
      });
      expect(scope.opus.html.data).toBe('Data');
   }));

   it('devrait retourner un retour avec un message Service. Vérifier le service pour voir si c\'est possible.', function() {
      backendMock.when('GET', url).respond(testErreurService);
      backendMock.flush();
      expect(scope.avertissements[0]).toContain('Allô');


   });


});

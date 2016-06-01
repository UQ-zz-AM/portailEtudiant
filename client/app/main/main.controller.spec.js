/* jshint unused:false, camelcase:false */
/* globals afterEach  */

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

describe('Controller: MainCtrl', function () {

   // load the controller's module
   beforeEach(module('pelApp'));

   var MainCtrl,
      scope,
      httpBackend,
      vURL = '',
      authMock = {
         logout: function(obj) {
            vURL = obj.url;
         },
      },
      consentement=false,
      mockUtilisateur = {
         isConsentement : true,
         setConsentement: function(newConsentement){
            consentement = newConsentement;
         }
      },
      form = {$valid:true},
      loginMock = {
         'token': 'eyJ0eXAiOiJKV1QiLCJh',
         'utilisateur': {
            'socio': {
               'code_perm': 'ZZZZ30547409',
               'nom': 'Paul',
               'prenom': 'Paul'
            },
            'prog': {
               'code_perm': 'ZZZZ30547409',
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
      mauvaisLoginMock = {
         'status': 'fail',
         'data': {
            'message': 'Erreur d\'authentification',
            'reponseService': {
               'err': 'Combinaison code_perm/NIP invalide'
            }
         }
      },
      mauvaisFormatLoginMock = {
         'status': 'fail',
         'data': {
            'message': 'Erreur d\'authentification',
         }
      },
      mauvaiseReponseJsendMock = {
         'status': 'fail',
         'data': {
            'inconnu': 'Erreur d\'authentification',
         }
      },
      errFatalMock = { 'status': 'error',
                 'message': 'Erreur fatale dans le service.'
      },
      postData = {
         'identifiant': 'CONQ01010106',
         'motDePasse': '00000'
      },
      mockMessages = {
         'status': 'fail',
         'data': {
            'heureMontreal': '20150929 08:14:06',
            'messages': [{
               'niveau': 'critique',
               'dateDeb': '20150829',
               'dateFin': '20180929',
               'message': 'Le portail étudiant est inaccessible, nous  sommes actuellement en rodage. Veuillez revenir un peu plus tard.'
            }, {
               'niveau': 'avertissement',
               'dateDeb': '20150829',
               'dateFin': '20180929',
               'message': ' Le portail sera inaccessible du 17 au 18 octobre, inclusivement.'
            }, {
               'niveau': 'information',
               'dateDeb': '20150829',
               'dateFin': '20180929',
               'message': ' La facture est maintenant disponible.'
            }]
         }
      };


   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
   */
   beforeEach(function (){

      module('pelApp');

      // Initialize the controller and a mock scope
      inject(function ($rootScope, $controller, $httpBackend, UtilisateurModel, Auth) {
         scope = $rootScope.$new();
         httpBackend = $httpBackend;

         MainCtrl = $controller('MainCtrl', {
            $scope: scope,
            Auth: authMock,
            UtilisateurModel: mockUtilisateur
         });
      });

      scope.user = {
         'codePermanent':'CONQ01010106',
         'password' : '00000'
      };

       httpBackend.when('GET','/messagesGlobaux').respond(mockMessages);
       httpBackend.flush();
   });

   afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
   });



   /////////////////////////////////////////////////////////////////////////////
   /*
   * Effectuer et évaluer les TESTS.
   */

   it('should be defined', function () {
      expect(MainCtrl).toBeDefined();
   });

   it('devrait contenir 3 messages globaux', function () {
      expect(scope.messagesGlobaux.length).toBe(3);
   });

   it('devrait se logger normalement', function () {
      httpBackend.when('POST','/authentification', postData).respond(loginMock);
      scope.login(form);
      httpBackend.flush();
      expect(scope.submitted).toBe(true);
      //console.log(angular.mock.dump(scope));
   });

   it('devrait avec un echec lors d\'une tentative de login avec erreur http', function () {
      httpBackend.when('POST','/authentification', postData).respond(500,'Erreur');
      scope.login(form);
      httpBackend.flush();
      expect(vURL).toBe('/difficulte');
   });

   it('devrait avoir un message lors d\'une tentative de login avec mauvais credentials', function () {
      httpBackend.when('POST','/authentification', postData).respond(mauvaisLoginMock);
      scope.login(form);
      httpBackend.flush();
      expect(scope.err).toBe(mauvaisLoginMock.data.reponseService.err);
   });

   it('devrait avoir un message lors d\'une tentative avec format invalide (retour de nodeJS) ', function () {
      httpBackend.when('POST','/authentification', postData).respond(mauvaisFormatLoginMock);
      scope.login(form);
      httpBackend.flush();
      expect(scope.err).toBe(mauvaisLoginMock.data.message);
   });

   it('devrait avoir un message lors d\'une erreur jsend ', function () {
      httpBackend.when('POST','/authentification', postData).respond(errFatalMock);
      scope.login(form);
      httpBackend.flush();
      expect(vURL).toBe('/difficulte');
   });

   it('devrait avoir un message lors d\'une réponse jsend inconnue ', function () {
      httpBackend.when('POST','/authentification', postData).respond(mauvaiseReponseJsendMock);
      scope.login(form);
      httpBackend.flush();
      expect(vURL).toBe('/difficulte');
   });

});

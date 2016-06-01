/*jshint unused:false */
/*global afterEach, Modernizr*/

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

describe('App authInterceptor Unit Tests', function() {

   var httpProvider,
      authInterceptor,
      rootScope,
      httpBackend,
      $http,
      $location,
      $cookieStore,
      //Auth,
      statut = false,
      vURL ='',
      loggin =true,
      mockAuth = function() {
         return{
            isLoggedIn: function(cb) {
               if (!cb) {
                  return (loggin);
               }
               cb (loggin);
            },
            logout: function(suite) {
               statut = false;
               if (suite.url){
                  vURL = suite.url;
               }
            }
         };
      };

   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
   */
   beforeEach(function (){

      module('pelApp', function ($httpProvider) {
         httpProvider = $httpProvider;
      });

      module(function($provide) {
         $provide.factory('Auth', mockAuth);
         $provide.value('Modernizr', {touch:true});
      });

      // Initialiser l'intercepteur.
      inject(function ($rootScope, _$http_, $httpBackend, _authInterceptor_, _$location_, _$cookieStore_) {
         rootScope = $rootScope;
         authInterceptor = _authInterceptor_;
         httpBackend = $httpBackend;
         $http = _$http_;
         $location = _$location_;
         $cookieStore = _$cookieStore_;
      });

   });


   afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
   });


   /////////////////////////////////////////////////////////////////////////////
   /*
   * Effectuer et évaluer les TESTS.
   */

   it('devrait avoir un intercepteur enregistré', function () {
       expect(httpProvider.interceptors).toContain('authInterceptor');
   });

   it('devrait avoir recevoir une erreur d\'authentification et passer par responseError', function () {
      // Affecte le path pour vérifier qu'il sera affecter par responseError
      $location.path('/dummy');
      httpBackend.when('GET','/').respond(401, 'PAS_OK');
      $http.get('/').then();
      httpBackend.flush();
      expect($location.path()).toBe('/');
      expect(rootScope.ajaxEnCours).toBeFalsy();
   });

   it('devrait lire un token et le mettre dans le header http dans request', function () {
      $cookieStore.put('token', 'blabla');
      httpBackend.when('GET','/').respond(200, 'OK');
      $http.get('/').then();
      httpBackend.flush();
      //TODO aller lire config.headers
      expect(rootScope.ajaxEnCours).toBeFalsy();
   });

   it('devrait créer un événement $routeChangeStart', inject(function($route) {
      httpBackend.when('GET',/.*/).respond(200, 'OK');
      // initialise le path pour vérifier s'il sera modifié.
      $location.path('/dummy');
      // Changer de route
      $location.url('/rif');
      httpBackend.flush();
      expect($location.path()).toBe('/rif');
   }));

   it('devrait créer un événement $routeChangeStart mais pas authentifié', inject(function($route) {
      httpBackend.when('GET',/.*/).respond(200, 'OK');
      // On spécifie qu'on est pas loggé.
      loggin = false;
      // initialise le path pour vérifier s'il sera modifié.
      $location.path('/nada');
      // Change de route, mais une route protégé avec authenticate = true
      $location.url('/consentement');
      httpBackend.flush();
      expect($location.path()).toBe('/');
   }));

   it('devrait se déconnecter', inject(function($rootScope) {
      //console.log(angular.mock.dump(rootScope));
      rootScope.logout();
      expect(vURL).toBe('/');
   }));

   it('ajuster Modernizer.touch à false. ', function() {
      expect(rootScope.deviceEvent).toBe('click');
      Modernizr.touch=false;
   });
   it('Modernizr.touch est maintenant faux. ', function() {
      expect(rootScope.deviceEvent).toBe('mouseenter mouseleave');
   });

});

/* jshint unused:false, camelcase:false */
/* globals spyOn, afterEach */

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

describe('Controller: RecuCtrl', function() {

   var scope,
      backendMock,
      recuCtrl,
      // Pour tester lorsque utilisateur-model
      mockRecuA = {
         getReleve : function(){
         return [{'annee':'2012'},{'annee':'2013'},{'annee':'2014'}];
         },
         getMessagesImpots: function() { return null; }
      },
      mockRecuB = {getReleve : function(){
         return undefined;
         },
         getMessagesImpots: function() { return null; }
      },
      mockRecu = mockRecuB,

      ie = false,
      chrome = false,
      ipad = false,
      appUtilMock = {
         isChrome : function(){
            return chrome;
         },

         isIpadIos71 : function(){
            return ipad;
         },
         isIE : function(){
            return ie;
         }
      },
      $location;

   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
   */

   beforeEach(function (){

      module('pelApp');

      /* Initialiser le contrôleur avec httpBackend et rootScope
      * et ressoudre les dépendances à rif(backendMock) et Auth (authMock).
      */
      inject(function($httpBackend, $rootScope, $controller, $cookieStore, UtilisateurModel, appUtil, _$location_) {
         scope = $rootScope.$new();
         scope.touch=false;
         backendMock = $httpBackend;
         $location = _$location_;
         recuCtrl = $controller('RecuCtrl', {
            $scope: scope,
            UtilisateurModel : mockRecu,//mockRecu,
            appUtil : appUtilMock//appUtilMock
         });
      });

   });

   afterEach(function() {
      backendMock.verifyNoOutstandingExpectation();
      backendMock.verifyNoOutstandingRequest();
   });

   /////////////////////////////////////////////////////////////////////////////
   /*
   * Effectuer et évaluer les TESTS.
   */

   it('redvrait sortir puisqu\'il n\'y a aucun relevé.', function() {
      expect(recuCtrl).toBeDefined();
      expect($location.path()).toBe('/');
      // Le premier test permet
      mockRecu = mockRecuA;
   });

   it('should be a scope value for releves[0].annee', function() {
      //console.log(angular.mock.dump(scope));
      expect(scope.releves[0].annee).toEqual('2012');
   });

   it('devrait retourner une erreur(lorsque json plutôt que pdf) à l\'appel de download ', function() {
      backendMock.when('GET','/apis/impots/2012', {'headers' : {'Accept': 'application/pdf'}}).respond('data', {'content-type':'application/json'});
      scope.download('/apis/impots', '2012');
      backendMock.flush();
      expect(scope.err).toBeDefined();
   });

   it('idem pour IE', function() {
      ie = true;
      backendMock.when('GET','/apis/impots/2012', {'headers' : {'Accept': 'application/pdf'}}).respond('data', {'content-type':'application/json'});
      scope.download('/apis/impots', '2012');
      backendMock.flush();
      expect(scope.err).toBeDefined();
   });

   it('idem pour ipad iOS7.1 /Chrome Android', function() {
      scope.touch=true;ie = false;chrome=true;ipad=true;

      backendMock.when('GET','/apis/impots/2012', {'headers' : {'Accept': 'application/pdf'}}).respond('data', {'content-type':'application/json'});
      scope.download('/apis/impots', '2012');
      backendMock.flush();
      expect(scope.err).toBeDefined();
   });

   it('devrait retourner un pdf à l\'appel de download ', function() {
      // TODO mettre un pdf dans data pour tester.
      //backendMock.when('GET','/apis/impots/2012', {'headers' : {'Accept': 'application/pdf'}}).respond("data", {"content-type":"application/pdf"});
      //scope.download('/apis/impots', '2012');
      //backendMock.flush();
      expect(scope.err).not.toBeDefined();
   });

   it('devrait retourner une erreur http à l\'appel de download ', function() {
      scope.touch=false;ie = false;chrome=false;ipad=false;
      backendMock.when('GET','/apis/impots/2012', {'headers' : {'Accept': 'application/pdf'}}).respond(500, 'Erreur');
      scope.download('/apis/impots', '2012');
      backendMock.flush();
      expect(scope.err).toBeDefined();
   });

   it('idem pour ipad iOS7.1 /Chrome Android', function() {
      scope.touch=true;ie = false;chrome=true;ipad=true;

      backendMock.when('GET','/apis/impots/2012', {'headers' : {'Accept': 'application/pdf'}}).respond(500, 'Erreur');
      scope.download('/apis/impots', '2012');
      backendMock.flush();
      expect(scope.err).toBeDefined();
   });

});

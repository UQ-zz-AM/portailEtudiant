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

describe('Controller: FactHistoCtrl', function() {

   var scope,
      backendMock,
      factHistoCtrl,
      // Pour tester lorsque utilisateur-model
      mockFactHistoA = {getFactHisto : function(){
         return [{'trimestre':'20151',  'date':'2015-03-22'},  {'trimestre':'20143',  'date':'2014-09-21'}];
         }
      },
      mockFactHistoB = {getFactHisto : function(){
         return undefined;
         }
      },
      mockFactHisto = mockFactHistoB,

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
         factHistoCtrl = $controller('FactHistoCtrl', {
            $scope: scope,
            UtilisateurModel : mockFactHisto
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

   it('redevrait sortir puisqu\'il n\'y a aucune facture historique.', function() {
      expect(factHistoCtrl).toBeDefined();
      expect($location.path()).toBe('/');
      mockFactHisto = mockFactHistoA;
   });

   it('should be a scope value for releves[0].annee', function() {
      expect(scope.factHistos[0].trimestre).toEqual('20151');
      expect(scope.factHistos[0].date).toEqual('2015-03-22');
   });


   // TODO
   // it('devrait retourner une erreur(lorsque json plutôt que pdf) à l\'appel de download ', function() {
   //    backendMock.when('GET','/apis/impots/2012', {'headers' : {'Accept': 'application/pdf'}}).respond('data', {'content-type':'application/json'});
   //    scope.download('/apis/impots', '2012');
   //    backendMock.flush();
   //    expect(scope.err).toBeDefined();
   // });


});

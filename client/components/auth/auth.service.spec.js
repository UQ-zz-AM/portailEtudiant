/* globals spyOn */


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


describe('Auth service', function() {

   // load the service's module
   beforeEach(module('pelApp'));

   var scope,
      auth,
      vwin;

   // Initialize the service
   beforeEach(inject(function($rootScope, Auth, $window) {
      scope = $rootScope.$new();
      auth = Auth;
      vwin = $window;
      spyOn(vwin, 'alert');
   }));

   it('should be defined', function() {
      expect(auth).toBeDefined();
   });

   it('devrait appel logout sans param', function() {
      auth.logout({'message':'allo'});
      expect(vwin.alert).toHaveBeenCalled();
   });

   it('devrait appel logout avec url', function() {
      // Comme location est utilisé par la page de test runner
      // On spy le wrapper logout.
      spyOn(auth, 'logout');
      auth.logout({'url':'/'});
      expect(auth.logout).toHaveBeenCalled();
   });

   it('devrait faire un appel a isLoggedIn sans argument', function() {
      auth.isLoggedIn();
      expect(auth.isLoggedIn).toBeDefined();
   });

   it('devrait faire un appel a isLoggedIn avec callback', function() {
      auth.isLoggedIn(function(){
         console.log('nada');
      });
      expect(auth.isLoggedIn).toBeDefined();
   });

});

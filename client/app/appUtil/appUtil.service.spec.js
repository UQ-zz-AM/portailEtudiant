
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

describe('Service: appUtil', function() {

   // load the service's module
   beforeEach(module('pelApp'));

   // instantiate service
   var appUtil;
   beforeEach(inject(function(_appUtil_) {
      appUtil = _appUtil_;
   }));

   it('should do something', function() {
      expect(!!appUtil).toBe(true);
   });

   it('isIE devrait être faux.', function() {
      expect(appUtil.isIE()).toBe(false);
   });

   it('isChrome devrait être faux.', function() {
      expect(appUtil.isChrome()).toBe(false);
   });

   it('isIpadIos71 devrait être faux.', function() {
      expect(appUtil.isIpadIos71()).toBe(false);
   });

   it('isIos devrait être faux.', function() {
      expect(appUtil.isIos()).toBe(false);
   });

   // getDate
   it('devrait obtenir différentes dates avec la function getDate.', function() {

      expect(appUtil.getDate).toBeDefined();

      // Valide 1er et date tronqué.
      expect(appUtil.getDate('2015-01-01')).toBe('1er janv. 2015');
      // Valide on ne valide pas l'intervale mais le format.
      expect(appUtil.getDate('1015-09-01')).toBe('1er sept. 1015');
      expect(appUtil.getDate('2014-08-08')).toBe('8 août 2014');

      // N'importe quoi.
      expect(appUtil.getDate('junk junk')).toBe('junk junk');
      expect(appUtil.getDate(undefined)).toBe(undefined);
   });

   // formatterDate
   it('devrait obtenir différentes dates avec la function formatterDate.', function() {
      expect(appUtil.formatterDate).toBeDefined();
      // Valide 1er et date tronquée retournée par getDate
      expect(appUtil.formatterDate('1er janv. 2015')).toBe('1<span class="premier">er</span> janv. 2015');
      expect(appUtil.formatterDate('1er sept. 1015')).toBe('1<span class="premier">er</span> sept. 1015');

      // N'importe quoi.
      expect(appUtil.formatterDate('junk junk')).toBe('junk junk');
      expect(appUtil.formatterDate(undefined)).toBe(undefined);
   });

   //getJour
   it('devrait obtenir différents jours avec la function getJour.', function() {

      expect(appUtil.getJour).toBeDefined();

      // Valide 1er et date trunqué.
      expect(appUtil.getJour('2015-01-01')).toBe('jeudi');
      expect(appUtil.getJour('1015-09-01')).toBe('vendredi');
      expect(appUtil.getJour('2014-08-08')).toBe('vendredi');

      // N'importe quoi.
      expect(appUtil.getJour('junk junk')).toBe('junk junk');
      expect(appUtil.getJour(undefined)).toBe(undefined);
   });

});

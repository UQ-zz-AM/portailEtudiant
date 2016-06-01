/* jshint unused:false */

'use strict';

describe('aTest', function() {


   var scope,
      elm,
      compiled,
      html = '<button class="moi" popover-trigger="click" type="button" popover="popover text">Selector Text</button>';

   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
   */
   beforeEach(function (){

      module('pelApp');

      inject(function ($rootScope, $compile) {
         scope = $rootScope.$new();

         //Créer un élément jqLite or jQuery.
         elm = angular.element(html);

         // Compiler l'élément dans une fonction pour traiter la vue.
         compiled = $compile(elm);

         //Exécuter la vue compilée.
         compiled(scope);

         scope.$digest();

      });

   });


   /////////////////////////////////////////////////////////////////////////////
   /*
   * Effectuer et évaluer les TESTS.
   */

   it('la classe buttonGoToPopover devrait être présente au départ.', function () {
      expect(scope).toBeDefined();
      expect(elm.hasClass('buttonGoToPopover')).toBe(true);
   });


});

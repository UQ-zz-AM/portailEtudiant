/*jshint indent:3 */

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

angular.module('pelApp')

.filter('dateComplete', function() {
   // transforme '20151123' -->  '23 novembre 2015'
   return function(input) {
      var mois = {
            '01': 'janvier',
            '02': 'février',
            '03': 'mars',
            '04': 'avril',
            '05': 'mai',
            '06': 'juin',
            '07': 'juillet',
            '08': 'août',
            '09': 'septembre',
            '10': 'octobre',
            '11': 'novembre',
            '12': 'décembre'
         },temp, premier,

      // 20151207
      pattern = /^\d{8}$/;
      if (input && pattern.test(input)) {
         premier = input.substr(6, 2);
         if (premier==='01') {
            premier = '1er';
         }
         temp =  premier + ' ' + mois[input.substr(4, 2)] + ' ' + input.substr(0, 4);
         if ( temp.indexOf('0') === 0){
            return temp.substr(1);
         }
         return temp;
      }
      // 07/12/2012
      pattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      if (input && pattern.test(input)) {
         premier = input.substr(0, 2);
         if (premier==='01') {
            premier = '1er';
         }
         temp = premier + ' ' + mois[input.substr(3, 2)] + ' ' + input.substr(6, 4);
         if ( temp.indexOf('0') === 0){
            return temp.substr(1);
         }
         return temp;
      }
      return input;
   };
})

.filter('dateCourte', function() {
   // transforme '20151123' -->  '2015-11-23'
   return function(input) {
      var pattern = /^\d{8}$/;
      if (input && pattern.test(input)) {
         return input.substr(0, 4) + '-' + input.substr(4, 2) + '-' + input.substr(6, 2);
      }
      return input;
   };
})

.filter('trimestre', function() {
   // Transforme '20153' -> 'hiver 2015'     '20121' -> 'automne 2012'    etc...
   return function(input) {
      var trimestre = {
            '1': 'hiver',
            '2': 'été',
            '3': 'automne'
         },
         pattern = /^\d{5}$/,
         patternSaison = /1|2|3/;

      if (input && pattern.test(input) && patternSaison.test(input.substr(4, 1))) {
         return trimestre[input.substr(4, 1)] + ' ' + input.substr(0, 4);
      }
      return input;
   };
})

.filter('trimestreSansAnnee', function() {
   // Transforme '20153' -> 'hiver'     '20121' -> 'automne'    etc...
   // On ne met pas l'année !
   return function(input) {
      var trimestre = {
            '1': 'hiver',
            '2': 'été',
            '3': 'automne'
         },
         pattern = /^\d{5}$/,
         patternSaison = /1|2|3/;

      if (input && pattern.test(input) && patternSaison.test(input.substr(4, 1))) {
         return trimestre[input.substr(4, 1)];
      }
      return input;
   };
})

.filter('trimestreTexte2num', function() {
   // transforme 'Automne - 2013'  --> '20133'
   //   Les patterns s'assure que l'input est valide, en majuscule ou en minuscule
   //   Si l'input est invalide, on le retourne sans le modifier
   return function(input) {
      if (!input) { return null; }
      var corresp = {'hiver': '1', 'été': '2', 'automne': '3'},
          patternSession = /^(hiver|été|automne)$/i,
          patternAnnee = /^\d{4}$/,
          trimestreElements = input.split(' - ');
      if (trimestreElements){
         if (patternSession.test(trimestreElements[0]) && patternAnnee.test(trimestreElements[1])) {
            return trimestreElements[1] + corresp[trimestreElements[0].toLowerCase()];
         }
      }
      return input;
   };
})

.filter('heureSansZero', function() {
   // transforme '09h30' -->  '9h30'
   return function(input) {
      var pattern = /^\d{2}h\d{2}$/;
      if (input && pattern.test(input)) {
         if ( input.indexOf('0') === 0){
            return input.substr(1);
         }
      }
      return input;
   };
});

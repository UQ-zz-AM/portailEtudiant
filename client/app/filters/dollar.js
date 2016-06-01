
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

angular.module('pelApp').filter('dollar', function() {
   'use strict';
   return function (input) {

      if (input && typeof input === 'string'){

         var negatif = (input.indexOf('-') !== -1),

         // Retirer tout sauf les nombres.
         nombre = input.replace(/\D/g,'');

         switch(nombre.length) {
            case 1:
               nombre = '0,0' +  nombre.substr(nombre.length - 1, 1);
               break;
            case 2:
               nombre = '0,' +  nombre.substr(nombre.length - 2, 2);
               break;
            case 6:
               nombre = nombre.substr(0, 1) +
               ' ' +  nombre.substr(1, 3) +
               ',' +  nombre.substr(nombre.length - 2, 2);
               break;
            case 7:
               nombre = nombre.substr(0, 2) +
               ' ' +  nombre.substr(2, 3) +
               ',' +  nombre.substr(nombre.length - 2, 2);
               break;

            default:
               nombre = nombre.substr(0, nombre.length -2) + ',' +  nombre.substr(nombre.length - 2, 2);
         }

         return (negatif) ? ('-' + nombre  + ' $') : (nombre  + ' $');

      }
      return input;
   };

});

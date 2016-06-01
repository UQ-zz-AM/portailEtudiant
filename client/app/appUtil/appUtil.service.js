/*jshint camelcase:false */

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

angular.module('pelApp').service('appUtil', function() {

   /**
    * Retire la réponse du format jsend. Ainsi l'interprétation du jsend n'a pas
    * à être dans tous les contrôlleurs.
    *
    * Les vues et les controlleurs utilisent plutôt ceci :
    *
    *     data : pour les réponses avec succès
    *     avertissements : un tableau de messages sans data
    *     err : contient un message d'erreur
    *
    * @param  {object}   reponse   La ressource.
    */

   this.interpreteJsend = function(reponse) {

      if (reponse && reponse.status !== undefined) {

         if (reponse.status === 'success' || reponse.status === 'fail') {
            return reponse.data;
         } else if (reponse.status === 'error') {
            return {
               'err': reponse.message
            };
         } else {
            return {
               'err': 'Une erreur est survenue (1)'
            };
         }

      } else {
         return {
            'err': 'Une erreur est survenue (2)'
         };
      }
   };

   this.isIE = function() {
      return (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Trident/') !== -1);
   };

   this.isChrome = function() {
      return (navigator.userAgent.indexOf('Chrome') !== -1);
   };

   this.isIpadIos71 = function() {
      return (navigator.userAgent.indexOf('CPU OS 7_1') !== -1 && navigator.userAgent.indexOf('iPad') !== -1);
   };

   this.isIos = function() {
      return (navigator.userAgent.indexOf('iPad') !== -1 || navigator.userAgent.indexOf('iPhone') !== -1);
   };


   this.sortBy = function () {

      var args = arguments,
         array = args[0],
         case_sensitive, keys_length, key, desc, a, b, i;

      if (typeof arguments[arguments.length - 1] === 'boolean') {
         case_sensitive = arguments[arguments.length - 1];
         keys_length = arguments.length - 1;
      } else {
         case_sensitive = false;
         keys_length = arguments.length;
      }

      return array.sort(function(obj1, obj2) {
         for (i = 1; i < keys_length; i++) {
            key = args[i];
            if (typeof key !== 'string') {
               desc = key[1];
               key = key[0];
               a = obj1[args[i][0]];
               b = obj2[args[i][0]];
            } else {
               desc = false;
               a = obj1[args[i]];
               b = obj2[args[i]];
            }

            if (case_sensitive === false && typeof a === 'string') {
               a = a.toLowerCase();
               b = b.toLowerCase();
            }

            if (!desc) {
               if (a < b) {return -1;}
               if (a > b) {return 1;}
            } else {
               if (a > b) {return -1;}
               if (a < b) {return 1;}
            }
         }
         return 0;
      });
   }; //end of objSort() function

   // ------------------------------------------------------------------------
   // Cette fonction détermine uniquement si on affiche ou non les périodes.
   // Martin
   // ------------------------------------------------------------------------
   this.isIcodeValid = function(icode) {
      if (icode === '2' ||
          icode === '3' ||
          icode === '5' ||
          icode === '6' ||
          icode === '8' ||
          icode === '9') {
         return false;
      } else {
         return true;
      }
   };

   // ------------------------------------------------------------------------
   // Retourne le jour associé à une date (lundi, mardi, etc...)
   // ------------------------------------------------------------------------
   this.getJour = function(dateDuJour) {
      var d = moment(dateDuJour, 'YYYY-MM-DD');
      if (d !== null && d.isValid()) {
         return moment(dateDuJour).format('dddd');
      } else {
         return dateDuJour;
      }
   };

   // ------------------------------------------------------------------------
   // Retourne la date en texte, par exemple: 1er janv. 2015
   // ------------------------------------------------------------------------
   this.getDate = function(date) {
     var d = moment(date, 'YYYY-MM-DD');

     if (d !== null && d.isValid()) {
        var dateFormate = moment(date).format('Do MMMM YYYY');
        if (dateFormate.length > 13) {
           return moment(date).format('Do MMM YYYY');
        } else {
           return dateFormate;
        }
     } else {
        return date;
     }
  };

   // ------------------------------------------------------------------------
   // Fonction qui ajoute une classe css pour que le 'er' de '1er' soit plus petit à l'affichage.
   //
   // Cette fonction formatte seulement la chaîne 1ER. Le er devient
   // plus petit.
   // Attention, la directive ng-bind-html d'AngularJS permet seulement
   // de passer l'attribut class et non style.
   // Martin
   // ------------------------------------------------------------------------
   this.formatterDate = function(dateString) {
     if (dateString && dateString.substring(0, 3).toUpperCase() === '1ER') {
        return '1<span class="premier">er</span>' + dateString.substring(3);
     }
     return dateString;
  };


});

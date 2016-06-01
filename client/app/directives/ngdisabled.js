/*jshint unused:false */

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

angular.module('pelApp').directive('optionsDisabled', function($parse) {
       var disableOptions = function(scope, attr, element, data,
                                     fnDisableIfTrue) {
           // refresh the disabled options in the select element.
           var options = element.find('option');


           var flagElemVide = false;

           for(var pos= 0,index=0;pos<options.length;pos++){
               var elem = angular.element(options[pos]);

               // Patch pour le menu vide au début. Martin -1
               if(elem.val() === '?'){
                  flagElemVide = true;
               }

               if(elem.val()!== ''){
                   var locals = {};

                   // Patch pour le menu vide au début. Martin -1
                   if (index > 0){
                     if (flagElemVide){
                        locals[attr] = data[index-1];
                     }else{
                        locals[attr] = data[index];
                     }
                     elem.attr('disabled', fnDisableIfTrue(scope, locals));
                   }
                   index++;
               }
           }
       };
       return {
           priority: 0,
           require: 'ngModel',
           link: function(scope, iElement, iAttrs, ctrl) {
               // parse expression and build array of disabled options
               var expElements = iAttrs.optionsDisabled.match(
                   /^\s*(.+)\s+for\s+(.+)\s+in\s+(.+)?\s*/);
               var attrToWatch = expElements[3];
               var fnDisableIfTrue = $parse(expElements[1]);
               scope.$watch(attrToWatch, function(newValue, oldValue) {
                   if(newValue){
                       disableOptions(scope, expElements[2], iElement,
                           newValue, fnDisableIfTrue);
                   }
               }, true);
               // handle model updates properly
               scope.$watch(iAttrs.ngModel, function(newValue, oldValue) {
                   var disOptions = $parse(attrToWatch)(scope);
                   if(newValue){
                      disableOptions(scope, expElements[2], iElement,
                          disOptions, fnDisableIfTrue);
                   }
               });
           }
       };
   });

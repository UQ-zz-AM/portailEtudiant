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

angular.module('pelApp').directive('cnStyler', function () {
        return {
            //# .restrict the directive to attribute only (e.g.: <style cn-styler>...</style>)
            restrict: 'A',
            link: function ($scope, $element, $attrs, controllers) {
                //# .$eval the in-line .options and setup the updateCSS function
                //#     NOTE: The expected string value of the inline options specifies a JSON/JavaScript object, hence the `|| {}` logic
                var css, regEx,
                    options = $scope.$eval($attrs.cnStyler) || {},
                    updateCSS = function () {
                        //# .$eval the css, replacing the results back into our $element's .html
                        $element.html($scope.$eval(css));
                    }
                ;

                //# Setup the .quote and the inverse in .unquote (which we use to process the css)
                //#     NOTE: In theory, the .unquote should not be present within the css
                options.quote = (options.usingSingleQuote !== false ? '\'' : '"');
                options.unquote = (options.quote === '"' ? '\'' : '"');
                regEx = new RegExp(options.unquote, 'g');

                //# Process the $element's .html into css, .replace'ing any present .unquote's with .quote's (this could cause problems), then the {{Angular}} (or /*{{Angular}}*/) variables with ' + stringified_versions + '
                if (options.commented !== false) {
                    css = options.unquote + ($element.html() + '')
                        .replace(regEx, options.quote)
                        .replace(/\/\*{{/g, options.unquote + '+')
                        .replace(/}}\*\//g, '+' + options.unquote) + options.unquote;
                } else {
                    css = options.unquote + ($element.html() + '')
                        .replace(regEx, options.quote)
                        .replace(/{{/g, options.unquote + '+')
                        .replace(/}}/g, '+' + options.unquote) + options.unquote;
                }

                //# .$watch for any changes in the $scope, calling our updateCSS function when they occur
                $scope.$watch(updateCSS);
            }
        };
    });

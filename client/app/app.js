
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

angular.module('pelApp', [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngRoute',
      'ui.calendar',
      'svgPng',
      'ui.bootstrap',
      'angularMoment'
   ])
   .config(function($routeProvider, $locationProvider, $httpProvider, moment) {
      $routeProvider
         .otherwise({
            redirectTo: '/'
         });

      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('authInterceptor');

      // timeout global pour ajax 10 sec.
      $httpProvider.defaults.timeout = 10000;


      //initialize get if not there
      if (!$httpProvider.defaults.headers.get) {
         $httpProvider.defaults.headers.get = {};
      }
      //disable IE ajax request caching
      $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

       moment.locale('fr-ca');
   })

.factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
      return {

         request: function(config) {

            $rootScope.ajaxEnCours=true;
            //
            // Pour tous les appels AJAX vers le serveur que le client effectue, on
            // doit insérer dans le http headers(Authorization) le token qui
            // nous a été fourni afin de s'authentifier auprès du serveur
            //
            config.headers = config.headers || {};
            if ($cookieStore.get('token')) {
               config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
            }
            return config;
         },

         response: function(response) {

            $rootScope.ajaxEnCours=false;

            if (response.data.token) {
               // On est authentifié, on conserve le token pour les futurs appels AJAX
               $cookieStore.put('token', response.data.token);
            }

            return response;
         },
         // TODO ajout de commentaires
         // On intercepte http 401 et on redirige vers le login.
         responseError: function(response) {

            $rootScope.ajaxEnCours=false;

            if (response.status === 401) {
               // remove any tokens
               $cookieStore.remove('token');
               $q.reject(response);
               $location.path('/');
            } else {
               return $q.reject(response);
            }
         }
      };
   })

   .run(function($rootScope, $location, Auth) {
      // On redirige vers login si la route demande l'authentification
      // et que l'utilisateur n'est pas connecté.
      $rootScope.$on('$routeChangeStart', function(event, next) {

         // Vérifie si on est authentifié.
         Auth.isLoggedIn(function(loggedIn) {

            // Si la route est coché authenticate:true, et que nous ne
            // sommes pas authentifié, alors on se
            // redirige vers la page d'accueil.
            // (par exemple, dans le fichier client/facturesEtImpots/app/rif/rif.js,
            //  nous avons authenticate: true)
            //
            if (next.authenticate && !loggedIn) {
               $location.path('/');
            }

         });
      });
   });

   // Puisque le bouton déconnexion est utilisé hors de ng-view
   // on place le logout dans le rootscope.
   angular.module('pelApp').run(function($rootScope, $window, Auth, APP, Modernizr) {
      $rootScope.logout = function(){
         Auth.logout({'url':'/'});
      };
      $rootScope.isLoggedIn = Auth.isLoggedIn;

      // Ici on utilise Modernizr pour vérifier si nous sommes
      // sur un appareil mobile. Le HTML comporte des if touch
      // et pour les popups des messages d'aide, l'événement
      // déclencheur n'est pas le même pour mobile ou Bureau.
      if (Modernizr.touch) {
         $rootScope.touch=true;
         $rootScope.deviceEvent='click';
      } else {
         $rootScope.touch=false;
         $rootScope.deviceEvent='mouseenter mouseleave';
      }

      // On se sert de content width pour accéder
      // au site version Desktop sur mobile.
      $rootScope.isDesktopMobileActive=true;


      // ------------------------------------------------------------------------
      // Cette fonction détermine si je suis sur un téléphone avec une brisure.
      // TODO retirer le code local qui fait cette vérification ailleurs.
      // Martin
      // ------------------------------------------------------------------------
      $rootScope.isTelephone = function(){
         if ($window.innerWidth <= APP.GLOBAL.resolutionTel){
            return true;
         }
         else{
            return false;
         }
      };

      // ------------------------------------------------------------------------
      // Comme nos boîtes modale sont très simple. On ne fait qu'un overlay
      // avec une zone blanche avec des messages.
      //
      // TODO comme faire avec Material Design :-)
      // Martin
      // ------------------------------------------------------------------------
      // Boîte de dialogue modale cachée au départ.
      $rootScope.dlog = {
         'messageStyle' : {'display':'none'},
         'hideMessages' : function(){
            this.overflow = {'overflow':'initial'};
            this.messageStyle = {'display':'none'};
            this.content = undefined;
            this.retour = undefined;
         },
         'showMessages' : function(content, retour){
            this.overflow = {'overflow':'hidden'};
            this.messageStyle = {'display':'block'};
            this.content = content;
            this.retour = retour;
         }
      };

   });

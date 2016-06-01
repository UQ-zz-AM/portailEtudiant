/*jshint unused:false, latedef:false, camelcase:false */
/*global BlobBuilder, saveAs */

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

angular.module('pelApp').controller('CalendrierCtrl', function($scope, $filter, $anchorScroll, $timeout, $window, $location, calendrierICS, moment, horaire, horaireUtil, reglesIns, appUtil, APP, DossierModel, UtilisateurModel) {
   'use strict';

   var allEvents = [],
       parseData,
       affecterScope,
       changerVueApresChangeDimension,
       personnaliserRendu,
       changerVue, setupMenu,
       cache = DossierModel.getDossierPart(APP.HORAIRE.nomService),
       resolutionTel = 460,
       errGenerique = 'Attention une erreur est survenue, veuillez essayer plus tard:';

   $scope.events = []; // voir stratégie pour vitesse dans Calendar.
   $scope.cal = {programmes:[]};
   // Pour ne pas afficher le libellé Examen s'il a aucun examen.
   $scope.examenPresent = false;
   // Lorsqu'il n'y a pas de download de ICS possible
   $scope.icsPossible = true;
   // Téléphone >=420
   $scope.telephone = false;

   // Puisque nous devons imprimer l'en-tête comme pour le RIF
   // lors de l'impression, nous devons accéder aux infos
   // de l'utilisateur et créer la date d'impression
   $scope.utilisateur = UtilisateurModel.getUtilisateur;
   $scope.dateImpression = moment().format('YYYYMMDD');


   parseData = function(horaireData, events) {
      var progCss = {},
         libelCoursMagistral = 'Cours magistral',
         programmeCount = 0;

      angular.forEach(horaireData.trimestre, function(t) {

         // A VALIDER
         // Passer seulement les trimestres >= 20151 pour les dates de début et fin du cours
         // qui sont absentes avant.
         if (parseInt(t.trim_num) >= 20151) {

            // loop sur les programmes
            angular.forEach(t.programme, function(p) {

               // Déterminer s'il s'agit d'un nouveau programme au calendrier.
               // Comme le programme peut revenir plusieurs fois pour plusieurs
               // trimestres, il faut mettre la classe CSS qu'une seule fois.
               if (!progCss.hasOwnProperty(p.code_prog)) {
                  programmeCount++;
                  progCss[p.code_prog] = programmeCount.toString();
                  $scope.cal.programmes.push(p);
               }

               angular.forEach(p.cours, function(c) {

                  //Construire tous les événements de cours en fonction des éléments de l'événement

                  angular.forEach(c.horaire, function(h) {


                     // Cours sans dates de rencontre
                     // Création d'un évènement pour chaque semaine entre la date de début et de fin du cours

                     if (c.dt_deb !== '' && c.dt_fin !== '') {

                        var dateDebut = moment(c.dt_deb, 'DD/MM/YYYY'),
                           dateFin = moment(c.dt_fin, 'DD/MM/YYYY'),
                           // nbSemaine = dateFin.diff(dateDebut, 'week'), -> Nb semaines complètes entre les 2 dates
                           nbSemaine = (dateFin.week() - dateDebut.week()) + 1, // Nb semaines sur le calendrier ou on
                           // doit afficher les cours
                           numeroSemaine = dateDebut.week();

                        for (var i = 0; i <= nbSemaine; i++) {

                           // Date à laquelle on doit mettre le cours dans le calendrier
                           var dateCal = moment('00:00', 'HH:mm').year(dateDebut.year()).week(numeroSemaine + i).day(h.jour).toDate();

                           // Ne pas créer l'évènement si on est à l'extérieur de l'intervalle de la date de
                           // début et de fin du cours
                           if ((dateCal >= dateDebut) && (dateCal <= dateFin)) {
                              var event = {
                                 title: c.sigle,
                                 local: h.local,
                                 typeCours: h.mode_util,
                                 cours: c,
                                 start: moment(h.hr_deb.replace('h', ':'), 'HH:mm').year(dateDebut.year()).week(numeroSemaine + i).day(h.jour),
                                 end:   moment(h.hr_fin.replace('h', ':'), 'HH:mm').year(dateDebut.year()).week(numeroSemaine + i).day(h.jour),
                                 allDay: false,
                                 className: ('programme-' + progCss[p.code_prog] + ' ' + (h.mode_util.toLowerCase().indexOf('cours magistral') === -1 ? '' : ' cours-magistral'))
                              };

                              if (event.typeCours.toLowerCase() === 'cours magistral') {
                                 event.typeCours = libelCoursMagistral;
                              }
                              events.push(event);
                           }
                        }
                     }

                  });


                  // Cours avec dates de rencontre
                  // Création d'un évènement pour chacune des dates de rencontre
                  angular.forEach(c.rencontre, function(r) {

                        var event = {
                           title: c.sigle,
                           local: r.local,
                           typeCours: 'Rencontre',
                           cours: c,
                           start: moment(r.date + ' ' + r.hr_deb.replace('h', ':'), 'DD/MM/YYYY HH:mm'),
                           end: moment(r.date + ' ' + r.hr_fin.replace('h', ':'), 'DD/MM/YYYY HH:mm'),
                           allDay: false,
                           className: ('programme-' + progCss[p.code_prog])
                        };

                        events.push(event);
                  });



                  //Construire tous les événements d'examens.
                  angular.forEach(c.examen, function(e) {

                     var event = {
                        title: c.sigle,
                        typeCours: e.type,
                        local: (e.local === undefined ? '' : e.local),
                        cours: c,
                        // Si pas d'heure dans la section allDay.
                        allDay: ( ( e.hr_deb !== '' && e.hr_fin !=='') ? false : true),
                        start: moment(e.date + ' ' + e.hr_deb.replace('h', ':'), 'DD/MM/YYYY HH:mm'),
                        end: moment(e.date + ' ' + e.hr_fin.replace('h', ':'), 'DD/MM/YYYY HH:mm'),
                        className: ('programme-' + progCss[p.code_prog] + ' ' + 'examen')
                     };
                     events.push(event);
                     if (!$scope.examenPresent){
                        $scope.examenPresent = true;
                     }

                  });

               });

            }); // loop sur les programmes

         }
      }); // Loop sur les trimestres


      // Loop les dates importantes du calendrier universitaire.
      angular.forEach(horaireData.calendrier, function(calendrier) {

         var event = {
            title: calendrier.desc_evenement
         };

         if (calendrier.type_evenement === 'F') {

            // Pour que les jours fériés durent toutes la journée.
            event.start = moment(calendrier.date_evenement, 'DD/MM/YYYY').hour(7).minute(30);
            event.end   = moment(calendrier.date_evenement, 'DD/MM/YYYY').hour(23).minute(30);
            event.className = ('dateImportante date-importante-type-' + calendrier.type_evenement);

         } else {

            event.start = moment(calendrier.date_evenement, 'DD/MM/YYYY');
            event.end = moment(calendrier.date_evenement, 'DD/MM/YYYY');
            event.allDay = true;
            event.className = ('dateImportante date-importante-type-' + calendrier.type_evenement);

         }


         // RETIRER LES ÉLÉMENTS(cours, examens, etc.) DES JOURS FÉRIERS.
         // Je le fais de cette façon plutôt que des if avant tous les ajouts
         // car c'est plus simple à modifier et c'est possible qu'on retire ça...
         // Ici, events ne contient pas encore de date importante.
         if (calendrier.type_evenement === 'F') {
            for (var i = 0; i < events.length; i++) {
               if (moment(event.start).format('LL') === moment(events[i].start).format('LL') && events[i].className !=='dateImportante date-importante-type-F') {
                  events.splice(i--, 1);
               }
            }
         }
         //console.log(event);
         events.push(event);
      });

      // Nouveau
      // loop pour les périodes d'inscription.
      if (horaireData.periodesIns && horaireData.periodesIns.programmes) {

         var typePeriode = {
            ABA:'d\'abandon',
            INS:'d\'inscription'
         };
         // On boucle sur chaque programme d'étude
         angular.forEach(horaireData.periodesIns.programmes, function(pI) {

            // seulement exclusion de quelques icode
            // Ne pas afficher les programes avec un icode: 2, 3, 5, 6, 8, 9
            if (reglesIns.isIcodeValid(pI.icode)) {

               // On boucle sur chaque trimestre
               angular.forEach(pI.trimestres, function(unTrimestre) {

                  var trimestreParticulier = ''; // Session intensive ou régulière
                  if (unTrimestre.sous_ses_txt) {
                     trimestreParticulier = ', trimestre ' + unTrimestre.sous_ses_txt.toLowerCase();
                  }

                  // On boucle sur chaque fenêtre d'inscription
                  angular.forEach(unTrimestre.fenetres, function(f) {
                     var debut = $filter('dateComplete')(f.date_deb_fen.replace(/\-/g,''));
                     var fin = $filter('dateComplete')(f.date_fin_fen.replace(/\-/g,''));
                     var debutCourt = debut.substr(0, debut.length - 4).replace(/^1 /,'1er ');
                     var debutFin = fin.substr(0, fin.length - 4).replace(/^1 /,'1er ');

                     var event = {
                        title: 'Du ' + debutCourt + ' au ' + debutFin + ' : ' +
                               'période ' + typePeriode[f.type_fenetre] +
                               ' ' + $filter('trimestre')(unTrimestre.an_ses_num) + trimestreParticulier + ' (' + pI.code_prog + ')',
                        start : moment(f.date_deb_fen, 'YYYY-MM-DD'),
                        end : moment(f.date_fin_fen, 'YYYY-MM-DD').add(1, 'day'),
                        className : ('periode' + '-' + f.type_fenetre.toLowerCase()),
                        allDay : true
                     };
                     events.push(event);
                  });

               });


            } // if icode valide

         });

      }

   };


   affecterScope = function(data) {

      parseData(data, allEvents);
      // Attendre que le cycle «digest» soit terminé avant d'accéder
      // la variable myCalendar.
      $timeout(function(){
         // Initialisation du menu date pour le téléphone.
         $scope.dateTelephone=moment().format('YYYY-MM-DD');
         // Ajuster la vue en fonction si téléphone ou non.
         changerVueApresChangeDimension(null);
         $scope.myCalendar.fullCalendar('addEventSource', allEvents);
      });
   };


   if (cache !== null) {
      affecterScope(cache);
   } else {
      horaire.get({'identifiant': 'identifiant'}, function(data) {

         if (data.code_perm) { // OK

            // Cette procédure traite les dates de rencontre, s'il y en a
            horaireUtil.ajouteLieu(data);

            DossierModel.setDossierPart(APP.HORAIRE.nomService, data, APP.HORAIRE.delaiCache);
            affecterScope(data);
         } else if (data.message) { // fail de jsend un message seulement.
            if (data.reponseService){
               if (data.reponseService.err === 'Aucun horaire n\'est présent au dossier') {
                  $scope.aucunHoraire = true;
               } else {
                  $scope.avertissements = [data.reponseService.err];
               }
            } else{
               $scope.avertissements = [data.message];
            }
         } else if (data.err) {
            $scope.err = errGenerique;
         } else {
            $scope.err = errGenerique;
         }

      }, function(err) {
         // TODO
         $scope.err = errGenerique;
      });

   }


   /////////////////////////////////////////////////////////////////////////////
   // Callbacks pour le calendrier

   // Calendrier. Cette fonction permet de personnaliser le rendu
   // de la composante «FullCalendar». Cette fonction est appellée
   // pour le «rendu» de chaque élément du calendrier.
   // Seul param view doit être présent.
   personnaliserRendu = function(event, element, view) {

      var inner; // Contenu de l'élément.

      // Ajoute la classe 'aujourdhui' dans l'entête de la journée courante (jaune-orange)
      var headClass = ['0', '.fc-mon', '.fc-tue', '.fc-wed', '.fc-thu', '.fc-fri', '.fc-sat', '.fc-sun'],
         now = moment();
      if (now >= view.start && now <= view.end) {
         jQuery('body').find(headClass[now.format('e')]).addClass('aujourdhui');
      }

      // Personnaliser les éléments à afficher pour un événement.
      if (event && (event.typeCours || event.local)) {

         // Obtenir une référence sur le contenu de l'événement
         inner = element.find('.fc-content');

         // Ajout des classes type de cours et local.
         // Ajout des éléments type et local à la suite.
         jQuery('<p class="coursType" />').html(event.typeCours).appendTo(inner);
         jQuery('<p class="coursLocal" />').html(event.local).appendTo(inner);

         // Extraire l'heure et l'ajouter à la suite des autres éléments.
         // Retirer l'heure de la première position, défaut de FullCalendar,
         // une fois ajoutée à la suite des autres éléments.
         if (! event.allDay){
            jQuery('<p class="customTime" />').html(inner.find('.fc-time span').text().replace(/:/g,'h')).appendTo(inner);
            // Si ça cause des problèmes que le div fc-time ne soit pas là,
            // on peut utiliser .empty().
            element.find('.fc-content .fc-time').remove();
         }
      }

   };



   // Manipulation du menu des mois
   // Setup des données du Menu mois année.
   // 7 mois avant et après la date courante
   setupMenu = function(dateCentrale) {

      // par défaut, aujourdhui
      if (!dateCentrale) {
         dateCentrale = moment();
      } else {
         // On construit un nouvel objet car on le modifie
         dateCentrale = moment(dateCentrale);
      }
      dateCentrale.set('date', 1);
      var menus = [];

      // On affiche 14 mois autour de la date choisi
      dateCentrale.set('month', dateCentrale.month()-8);
      for (var i = -8; i < 7; i++) {
         dateCentrale.add(1, 'month');
         menus.push({
            'value': dateCentrale.format('MM-DD-YYYY'),
            'libel': dateCentrale.format('MMMM YYYY')
         });
      }
      return menus;
   };
   $scope.menus = setupMenu(null);



   $scope.changeMenu = function() {
      $scope.myCalendar.fullCalendar('gotoDate', moment($scope.menuSelectionne.value, 'MM-DD-YYYY'));
   };

   $scope.changeDate = function() {
      if (! $scope.dateTelephone) {
         // Attention, pas de date nulle, on force la date du jour
         $scope.dateTelephone=moment().format('YYYY-MM-DD');
      }
      $scope.myCalendar.fullCalendar('gotoDate', moment($scope.dateTelephone,'YYYY-MM-DD'));
   };



   // Sur tous les changements de date, on ajuste l'affichage de la semaine et du menu des mois
   changerVue = function(view, element) {
      if (view) {
         var startDate = view.start,
            endDate = moment(view.end).subtract(1, 'days'),
            dateDuMois = endDate.format('MMMM YYYY');

         // Maj des dates de l'en-tête du calendrier.
         $scope.startDate = appUtil.getDate(startDate.format('YYYY-MM-DD')); //startDate.format('Do MMMM');
         $scope.endDate = appUtil.getDate(endDate.format('YYYY-MM-DD')); //endDate.format('Do MMMM YYYY');

         // On reconstruit le menu des mois selon la date courante
         $scope.menus = setupMenu(startDate);
         // On place la date dans le menu téléphone
         $scope.dateTelephone=startDate.format('YYYY-MM-DD');

         // Et on sélectionne le bon mois
         angular.forEach($scope.menus, function(menuCourant) {
            if (menuCourant.libel === dateDuMois) {
               $scope.menuSelectionne = menuCourant;
            }
         });
      }
   };



   // Sur tous les changements de date de téléphone, on ajuste l'affichage de la semaine et du menu des mois.
   changerVueApresChangeDimension = function(view) {
      if ($window.innerWidth <= resolutionTel){
         $scope.telephone = true;
         $scope.myCalendar.fullCalendar( 'changeView', 'agendaDay' );
      }else{
         $scope.telephone = false;
         $scope.myCalendar.fullCalendar( 'changeView', 'agendaWeek' );
      }
   };



   /* L'objet de configuration du calendrier. */
   $scope.uiConfig = {

      calendar: {
         header: {
            left: '',
            center: '', // month agendaWeek agendaDay
            right: ''
         },
         axisFormat: 'H',
         minTime: '07:30:00',
         maxTime: '23:30:00',
         defaultView: 'agendaWeek',
         firstDay: 1, //Lundi
         slotEventOverlap: false,
         allDayText: ' ',
         height: 1500,
         columnFormat: {
            month: 'dddd',
            week: 'dddd D',
            day: 'dddd D'
         },
         timeFormat: 'H:mm',
         viewRender: changerVue,
         eventRender: personnaliserRendu,
         dragScroll:false,
         droppable:false,
         // Comme iOS ne répond pas au click mais au mouseover lors
         // du premier click, c,est ce que nous utilisons.
         eventMouseover: function(calEvent, element, view){
            if  (appUtil.isIos()){
               $scope.coursCourant = calEvent.cours;
               $anchorScroll();
            }
         },
         eventClick: function(calEvent, jsEvent, view) {
            // Afficher le cours cliqué.
            if (calEvent.url){
               $location.path(calEvent.url);
            }
            // Afficher le cours cliqué.
            if (calEvent.cours){
               $scope.coursCourant = calEvent.cours;
               $anchorScroll();
            }
         },
         // phone rotation
         windowResize: changerVueApresChangeDimension

      }

   };

   //
   /////////////////////////////////////////////////////////////////////////////


   // Cette source est obligatoire pour la directive calendrier.
   // Nous ajoutons les événements directement via fullCalendar
   // au retour de la requête async.
   $scope.eventsSource = [];


   // Fonction ajouté au scope afin de permettre au élément
   // ajoutés au calendrier d'appeller fullCalendar.
   // La commande est directement passée à FullCalendar.
   $scope.calAction = function(cmd) {
      $scope.myCalendar.fullCalendar(cmd);
   };


   $scope.removeCoursCourant = function() {
      delete $scope.coursCourant;
      // S'assurer que lorqu'on affiche le détail du cours scroll jusqu'en haut.
      $anchorScroll();
   };


   // Aller chercher le fichier ICS via un service
   $scope.downloadICS = function() {

      if (!$scope.cal || !$scope.cal.programmes  || $scope.cal.programmes.length===0) {
         $scope.icsPossible = false;
         return;
      }

      calendrierICS.get({'identifiant': 'identifiant'}, function(data) {

         //console.log('ICS:' + data.ical);

         if (!data || data.err || !data.ical) {
            $scope.err = errGenerique;
            return;
         }

         // download !
         var blob;
         if (navigator.userAgent.indexOf('MSIE 10') === -1) { // chrome or firefox
            blob = new Blob([data.ical], {type: 'text/calendar'});
         } else { // ie
            var bb = new BlobBuilder();
            bb.append(data.ical);
            blob = bb.getBlob('text/x-vCalendar;charset=' + document.characterSet);
         }

         saveAs(blob, 'calendrier.ics');

      },
      function(err) {
         // TODO
         $scope.err = errGenerique;
      });

   };

});

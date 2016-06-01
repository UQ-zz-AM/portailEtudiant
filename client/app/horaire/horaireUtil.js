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

angular.module('pelApp').service('horaireUtil', function() {

'use strict';

   // Fonction qui boucle sur les dates de rencontre et qui ajoute le
   // local et l'url du pavillon qui sont dans l'horaire, si
   // cette date de rencontre se retrouve dans l'horaire
   //
   // S'il n'y a pas de date de rencontre, on ne touche à rien
   // S'il y a des dates de rencontres, tous les horaires seront effacés
   //
   //   En entrée, le json reçu par le factory 'horaire'
   this.ajouteLieu = function(serviceHoraire) {

      if (!serviceHoraire || !serviceHoraire.trimestre || serviceHoraire.trimestre.length === 0) {
         return;
      }

      // Ne capotez pas, mais ici,
      //    on boucle dans les trimestres, puis dans les programmes, puis dans les cours, puis dans les rencontres, puis dans les horaires

      // Pour chaque trimestre
      for (var k = 0; k < serviceHoraire.trimestre.length; k++) {
         if (serviceHoraire.trimestre[k].programme && serviceHoraire.trimestre[k].programme.length > 0) {

            // Pour chaque programme
            for (var m = 0; m < serviceHoraire.trimestre[k].programme.length; m++) {
               if (serviceHoraire.trimestre[k].programme[m].cours && serviceHoraire.trimestre[k].programme[m].cours.length > 0) {

                  // Pour chaque cours
                  for (var c = 0; c < serviceHoraire.trimestre[k].programme[m].cours.length; c++) {

                     // On va arrêter de trainer des variables très longues
                     // parce que ce n'est pas brillant
                     var rencontres = serviceHoraire.trimestre[k].programme[m].cours[c].rencontre;
                     var horaires = serviceHoraire.trimestre[k].programme[m].cours[c].horaire;


                     if (rencontres && horaires && rencontres.length > 0 && horaires.length > 0) {

                        // Pour chaque rencontre
                        for (var i = 0; i < rencontres.length; i++) {

                           // Pour chaque horaire
                           // On cherche dans l'horaire pour un moment identique (jour, heureDebut et HeureFin)
                           for (var j = 0; j < horaires.length; j++) {
                              if (horaires[j].jour === rencontres[i].jour &&
                                 horaires[j].hr_deb === rencontres[i].hr_deb &&
                                 horaires[j].hr_fin === rencontres[i].hr_fin) {
                                 // On a un match !!!
                                 // On greffe le local et l'url_pavillon, s'ils sont présents dans l'horaire
                                 if (horaires[j].local) {
                                    rencontres[i].local = horaires[j].local;
                                 }
                                 if (horaires[j].url_pavillon) {
                                    rencontres[i].url_pavillon = horaires[j].url_pavillon;
                                 }

                              }
                           }

                        }

                        // On efface les horaires, puisqu'il y a des dates de rencontre
                        // serviceHoraire.trimestre[k].programme[m].cours[c].horaireDebug =
                        // serviceHoraire.trimestre[k].programme[m].cours[c].horaire;
                        serviceHoraire.trimestre[k].programme[m].cours[c].horaire = null;

                     }
                  }
               }
            }
         }
      }

   };


});

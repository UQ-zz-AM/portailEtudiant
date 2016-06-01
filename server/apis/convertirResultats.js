
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



// Conversion du format JSON de 'résultats' car on veut les cours par trimestre et par programme.
//
// Le service "https://wwt....." retourne
// les résultats des différentes évaluations d'un cours sous la forme   VOIR test.spec.js
//
// Il faut replacer cette structure dans la forme suivante pour faciliter le travail du coté client


//
//  On construit donc un tableau de trimestre, qui contient un tableau de programme d'études, qui contient un tableau d'activités (un cours)

//
//
var convertirResultats = function(lesResultats) {

   // Validation
   if (!lesResultats) {
      return lesResultats;
   }
   if (!lesResultats.resultats) {
      return lesResultats;
   }
   if (!lesResultats.resultats.activites) {
      return lesResultats;
   }

   // Ajoute l'activité dans un tableau de programme d'étude
   var ajouteProgramme = function(tableauProgramme, uneActivite) {
      var trouve = false;
      // Si le programme d'étude est déjà dans le tableau, on ne fait qu'ajouter l'activité
      tableauProgramme.forEach(function(unProgramme) {
         if (unProgramme.codeProg === uneActivite.programme) {
            unProgramme.activites.push(uneActivite);
            trouve = true;
         }
      });
      if (!trouve) {
         // On n'a pas trouvé le programme d'étude
         // Donc on le crée et on lui ajoute l'activité
         tableauProgramme.push({
            "codeProg": uneActivite.programme,
            "titreProgramme": uneActivite.titreProgramme, // On déplace le titre du programme d'étude à ce niveau
            "activites": [uneActivite]
         });
      }
   };

   // Ajoute l'activité dans un tableau de trimestre
   var ajouteTrimestre = function(tableauTrimestre, uneActivite) {
      var trouve = false;
      // Si le trimestre est déjà dans le tableau, on ne
      // fait qu'ajouter l'activité au tableau de programme d'étude
      tableauTrimestre.forEach(function(unTrimestre) {
         if (unTrimestre.trimestre === uneActivite.trimestre) {
            ajouteProgramme(unTrimestre.programmes, uneActivite);
            trouve = true;
         }
      });
      if (!trouve) {
         // On n'a pas trouvé le trimestre
         // On ajoute d'abord l'activité à un tableau de programme d'étude
         // puis on crée le trimestre
         var tableauProgramme = [];
         ajouteProgramme(tableauProgramme, uneActivite);
         tableauTrimestre.push({
            "trimestre": uneActivite.trimestre,
            "programmes": tableauProgramme
         });
      }
   };

   var retour = {
      "resultats": []
   };
   lesResultats.resultats.activites.forEach(function(uneActivite) {
      ajouteTrimestre(retour.resultats, uneActivite);
   });

   return retour;

};


module.exports = convertirResultats;


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

angular.module('pelApp').filter('notationLibel', function() {

   return function(input) {
      if (input){
         if (input==='A+') { return 'Excellent';}
         else
         if (input==='A') { return 'Excellent';}
         else
         if (input==='A-') { return 'Excellent';}
         else
         if (input==='tA') { return 'Excellent';}
         else
         if (input==='ABS') { return 'Absence';}
         else
         if (input==='B+') { return 'Très bien';}
         else
         if (input==='B') { return 'Très bien';}
         else
         if (input==='B-') { return 'Très bien';}
         else
         if (input==='tB') { return 'Très bien';}
         else
         if (input==='C+') { return 'Bien';}
         else
         if (input==='C') { return 'Bien';}
         else
         if (input==='C-') { return 'Bien';}
         else
         if (input==='tC') { return 'Bien';}
         else
         if (input==='D+') { return 'Passable ';}
         else
         if (input==='D') { return ' Passable';}
         else
         if (input==='E') { return 'Échec';}
         else
         if (input==='EXE') { return 'Exemption';}
         else
         if (input==='H') { return 'Hors programme';}
         else
         if (input==='I') { return 'Incomplet';}
         else
         if (input==='K') { return 'Exemption pour reconnaissance d\'acquis';}
         else
         if (input==='L') { return 'Échoué repris et réussi';}
         else
         if (input==='N') { return 'Non crédité';}
         else
         if (input==='N.A.') { return 'Ne s\'applique pas';}
         else
         if (input==='ND') { return 'Non disponible';}
         else
         if (input==='P') { return 'Cours d\'appoint';}
         else
         if (input==='R') { return 'Résultat reporté';}
         else
         if (input==='S') { return 'Succès';}
         else
         if (input==='W') { return 'Cours suivi à titre d\'auditeur-trice';}
         else
         if (input==='X') { return 'Abandon autorisé';}
         else
         if (input==='#') { return 'Délai autorisé pour la remise du résultat';}
         else
         if (input==='*') { return 'Résultat non disponible';}
         else
         if (input==='**') { return 'Ces activités ne sont pas évaluées et ne mènent à l\'obtention d\'aucun crédit universitaire';}
         else
         if (input==='NOTE FINALE') { return 'La note finale, c\'est FINAL ! :-)';}
      }
      return null;
   };

});

// Si nous avons un nombre, on le retourne sous forme de chaine de caractères avec 2 positions après le point
//   On remplace les points par une virgule
//            Attention : des virgules dans RESULTAT mais des points dans le RELEVÉ DE NOTES
//            C'est bizarre, mais c'est comme çà !!
//            RESULTAT utilise des 'number'
//            Le RELEVÉ utilise des 'string'
angular.module('pelApp').filter('formatteChiffre', function() {
   return function(input) {
      if (typeof input === 'number') {
         return input.toString().replace('.',',');
      } else {
         if (typeof input === 'string') {
            return input;  //.replace('.',',');   Attention : des virgules dans RESULTAT mais des points dans le RELEVÉ DE NOTES
         }
      }
      return input;
   };
});

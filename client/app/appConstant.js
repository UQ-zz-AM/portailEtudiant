/*global Modernizr */

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

angular.module('pelApp').constant('APP', {

   // Services
   'RIF': { nomService :'rif',
            delaiCache : 120, // secondes
            RESTurl:'/apis/rif/:identifiant/:p_session/:p_dateProduction'
   },
   'RECU': { nomService :'recu',
            delaiCache : 120, // secondes
            RESTurl:'/apis/rifSommaire/:identifiant'
   },
   'HORAIRE': { nomService :'horaire',
            delaiCache : 120, // secondes
            RESTurl:'/apis/horaire/:identifiant'
   },
   'RELEVE' : { nomService :'releve',
            delaiCache : 480, // secondes
            RESTurlReleve:'/apis/releve/:identifiant/:programme/:resultat',
            RESTurlIns:'/apis/programmeIns/:identifiant/'
   },
   'RESUMERESULTATS' : { nomService :'resumeResultats',
            delaiCache : 480, // secondes
            RESTurl:'/apis/resumeResultat/:identifiant/'
   },
   'RESULTATSACTIVITE' : { nomService :'resultatActivite',
            delaiCache : 480, // secondes
            RESTurl:'/apis/resultatActivite/:identifiant/:Pc_trimestre/:Pc_sigle/:Pc_groupe'
   },
   'AUTORISATION' : { nomService :'autorisation',
            delaiCache : 480, // secondes
            RESTurl:'/apis/periodesIns/:identifiant/:PC_IND_TOUS'
   },
   'MESSAGESGLOBAUX' : { nomService :'messagesGlobaux',
            delaiCache : 960, // secondes   == 16 minutes
            RESTurl:'/messagesGlobaux'
   },
   'CALENDRIERICS' : { nomService :'calendrierICS',
            delaiCache : 480, // secondes
            RESTurl:'/apis/calendrierICS/:identifiant'
   },
   'INSCRIPTION' : { nomService :'inscription',
            delaiCache : 20, // secondes
            RESTurlValidation:'/apis/validationIns/:identifiant/:programme/:trimestre/:avecAutorisation',
            RESTurlIns:'/apis/traiteIns/:identifiant/:programme/:trimestre/:codeTrans' +
                       '/:sigle/:groupe/:sigleAncien/:groupeAncien',
            RESTurlInsLot:'/apis/traiteInsLot/:identifiant/:programme/:trimestre/:codeTrans/:lot',
            RESTurlGroupes:'/apis/listeCoursGroupe/:identifiant/:programme/:trimestre/:sigle'
   },
   'OPUS': { nomService :'opus',
            delaiCache : 120, // secondes
            RESTurl:'/apis/opus/:identifiant/:trimestre/:annee'
   },
   'EVALUATION': { nomService :'evaluation',
            delaiCache : 120, // secondes
            RESTurlListeCoursEvaluable:'/apis/listeCoursEvaluable/:identifiant/',
            RESTurlObtenirQuestionnaire:'/apis/obtenirQuestionnaire/:identifiant/:Pn_id_enseignement'
   },
   'GLOBAL' :{
      // Résolution minimum pour considérer qu'un téléphone
      // est au mode portrait.
      resolutionTel: 460
   }

});


angular.module('pelApp').constant('Modernizr', Modernizr);

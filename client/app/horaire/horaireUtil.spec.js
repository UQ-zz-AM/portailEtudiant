
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

describe('Service: horaireUtil', function() {


   var testUnHoraire = {
      "trimestre": [{
         "trim_txt": "Automne - 2015",
         "trim_num": "20153",
         "programme": [{
            "code_prog": "7954",
            "titre_prog": "baccalauréat en enseignement secondaire (mathématiques)",
            "cours": [{
               "sigle": "ASC6003",
               "groupe": "20",
               "titre": "Problématiques interculturelles à l\'école québécoise",
               "nb_cred": "3.0",
               "rem1": "Examens: 31 oct.  et 19 déc. ",
               "rem2": "apportez votre lunch",
               "dt_deb": "",
               "dt_fin": "",
               "horaire": [{
                  "jour": "Lundi   ",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30",
                  "local": "A-R520  ",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/a"
               }, {
                  "jour": "Lundi   ",
                  "hr_deb": "14h00",
                  "hr_fin": "17h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Mardi   ",
                  "hr_deb": "09h30",
                  "hr_fin": "13h00",
                  "local": "PK-S1540",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/pk"
               }, {
                  "jour": "Mardi   ",
                  "hr_deb": "18h00",
                  "hr_fin": "21h00",
                  "local": "A-M820  ",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/a"
               }, {
                  "jour": "Mercredi",
                  "hr_deb": "17h00",
                  "hr_fin": "21h00",
                  "local": "A-6300  ",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/a"
               }, {
                  "jour": "Jeudi   ",
                  "hr_deb": "14h00",
                  "hr_fin": "17h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Vendredi",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30",
                  "local": "J-2275  ",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/j"
               }, {
                  "jour": "Vendredi",
                  "hr_deb": "18h00",
                  "hr_fin": "21h00",
                  "local": "J-2275  ",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/j"
               }],
               "examen": [{
                  "type": "INTRA",
                  "jour": "Samedi  ",
                  "date": "31/10/2015",
                  "hr_deb": "",
                  "hr_fin": "",
                  "local": ""
               }, {
                  "type": "FINAL",
                  "jour": "Samedi  ",
                  "date": "19/12/2015",
                  "hr_deb": "",
                  "hr_fin": "",
                  "local": ""
               }],
               "rencontre": [{
                  "jour": "Lundi   ",
                  "date": "07/09/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30"
               }, {
                  "jour": "Mardi   ",
                  "date": "08/09/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "13h00"
               }, {
                  "jour": "Lundi   ",
                  "date": "14/09/2015",
                  "hr_deb": "14h00",
                  "hr_fin": "17h00"
               }, {
                  "jour": "Mardi   ",
                  "date": "15/09/2015",
                  "hr_deb": "18h00",
                  "hr_fin": "21h00"
               }, {
                  "jour": "Mercredi",
                  "date": "16/09/2015",
                  "hr_deb": "18h00",
                  "hr_fin": "21h00"
               }, {
                  "jour": "Jeudi   ",
                  "date": "17/09/2015",
                  "hr_deb": "14h00",
                  "hr_fin": "17h00"
               }, {
                  "jour": "Vendredi",
                  "date": "18/09/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30"
               }, {
                  "jour": "Vendredi",
                  "date": "18/09/2015",
                  "hr_deb": "18h00",
                  "hr_fin": "21h00"
               }],
               "enseignant": [{
                  "nom": "Non disponible",
                  "url_repertoire": ""
               }]
            }, {
               "sigle": "ESM4185",
               "groupe": "10",
               "titre": "Stage IV :  Pratique autonome de l\'enseignement des mathématiques",
               "nb_cred": "8.0",
               "rem1": "Cohorte 2012 - Pre-stage 5 jrs + 40 jrs consecutifs",
               "rem2": "entre le 26 oct et le 22 dec + une rencontre  hiver 2016",
               "dt_deb": "",
               "dt_fin": "",
               "horaire": [{
                  "jour": "Lundi   ",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }],
               "rencontre": [{
                  "jour": "Lundi   ",
                  "date": "10/08/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30"
               }, {
                  "jour": "Lundi   ",
                  "date": "17/08/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30"
               }, {
                  "jour": "Lundi   ",
                  "date": "07/09/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30"
               }, {
                  "jour": "Lundi   ",
                  "date": "05/10/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30"
               }],
               "enseignant": [{
                  "nom": "Non disponible",
                  "url_repertoire": ""
               }]
            }, {
               "sigle": "MAT3227",
               "groupe": "10",
               "titre": "Didactique des mathématiques II et laboratoire",
               "nb_cred": "5.0",
               "rem1": "Cohorte 2012  Debut du cours le 17 aout  horaire particulier",
               "rem2": "relache 24 aout au 1er sept pour pré-stage",
               "dt_deb": "17/08/2015",
               "dt_fin": "09/10/2015",
               "horaire": [{
                  "jour": "Lundi   ",
                  "hr_deb": "13h30",
                  "hr_fin": "17h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Lundi   ",
                  "hr_deb": "18h00",
                  "hr_fin": "21h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Mardi   ",
                  "hr_deb": "13h00",
                  "hr_fin": "17h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Mercredi",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Mercredi",
                  "hr_deb": "13h30",
                  "hr_fin": "17h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Mercredi",
                  "hr_deb": "18h00",
                  "hr_fin": "21h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Jeudi   ",
                  "hr_deb": "13h00",
                  "hr_fin": "17h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Vendredi",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Vendredi",
                  "hr_deb": "13h30",
                  "hr_fin": "17h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }],
               "enseignant": [{
                  "nom": "Non disponible",
                  "url_repertoire": ""
               }]
            }]
         }]
      }, {
         "trim_txt": "Hiver - 2015",
         "trim_num": "20151",
         "programme": [{
            "code_prog": "7954",
            "titre_prog": "baccalauréat en enseignement secondaire (mathématiques)",
            "cours": [{
               "sigle": "ASS2063",
               "groupe": "10",
               "titre": "Intégration scolaire et modèles d\'intervention",
               "nb_cred": "3.0",
               "rem1": "Cohorte 2012",
               "rem2": "",
               "dt_deb": "07/01/2015",
               "dt_fin": "25/02/2015",
               "horaire": [{
                  "jour": "Lundi   ",
                  "hr_deb": "14h00",
                  "hr_fin": "17h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Mercredi",
                  "hr_deb": "14h00",
                  "hr_fin": "17h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }],
               "enseignant": [{
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }]
            }, {
               "sigle": "ESM3155",
               "groupe": "10",
               "titre": "Stage III : Pratique guidée de l\'enseignement des mathématiques auprès de clientèles diversifiées",
               "nb_cred": "5.0",
               "rem1": "Cohorte 2012 - une ou deux journées en fév. et 26 jrs",
               "rem2": "consécutifs entre le 9 mars et le 17 avril 2015",
               "dt_deb": "",
               "dt_fin": "",
               "horaire": [{
                  "jour": "Lundi   ",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Mardi   ",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }],
               "rencontre": [{
                  "jour": "Lundi   ",
                  "date": "12/01/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30"
               }, {
                  "jour": "Lundi   ",
                  "date": "19/01/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30"
               }, {
                  "jour": "Lundi   ",
                  "date": "26/01/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30"
               }, {
                  "jour": "Lundi   ",
                  "date": "02/02/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30"
               }, {
                  "jour": "Lundi   ",
                  "date": "09/02/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30"
               }, {
                  "jour": "Mardi   ",
                  "date": "21/04/2015",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30"
               }],
               "enseignant": [{
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }]
            }, {
               "sigle": "FPE4520",
               "groupe": "21",
               "titre": "Évaluation des apprentissages au secondaire",
               "nb_cred": "3.0",
               "rem1": "Cohorte 2012",
               "rem2": "",
               "dt_deb": "08/01/2015",
               "dt_fin": "26/02/2015",
               "horaire": [{
                  "jour": "Mardi   ",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Jeudi   ",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }],
               "enseignant": [{
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }]
            }, {
               "sigle": "MAT4600",
               "groupe": "10",
               "titre": "Didactique d\'intervention en  mathématiques auprès de clientèles diversifiées",
               "nb_cred": "3.0",
               "rem1": "Cohorte 2012",
               "rem2": "",
               "dt_deb": "07/01/2015",
               "dt_fin": "27/02/2015",
               "horaire": [{
                  "jour": "Lundi   ",
                  "hr_deb": "09h00",
                  "hr_fin": "11h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Lundi   ",
                  "hr_deb": "11h00",
                  "hr_fin": "13h00",
                  "local": "",
                  "mode_util": "Exercices",
                  "url_pavillon": ""
               }, {
                  "jour": "Mardi   ",
                  "hr_deb": "13h00",
                  "hr_fin": "15h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Mardi   ",
                  "hr_deb": "15h00",
                  "hr_fin": "17h00",
                  "local": "",
                  "mode_util": "Exercices",
                  "url_pavillon": ""
               }, {
                  "jour": "Mardi   ",
                  "hr_deb": "18h00",
                  "hr_fin": "20h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Mardi   ",
                  "hr_deb": "20h00",
                  "hr_fin": "22h00",
                  "local": "",
                  "mode_util": "Exercices",
                  "url_pavillon": ""
               }, {
                  "jour": "Mercredi",
                  "hr_deb": "09h00",
                  "hr_fin": "12h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Mercredi",
                  "hr_deb": "18h00",
                  "hr_fin": "20h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Mercredi",
                  "hr_deb": "20h00",
                  "hr_fin": "22h00",
                  "local": "",
                  "mode_util": "Exercices",
                  "url_pavillon": ""
               }, {
                  "jour": "Jeudi   ",
                  "hr_deb": "13h00",
                  "hr_fin": "15h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }, {
                  "jour": "Jeudi   ",
                  "hr_deb": "15h00",
                  "hr_fin": "17h00",
                  "local": "",
                  "mode_util": "Exercices",
                  "url_pavillon": ""
               }, {
                  "jour": "Vendredi",
                  "hr_deb": "09h00",
                  "hr_fin": "12h00",
                  "local": "",
                  "mode_util": "Cours magistral",
                  "url_pavillon": ""
               }],
               "enseignant": [{
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }, {
                  "nom": "Steven Zarper",
                  "url_repertoire": " "
               }]
            }]
         }]
      }, {
         "trim_txt": "Automne - 2014",
         "trim_num": "20143",
         "programme": [{
            "code_prog": "7954",
            "titre_prog": "baccalauréat en enseignement secondaire (mathématiques)",
            "cours": [{
               "sigle": "ASS3070",
               "groupe": "40",
               "titre": "Adolescents en difficulté d\'ordre comportemental au secondaire",
               "nb_cred": "3.0",
               "rem1": "Cohorte 2012",
               "rem2": "",
               "dt_deb": "",
               "dt_fin": "",
               "horaire": [{
                  "jour": "Jeudi   ",
                  "hr_deb": "09h30",
                  "hr_fin": "12h30",
                  "local": "DS-M260 ",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/ds"
               }],
               "enseignant": [{
                  "nom": "Non disponible",
                  "url_repertoire": ""
               }]
            }, {
               "sigle": "MAT3005",
               "groupe": "20",
               "titre": "Théorie des équations",
               "nb_cred": "3.0",
               "rem1": "Cohorte 2012",
               "rem2": "",
               "dt_deb": "",
               "dt_fin": "",
               "horaire": [{
                  "jour": "Mardi   ",
                  "hr_deb": "09h00",
                  "hr_fin": "10h30",
                  "local": "PK-3605 ",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/pk"
               }, {
                  "jour": "Mardi   ",
                  "hr_deb": "10h30",
                  "hr_fin": "12h30",
                  "local": "PK-3605 ",
                  "mode_util": "Exercices",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/pk"
               }, {
                  "jour": "Mercredi",
                  "hr_deb": "18h00",
                  "hr_fin": "19h30",
                  "local": "PK-3605 ",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/pk"
               }],
               "enseignant": [{
                  "nom": "Non disponible",
                  "url_repertoire": ""
               }]
            }, {
               "sigle": "MAT3135",
               "groupe": "30",
               "titre": "Didactique de la géométrie",
               "nb_cred": "3.0",
               "rem1": "Cohorte 2012",
               "rem2": "",
               "dt_deb": "",
               "dt_fin": "",
               "horaire": [{
                  "jour": "Mercredi",
                  "hr_deb": "13h00",
                  "hr_fin": "14h30",
                  "local": "SH-3340 ",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/sh"
               }, {
                  "jour": "Mercredi",
                  "hr_deb": "14h30",
                  "hr_fin": "16h30",
                  "local": "SH-3340 ",
                  "mode_util": "Exercices",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/sh"
               }, {
                  "jour": "Jeudi   ",
                  "hr_deb": "15h30",
                  "hr_fin": "17h00",
                  "local": "PK-3605 ",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/pk"
               }],
               "enseignant": [{
                  "nom": "Non disponible",
                  "url_repertoire": ""
               }]
            }, {
               "sigle": "MAT3200",
               "groupe": "10",
               "titre": "Regards mathématiques et didactiques sur des thèmes abordés au secondaire",
               "nb_cred": "3.0",
               "rem1": "Cohorte 2012",
               "rem2": "",
               "dt_deb": "",
               "dt_fin": "",
               "horaire": [{
                  "jour": "Lundi   ",
                  "hr_deb": "14h00",
                  "hr_fin": "16h00",
                  "local": "PK-3605 ",
                  "mode_util": "Exercices",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/pk"
               }, {
                  "jour": "Mercredi",
                  "hr_deb": "09h00",
                  "hr_fin": "12h00",
                  "local": "PK-3605 ",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/pk"
               }],
               "enseignant": [{
                  "nom": "Non disponible",
                  "url_repertoire": ""
               }]
            }, {
               "sigle": "MAT4681",
               "groupe": "20",
               "titre": "Statistique pour les sciences",
               "nb_cred": "3.0",
               "rem1": "",
               "rem2": "",
               "dt_deb": "",
               "dt_fin": "",
               "horaire": [{
                  "jour": "Mardi   ",
                  "hr_deb": "13h30",
                  "hr_fin": "16h30",
                  "local": "PK-1705 ",
                  "mode_util": "Cours magistral",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/pk"
               }, {
                  "jour": "Jeudi   ",
                  "hr_deb": "13h30",
                  "hr_fin": "15h30",
                  "local": "PK-1705 ",
                  "mode_util": "Exercices",
                  "url_pavillon": "http://carte.uqam.ca/#pavillon/pk"
               }],
               "enseignant": [{
                  "nom": "Non disponible",
                  "url_repertoire": ""
               }]
            }]
         }]
      }]
   };



   // load the service's module
   beforeEach(module('pelApp'));

   // instantiate service
   var horaireUtil;
   beforeEach(inject(function(_horaireUtil_) {
      horaireUtil = _horaireUtil_;
   }));

   it('should do something', function() {
      expect(!!horaireUtil).toBe(true);
   });

   it(' Appel vide', function() {
   	  horaireUtil.ajouteLieu(null);
   	  expect(!!horaireUtil).toBe(true);
   });

   it(' Appel sans erreur ', function() {
   	  horaireUtil.ajouteLieu(testUnHoraire);
   	  // Bon, on est supposé avoir ajouté le local et l'url à la rencontre suivante:
      expect(testUnHoraire.trimestre[0].programme[0].cours[0].rencontre[0].local).toBe('A-R520  ');
      expect(testUnHoraire.trimestre[0].programme[0].cours[0].rencontre[0].url_pavillon).toBe('http://carte.uqam.ca/#pavillon/a');

      // Toutes les horaires doivent disparaitre !
      expect(testUnHoraire.trimestre[0].programme[0].cours[0].horaire).toBe(null);
   });


});

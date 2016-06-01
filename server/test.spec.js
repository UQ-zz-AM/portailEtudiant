/* jshint -W030 */ //ingnorer les should(false).not.ok. Ok génèere un warning JSHint.
// 'use strict';

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

var should = require('should');

var util = require('./config/util');
var configPortailEtudiant = util.obtenirConfig();
var configCourriel = util.obtenirConfig().servicesTransversaux.courriel;
var courriel = require('./servicesTransversaux/courriel/index.js');
var journalLogger = require('./servicesTransversaux/journalisation/journalLogger.js');

var testReq = {
   'headers': {
      'ns-client-ip': '132.208.100.100'
   }
};

var convertirResultats = require('./apis/convertirResultats.js');

// Un jeu de tests pour convertirResultats
var unResultatAvantConversion = {
   "resultats": {
      "activites": [{
         "trimestre": 20151,
         "sigle": "PSY4020",
         "groupe": 40,
         "titreActivite": "METHODOLOGIE DE LA RECHERCHE EN PSYCHOLOGIE",
         "creditActivite": 3,
         "programme": "7733",
         "titreProgramme": "baccalauréat en psychologie",
         "note": null,
         "valeurNote": null,
         "systemeResultats": "O",
         "total": null,
         "ponderation": null,
         "moyenne": 28.4,
         "ecartType": 4.5,
         "messageGroupe": null,
         "messagePersonnel": null,
         "evaluations": [{
            "id": 0,
            "titre": "Examen Intra",
            "modeNotation": "C",
            "modeEvaluation": "I",
            "resultatNumerique": null,
            "resultatAlphabetique": null,
            "resultatAlphabetiqueConverti": null,
            "resultatMaximum": 37,
            "moyenneNumerique": 29.25,
            "moyenneAlphabetique": null,
            "moyenneAlphabetiqueConvertie": null,
            "ecartType": 5.4,
            "resultatPondere": null,
            "ponderation": 30,
            "moyennePondere": 23.72,
            "ecartTypePondere": 4.38,
            "messageEquipe": null
         }, {
            "id": 2,
            "titre": "Plan de travail",
            "modeNotation": "C",
            "modeEvaluation": "E",
            "resultatNumerique": null,
            "resultatAlphabetique": null,
            "resultatAlphabetiqueConverti": null,
            "resultatMaximum": 1,
            "moyenneNumerique": 0.875,
            "moyenneAlphabetique": null,
            "moyenneAlphabetiqueConvertie": null,
            "ecartType": 0.25,
            "resultatPondere": null,
            "ponderation": 1,
            "moyennePondere": 0.88,
            "ecartTypePondere": 0.25,
            "messageEquipe": null
         }, {
            "id": 3,
            "titre": "Questionnaire (remise)",
            "modeNotation": "C",
            "modeEvaluation": "E",
            "resultatNumerique": null,
            "resultatAlphabetique": null,
            "resultatAlphabetiqueConverti": null,
            "resultatMaximum": 1.5,
            "moyenneNumerique": 1.3125,
            "moyenneAlphabetique": null,
            "moyenneAlphabetiqueConvertie": null,
            "ecartType": 0.24,
            "resultatPondere": null,
            "ponderation": 1.5,
            "moyennePondere": 1.31,
            "ecartTypePondere": 0.24,
            "messageEquipe": null
         }, {
            "id": 4,
            "titre": "Questionnaire (compléter)",
            "modeNotation": "C",
            "modeEvaluation": "I",
            "resultatNumerique": null,
            "resultatAlphabetique": null,
            "resultatAlphabetiqueConverti": null,
            "resultatMaximum": 2.5,
            "moyenneNumerique": 2.5,
            "moyenneAlphabetique": null,
            "moyenneAlphabetiqueConvertie": null,
            "ecartType": 0,
            "resultatPondere": null,
            "ponderation": 2.5,
            "moyennePondere": 2.5,
            "ecartTypePondere": 0,
            "messageEquipe": null
         }],
         "enseignants": [{
            "nom": "Zarper",
            "prenom": "Bill",
            "estProfesseur": "O",
            "alias": "zarper.bill",
            "courriel": "zarper.bill@univ.org"
         }]
      }, {
         "trimestre": 20151,
         "sigle": "PSY4120",
         "groupe": 20,
         "titreActivite": "PSYCHOLOGIE SOCIALE",
         "creditActivite": 3,
         "programme": "7733",
         "titreProgramme": "baccalauréat en psychologie",
         "note": null,
         "valeurNote": null,
         "systemeResultats": "O",
         "total": 36.43,
         "ponderation": 40,
         "moyenne": 30.19,
         "ecartType": 5.29,
         "messageGroupe": null,
         "messagePersonnel": null,
         "evaluations": null,
         "enseignants": null
      }, {
         "trimestre": 20151,
         "sigle": "PSY4130",
         "groupe": 10,
         "titreActivite": "INTRODUCTION A LA PSYCHOMETRIE",
         "creditActivite": 3,
         "programme": "7733",
         "titreProgramme": "baccalauréat en psychologie",
         "note": null,
         "valeurNote": null,
         "systemeResultats": "O",
         "total": 27.5,
         "ponderation": 35,
         "moyenne": 36.11,
         "ecartType": 10.8,
         "messageGroupe": null,
         "messagePersonnel": null,
         "evaluations": [{
            "id": 0,
            "titre": "examen 1",
            "modeNotation": "C",
            "modeEvaluation": "I",
            "resultatNumerique": 10.5,
            "resultatAlphabetique": null,
            "resultatAlphabetiqueConverti": null,
            "resultatMaximum": 15,
            "moyenneNumerique": 8.5,
            "moyenneAlphabetique": null,
            "moyenneAlphabetiqueConvertie": null,
            "ecartType": null,
            "resultatPondere": 10.5,
            "ponderation": 15,
            "moyennePondere": 8.5,
            "ecartTypePondere": null,
            "messageEquipe": null
         }, {
            "id": 1,
            "titre": "travail 1",
            "modeNotation": "C",
            "modeEvaluation": "E",
            "resultatNumerique": 17,
            "resultatAlphabetique": null,
            "resultatAlphabetiqueConverti": null,
            "resultatMaximum": 20,
            "moyenneNumerique": 17,
            "moyenneAlphabetique": null,
            "moyenneAlphabetiqueConvertie": null,
            "ecartType": null,
            "resultatPondere": 17,
            "ponderation": 20,
            "moyennePondere": 17,
            "ecartTypePondere": null,
            "messageEquipe": null
         }, {
            "id": 2,
            "titre": "travail 2",
            "modeNotation": "C",
            "modeEvaluation": "E",
            "resultatNumerique": null,
            "resultatAlphabetique": null,
            "resultatAlphabetiqueConverti": null,
            "resultatMaximum": 25,
            "moyenneNumerique": 24.5,
            "moyenneAlphabetique": null,
            "moyenneAlphabetiqueConvertie": null,
            "ecartType": null,
            "resultatPondere": null,
            "ponderation": 25,
            "moyennePondere": 24.5,
            "ecartTypePondere": null,
            "messageEquipe": null
         }],
         "enseignants": null
      }, {
         "trimestre": 20151,
         "sigle": "PSY5020",
         "groupe": 50,
         "titreActivite": "DEVELOPPEMENT AFFECTIF DE L'ADULTE",
         "creditActivite": 3,
         "programme": "7731",
         "titreProgramme": "certificat en psycho",
         "note": null,
         "valeurNote": null,
         "systemeResultats": "O",
         "total": null,
         "ponderation": null,
         "moyenne": 80.28,
         "ecartType": 14.27,
         "messageGroupe": null,
         "messagePersonnel": null,
         "evaluations": null,
         "enseignants": null
      }, {
         "trimestre": 20151,
         "sigle": "PSY5860",
         "groupe": 50,
         "titreActivite": "THEORIES ET TECHNIQUES DE L'ENTREVUE",
         "creditActivite": 3,
         "programme": "7733",
         "titreProgramme": "baccalauréat en psychologie",
         "note": null,
         "valeurNote": null,
         "systemeResultats": "O",
         "total": null,
         "ponderation": null,
         "moyenne": null,
         "ecartType": null,
         "messageGroupe": null,
         "messagePersonnel": null,
         "evaluations": null,
         "enseignants": null
      }, {
         "trimestre": 20143,
         "sigle": "PSY4031",
         "groupe": 40,
         "titreActivite": "ANALYSE QUANTITATIVE EN PSYCHOLOGIE",
         "creditActivite": 3,
         "programme": "7732",
         "titreProgramme": "baccalauréat en psychologie",
         "note": null,
         "valeurNote": null,
         "systemeResultats": "O",
         "total": null,
         "ponderation": null,
         "moyenne": null,
         "ecartType": null,
         "messageGroupe": null,
         "messagePersonnel": null,
         "evaluations": null,
         "enseignants": null
      }, {
         "trimestre": 20143,
         "sigle": "PSY4190",
         "groupe": 20,
         "titreActivite": "PSYCHOLOGIE HUMANISTE",
         "creditActivite": 3,
         "programme": "7732",
         "titreProgramme": "baccalauréat en psychologie",
         "note": null,
         "valeurNote": null,
         "systemeResultats": "O",
         "total": null,
         "ponderation": null,
         "moyenne": null,
         "ecartType": null,
         "messageGroupe": null,
         "messagePersonnel": null,
         "evaluations": null,
         "enseignants": null
      }, {
         "trimestre": 20143,
         "sigle": "PSY5120",
         "groupe": 10,
         "titreActivite": "APPROCHES PHENOMENOLOGIQUES",
         "creditActivite": 3,
         "programme": "7732",
         "titreProgramme": "baccalauréat en psychologie",
         "note": null,
         "valeurNote": null,
         "systemeResultats": "O",
         "total": null,
         "ponderation": null,
         "moyenne": null,
         "ecartType": null,
         "messageGroupe": null,
         "messagePersonnel": null,
         "evaluations": null,
         "enseignants": null
      }]
   }
};



describe("Test coté serveur ", function() {

   this.timeout(30500);

   before(function() {;
   });


   it(' Pour voir si c\'est OK ', function(done) {
      should('allo').be.equal('allo');
      done();
   });

   it(' Service courriel ', function(done) {
      should(courriel).be.ok;
      done();
   });

   it(' Service journalLogger ', function(done) {
      should(journalLogger).be.ok;
      should(journalLogger.getIpClient(testReq)).be.equal('132.208.100.100');
      done();
   });

   it(' Service convertirResultats ', function(done) {
      should(convertirResultats).be.ok;

      // console.log(JSON.stringify(convertirResultats(unResultatAvantConversion), null, 3));

      should(convertirResultats(unResultatAvantConversion).resultats).be.ok;
      // 3 trimestres
      should(convertirResultats(unResultatAvantConversion).resultats.length).equal(2);
      // 1er trimestre est 20151
      should(convertirResultats(unResultatAvantConversion).resultats[0].trimestre).equal(20151);
      // le 2e programme d'études est le certificat
      should(convertirResultats(unResultatAvantConversion).resultats[0].programmes[1].titreProgramme).equal('certificat en psycho');

      done();
   });



   afterEach(function() {;
   });

   after(function() {;
   })


});

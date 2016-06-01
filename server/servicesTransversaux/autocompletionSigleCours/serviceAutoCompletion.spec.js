/* jshint -W030 */ //ingnorer les should(false).not.ok. Ok génèere un warning JSHint.

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

var should = require('should'),
   nock = require("nock"),
   request = require("request");

var serviceAutoCompletion = require('./serviceAutoCompletion');



// Attention, on utilise de vieux trimestres car, chargerTroisTrimestres() est
// lancé au départ de l'application, donc les trois trimestres associés à la date du jour seront chargés !
// On ne veut pas ces données, on force donc l'utilisation de 3 vieilles sessions (19973, 19981 et 19982)
//    Les trois premiers it() sont donc là pour charger ces trois vieux trimestres qui sont chargés avec nock()

var dataTest = {
   "19973": [
      "ACM1002     ",
      "ACM4001     ",
      "ACM6031     ",
      "ACM6032     ",
      "ACT.REC     ",
      "ACT1021     ",
      "ACT1040     ",
      "ACT2025     ",
      "ACT2040     ",
      "ACT2121     "
   ],
   "19981": [
      "ACM1001     ",
      "ACM4001     ",
      "ACM6031     ",
      "ACM6032     ",
      "ACT.REC     ",
      "ACT1021     ",
      "ACT1040     ",
      "ACT2025     ",
      "ACT2040     ",
      "ACT2121     "
   ],
   "19982": [
      "   TEST pour les tests, on place plein de cours ACM pour atteindre le maximum NB_SIGLES_MAXIMUM",
      "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ",
      "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ",
      "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ",
      "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ",
      "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ", "ACM1001     ",
      "ACM4001     ",
      "ACM6031     ",
      "ACM6032     ",
      "TRS8915     ",
      "TRS8920     ",
      "TRS8925     ",
      "TRS9001     ",
      "TRS9002     "
   ]
};



describe('Test du service autoCompletion', function() {


   // On attends la connexion à la BD
   this.timeout(5000);

   before(function() {
      process.env.NODE_ENV = 'testUnitaire';
   });



   it('Devrait retourner premier appel vieux trimestre 19973', function(done) {

      nock('http://unitaire.ca')
         .post('/obtenirListeCours')
         .reply(200, {
            status: 'success',
            data: dataTest
         });

      serviceAutoCompletion.obtenirListeSigles('19973', 'ACM', function(res) {
         should(res).ok;
         should(res.statut).equal('PremierAppel');
         should(res.tabCours.length).equal(0);
         done();
      });

   });

   it('Devrait retourner premier appel vieux trimestre 19981', function(done) {

      nock('http://unitaire.ca')
         .post('/obtenirListeCours')
         .reply(200, {
            status: 'success',
            data: dataTest
         });

      serviceAutoCompletion.obtenirListeSigles('19981', 'ACM', function(res) {
         should(res).ok;
         should(res.statut).equal('PremierAppel');
         should(res.tabCours.length).equal(0);
         done();
      });

   });

   it('Devrait retourner premier appel trimestre 19982', function(done) {

      nock('http://unitaire.ca')
         .post('/obtenirListeCours')
         .reply(200, {
            status: 'success',
            data: dataTest
         });

      serviceAutoCompletion.obtenirListeSigles('19982', 'ACM', function(res) {
         should(res).ok;
         should(res.statut).equal('PremierAppel');
         should(res.tabCours.length).equal(0);
         done();
      });

   });


   it('Devrait retourner un succès : 4 cours ACM* .', function(done) {

      nock('http://unitaire.ca')
         .post('/obtenirListeCours')
         .reply(200, {
            status: 'success',
            data: dataTest
         });

      serviceAutoCompletion.obtenirListeSigles('19973', 'ACM', function(res) {
         should(res).ok;
         should(res.statut).equal('Succes');
         should(res.tabCours.length).equal(4); // Il y a 4 cours qui commence par ACM en 19973
         done();
      });

   });



   it('Devrait retourner un succès avec 6 cours ACT* .', function(done) {

      nock('http://unitaire.ca')
         .post('/obtenirListeCours')
         .reply(200, {
            status: 'success',
            data: dataTest
         });

      serviceAutoCompletion.obtenirListeSigles('19981', 'ACT', function(res) {
         should(res).ok;
         should(res.statut).equal('Succes');
         should(res.tabCours.length).equal(6); // Il y a 6 cours qui commence par ACT en 19981
         done();
      });

   });



   it('Devrait retourner trop de cours.', function(done) {

      nock('http://unitaire.ca')
         .post('/obtenirListeCours')
         .reply(200, {
            status: 'success',
            data: dataTest
         });

      serviceAutoCompletion.obtenirListeSigles('19982', 'ACM', function(res) {
         should(res).ok;
         should(res.statut).equal('TropDeCours');
         should(res.tabCours.length).equal(0); // Il y a trop de cours qui commence par ACM en 19982
         done();
      });

   });



   it('Devrait retourner aucun cours.', function(done) {

      nock('http://unitaire.ca')
         .post('/obtenirListeCours')
         .reply(200, {
            status: 'success',
            data: dataTest
         });

      serviceAutoCompletion.obtenirListeSigles('19981', 'INFINF777777', function(res) {
         should(res).ok;
         should(res.statut).equal('AucunCours');
         done();
      });

   });


   afterEach(function() {
      //Réinitialiser le timeout
      this.timeout(5000);

   });


   after(function() {
      process.env.NODE_ENV = 'development';
   })

});

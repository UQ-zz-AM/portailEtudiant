
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

describe('service: reglesIns', function() {

   // load the service's module
   beforeEach(module('pelApp'));

   var reglesIns;

   beforeEach(inject(function(_reglesIns_) {
      reglesIns = _reglesIns_;
   }));



   var dataPeriodeInsProgrammes = [{
      'code_prog': 'C102',
      'titre_prog': 'baccalauréat par cumul de programmes',
      'icode': '0',
      'fenetres': []
   }, {
      'code_prog': '4122',
      'titre_prog': 'certificat en administration',
      'icode': '6',
      'trimestres': [{
         'an_ses_num': '20153',
         'sous_ses_txt': '',
         'mode_inscription': 'WEB',
         'statut': 'ACTIF',
         'fenetres': [{
            'type_fenetre': 'ABA',
            'date_deb_fen': '2015-09-16',
            'date_fin_fen': '2015-10-01'
         }]
      }]
   }, {
      'code_prog': '4423',
      'titre_prog': 'certificat en commerce international',
      'icode': '0',
      'trimestres': [{
         'an_ses_num': '20153',
         'sous_ses_txt': '',
         'mode_inscription': 'WEB',
         'statut': 'ACTIF',
         'fenetres': [{
            'type_fenetre': 'ABA',
            'date_deb_fen': '2015-09-16',
            'date_fin_fen': '2015-11-11'
         }]
      }]
   }, {
      'code_prog': '4728',
      'titre_prog': 'certificat en technologies d affaires',
      'icode': '0',
      'trimestres': [{
         'an_ses_num': '20153',
         'sous_ses_txt': '',
         'mode_inscription': 'WEB',
         'statut': 'ACTIF',
         'fenetres': [{
            'type_fenetre': 'ABA',
            'date_deb_fen': '2015-09-16',
            'date_fin_fen': '2015-11-11'
         }]
      }]
   }];




   var dataPeriodeInsProgrammes02 = [{
      'code_prog': 'C102',
      'titre_prog': 'baccalauréat par cumul de programmes',
      'icode': '0',
      'fenetres': []
   }, {
      'code_prog': '4122',
      'titre_prog': 'certificat en administration',
      'icode': '6',
      'trimestres': [{
         'an_ses_num': '20153',
         'sous_ses_txt': '',
         'mode_inscription': 'WEB',
         'statut': 'ACTIF',
         'fenetres': [{
            'type_fenetre': 'ABA',
            'date_deb_fen': '2015-09-16',
            'date_fin_fen': '2015-10-01'
         }]
      }]
   }, {
      'code_prog': '4423',
      'titre_prog': 'certificat en commerce international',
      'icode': '0',
      'trimestres': [{
         'an_ses_num': '20153',
         'sous_ses_txt': '',
         'mode_inscription': 'WEB',
         'statut': 'ACTIF',
         'fenetres': [{
            'type_fenetre': 'ABA',
            'date_deb_fen': '2015-09-16',
            'date_fin_fen': '2015-11-11'
         }]
      }]
   }, {
      'code_prog': '4728',
      'titre_prog': 'certificat en technologies d affaires',
      'icode': '0',
      'trimestres': [{
         'an_ses_num': '20153',
         'sous_ses_txt': '',
         'mode_inscription': 'WEB',
         'statut': 'ACTIF',
         'fenetres': [{
            'type_fenetre': 'ABA',
            'date_deb_fen': '2015-09-16',
            'date_fin_fen': '2015-11-11'
         }]
      },{
         'an_ses_num': '20153',
         'sous_ses_txt': 'Intensif',
         'mode_inscription': 'WEB',
         'statut': 'ACTIF',
         'fenetres': [{
            'type_fenetre': 'ABA',
            'date_deb_fen': '2015-09-16',
            'date_fin_fen': '2015-11-11'
         }]
      }]
   }];



   it('should do something', function() {
      expect(!!reglesIns).toBe(true);
   });


   it(' Icode ', function() {
      expect(reglesIns.isIcodeValid('1')).toBe(true);
      expect(reglesIns.isIcodeValid('2')).toBe(true);
      expect(reglesIns.isIcodeValid('6')).toBe(false);
      expect(reglesIns.isIcodeValid(null)).toBe(true);
   });

   it(' trierProgramme ', function() {
      var programmesTest = [{
         'icode': '2',
         'titreProg': ' Sciences '
      }, {
         'icode': '3',
         'titreProg': ' Politique '
      }, {
         'icode': '4',
         'titreProg': ' Arts '
      }];

      reglesIns.trierProgramme(programmesTest);
      // On doit avoir, dans l'ordre 4, 2 et 3
      expect(programmesTest[0].icode).toBe('4');
      expect(programmesTest[1].icode).toBe('2');
      expect(programmesTest[1].titreProg).toBe(' Sciences ');
      expect(programmesTest[2].icode).toBe('3');

   });


   it(' retirerPeriodesInactives ', function() {

      var dateNode = moment('2015-11-10','YYYY-MM-DD');
      var copieDataTest = JSON.parse(JSON.stringify(dataPeriodeInsProgrammes));
      reglesIns.retirerPeriodesInactives(copieDataTest, dateNode);

      expect(copieDataTest[0].fenetres.length).toBe(0);
      // Celle-ci a été enlevé, normalement
      expect(copieDataTest[1].trimestres[0].fenetres.length).toBe(0);

   });


   it(' mergerFenProgTrimIdentique ', function() {

      var copieDataTest = JSON.parse(JSON.stringify(dataPeriodeInsProgrammes02));
      reglesIns.mergerFenProgTrimIdentique(copieDataTest);

      // Toujours 2
      expect(copieDataTest[3].trimestres.length).toBe(2);
      // Mais la première a maintenant 2 fenetres
      expect(copieDataTest[3].trimestres[0].fenetres.length).toBe(2);

   });


   it(' getProgrEtTrimestre ', function() {

      var copieDataTest = JSON.parse(JSON.stringify(dataPeriodeInsProgrammes02));
      var resultat = reglesIns.getProgrEtTrimestre('4728', '20153', copieDataTest);

      // Toujours 2
      expect(copieDataTest[3].trimestres.length).toBe(2);

      expect(resultat.programme.code_prog).toBe('4728');

      resultat = reglesIns.getProgrEtTrimestre('1234', '20153', copieDataTest);
      expect(resultat.programme).toBe(undefined);

   });


   it(' isPeriode true', function() {

      var copieDataTest = JSON.parse(JSON.stringify(dataPeriodeInsProgrammes));

      var dateNode = moment('2015-11-10','YYYY-MM-DD');
      var resultat = reglesIns.isPeriode({ 'programmes' : copieDataTest }, dateNode);
      expect(resultat).toBe(true);

   });

   it(' isPeriode false ', function() {

      var copieDataTest = JSON.parse(JSON.stringify(dataPeriodeInsProgrammes));

      var dateNode = moment('201-11-10','YYYY-MM-DD');
      var resultat = reglesIns.isPeriode({ 'programmes' : copieDataTest }, dateNode);
      expect(resultat).toBe(false);

   });


});

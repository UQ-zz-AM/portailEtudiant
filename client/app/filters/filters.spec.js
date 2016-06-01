/*jshint -W008 */

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

describe('Tests des filtres', function () {
   'use strict';
   var capitalize,
      uncapitalize,
      capitalizeNomPrenom,
      dollar,
      dateComplete,
      dateCourte,
      notationLibel,
      // notationParenthese,
      trimestre,
      trimestreSansAnnee,
      trimNumero,
      trimGroupe,
      formatteChiffre,
      trimestreTexte2num,
      unique;


   /////////////////////////////////////////////////////////////////////////////
   /*
   * PRÉPARER les tests.
   */
   beforeEach(module('pelApp'));

   beforeEach(inject(function ($filter) {
      capitalize = $filter('capitalize');
      uncapitalize = $filter('uncapitalize');
      capitalizeNomPrenom = $filter('capitalizeNomPrenom');
      dollar = $filter('dollar');
      dateComplete = $filter('dateComplete');
      dateCourte = $filter('dateCourte');
      trimestre = $filter('trimestre');
      trimestreSansAnnee = $filter('trimestreSansAnnee');
      formatteChiffre = $filter('formatteChiffre');
      trimestreTexte2num = $filter('trimestreTexte2num');
      trimNumero = $filter('trimNumero');
      trimGroupe = $filter('trimGroupe');
      notationLibel = $filter('notationLibel');
      unique = $filter('unique');
   }));



   /////////////////////////////////////////////////////////////////////////////
   /*
   * Effectuer et évaluer les TESTS.
   */

   describe('Tests de trimestre', function () {

      it(' Conversion simple hiver', function () {
         var result = trimestre('20151');
         expect(result).toEqual('hiver 2015');
      });

      it(' Conversion simple été', function () {
         var result = trimestre('77772');
         expect(result).toEqual('été 7777');
      });

      it(' Mauvaise session ', function () {
         var result = trimestre('2000b');
         expect(result).toEqual('2000b');
      });

      it(' Mauvaise saison', function () {
         var result = trimestre('20204');
         expect(result).toEqual('20204');
      });

      it(' Mauvais input', function () {
         var result = trimestre('202044');
         expect(result).toEqual('202044');
      });

   });

   describe('Tests de trimestre sans année', function () {

      it(' Conversion simple hiver', function () {
         var result = trimestreSansAnnee('20151');
         expect(result).toEqual('hiver');
      });

      it(' Conversion simple été', function () {
         var result = trimestreSansAnnee('77772');
         expect(result).toEqual('été');
      });

      it(' Mauvaise session ', function () {
         var result = trimestreSansAnnee('2000b');
         expect(result).toEqual('2000b');
      });

      it(' Mauvaise saison', function () {
         var result = trimestreSansAnnee('20204');
         expect(result).toEqual('20204');
      });

      it(' Mauvais input', function () {
         var result = trimestreSansAnnee('202044');
         expect(result).toEqual('202044');
      });

   });

   describe('Tests de dateComplete', function () {

      it(' Conversion simple avec le pattern 20151207 ', function () {
         var result = dateComplete('20151207');
         expect(result).toEqual('7 décembre 2015');
      });

      it(' Conversion simple avec le pattern 07/12/2018 ', function () {
         var result = dateComplete('07/12/2018');
         expect(result).toEqual('7 décembre 2018');
      });

      it(' Conversion simple avec le pattern 31/01/7777', function () {
         var result = dateComplete('31/01/7777');
         expect(result).toEqual('31 janvier 7777');
      });

      it(' Conversion simple avec le pattern 01/01/7777 ', function () {
         var result = dateComplete('01/01/7777');
         expect(result).toEqual('1er janvier 7777');
      });

      it(' Conversion simple avec le pattern 20151201 ', function () {
         var result = dateComplete('20151201');
         expect(result).toEqual('1er décembre 2015');
      });

      it(' Un mauvais pattern ', function () {
         var result = dateComplete('7 12 2019');
         expect(result).toEqual('7 12 2019');
      });

      it(' Mois impossible ', function () {
         var result = dateComplete('07/13/2018');
         expect(result).toEqual('7 undefined 2018');
      });

      it(' Mauvaise date ', function () {
         var result = dateComplete('aaa');
         expect(result).toEqual('aaa');
      });

      it(' Mauvais input ', function () {
         var result = dateComplete('201512078');
         expect(result).toEqual('201512078');
      });

   });

   describe('Tests de dateCourte', function () {

      it(' Conversion simple avec le pattern 20151207 ', function () {
         var result = dateCourte('20151207');
         expect(result).toEqual('2015-12-07');
      });

      it(' mauvais input ', function () {
         var result = dateCourte('201512078');
         expect(result).toEqual('201512078');
      });

      it(' Un mauvais pattern ', function () {
         var result = dateCourte('7 12 2019');
         expect(result).toEqual('7 12 2019');
      });

   });


   describe('Tests de trimNumero', function () {

      it(' Simple', function () {
         var result = trimNumero('bleau.joe.3');
         expect(result).toEqual('bleau.joe.');
      });

      it(' Simple 2 ', function () {
         var result = trimNumero('bleau4.joe.3');
         expect(result).toEqual('bleau.joe.');
      });

      it(' Simple 3 ', function () {
         var result = trimNumero('bleau4.joe.55553');
         expect(result).toEqual('bleau.joe.');
      });

   });


   describe('Tests de trimGroupe', function () {

      it(' Simple', function () {
         var result = trimGroupe('020');
         expect(result).toEqual('20');
      });

      it(' Simple échec 3 positions ', function () {
         var result = trimGroupe('120');
         expect(result).toEqual('120');
      });

      it(' Simple échec 2 positions', function () {
         var result = trimGroupe('20');
         expect(result).toEqual('20');
      });

      it(' Nulle ', function () {
         var result = trimGroupe();
         expect(result).toEqual();
      });

   });


   describe('Tests de capitalize', function () {

      it('Capitalize a sentence', function () {
         var result = capitalize('si par une nuit d\'hiver un voyageur.');
         expect(result).toEqual('Si par une nuit d\'hiver un voyageur.');
      });

      it('Capitalize a number', function () {
         var result = capitalize('34');
         expect(result).toEqual('34');
      });

      it('Capitalize a nothing', function () {
         var result = capitalize(undefined);
         expect(result).toEqual(undefined);
      });

      it('Capitalize a single lettre', function () {
         var result = capitalize('z');
         expect(result).toEqual('Z');
      });

   });


   describe('Tests de uncapitalize', function () {

      it('Uncapitalize a sentence', function () {
         var result = uncapitalize('Si par une nuit d\'hiver un voyageur.');
         expect(result).toEqual('si par une nuit d\'hiver un voyageur.');
      });

      it('Uncapitalize a number', function () {
         var result = uncapitalize('34');
         expect(result).toEqual('34');
      });

      it('Uncapitalize a nothing', function () {
         var result = uncapitalize(undefined);
         expect(result).toEqual(undefined);
      });

      it('Uncapitalize a single lettre', function () {
         var result = uncapitalize('A');
         expect(result).toEqual('a');
      });

   });



   describe('Tests de capitalizeNomPrenom', function () {

      it(' Un seul prénom ', function () {
         var result = capitalizeNomPrenom('joe');
         expect(result).toEqual('Joe');
      });

      it(' Nom et prénom ', function () {
         var result = capitalizeNomPrenom('einstein ALBERT');
         expect(result).toEqual('Einstein Albert');
      });

      it(' Composé ', function () {
         var result = capitalizeNomPrenom('einstein ALBERT de la pirouette');
         expect(result).toEqual('Einstein Albert De La Pirouette');
      });

      it(' Composé avec tiret ', function () {
         var result = capitalizeNomPrenom('einstein-aLBERT');
         expect(result).toEqual('Einstein-Albert');
      });

      it(' Composé avec tiret ', function () {
         var result = capitalizeNomPrenom('jean-jacques seguin-borduas');
         expect(result).toEqual('Jean-Jacques Seguin-Borduas');
      });

      it(' Avec une apostrophe ', function () {
         var result = capitalizeNomPrenom('jean-jacques de l\'aigle');
         expect(result).toEqual('Jean-Jacques De L\'Aigle');
      });

      it(' Avec des accents ', function () {
         var result = capitalizeNomPrenom('éloise ïbachi çagalé');
         // console.log('==============================================' + result);
         expect(result).toEqual('Éloise Ïbachi Çagalé');
      });

      it(' Plus complexe ', function () {
         var result = capitalizeNomPrenom('imà¨ne éloise-ïbAchi çagalé-chareSt-');
         // console.log('==============================================' + result);
         expect(result).toEqual('Imà¨ne Éloise-Ïbachi Çagalé-Charest-');
      });

      it(' Avec des points  ', function () {
         var result = capitalizeNomPrenom('guy a.lepage');
         // console.log('==============================================' + result);
         expect(result).toEqual('Guy A.Lepage');
      });

   });



   describe('Tests de dollar', function () {

      it('Format a number 1095 -> 10,95 $', function () {
         var result = dollar('1095');
         expect(result).toEqual('10,95 $');
      });

      it('Format a small number 10 -> 0,10 $', function () {
         var result = dollar('10');
         expect(result).toEqual('0,10 $');
      });

      it('Format a negatif number -1054 -> -10,54 $', function () {
         var result = dollar('-1054');
         expect(result).toEqual('-10,54 $');
      });

      it('Format a single number 8 -> 0,08 $', function () {
         var result = dollar('8');
         expect(result).toEqual('0,08 $');
      });

      it('Format a single negatif number 6 -> -0,06 $', function () {
         var result = dollar('-6');
         expect(result).toEqual('-0,06 $');
      });

      it('Format a hundred  number  10099 -> 100,99 $', function () {
         var result = dollar('10099');
         expect(result).toEqual('100,99 $');
      });

      it('Format a thouand  number  100099 -> 1 000,99 $', function () {
         var result = dollar('100099');
         expect(result).toEqual('1 000,99 $');
      });

      it('Format a ten thousand  number  1234599 -> 12 345,99 $', function () {
         var result = dollar('1234599');
         expect(result).toEqual('12 345,99 $');
      });

      it('Format a hundred thousand  number  12345699 -> 123456,99 $', function () {
         var result = dollar('12345699');
         expect(result).toEqual('123456,99 $');
      });

      it('Format a bad number 10aa3395', function () {
         var result = dollar('10aa3395');
         expect(result).toEqual('1 033,95 $');
      });

      it('Format a undefined number. Return undefined', function () {
         var result = dollar(undefined);
         expect(result).toEqual(undefined);
      });

      it('Format a empty string number. Return \'\'', function () {
         var result = dollar('');
         expect(result).toEqual('');
      });

      it('Format nothing. Return undefined', function () {
         var result = dollar();
         expect(result).toEqual(undefined);
      });


   });

   describe('Tests de formatteChiffre ', function () {

      it(' simple ', function () {
         var result = formatteChiffre(1.00);
         expect(result).toEqual('1');
      });

      it(' avec un zéro ', function () {
         var result = formatteChiffre(0.12);
         expect(result).toEqual('0,12');
      });

      it(' pas de zéro ', function () {
         var result = formatteChiffre(.12);
         expect(result).toEqual('0,12');
      });

      it(' une décimale', function () {
         var result = formatteChiffre(0.2);
         expect(result).toEqual('0,2');
      });

      it(' négatif', function () {
         var result = formatteChiffre(-0.2);
         expect(result).toEqual('-0,2');
      });

      it(' avec des milliers ', function () {
         var result = formatteChiffre(12345.12);
         expect(result).toEqual('12345,12');
      });

      it(' plusieurs decimales ', function () {
         var result = formatteChiffre(1.23456);
         expect(result).toEqual('1,23456');
      });

      it(' plusieurs decimales et arrondi ', function () {
         var result = formatteChiffre(1.289);
         expect(result).toEqual('1,289');
      });

      it(' string', function () {
         var result = formatteChiffre('33,5');
         expect(result).toEqual('33,5');
      });

   });


   describe('Tests de trimestreTexte2num ', function () {

      it(' simple  ', function () {
         var result = trimestreTexte2num('hiver - 2014');
         expect(result).toEqual('20141');
      });

      it(' simple avec majuscule ', function () {
         var result = trimestreTexte2num('Hiver - 2014');
         expect(result).toEqual('20141');
      });

      it(' simple avec majuscule 2 ', function () {
         var result = trimestreTexte2num('AUTOMNE - 2014');
         expect(result).toEqual('20143');
      });

      it(' Les accents ', function () {
         var result = trimestreTexte2num('été - 2011');
         expect(result).toEqual('20112');
      });

      it(' Dans le passé', function () {
         var result = trimestreTexte2num('été - 1912');
         expect(result).toEqual('19122');
      });

      it(' Dans le futur', function () {
         var result = trimestreTexte2num('été - 4233');
         expect(result).toEqual('42332');
      });

      it(' Mauvaise année', function () {
         var result = trimestreTexte2num('été - 20125');
         expect(result).toEqual('été - 20125');
      });

      it(' Mauvaise année 2', function () {
         var result = trimestreTexte2num('été - hiver');
         expect(result).toEqual('été - hiver');
      });

      it(' Mauvais input', function () {
         var result = trimestreTexte2num('20123');
         expect(result).toEqual('20123');
      });

      it(' Mauvais input (null)', function () {
         var result = trimestreTexte2num(null);
         expect(result).toBe(null);
      });

   });


   describe('Tests de notationLibel', function () {

      it(' Simple A+', function () {
         var result = notationLibel('A+');
         expect(result).toEqual('Excellent');
      });

      it(' Simple null ', function () {
         var result = notationLibel('AAAAA+');
         expect(result).toEqual(null);
      });

   });

   describe('Tests de unique', function () {

      it(' Simple ', function () {
         var result = unique([{
                        'jour': 'Lundi   ',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': ''
                     }, {
                        'jour': 'Mercredi',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': ''
                     }],
                     'mode_util');
         expect(result).toEqual([{
                        'jour': 'Lundi   ',
                        'hr_deb': '09h30',
                        'hr_fin': '12h30',
                        'local': '',
                        'mode_util': 'Cours magistral',
                        'url_pavillon': ''
                     }]);
      });

      it(' Simple null ', function () {
         var result = unique(null, null);
         expect(result.length).toEqual(0);
      });

   });


});

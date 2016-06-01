/* jshint  unused:false, camelcase:false */
/* globals afterEach, testErreur, DossierModelMock, spyOn */

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

describe('Controller: EvaluationCtrl', function() {

   var EvaluationCtrl,
      scope,
      backendMock,
      codePermanent = 'identifiant',
      erreurGenerique = 'Une erreur est survenue, veuillez essayer plus tard.',
      url = '';


   var  testMessage = function() {
         return {
            'status': 'fail',
            data: {
               'message': ' Aucun résultat '
            }
         };
      },
      testErreur = function() {
         return {
            'status': 'error',
            'message': 'Erreur fatale dans le service.'
         };
      },
      testErreur2 = function() {
         return {
            'status': 'error',
            'nada': '.'
         };
      },

   testListeCours = function() {
      return {
         'status':'success',
         data:{
            'liste_cours': [
               {
                  'trim_num': '20161',
                  'trim_txt': 'Hiver 2016',
                  'sigle': 'GEO2093',
                  'groupe': '010',
                  'titre': 'CARTOGRAPHIE THEMATIQUE',
                  'dt_deb_eval': '2016-04-01',
                  'dt_fin_eval': '2030-01-01',
                  'ind_hors_periode': 'N',
                  'nom_enseignant': ' ',
                  'id_enseignement': '20386',
                  'ind_saisie': 'O'
               },
               {
                  'trim_num': '20161',
                  'trim_txt': 'Hiver 2016',
                  'sigle': 'GEO2200',
                  'groupe': '030',
                  'titre': 'GEOGRAPHIE SOCIALE: ACTEURS ET TERRITOIRES',
                  'dt_deb_eval': '2016-04-01',
                  'dt_fin_eval': '2030-01-01',
                  'ind_hors_periode': 'N',
                  'nom_enseignant': ' ',
                  'id_enseignement': '20383',
                  'ind_saisie': 'N'
               },
               {
                  'trim_num': '20161',
                  'trim_txt': 'Hiver 2016',
                  'sigle': 'GEO2200',
                  'groupe': '030',
                  'titre': 'GEOGRAPHIE SOCIALE: ACTEURS ET TERRITOIRES',
                  'dt_deb_eval': '2016-04-01',
                  'dt_fin_eval': '2030-01-01',
                  'ind_hors_periode': 'N',
                  'nom_enseignant': ' ',
                  'id_enseignement': '20384',
                  'ind_saisie': 'N'
               },
               {
                  'trim_num': '20161',
                  'trim_txt': 'Hiver 2016',
                  'sigle': 'GEO2200',
                  'groupe': '030',
                  'titre': 'GEOGRAPHIE SOCIALE: ACTEURS ET TERRITOIRES',
                  'dt_deb_eval': '2016-04-01',
                  'dt_fin_eval': '2030-01-01',
                  'ind_hors_periode': 'N',
                  'nom_enseignant': ' ',
                  'id_enseignement': '20385',
                  'ind_saisie': 'N'
               }
            ],
            'heureMontreal': '20160426 10:33:44',
            '$promise': {},
            '$resolved': true
         }
      };
   };

   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
    */
   beforeEach(module('pelApp'));

   /* Initialiser le contrôleur avec httpBackend et rootScope
    * et ressoudre les dépendances à horaire(backendMock) et Auth (authMock).
    */

   beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      scope = $rootScope.$new();
      backendMock = _$httpBackend_;
      EvaluationCtrl = $controller('EvaluationCtrl', {
         $scope: scope
      });

   }));



   /////////////////////////////////////////////////////////////////////////////
   /*
    * Effectuer et évaluer les TESTS.
    */

   it('EvaluationCtrl devrait être défini', function() {
      expect(EvaluationCtrl).toBeDefined();
   });

   it('devrait retourner une liste de cours à évaluer et complétées.', function() {
      backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(testListeCours());
      backendMock.flush();
      expect(scope.coursAevaluer.length).toBe(3);
      expect(scope.coursCompletee.length).toBe(1);

   });

   it('devrait retourner un avertissement fail.', function() {
      backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(testMessage());
      backendMock.flush();
      // TODO Est-ce que c'est possible. Est que listeCoursEvaluable peut retourner un fail ?
      expect(scope.avertissements[0]).toBe(' Aucun résultat ');
   });

   it('devrait retourner une erreur (error)).', function() {
      backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(testErreur());
      backendMock.flush();
      // TODO Est-ce que c'est possible. Est que listeCoursEvaluable peut retourner un fail ?
      expect(scope.err).toBe('Une erreur est survenue, veuillez essayer plus tard.');
   });

   it('devrait retourner une erreur non trappée (error)).', function() {
      backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(testErreur2());
      backendMock.flush();
      // TODO Est-ce que c'est possible. Est que listeCoursEvaluable peut retourner un fail ?
      expect(scope.err).toBe('Une erreur est survenue, veuillez essayer plus tard.');
   });

   it('devrait retourner une erreur de comm.', function() {
      backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(500,{},{});
      backendMock.flush();
      expect(scope.err).toBe('Une erreur est survenue, veuillez essayer plus tard.');
   });

   it('devrait appel de afficherQuestionnaire.', function() {
      backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(testListeCours());
      backendMock.flush();
      var cours = {
         'id_enseignement':'123',
         'sigle':'INF1000',
         'groupe':'030',
         'nom_enseignant':'moi-meme',
         'titre':'Titre du cours',
         'trim_txt':'20163'
      };
      spyOn(scope, 'afficherQuestionnaire');
      scope.afficherQuestionnaire(cours);
      expect(scope.afficherQuestionnaire).toHaveBeenCalled();

   });


   // it('devrait faire appel a la fonction between avec dates en dehors.', function() {
   //    backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(testListeCours());
   //    backendMock.flush();
   //    var debut = '2013-01-01',
   //        fin   = '2013-01-04';
   //    var result = scope.between(debut, fin);
   //    //console.log(result);
   //    expect(result).toBe('disabled desactive');
   // });


   // it('devrait faire appel a la fonction between avec dates à l\'interieur.', function() {
   //    backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(testListeCours());
   //    backendMock.flush();
   //    var debut = '2013-01-01',
   //        fin   = '2020-01-04';
   //    var result = scope.between(debut, fin);
   //    //console.log(result);
   //    expect(result).toBe('');
   // });

   // it('devrait faire appel a la fonction between avec heures à l\'extérieur.', function() {
   //    backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(testListeCours());
   //    backendMock.flush();
   //    var debut = '2013-01-01 10:33:44',
   //        fin   = '2016-04-26 10:33:43';
   //    var result = scope.between(debut, fin);
   //    //console.log(result);
   //    expect(result).toBe('disabled desactive');
   // });

   // it('devrait faire appel a la fonction between avec heures égales à la borne supérieure.', function() {
   //    backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(testListeCours());
   //    backendMock.flush();
   //    var debut = '2016-04-26 10:33:42',
   //        fin   = '2016-04-26 10:33:44';
   //    var result = scope.between(debut, fin);
   //    expect(result).toBe('');
   // });

   // it('devrait faire appel a la fonction between avec heures à l\'intérieur.', function() {
   //    backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(testListeCours());
   //    backendMock.flush();
   //    var debut = '2016-04-26 10:33:42',
   //        fin   = '2016-04-26 10:33:45';
   //    var result = scope.between(debut, fin);
   //    expect(result).toBe('');
   // });

   // it('devrait faire appel a la fonction between avec heures invalides.', function() {
   //    backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(testListeCours());
   //    backendMock.flush();
   //    var debut = '2016-04-26 10:33:45',
   //        fin   = '2016-04-26 10:33:44';
   //    var result = scope.between(debut, fin);
   //    expect(result).toBe('disabled desactive');
   // });


   it('devrait faire a getDate pour formatter.', function() {
      backendMock.when('GET','/apis/listeCoursEvaluable/' + codePermanent).respond(testListeCours());
      backendMock.flush();
      var d = '2010-01-01';
      var result = scope.getDate(d);
      expect(result).toBe('1er janv. 2010 à 00h00');
   });


});

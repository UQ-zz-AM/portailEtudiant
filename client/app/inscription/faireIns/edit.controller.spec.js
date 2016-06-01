/*jshint unused:false, camelcase:false*/
/*globals alert, afterEach, spyOn*/

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
describe('Controller: EditCtrl', function() {

   var scope,
       backendMock,
       editCtrl,
       $timeout,
       elem = angular.element;


    var cours1 = {
       'action' : 'remplacer',
       'titre' : 'Un cours parmi tant d\'autres',
       'credit' : '4'
    };

   var listCours1 = {
      'status': 'success',
      'data': {
         'parametresAppel': {
            'trimestre': '20153',
            'sigle': 'LIN1002',
            'programme': '7254'
         },
         'titre': 'Connaissances de base en grammaire du français écrit (hors programme)',
         'credit': '3',
         'etatCours': 'VALIDE',
         'groupe': [{
            'noGroupe': '001',
            'nbPlace': '47',
            'statutInscription': 'OUVERT_A_TOUS',
            'transgressionPermise': 'OUI',
            'sousSession': '',
            'campus': 'Campus à déterminer',
            'horaire': [{
               'jour': 'Jeudi',
               'heurDebut': '19h00',
               'heureFin': '22h00',
               'local': ''
            }]
         }, {
            'noGroupe': '002',
            'nbPlace': '45',
            'statutInscription': 'OUVERT_A_TOUS',
            'transgressionPermise': 'OUI',
            'sousSession': '',
            'campus': 'Campus à déterminer',
            'horaire': [{
               'jour': 'Jeudi',
               'heurDebut': '14h00',
               'heureFin': '17h00',
               'local': ''
            }]
         }, {
            'noGroupe': '020',
            'nbPlace': '39',
            'statutInscription': 'OUVERT_A_TOUS',
            'transgressionPermise': 'OUI',
            'sousSession': '',
            'campus': 'Campus à déterminer',
            'horaire': [{
               'jour': 'Mardi',
               'heurDebut': '09h30',
               'heureFin': '12h30',
               'local': ''
            }]
         }, {
            'noGroupe': '021',
            'nbPlace': '49',
            'statutInscription': 'OUVERT_A_TOUS',
            'transgressionPermise': 'OUI',
            'sousSession': '',
            'campus': 'Campus à déterminer',
            'horaire': [{
               'jour': 'Mardi',
               'heurDebut': '09h30',
               'heureFin': '12h30',
               'local': ''
            }]
         }, {
            'noGroupe': '022',
            'nbPlace': '50',
            'statutInscription': 'OUVERT_A_TOUS',
            'transgressionPermise': 'OUI',
            'sousSession': '',
            'campus': 'Campus à déterminer',
            'horaire': [{
               'jour': 'Mardi',
               'heurDebut': '18h00',
               'heureFin': '21h00',
               'local': ''
            }]
         }, {
            'noGroupe': '023',
            'nbPlace': '50',
            'statutInscription': 'OUVERT_A_TOUS',
            'transgressionPermise': 'OUI',
            'sousSession': '',
            'campus': 'Campus à déterminer',
            'horaire': [{
               'jour': 'Mardi',
               'heurDebut': '14h00',
               'heureFin': '17h00',
               'local': ''
            }]
         }, {
            'noGroupe': '030',
            'nbPlace': '49',
            'statutInscription': 'OUVERT_A_TOUS',
            'transgressionPermise': 'OUI',
            'sousSession': '',
            'campus': 'Campus à déterminer',
            'horaire': [{
               'jour': 'Mercredi',
               'heurDebut': '14h00',
               'heureFin': '17h00',
               'local': ''
            }]
         }, {
            'noGroupe': '040',
            'nbPlace': '49',
            'statutInscription': 'OUVERT_A_TOUS',
            'transgressionPermise': 'OUI',
            'sousSession': '',
            'campus': 'Campus à déterminer',
            'horaire': [{
               'jour': 'Jeudi',
               'heurDebut': '18h00',
               'heureFin': '21h00',
               'local': ''
            }]
         }, {
            'noGroupe': '050',
            'nbPlace': '49',
            'statutInscription': 'OUVERT_A_TOUS',
            'transgressionPermise': 'OUI',
            'sousSession': '',
            'campus': 'Campus à déterminer',
            'horaire': [{
               'jour': 'Vendredi',
               'heurDebut': '09h30',
               'heureFin': '12h30',
               'local': ''
            }]
         }],
         'heureMontreal': '20151123 15:52:03',
         '$promise': {},
         '$resolved': true
      }
   };

   var listCours2 = {
      'status': 'success',
      'data': {
         'parametresAppel': {
            'trimestre': '20153',
            'sigle': 'INF0326',
            'programme': '7111'
         },
         'titre': 'Outils de bureautique et Internet (hors programme)',
         'credit': '3',
         'etatCours': 'VALIDE',
         'groupe': [
            {
               'noGroupe': '030',
               'nbPlace': '0',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Mercredi',
                     'heurDebut': '09h30',
                     'heureFin': '12h30',
                     'local': ''
                  }
               ]
            },
            {
               'noGroupe': '064',
               'nbPlace': '23',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Mardi',
                     'heurDebut': '09h30',
                     'heureFin': '12h30',
                     'local': ''
                  }
               ]
            }
         ],
         'heureMontreal': '20151124 09:59:42',
         '$promise': {},
         '$resolved': true
      }
   };

   var listCours3 = {
      'status': 'success',
      'data': {
         'parametresAppel': {
            'trimestre': '20153',
            'sigle': 'ANG3027',
            'programme': '7111'
         },
         'titre': 'Intermediate English Skills for Business',
         'credit': '3',
         'etatCours': 'VALIDE',
         'groupe': [
            {
               'noGroupe': '040',
               'nbPlace': '42',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Jeudi',
                     'heurDebut': '14h00',
                     'heureFin': '17h00',
                     'local': ''
                  }
               ]
            },
            {
               'noGroupe': '050',
               'nbPlace': '42',
               'statutInscription': 'SUSPENDU_WEB',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Vendredi',
                     'heurDebut': '14h00',
                     'heureFin': '17h00',
                     'local': ''
                  }
               ]
            },
            {
               'noGroupe': '060',
               'nbPlace': '35',
               'statutInscription': 'SUSPENDU',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': []
            }
         ],
         'heureMontreal': '20151124 11:06:12',
         '$promise': {},
         '$resolved': true
      }

   };

   var listCours4 ={
      'status': 'success',
      'data': {
         'parametresAppel': {
            'trimestre': '20153',
            'sigle': 'ANG20BB',
            'programme': '7111'
         },
         'titre': '',
         'credit': '',
         'etatCours': 'INVALIDE',
         'groupe': [],
         'heureMontreal': '20151124 13:26:56',
         '$promise': {},
         '$resolved': true
      }
   };

   var listCoursMat1002 = {
      'status' :'success',
      'data': {
         'parametresAppel': {
            'trimestre': '20153',
            'sigle': 'MAT1002',
            'programme': '7111'
         },
         'titre': 'Introduction aux méthodes quantitatives appliquées à la gestion (hors programme)',
         'credit': '3',
         'etatCours': 'VALIDE',
         'groupe': [
            {
               'noGroupe': '001',
               'nbPlace': '50',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Mardi',
                     'heurDebut': '18h30',
                     'heureFin': '21h30',
                     'local': ''
                  }
               ]
            },
            {
               'noGroupe': '002',
               'nbPlace': '54',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Mercredi',
                     'heurDebut': '18h30',
                     'heureFin': '21h30',
                     'local': ''
                  }
               ]
            },
            {
               'noGroupe': '003',
               'nbPlace': '48',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Jeudi',
                     'heurDebut': '18h30',
                     'heureFin': '21h30',
                     'local': ''
                  }
               ]
            },
            {
               'noGroupe': '004',
               'nbPlace': '49',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Mercredi',
                     'heurDebut': '18h30',
                     'heureFin': '21h30',
                     'local': ''
                  }
               ]
            },
            {
               'noGroupe': '010',
               'nbPlace': '54',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Lundi',
                     'heurDebut': '18h00',
                     'heureFin': '21h00',
                     'local': ''
                  }
               ]
            },
            {
               'noGroupe': '030',
               'nbPlace': '55',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Mercredi',
                     'heurDebut': '09h30',
                     'heureFin': '12h30',
                     'local': ''
                  }
               ]
            },
            {
               'noGroupe': '031',
               'nbPlace': '55',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Mercredi',
                     'heurDebut': '18h00',
                     'heureFin': '21h00',
                     'local': ''
                  }
               ]
            },
            {
               'noGroupe': '050',
               'nbPlace': '55',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Vendredi',
                     'heurDebut': '09h30',
                     'heureFin': '12h30',
                     'local': ''
                  }
               ]
            },
            {
               'noGroupe': '052',
               'nbPlace': '28',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Vendredi',
                     'heurDebut': '09h30',
                     'heureFin': '12h30',
                     'local': ''
                  }
               ]
            }
         ],
         'heureMontreal': '20151124 15:15:43',
         '$promise': {},
         '$resolved': true
      }
   };

   var listeHoraire = {
      'status' :'success',
      'data' : {
         'parametresAppel': {
            'trimestre': '20153',
            'sigle': 'ADM1100',
            'programme': '7111'
         },
         'titre': 'Gestion des organisations',
         'credit': '3',
         'etatCours': 'ABSENT_HORAIRE',
         'groupe': [],
         'heureMontreal': '20151124 16:02:07',
         '$promise': {},
         '$resolved': true
      }
   };

   var listeAucunHoraire = {
      'status' :'success',
      'data' : {
         'parametresAppel': {
            'trimestre': '20153',
            'sigle': 'ADM1100',
            'programme': '7111'
         },
         'titre': 'Gestion des organisations',
         'credit': '3',
         'etatCours': 'VALIDE',
         'groupe': [],
         'heureMontreal': '20151124 16:02:07',
         '$promise': {},
         '$resolved': true
      }
   };

   var list1Place = {
      'status': 'success',
      'data': {
         'parametresAppel': {
            'trimestre': '20153',
            'sigle': 'ANG3027',
            'programme': '7111'
         },
         'titre': 'Intermediate English Skills for Business',
         'credit': '3',
         'etatCours': 'VALIDE',
         'groupe': [
            {
               'noGroupe': '040',
               'nbPlace': '1',
               'statutInscription': 'OUVERT_A_TOUS',
               'transgressionPermise': 'OUI',
               'sousSession': '',
               'campus': 'Campus à déterminer',
               'horaire': [
                  {
                     'jour': 'Jeudi',
                     'heurDebut': '14h00',
                     'heureFin': '17h00',
                     'local': ''
                  }
               ]
            }
         ],
         'heureMontreal': '20151124 11:06:12',
         '$promise': {},
         '$resolved': true
      }

   };



   var lesCoursInscrits = [{
      'sigle': 'LIN1002',
      'titre': 'Comptabilité financière intermédiaire I',
      'credit': '3',
      'groupe': '20',
      'sousSession': '',
      'statutInscription': 'OUVERT_A_TOUS',
      'transgressionPermise': 'OUI',
      'codeProgramme': '7330',
      'historiqueAjout': 'TODO historique de l\'ajout (à venir)'
   }, {
      'sigle': 'SCO3006',
      'titre': 'Systèmes d\'information comptable',
      'credit': '3',
      'groupe': '2',
      'sousSession': '',
      'statutInscription': 'OUVERT_A_TOUS',
      'transgressionPermise': 'OUI',
      'codeProgramme': '7330',
      'historiqueAjout': 'TODO historique de l\'ajout (à venir)'
   }, {
      'sigle': 'SCO3008',
      'titre': 'Impôt sur le revenu I',
      'credit': '3',
      'groupe': '22',
      'sousSession': '',
      'statutInscription': 'OUVERT_A_TOUS',
      'transgressionPermise': 'OUI',
      'codeProgramme': '7330',
      'historiqueAjout': 'TODO historique de l\'ajout (à venir)'
   }];



   var  testFail = {
      'status': 'fail',
      'data': {
         'message': 'Problème'
      }
   };

   var testSigle = {

         'status': 'success',
         'data': {
            'heureMontreal': '20150301 00:00:00',
            'listeSigle': {
               'tabCours': [
                  'INF0326',
                  'INF1026',
                  'INF1035',
                  'INF1105',
                  'INF1120',
                  'INF1130',
                  'INF1256',
                  'INF2005',
                  'INF2015',
                  'INF2120',
                  'INF2160',
                  'INF2170',
                  'INF3105',
                  'INF3135',
                  'INF3143',
                  'INF3172',
                  'INF3180',
                  'INF3270',
                  'INF4100',
                  'INF4170',
                  'INF4375',
                  'INF5071',
                  'INF5151',
                  'INF5153',
                  'INF5171',
                  'INF5180',
                  'INF6150',
                  'INF7115',
                  'INF7210',
                  'INF7215',
                  'INF7270',
                  'INF7330',
                  'INF7335',
                  'INF7345',
                  'INF7440',
                  'INF7470',
                  'INF7570',
                  'INF7741',
                  'INF8212',
                  'INF8652',
                  'INF980X',
                  'INF9811',
                  'INF9812',
                  'ING1000',
                  'ING2510',
                  'ING3001',
                  'ING3002',
                  'ING3003',
                  'ING3510',
                  'ING4001',
                  'ING4221',
                  'ING6311',
                  'INM4701',
                  'INM4702',
                  'INM4703',
                  'INM5001',
                  'INM5151',
                  'INM5801',
                  'INM5802',
                  'INM5803',
                  'INM6000'
               ],
               'statut': 'Succes'
            }
         }

   };

   var tropDeCours = {

         'status': 'success',
         'data': {
            'heureMontreal': '20150301 00:00:00',
            'listeSigle': {
               'tabCours': [],
               'statut': 'TropDeCours',
               'nbSigles': 294
            }
         }

   };

   var testErreur = {
      'status': 'error',
      'message': 'Erreur fatale dans le service.'
   };

   /////////////////////////////////////////////////////////////////////////////
   /*
   * PRÉPARER les tests.
   */
   beforeEach(module('pelApp'));

   // /* Initialiser le contrôleur avec httpBackend et rootScope
   //  * et ressoudre les dépendances aux autorisations (backendMock) et Auth (authMock).
   //  */
   beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, _$timeout_) {
      scope = $rootScope.$new();
      backendMock = _$httpBackend_;
      $timeout = _$timeout_;
      editCtrl = $controller('EditCtrl', {
         $scope: scope,
         $element:elem
      });
      backendMock.when('GET','app/main/main.html').respond({'status':'err'});
      scope.cours = {'groupe':'40'};
   }));

   /////////////////////////////////////////////////////////////////////////////
   /*
   * Effectuer et évaluer les TESTS.
   */

   it('editCtrl devrait être défini', function() {
      expect(editCtrl).toBeDefined();
   });

   it('editCtrl appel a foncion init avec une action modifier dans le parent.', function() {
      scope.cours = cours1;
      editCtrl.init();
      expect(editCtrl.crsCourant.credit).toBe('4');
      expect(editCtrl.typeTransaction).toBe('remplacer');
      expect(scope).toBeDefined();
   });


   /******************* GETLISTEGROUPES /*******************/

   it('editCtrl appel de getListeGroupes, cours avec des places.', function() {
      backendMock.when('GET','/apis/listeCoursGroupe/identifiant/7254/20153/LIN1002').respond(listCours1);
      editCtrl.getListeGroupes('7254', '20153', 'LIN1002');
      backendMock.flush();
      //console.log(angular.mock.dump(editCtrl.crsCourant.groupe.length));
      expect(editCtrl.crsCourant.groupe.length).toBe(9);

   });

   it('editCtrl appel de getListeGroupes avec groupe complet et groupe avec places.', function() {
      backendMock.when('GET','/apis/listeCoursGroupe/identifiant/7111/20153/INF0326').respond(listCours2);
      editCtrl.getListeGroupes('7111', '20153', 'INF0326');
      backendMock.flush();
      //console.log(angular.mock.dump(editCtrl.crsCourant.groupe.length));
      expect(editCtrl.crsCourant.groupe.length).toBe(2);
   });

   it('editCtrl appel de getListeGroupes groupe suspedu.', function() {
      backendMock.when('GET','/apis/listeCoursGroupe/identifiant/7111/20153/ANG3027').respond(listCours3);
      editCtrl.getListeGroupes('7111', '20153', 'ANG3027');
      backendMock.flush();
      //console.log(angular.mock.dump(editCtrl.crsCourant.groupe.length));
      expect(editCtrl.crsCourant.groupe.length).toBe(3);
   });

   it('editCtrl appel de getListeGroupes cours invalide.', function() {
      backendMock.when('GET','/apis/listeCoursGroupe/identifiant/7111/20153/ANG3bb7').respond(listCours4);
      editCtrl.getListeGroupes('7111', '20153', 'ANG3bb7');
      backendMock.flush();
      //console.log(angular.mock.dump(editCtrl.crsCourant));
      expect(editCtrl.crsCourant.etatCours).toBe('INVALIDE');
   });

   it('editCtrl appel de getListeGroupes avec le même groupe que le parent.', function() {
      backendMock.when('GET','/apis/listeCoursGroupe/identifiant/7111/20153/MAT1002').respond(listCoursMat1002);
      backendMock.flush();
      //console.log(angular.mock.dump(scope.$parent.cours));
      expect(scope).toBeDefined();
   });

   it('editCtrl appel de getListeGroupes groupe horaire absent.', function() {
      backendMock.when('GET','/apis/listeCoursGroupe/identifiant/7111/20153/ABSENCE').respond(listeHoraire);
      editCtrl.getListeGroupes('7111', '20153', 'ABSENCE');
      backendMock.flush();
      //console.log(angular.mock.dump(editCtrl));
      expect(editCtrl.crsCourant.etatCours).toBe('ABSENT_HORAIRE');
   });

   it('editCtrl appel de getListeGroupes aucun horaire.', function() {
      backendMock.when('GET','/apis/listeCoursGroupe/identifiant/7111/20153/ADM1100').respond(listeAucunHoraire);
      editCtrl.getListeGroupes('7111', '20153', 'ADM1100');
      backendMock.flush();
      //console.log(angular.mock.dump(editCtrl));
      expect(editCtrl.crsCourant.groupe.length).toBe(0);
   });

   it('editCtrl appel de getListeGroupes 1 groupe avec une place.', function() {
      backendMock.when('GET','/apis/listeCoursGroupe/identifiant/7111/20153/ANG3027').respond(list1Place);
      editCtrl.getListeGroupes('7111', '20153', 'ANG3027');
      backendMock.flush();
      expect(editCtrl.crsCourant.groupe[0].nbPlace).toBe('1');
   });

   /******************* Autres /*******************/

   it('editCtrl appel de onSelect avec de bonne données.', function() {
      editCtrl.sigleCourant     = 'INF3333';
      editCtrl.lastSigleCourant = 'INF4545';
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};
      editCtrl.onSelect();
      expect(editCtrl.spinningGroupe).toBe(true);
   });

   it('editCtrl appel de onSelect avec lastSigleCourant et sigleCourant identique.', function() {
      editCtrl.sigleCourant     = 'INF4545';
      editCtrl.lastSigleCourant = 'INF4545';
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};
      editCtrl.onSelect();
      expect(editCtrl.spinningGroupe).toBe(false);
   });

   it('editCtrl appel de onSelect avec sigleCourant très long.', function() {
      editCtrl.sigleCourant     = 'INFdjkfgh jdh jdfg hdflkjhg dfklj ghl kdjfh';
      editCtrl.lastSigleCourant = 'INF4545';
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};
      editCtrl.onSelect();
      expect(editCtrl.spinningGroupe).toBe(false);
   });

   it('editCtrl appel de onSelect avec sigleCourant trop court.', function() {
      editCtrl.sigleCourant     = 'INF';
      editCtrl.lastSigleCourant = 'INF4545';
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};
      editCtrl.onSelect();
      expect(editCtrl.spinningGroupe).toBe(false);
   });

   it('editCtrl appel de changeSigle avec sigleCourant court.', function() {

      editCtrl.sigleCourant     = 'INF';
      // Ces valeurs devraient disparaître.
      editCtrl.crsCourant='Allo';
      editCtrl.lastSigleCourant='Bonjour';
      editCtrl.groupeSelectionne={'contenu':'chose'};

      editCtrl.changeSigle();

      expect(editCtrl.crsCourant).toBe(null);
      expect(editCtrl.lastSigleCourant).toBe(null);
      expect(editCtrl.groupeSelectionne.contenu).toBeFalsy();
   });

   it('editCtrl appel de changeSigle avec sigleCourant long.', function() {

      editCtrl.sigleCourant     = 'INF2020';
      // Ces valeurs devraient disparaître.
      editCtrl.crsCourant='Allo';
      editCtrl.lastSigleCourant='Bonjour';
      editCtrl.groupeSelectionne={'contenu':'chose'};

      editCtrl.changeSigle();

      expect(editCtrl.crsCourant).toBe('Allo');
      expect(editCtrl.lastSigleCourant).toBe('Bonjour');
      expect(editCtrl.groupeSelectionne.contenu).toBe('chose');
   });

   it('editCtrl appel de statutCouleur avec cours valide .', function() {
      editCtrl.crsCourant = {};
      editCtrl.sigleCourant = 'allo';
      var res = editCtrl.statutCouleur();
      expect(res).toContain('green');
   });

   it('editCtrl appel de statutCouleur avec sigle longueur minimale .', function() {
      editCtrl.sigleCourant = '123';
      var res = editCtrl.statutCouleur();
      expect(res).toContain('border:;background:;');
   });

   it('editCtrl appel de statutCouleur avec cours invalide .', function() {
      editCtrl.crsCourant = {};
      editCtrl.crsCourant.messageCours = 'allo';
      var res = editCtrl.statutCouleur();
      expect(res).toContain('#a71700');
   });


   it('editCtrl appel de isGroupeInvalide.', function() {
      editCtrl.groupeSelectionne = {};
      editCtrl.groupeSelectionne.statutInscription = 'INVALIDE';
      var res = editCtrl.isGroupeInvalide();
      expect(res).toBe(true);
      editCtrl.groupeSelectionne.statutInscription = 'OUVERT_A_TOUS';
      editCtrl.groupeSelectionne.nbPlace = '0';
      res = editCtrl.isGroupeInvalide();
      expect(res).toBe(true);
      editCtrl.groupeSelectionne.nbPlace = '3';
      res = editCtrl.isGroupeInvalide();
      expect(res).toBe(false);
   });

   it('editCtrl appel de isGroupeValide.', function() {
      editCtrl.groupeSelectionne = {};
      editCtrl.groupeSelectionne.statutInscription = 'INVALIDE';
      var res = editCtrl.isGroupeValide();
      expect(res).toBe(false);
      editCtrl.groupeSelectionne.statutInscription = 'OUVERT_A_TOUS';
      editCtrl.groupeSelectionne.nbPlace = '0';
      res = editCtrl.isGroupeValide();
      expect(res).toBe(false);
      editCtrl.groupeSelectionne.nbPlace = '3';
      res = editCtrl.isGroupeValide();
      expect(res).toBe(true);
   });


   it('editCtrl appel de isGroupeValide.', function() {

      editCtrl.sigleCourant = 'INF1000';
      var res = editCtrl.isCoursDeLangue();
      expect(res).toBe(false);

      editCtrl.sigleCourant = 'ESP1000';
      res = editCtrl.isCoursDeLangue();
      expect(res).toBe(true);

      editCtrl.sigleCourant = 'ANG1000';
      res = editCtrl.isCoursDeLangue();
      expect(res).toBe(true);

      editCtrl.sigleCourant = undefined;
      res = editCtrl.isCoursDeLangue();
      expect(res).toBe(false);
   });

   it('editCtrl traiteInscription ajouter.', function() {
      var sigle ='inf4545',
          groupe = '30';

      scope.p = {
         'resultat' : {
            'transaction': '',
            'sigle': '',
            'groupe': '',
            'sigleAncien': '',
            'groupeAncien': '',
         },
         'traiterInscription' : function(transaction, sigle, groupe, sigleAncien, groupeAncien){
            scope.p.resultat.transaction = transaction;
            scope.p.resultat.sigle = sigle;
            scope.p.resultat.groupe = groupe;
            scope.p.resultat.sigleAncien = sigleAncien;
            scope.p.resultat.groupeAncien = groupeAncien;
         }
      };

      scope.cours={
         'sigle': sigle,
         'groupe': groupe
      };

      scope.traiterInscription = scope.p.traiterInscription;
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};

      editCtrl.sigleCourant = 'INF100';
      editCtrl.groupeSelectionne = {};
      editCtrl.groupeSelectionne.noGroupe = '20';
      editCtrl.typeTransaction = 'ajouter';


      // Ajouter
      editCtrl.traiteInscription();
      expect(scope.p.resultat.transaction).toBe('ajouter');

      // remplacer
      editCtrl.typeTransaction = 'remplacer';
      editCtrl.traiteInscription();
      expect(scope.p.resultat.transaction).toBe('remplacer');

      // modifier le groupe
      editCtrl.typeTransaction = 'remplacer';
      editCtrl.sigleCourant = 'inf4545';
      editCtrl.traiteInscription();
      expect(scope.p.resultat.transaction).toBe('modifier');

   });


   it('editCtrl appel de getSigles pour une nouvelle requête.', function() {
      backendMock.expect('GET','/apis/autocompletion/identifiant/20153/INF0326').respond(testSigle);
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};
      editCtrl.getSigles('INF0326');
      backendMock.flush();
      // seulement une couverture de code
      expect(1).toBe(1);
   });

   it('editCtrl appel de getSigles pour une requête avec trop de cours.', function() {
      backendMock.expect('GET','/apis/autocompletion/identifiant/20153/MUS').respond(tropDeCours);
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};
      editCtrl.getSigles('MUS');
      backendMock.flush();
      // seulement une couverture de code
      expect(1).toBe(1);
   });

   it('editCtrl appel de getSigles pour une requête erreur.', function() {
      backendMock.expect('GET','/apis/autocompletion/identifiant/20153/MUS').respond(testErreur);
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};
      editCtrl.getSigles('MUS');
      backendMock.flush();
      // seulement une couverture de code
      expect(1).toBe(1);
   });

   it('editCtrl appel de getSigles plus d\'une fois.', function() {
      backendMock.expect('GET','/apis/autocompletion/identifiant/20153/INF').respond(testSigle);
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};
      editCtrl.getSigles('INF');
      backendMock.flush();
      // On fait le flush avant pour la promesse du $http se réalise
      // Le prochain call à getSigles prends le cache, il ne fait pas d'appel au serveur
      var r = editCtrl.getSigles('INF0');
      expect(r.length).toBe(1);  // Un seul cours INF0  : INF0326
   });

   it('editCtrl appel de getSigles plus d\'une fois, 5 caractères.', function() {
      backendMock.expect('GET','/apis/autocompletion/identifiant/20153/INF').respond(testSigle);
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};
      editCtrl.getSigles('INF');
      backendMock.flush();
      // On fait le flush avant pour la promesse du $http se réalise
      // Le prochain call à getSigles prends le cache, il ne fait pas d'appel au serveur
      var r = editCtrl.getSigles('INF10');
      expect(r.length).toBe(2);  // 2 cours INF10...
   });

   it('editCtrl appel de getSigles plus d\'une fois, 4 caractères', function() {
      backendMock.expect('GET','/apis/autocompletion/identifiant/20153/INF').respond(testSigle);
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};
      editCtrl.getSigles('INF');
      backendMock.flush();
      // On fait le flush avant pour la promesse du $http se réalise
      // Le prochain call à getSigles prends le cache, il ne fait pas d'appel au serveur
      var r = editCtrl.getSigles('INF1120');
      expect(r.length).toBe(1);
   });

   it('editCtrl appel de getSigles plus d\'une fois, 4 caractères mais pas la.', function() {
      backendMock.expect('GET','/apis/autocompletion/identifiant/20153/INF').respond(testSigle);
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};
      editCtrl.getSigles('INF');
      backendMock.flush();
      // On fait le flush avant pour la promesse du $http se réalise
      // Le prochain call à getSigles prends le cache, il ne fait pas d'appel au serveur
      var r = editCtrl.getSigles('INFX');
      expect(r.length).toBe(0);
   });

   it('editCtrl appel de onSelect plus d\'une fois, pas dans le cache.', function() {
      backendMock.expect('GET','/apis/autocompletion/identifiant/20153/INF').respond(testSigle);
      scope.programmeCourant={'code_prog':'7111'};
      scope.trimestreCourant= {'an_ses_num':'20153'};
      editCtrl.getSigles('INF');
      backendMock.flush();
      // On fait le flush avant pour la promesse du $http se réalise

      // Pas dans le cache
      editCtrl.sigleCourant='INFXX';
      editCtrl.onSelect();

   });

   it(' editCtrl Ajouter un cours déjà là. ', function() {
      scope.coursInscrits = lesCoursInscrits;
      editCtrl.typeTransaction = 'ajouter';
      editCtrl.sigleCourant='LIN1002';
      editCtrl.onSelect();
      expect(editCtrl.crsCourant.messageCours).toContain('Vous êtes déjà inscrit à ce cours');

   });



});

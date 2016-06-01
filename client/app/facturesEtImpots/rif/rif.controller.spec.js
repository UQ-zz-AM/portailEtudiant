/* jshint unused:false, camelcase:false */
/* globals spyOn */

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

describe('Controller: rifCtrl', function() {


//"{"status":"success","data":{"generale":{"trimestre":"20143","en_date_du":"20141214"},"academique":{"message":"Pour connaître les locaux de cours, changer votre adresse, consulter la page d'acceuil du registrariat à l'adresse : http://www.etudier.uqam.ca","programmes":[]},"finance":{"message":"Avant de faire votre paiement, toujours vérifier votre solde sur : https://www-s.uqam.ca/regis/insfac.html","solde_ant_dt":"20140228","solde_ant_mt":"0","min_req_exig_dt":"Pour le 20140912","min_req_exig_mt":"0","min_req_brut_mt":"","min_req_trim_mt":"","total_ajout_de_frais":"0","detail_ajout_de_frais":[],"total_section_paiement":"0","detail_section_paiement":[],"total_section_autres_frais":"0","detail_section_autres_frais":[],"total_facture_trimestre":"0","solde_global":"0","liste_trim_hist":[]}}}"

   var rifCtrl,
      scope,
      backendMock,
      codePermanent = 'identifiant',
      errGenerique = 'Une erreur est survenue, veuillez essayer plus tard.',
      testData = function() {
         return { 'status': 'success',
                      data: {'generale': {
                              'trimestre': '20143',
                              'coordonnees': {
                                'adresseGeographique': ['Local DS-1110 (pavillon J.-A.-DeSève)', '320, rue Sainte-Catherine Est', 'Montréal (Québec) H2X 1L7'],
                                'adressePostale': ['Case postale 8888,', 'Succursale Centre-Ville,', 'Montréal (Québec) H3C 3P8'],
                                'telephone': ' ',
                                'telecopieur': ' ',
                                'courriel': '@exemple.ca',
                                'siteWeb': 'servicesfinanciers.uqam.ca'
                              },
                              'en_date_du': '20141204'
                           }
                        }
         };
      },
      testMessages = function() {
         return { 'status': 'success',
                  data:{
                     'messageMauvaiseCreance': [
                     'Votre dossier financier n\'est pas en règle. Pour régularisez la situation, veuillez contacter le service des comptes étudiants',
                     'Vous n\'avez pas d\'activité à ce trimestre'
                     ]
                  }
               };
      },
      testMessage = function() {
         return { 'status': 'fail',
                  data: {
                     'message': 'Votre dossier financier n\'est pas en règle.'
                  }
               };
      },
      testErreur = function() {
         return { 'status': 'error',
                 'message': 'Erreur fatale dans le service.'
              };
      },

      DossierModelMock = {
         getDossierPart: function(element) {
            return {
               'generale':{
                  'trimestre':'20143',
                  'coordonnees': {
                                'adresseGeographique': ['Local DS-1110 (pavillon J.-A.-DeSève)', '320, rue Sainte-Catherine Est', 'Montréal (Québec) H2X 1L7'],
                                'adressePostale': ['Case postale 8888,', 'Succursale Centre-Ville,', 'Montréal (Québec) H3C 3P8'],
                                'telephone': ' ',
                                'telecopieur': ' ',
                                'courriel': 'comptes.etudiants@uqam.ca',
                                'siteWeb': 'servicesfinanciers.uqam.ca'
                              },
                  'en_date_du':'20141204'
               }
            };
         }
      };


   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
   */
   beforeEach(module('pelApp'));

   /* Initialiser le contrôleur avec httpBackend et rootScope
    * et ressoudre les dépendances à rif(backendMock) et Auth (authMock).
   */
   beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      scope = $rootScope.$new();
      backendMock = _$httpBackend_;
      rifCtrl = $controller('RifCtrl', {
         $scope: scope
      });

   }));


   /////////////////////////////////////////////////////////////////////////////
   /*
    * Effectuer et évaluer les TESTS.
   */

   it('rifCtrl devrait être défini', function() {
      expect(rifCtrl).toBeDefined();
   });

   it('rifCourant ne devrait pas être défini', function() {
      expect(scope.rifCourant).toBeUndefined();
   });

   it('devrait récupérer une facture', function() {
      backendMock.when('GET','/apis/rif/' + codePermanent ).respond(testData());
      backendMock.flush();
      expect(scope.rifCourant).toBeDefined();
      expect(scope.rifCourant.generale.trimestre).toContain('20143');
      expect(scope.trimestreCourant).toEqual('20143');
   });

   it('devrait modifier le statut existant du trimestreAnterieur', function() {
      scope.changeToggle('trimestreAnterieur');
      expect(scope.toggle.trimestreAnterieur).toBeTruthy();
      scope.changeToggle('trimestreAnterieur');
      expect(scope.toggle.trimestreAnterieur).toBeFalsy();
   });

   it('should créer et changer un item existant indexName(1)  (droitScolarite)', function() {
      // Ajouter un nouvel item vrai lors de la création
      scope.changeToggle('droitScolarite', 1);
      expect(scope.toggle.droitScolarite['1']).toBeTruthy();
      // Le faire basculer à faux
      scope.changeToggle('droitScolarite', 1);
      expect(scope.toggle.droitScolarite['1']).toBeFalsy();
      // Le faire basculer à vrai de nouveaux
      scope.changeToggle('droitScolarite', 1);
      expect(scope.toggle.droitScolarite['1']).toBeTruthy();
   });

   it('devrait utiliser une facture en cache(DossierModel) plutôt qu\'aller sur le réseau', inject(function($controller) {
      // injection du DossierModel
      rifCtrl = $controller('RifCtrl', {
         $scope: scope,
         DossierModel: DossierModelMock
      });
      expect(scope.rifCourant).toBeDefined();
      expect(scope.rifCourant.generale.trimestre).toContain('20143');
      expect(scope.trimestreCourant).toEqual('20143');
   }));

   it('devrait retourner une erreur serveur (http 500)', function() {
      backendMock.when('GET','/apis/rif/' + codePermanent ).respond(500,{},{});
      backendMock.flush();
      expect(scope.err).toEqual(errGenerique);
   });

   it('devrait récupérer plusieurs messages', function() {
      backendMock.when('GET','/apis/rif/' + codePermanent ).respond(testMessages());
      backendMock.flush();
      expect(scope.avertissements[0]).not.toEqual(0);
   });

   it('devrait récupérer un message', function() {
      backendMock.when('GET','/apis/rif/' + codePermanent ).respond(testMessage());
      backendMock.flush();
      expect(scope.avertissements[0]).not.toEqual(0);
   });

   it('devrait récupérer une erreur jsend (error) ', function() {
      backendMock.when('GET','/apis/rif/' + codePermanent ).respond(testErreur());
      backendMock.flush();
      expect(scope.err).not.toEqual(0);
   });

});

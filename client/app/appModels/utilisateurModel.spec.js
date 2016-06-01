/*jshint camelcase:false */
/*global afterEach */

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

describe('Service: UtilisateurModel', function() {

   var serviceUtilisateur,
      httpBackend,
      location,
      utilisateur,
      statut = true,
      mockAccepterData = {
         'status': 'success',
         'data': {
            'dateConsentement': '20150217'
         }
      },
      mockAuth = {
         isLoggedIn: function() {
            //console.log('isLoggedIn: true');
            statut = true;
            return (true);
         },
         logout: function(suite) {
            statut = false;
            if (suite) {
               statut = false;
            }
         }
      },
      mockbackendData = {
         'status': 'success',
         'data': {
            'resume': {
               'socio': {
                  'code_perm': 'HELA203366466',
                  'prenom': 'Paul',
                  'nom': 'St-Paul',
                  'adresse_l1': '2222 AV Frisé',
                  'adresse_l2': 'MONTREAL H3A 2Z7',
                  'adresse_l3': '',
                  'tel_res': '(514) 555-5555',
                  'tel_tra': '(514) 555-5555 Poste: 555   ',
                  'sexe': 'Féminin',
                  'date_naiss': '1971-01-31',
                  'courriel': 'st-paul.paul@example.ca',
                  'confidentiel': 'N',
                  'del_finance': 'N',
                  'del_biblio': 'N',
                  'regl_infra_conf': 'N',
                  'regl_infra_msg': '<strong>Intégrité académique</strong>...'
               },
               'trimestresCourants': [{
                  'trim_txt': 'Hiver 2015',
                  'trim_num': '20151',
                  'trim_def': 'N'
               }, {
                  'trim_txt': 'Été 2015',
                  'trim_num': '20152',
                  'trim_def': 'N'
               }, {
                  'trim_txt': 'Automne 2015',
                  'trim_num': '20153',
                  'trim_def': 'O'
               }],
               'finance': {
                  'generale': {
                     'date_echeance': 'n.a.',
                     'date_solde_anterieur': 'n.a.',
                     'code_permanent': 'HELA30546609',
                     'trimestre': '20151',
                     'p_ind_1er_paiement': 'false',
                     'en_date_du': '20150216',
                     'coordonnees': {
                        'adresseGeographique': [
                           'Local DS-ZZZZ (Pavillon J.-A. De Sève)',
                           '320, rue Sainte-Catherine Est',
                           'Montréal (Québec) H2X 1L7'
                        ],
                        'adressePostale': [
                           '...',
                           '...,',
                           '...'
                        ],
                        'telephone': '...',
                        'telecopieur': '...',
                        'courriel': '...',
                        'siteWeb': '...'
                     },
                     'aideGenerale': [
                        'Pour toute question ou information concernant ...',
                        'Téléphone : ...',
                        'Courriel : ...',
                        'Ou présentez-vous ...'
                     ],
                     'aideFacture': {
                        'soldeAnterieur': 'Solde à la date indiquée',
                        'ajoutFrais': 'Transactions ajoutées après la date du solde indiquée ci-haut pour des trimestres antérieurs',
                        'factureCourante': 'Voir détails ci-dessous',
                        'detailPaiement': 'Cliquer sur le + pour voir le détail de vos paiements',
                        'classeB': 'Facturation  ...',
                        'codePaiement': 'Utiliser via le site de votre institution financière...'
                     },
                     'dateConsentement': '20150213'
                  },
                  'sommaireFinance': {
                     'solde_global': '148203',
                     'liste_releves_impots': [{
                        'annee': '2014',
                        'idDoc': '32325'
                     }],
                     'liste_factures_anterieures': [],
                     'liste_trim_hist': [{
                        'trim_num': '20143'
                     }]
                  }
               }
            }
         }
      };


   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
    */

   beforeEach(function() {

      module('pelApp');

      module(function($provide) {
         $provide.value('Auth', mockAuth);
      });

      inject(function(UtilisateurModel, $httpBackend, _$location_) {
         serviceUtilisateur = UtilisateurModel;
         httpBackend = $httpBackend;
         location = _$location_;
      });

      httpBackend.when('GET', '/apis/resume/identifiant').respond(mockbackendData);

   });

   afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
   });



   /////////////////////////////////////////////////////////////////////////////
   /*
    * Effectuer et évaluer les TESTS.
    */

   it('serviceUtilisateur devrait être défini', function() {
      expect(serviceUtilisateur).toBeDefined();
   });


   it('devrait avoir la fonction getUtilisateur', function() {
      expect(serviceUtilisateur.getUtilisateur).toBeDefined();
   });

   it('devrait récupérer le consentement', function() {
      // Attention cet appel fera l'appel à init(), puisque l'utilisateur
      // n'a pas été récupérer encore et que c'est par getUtilisateur
      // que l'objet est initialisé.
      utilisateur = serviceUtilisateur.getUtilisateur();
      httpBackend.flush();
      httpBackend.verifyNoOutstandingExpectation();
      //  Cet appel récupère l'utilisateur.
      utilisateur = serviceUtilisateur.getUtilisateur();
      //console.log('Consentement: ' + utilisateur.consentementFinance);
      expect(utilisateur.consentementFinance).toEqual(true);
   });

   it('ne devrait pas avoir de "ADRESSE INCONNUE" redondante ', function() {
      mockbackendData.data.resume.socio.adresse_l1 = 'ADRESSE INCONNUE';
      mockbackendData.data.resume.socio.adresse_l2 = 'ADRESSE INCONNUE ';
      mockbackendData.data.resume.socio.adresse_l3 = '  ADRESSE INCONNUE  ';
      // Attention cet appel fera l'appel à init(), puisque l'utilisateur
      // n'a pas été récupérer encore et que c'est par getUtilisateur
      // que l'objet est initialisé.
      utilisateur = serviceUtilisateur.getUtilisateur();
      httpBackend.flush();
      httpBackend.verifyNoOutstandingExpectation();
      //  Cet appel récupère l'utilisateur.
      utilisateur = serviceUtilisateur.getUtilisateur();
      //console.log('Consentement: ' + utilisateur.consentementFinance);
      expect(utilisateur.adresse_l1).toEqual('ADRESSE INCONNUE');
      expect(utilisateur.adresse_l2).toEqual('');
      expect(utilisateur.adresse_l3).toEqual('');
      mockbackendData.data.resume.socio.adresse_l1 = '2222 AV Frisé';
      mockbackendData.data.resume.socio.adresse_l2 = 'MONTREAL H3A 2Z7';
      mockbackendData.data.resume.socio.adresse_l3 = '';
   });

   it('ne devrait pas avoir de consentement', function() {
      mockbackendData.data.resume.finance.generale.dateConsentement = 'aucune';
      // Attention cet appel fera l'appel à init(), puisque l'utilisateur
      // n'a pas été récupérer encore et que c'est par getUtilisateur
      // que l'objet est initialisé.
      utilisateur = serviceUtilisateur.getUtilisateur();
      httpBackend.flush();
      httpBackend.verifyNoOutstandingExpectation();
      //  Cet appel récupère l'utilisateur.
      utilisateur = serviceUtilisateur.getUtilisateur();
      //console.log('Consentement: ' + utilisateur.consentementFinance);
      expect(utilisateur.consentementFinance).toEqual(false);
      mockbackendData.data.resume.finance.generale.dateConsentement = '20150213';
   });


   it('ne devrait pas retourner d\'utilisateur car jsend fail', function() {
      mockbackendData.status = 'fail';
      // Attention cet appel fera l'appel à init(), puisque l'utilisateur
      // n'a pas été récupérer encore et que c'est par getUtilisateur
      // que l'objet est initialisé.
      utilisateur = serviceUtilisateur.getUtilisateur();
      httpBackend.flush();
      httpBackend.verifyNoOutstandingExpectation();
      expect(statut).toBeFalsy();
      mockbackendData.status = 'success';
   });

   it('devrait récupérer la liste des relevés d\'impôts', function() {
      // Attention cet appel fera l'appel à init(), puisque l'utilisateur
      // n'a pas été récupérer encore.
      utilisateur = serviceUtilisateur.getUtilisateur();
      httpBackend.flush();
      httpBackend.verifyNoOutstandingExpectation();
      expect(serviceUtilisateur.getReleve().length).toBe(1);
   });

   it('devrait accepter le consentement via setConsentement', function() {
      httpBackend.expectGET(/.*accepter.*/).respond(200, mockAccepterData);
      serviceUtilisateur.setConsentement('null');
      httpBackend.flush();
      httpBackend.verifyNoOutstandingExpectation();
      expect(statut).toBeTruthy();
   });

   it('devrait retourner isConsentementFinance a vrai', function() {
      // Attention cet appel fera l'appel à init(), puisque l'utilisateur
      // n'a pas été récupérer encore et que c'est par getUtilisateur
      // que l'objet est initialisé.
      utilisateur = serviceUtilisateur.getUtilisateur();
      httpBackend.flush();
      httpBackend.verifyNoOutstandingExpectation();
      //  Cet appel récupère l'utilisateur.
      utilisateur = serviceUtilisateur.getUtilisateur();
      expect(serviceUtilisateur.isConsentement()).toBeTruthy();

   });

   it('devrait effacer l\'utilisateur', function() {
      // Attention cet appel fera l'appel à init(), puisque l'utilisateur
      // n'a pas été récupérer encore et que c'est par getUtilisateur
      // que l'objet est initialisé.
      utilisateur = serviceUtilisateur.getUtilisateur();
      httpBackend.flush();
      httpBackend.verifyNoOutstandingExpectation();
      //  Cet appel récupère l'utilisateur.
      utilisateur = serviceUtilisateur.getUtilisateur();
      expect(utilisateur).not.toBe({});
      serviceUtilisateur.effacerUtilisateur();
      // On se sert de getReleve pour vérifier afin de ne pas
      // ré-initialer utilisateur.
      var releves = serviceUtilisateur.getReleve();
      expect(releves).toBeUndefined();
   });

   it('devrait retourner avec une erreur http utilisateur', function() {
      httpBackend.expectGET('/apis/resume/identifiant').respond(500, 'Problème serveur.');
      serviceUtilisateur.getUtilisateur();
      httpBackend.flush();
      httpBackend.verifyNoOutstandingExpectation();
      expect(statut).toBeFalsy();
   });

   it('ne devrait pas retourner de date de consentement suite à setConsentement', function() {
      var mockRefuserData = {
         'status': 'success',
         'data': {}
      };
      httpBackend.expectGET(/.*accepter.*/).respond(200, mockRefuserData);
      serviceUtilisateur.setConsentement('null');
      httpBackend.flush();
      httpBackend.verifyNoOutstandingExpectation();
      expect(statut).toBeFalsy();
   });

   it('devrait retourner avec une erreur http pour setConsentement', function() {
      httpBackend.expectGET(/.*accepter.*/).respond(500, 'Problème serveur.');
      serviceUtilisateur.setConsentement('null');
      httpBackend.flush();
      httpBackend.verifyNoOutstandingExpectation();
      expect(statut).toBeFalsy();
   });

   it('devrait retourner avec un fail jsend pour setConsentement', function() {
      var mockFailData = {
         'status': 'fail',
         'message': 'erreur'
      };
      httpBackend.expectGET(/.*accepter.*/).respond(200, mockFailData);
      serviceUtilisateur.setConsentement('null');
      httpBackend.flush();
      httpBackend.verifyNoOutstandingExpectation();
      expect(statut).toBeFalsy();
   });

});

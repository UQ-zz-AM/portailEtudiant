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
    request = require("request"),
    path = require('path');

var util = require('../config/util');
var configPortailEtudiant = util.obtenirConfig();
var apiInstitutions = require('./api');

var pathConfigPortail = process.env.libreDaPathConfigPortail || '../../../';
var services = require(path.join(pathConfigPortail, 'configPortailEtudiant') + '/catalogServices.json');

var nip = util.encrypte(
    configPortailEtudiant.donneesTests.CodePermTestNip1,
    configPortailEtudiant.motsSecretsMagiques.motMagique);

var req = {
    'params': {
        'programme': configPortailEtudiant.donneesTests.CodePermTestCodeProg1,
        'trimestre': configPortailEtudiant.donneesTests.CodePermTestSession1
    },
    'user': {
        'identifiant': configPortailEtudiant.donneesTests.CodePermTest1,
        'id': nip
    }
};

describe('Test des services institutionnels de l\'UQAM', function () {
    describe("Tester l'API.", function () {

        var bonNip = req.user.id;
        var bonCodepermanent = req.user.identifiant;

        // Certains apis prennent un peu de temps, donc on met 5 secondes d'attente maximum
        this.timeout(5000);
        before(function () {
            process.env.NODE_ENV = 'testUnitaire';
        });

        it('Devrait retourner jsend.success.', function (done) {
            nock('http://unitaire.ca')
                .post('/rif')
                .reply(200, {
                    status: 'success',
                    data: {
                        html: '<html></html>'
                    }
                });
            apiInstitutions.obtenirServicesCommun(
                'rif',
                req,
                function (res) {
                    should(res).ok;
                    should(res.status).equal("success");
                    should(res.data).ok;
                    should(res.data.html).ok;

                    done();
                });
        });

        it("Le nip n'est pas bon. Devrait retourner jsend.fail.", function (done) {
            //Enregistrer la bonne valeur du nip afin de la réinitialiser pour les autres test.
            req.user.id = util.encrypte(
                'abcde',
                configPortailEtudiant.motsSecretsMagiques.motMagique);

            apiInstitutions.obtenirServicesCommun(
                'rif',
                req,
                function (res) {
                    should(res).ok;
                    should(res.status).equal("fail");
                    should(res).ok;
                    should(res.data.message).equal("Nip invalide");
                    done();
                });
        });

        it("Le code permanent n'est pas bon. Devrait retourner jsend.fail.", function (done) {
            //Enregistrer la bonne valeur du nip afin de la réinitialiser pour les autres test.
            req.user.identifiant = util.encrypte(
                'comg123',
                configPortailEtudiant.motsSecretsMagiques.motMagique);

            apiInstitutions.obtenirServicesCommun(
                'rif',
                req,
                function (res) {
                    should(res).ok;
                    should(res.status).equal("fail");
                    should(res).ok;
                    should(res.data.message).equal("Code permanent invalide");
                    done();
                });
        });

        it("Simuler un timeout", function (done) {
            //On permet un time plus grand le timeout de mocha est 5 secondes. On veut tester le timeout de 10 secondes du service.
            this.timeout(30500);
            nock('http://unitaire.ca')
                .post('/rif')
                .delayConnection(30100)
                .reply(200, '<html><body>Pouff timeout!</body></html>');

            apiInstitutions.obtenirServicesCommun(
                'rif',
                req,
                function (res) {
                    should(res).ok;
                    should(res.status).equal("error");
                    should(res.message).equal("Impossible d'accéder à l'URL ou ETIMEDOUT");

                    done();
                });
        });

        it("Une erreur Oracle", function (done) {
            nock('http://unitaire.ca')
                .post('/rif')
                .reply(500);

            apiInstitutions.obtenirServicesCommun(
                'rif',
                req,
                function (res) {
                    should(res).ok;
                    should(res.status).equal("error");
                    should(res.message).containEql("Erreur Oracle:");
                    done();
                });
        });

        it("Simuler un JSON invalide", function (done) {
            nock('http://unitaire.ca')
                .post('/rif')
                .reply(200, '{ "": ;;, "invalide": "JSON"}');

            apiInstitutions.obtenirServicesCommun(
                'rif',
                req,
                function (res) {
                    should(res).ok;
                    should(res.status).equal("error");
                    should(res.message).equal("Erreur fatale dans le service");
                    done();
                });
        });

        it("Simuler un JSON valide, mais avec une erreur fournie", function (done) {
            nock('http://unitaire.ca')
                .post('/rif')
                .reply(200, '{ "err_fatal": true, "message": "err_fatal"}');


            apiInstitutions.obtenirServicesCommun(
                'rif',
                req,
                function (res) {
                    should(res).ok;
                    should(res.status).equal("error");
                    should(res.message).equal("err_fatal");
                    done();
                });
        });

        it("Simuler un JSON valide, mais avec une erreur de type err", function (done) {
            nock('http://unitaire.ca')
                .post('/rif')
                .reply(200, '{ "err": true, "message": "err_fatal"}');


            apiInstitutions.obtenirServicesCommun(
                'rif',
                req,
                function (res) {

                    should(res).ok;
                    should(res.status).equal("fail");
                    should(res.data.message).equal("Erreur du service");
                    should(res.data.reponseService).be.ok;
                    done();
                });
        });

        it("Simuler un JSON valide", function (done) {
            nock('http://unitaire.ca')
                .post('/rif')
                .reply(200, '{ "hello": "world"}');


            apiInstitutions.obtenirServicesCommun(
                'rif',
                req,
                function (res) {

                    should(res).ok;
                    should(res.status).equal("success");
                    should(res.data.hello).be.ok;
                    should(res.data.hello).equal("world");
                    done();
                });
        });

        afterEach(function () {
            //Réinitialiser le timeout
            this.timeout(5000);

            //Réinitialiser le nip et code permanent
            req.user.id = bonNip;
            req.user.identifiant = bonCodepermanent;

            nock.cleanAll();
        });

        after(function () {
            process.env.NODE_ENV = 'development';
        })
    });
});

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

var should = require('should'),
    nock = require("nock");

var util = require('../config/util');
var configPortailEtudiant = util.obtenirConfig();
var auth = require('./auth');

var nip = util.encrypte(
    configPortailEtudiant.donneesTests.CodePermTestNip1,
    configPortailEtudiant.motsSecretsMagiques.motMagique);

describe("Test l'authentification institutionnels de l'UQAM", function () {
    this.timeout(30500);
    before(function () {
        process.env.NODE_ENV = 'testUnitaire';
    });

    it('Code permanent invalide', function (done) {
        auth.authentification('com123', 12345, function(res){

            should(res).be.ok;
            should(res.status).be.equal('fail');
            should(res.data.message).be.ok;
            should(res.data.message).be.equal('Code permanent invalide');

            done();
        });

    });

    it('Nip invalide', function (done) {
        auth.authentification('comg11111111', 123, function(res){

            should(res).be.ok;
            should(res.status).be.equal('fail');
            should(res.data.message).be.ok;
            should(res.data.message).be.equal('Nip invalide');

            done();
        });

    });

    it('Erreur Oracle', function (done) {
        nock('http://unitaire.ca')
            .post('/authentification')
            .reply(500, '{ "oracle": "pouff!"}');


        auth.authentification('comg11111111', 12345,function (res) {
                should(res).ok;
                should(res.status).equal("error");
                should(res.message).be.ok;
                should(res.message).containEql("Erreur Oracle:");
                done();
            });

    });

    it('JSON invalide.', function (done) {
        nock('http://unitaire.ca')
            .post('/authentification')
            .reply(200, '{ "" "json": "invalide"}');


        auth.authentification('comg11111111', 12345,function (res) {
            should(res).ok;
            should(res.status).equal("error");
            should(res.message).be.ok;
            should(res.message).containEql("Erreur d'authentification:");
            done();
        });
    });

    it('Erreur fatale.', function (done) {
        nock('http://unitaire.ca')
            .post('/authentification')
            .reply(200, '{ "err_fatal": "err_fatal"}');


        auth.authentification('comg11111111', 12345,function (res) {
            should(res).ok;
            should(res.status).equal("error");
            should(res.message).be.ok;
            should(res.message).equal("Erreur fatale dans le service");
            done();
        });
    });

    it('Service Err.', function (done) {
        nock('http://unitaire.ca')
            .post('/authentification')
            .reply(200, '{ "err": "il y a eu une erreur de nip"}');


        auth.authentification('comg11111111', 12345,function (res) {
            should(res).ok;
            should(res.status).equal("fail");
            should(res.data.message).be.ok;
            should(res.data.message).equal("Erreur d'authentification");

            done();
        });
    });

    it('Authentification valide.', function (done) {
        nock('http://unitaire.ca')
            .post('/authentification')
            .reply(200, '{ "je": "suis connecte"}');


        auth.authentification('comg11111111', 12345,function (res) {
            should(res).ok;
            should(res.status).equal("success");
            should(res.data.je).be.ok;
            should(res.data.je).equal("suis connecte");

            done();
        });
    });

    it('Simuler un timeout.', function (done) {
        nock('http://unitaire.ca')
            .post('/authentification')
            .delayConnection(30100)
            .reply(200, '{ "je": "suis connecté"}');


        auth.authentification('comg11111111', 12345,function (res) {
            should(res).ok;
            should(res.status).equal("error");
            should(res.message).be.ok;
            should(res.message).equal("Impossible d'accéder à l'URL ou ETIMEDOUT");

            done();
        });
    });

    afterEach(function () {
        nock.cleanAll();
    });

    after(function () {
        process.env.NODE_ENV = 'development';
    })

});

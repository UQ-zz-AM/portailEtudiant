
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

var fs = require('fs');
var path = require('path');
var os = require('os');
var ical2json = require("ical2json");
var iconv = require('iconv').Iconv('iso-8859-1', 'utf-8');

var configPortailEtudiant = null;

var encryption = function(text, motsMagiques) {

    var crypted = 'TODO : veuillez utiliser la méthode d''encryption que vous préférez';

    return crypted;
};

var decryption = function(text, motsMagiques) {
    var dec = 'TODO : veuillez utiliser la méthode d''encryption que vous préférez';
    return dec;
};

module.exports = {

    encrypte: function(text, motsMagiques) {
        return encryption(text, motsMagiques);
    },

    decrypte: function(text, motsMagiques) {
        return decryption(text, motsMagiques);
    },

    // Obtention de la configuration du portail étudiant
    // (voir configDefault.json pour la structure de cette configuration)
    obtenirConfig: function() {
        if (configPortailEtudiant) {
            return configPortailEtudiant;
        }

        var pathConfigPortail = process.env.libreDaPathConfigPortail || '../../../';
        configPortailEtudiant = require(path.join(pathConfigPortail, 'configPortailEtudiant') + '/config.json').portailEtudiant;

        // Extraire les données système à chaque startup et les journaliser
        configPortailEtudiant.infoSysteme = {
            "Système PortailÉtudiant": {
                "port": process.env.PORT,
                "env": process.env.NODE_ENV,
                "hostname": os.hostname(),
                "type": os.type(),
                "platform": os.platform(),
                "arch": os.arch(),
                "release": os.release(),
                "loadavg": os.loadavg(),
                "uptime": os.uptime(),
                "totalmem": os.totalmem(),
                "freemem": os.freemem(),
                "cpus": os.cpus(),
                "networkInterfaces": os.networkInterfaces()
            }
        }

        // Chaque journalisation va enregistrer ceci
        configPortailEtudiant.nomServeur = configPortailEtudiant.nomServeur + ' (' + os.hostname() + ')';

        // Root path of server
        configPortailEtudiant.root = path.normalize(__dirname + '/../..');

        return configPortailEtudiant;
    },

    convertIcal2json: function(icalData) {
        return ical2json.convert(icalData);
    },

    convertBodyEncoding: function(body) {
        return iconv.convert(body).toString('utf-8');
    }

};

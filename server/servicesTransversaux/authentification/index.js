
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

var express = require('express');
var router = express.Router();

var jsend = require('jsend');
var jwt = require('jsonwebtoken');

var util = require('../../config/util');
var configPortailEtudiant = util.obtenirConfig();

var authInstitution = require('../../apis/auth');

router.post('/', function(req, res, next) {

   // Validation sommaire des paramètres (C'est la job de l'api d'authentification)
   if ((!req.body) || (!req.body.identifiant) || (!req.body.motDePasse)) {
      //  res.send(401, 'Wrong user or password');
      return res.json(jsend.error({
         message: " Authentification invalide "
      }));
   }

   // appel de l'api d'authentification spécifique à l'institution
   authInstitution.authentification(
      req.body.identifiant,
      req.body.motDePasse,
      function(reponse) {
         if (!reponse) {
            return res.json(jsend.error({
               message: " Authentification invalide "
            }));
         }

         // console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++');
         // console.log(JSON.stringify(reponse, null, 3));
         // console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++');

         if (reponse.status === 'success') {

            // On construit le token jwt
            var token = jwt.sign({
                  identifiant: req.body.identifiant,
                  id: util.encrypte(req.body.motDePasse, configPortailEtudiant.motsSecretsMagiques.motMagique)
               },
               configPortailEtudiant.motsSecretsMagiques.motMagiqueToken, {
                  expiresInMinutes: 60 * 5
               }
            );

            // On limite au nom, prénom
            // car les cookies ont 4096 au max
            var utilisateur = { socio:{} };
            utilisateur.socio.code_perm = reponse.data.code_perm;
            utilisateur.socio.nom = reponse.data.nom;
            utilisateur.socio.prenom = reponse.data.prenom;


            // On conserve la notion de rôle
            // même s'il n'y a que 'etudiant' pour le moment
            utilisateur.role = 'etudiant';

            // On retourne d'un seul coup le token (pour jwt) et
            // l'utilisateur pour les données sociologique
            return res.json({
               token: token,
               utilisateur: utilisateur
            });
         }
         return res.json(reponse);
      });

});


module.exports = router;

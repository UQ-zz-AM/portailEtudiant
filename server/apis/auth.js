
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
var jsend = require('jsend'),
   request = require('request'),
   path = require('path');

var pathConfigPortail = process.env.libreDaPathConfigPortail || '../../../';
var configAUTH = require(path.join(pathConfigPortail, 'configPortailEtudiant') + '/configAuth.json'),
   util = require('../config/util'),
   journalLogger = require('../servicesTransversaux/journalisation/journalLogger');

/**
 * Authentification
 */
exports.authentification = function(codePermanent, nip, callback) {

   if (codePermanent) {
      codePermanent = codePermanent.toUpperCase();
   }

   // Valider codePermanent
   var patternCodePermanent =
      new RegExp("^[A-Z]{4}(0[1-9]|[12][0-9]|3[01]|6[3-9]|[78][0-9]|9[0-3]|99)([0,5][1-9]|[1,6][012]|13|63)[0-9]{4}$");
   if (!patternCodePermanent.test(codePermanent)) {

      journalLogger.journalisationAvertissement(" Authentification: Code permanent invalide: " + codePermanent, null);

      return callback(jsend.fail({
         message: "Code permanent invalide"
      }));
   }


   // Valider nip (5 chiffres)
   var patternNip =
      new RegExp("^[0-9]{5}$");
   if (!patternNip.test(nip)) {
      journalLogger.journalisationAvertissement(" Authentification: pattern nip invalide: " + codePermanent + ":" + nip, null);
      return callback(jsend.fail({
         message: "Nip invalide"
      }));
   }

   // Appel du service d'authentification
   var url = configAUTH.authentification.URL[process.env.NODE_ENV],

      postParams = 'Pc_code_perm=' + codePermanent + '&Pc_nip=' + nip;

   // Permet les certificat autosignés.
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
   request({
         method: 'POST',
         url: url,
         encoding: null,
         body: postParams,
         timeout: 30000
      },
      function(err, response, body) {

         if (err) {

            journalLogger.journalisationErreur(" Authentification: Impossible d'accéder à l'URL ou ETIMEDOUT: " + err, null);
            return callback(jsend.error("Impossible d'accéder à l'URL ou ETIMEDOUT"));

         } else {

            // Il y a un retour
            // Vérifions si en erreur.
            if (response.statusCode !== 200) {
               // Le body va contenir le message d'erreur Oracle.
               var messErreur = body.toString();
               journalLogger.journalisationErreur(" Authentification: retour en erreur (!200): " + messErreur, null);

               return callback(jsend.error("Erreur Oracle:" + messErreur));

            } else {
               // On gagnerait un peu si nous n'avions pas à convertir.
               var resService = null;

               try {
                  var bodyAvecEncoding = util.convertBodyEncoding(body);
                  resService = JSON.parse(bodyAvecEncoding);
               } catch (e) {
                  journalLogger.journalisationErreur(" Authentification: retour en erreur (Json erronée): " + e, null);
                  return callback(jsend.error("Erreur d'authentification:" + e));
               }

               // Vérifier le retour au niveau du service.
               // err_fatal = erreur fatale on ne peut pas continuer.
               if (resService.err_fatal) {
                  // Ici on génère une erreur à partir de celle du service.
                  journalLogger.journalisationErreur(" Authentification: retour en erreur : " + resService, null);
                  return callback(
                     jsend.error(
                        resService.message ? resService.message : "Erreur fatale dans le service"));
               }
               // err = probablement un mauvais credential. Ce n'est pas
               // une erreur dans nos API alors on place l'objet err
               // dans l'objet req.
               if (resService.err) {
                  //req.err = resService;
                  journalLogger.journalisationAvertissement('mauvais credential:' + resService.err, null);
                  return callback(jsend.fail({
                     message: "Erreur d'authentification",
                     reponseService: resService
                  }));
               } else {
                  // RETOUR au client
                  return callback(jsend.success(resService));
               }
            }
         }
      }
   );
};


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
   moment = require('moment'),
   request = require('request'),
   path = require('path');

var pathConfigPortail = process.env.libreDaPathConfigPortail || '../../../';
var services = require(path.join(pathConfigPortail, 'configPortailEtudiant') + '/catalogServices.json');

var util = require('../config/util');
var configPortailEtudiant = util.obtenirConfig();



/**
 * APIs de l'UQAM
 *
 *  Liste des paramètres:
 *    service : le nom du service demandé (selon le fichier catalogServices.json)
 *    req : la requete en cours
 *    callback: fonction de retour, on lui fournit toujours un objet JSEND
 *
 */

exports.obtenirServicesCommun = function(service, req, callback) {


   // le request peut contenir d'autres paramètres
   var parametres = req.params;

   // codePermanent : plus nécessaire pour tous les services.
   var codePermanent = req.user.identifiant;
   if (codePermanent) {
      codePermanent = codePermanent.toUpperCase();
   }

   // nip : PLUS nécessaire pour tous les services
   var nip = null;
   if (req.user.id) {
      nip = util.decrypte(req.user.id, configPortailEtudiant.motsSecretsMagiques.motMagique);
   }


   // Valider codePermanent s'il est present
   var patternCodePermanent =
      new RegExp("^[A-Z]{4}(0[1-9]|[12][0-9]|3[01]|6[3-9]|[78][0-9]|9[0-3]|99)([0,5][1-9]|[1,6][012]|13|63)[0-9]{4}$");

   if (codePermanent) {
      if (!patternCodePermanent.test(codePermanent))
         return callback(jsend.fail({message: "Code permanent invalide"}));
   }


   // Valider nip (5 chiffres)
   var patternNip =
      new RegExp("^[0-9]{5}$");
   if (nip) {
      if (!patternNip.test(nip))
         return callback(jsend.fail({message: "Nip invalide"}));
   }

   var url = services[service].URL[process.env.NODE_ENV],
      params = services[service].params,
      credentials = services[service].credentialKeys,
      receiveContentType = services[service].contentType,
      postParams,
      auth = services[service].httpAuthorisation;

   if (auth) {
      auth.password = configPortailEtudiant.motsSecretsMagiques.motSecretServices;
      auth.sendImmediately = true;
   }


   // Évite la vérification du certificat si nécessaire.
   // process.env.NODE_TLS_REJECT_UNAUTHORIZED = services[service].verificationCert[process.env.NODE_ENV];
   //
   // Attention, on force à zéro pour le moment
   //    Nous connaissons les services que nous appelons, une vérification du certificat est inutile.
   //    Si nous devons, éventuellement, effectuer une telle vérification, il ne faut pas
   //    faire d'appel parallèle (async) car process.env.* est une variable globale
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

   // Comme tous les services requiert un CP/NIP, mais que les services n'utilisent pas tous
   // les mêmes noms de param ces derniers sont dans le catalogue de services.

   if (credentials){
      postParams = credentials.user + '=' + codePermanent + '&' + credentials.pass + '=' + nip;
   }


   //Extraire les paramètres si nécessaire.
   var prop;
   if (parametres && params) {
      for (prop in parametres) {
         if (parametres.hasOwnProperty(prop)) {
            if (params[prop] !== undefined && parametres[prop] !== undefined) {

               // S'il n'y a pas d'autres params avant.
               if (postParams){
                  postParams += '&' + params[prop] + '=' + parametres[prop];
               }else{
                  postParams =  params[prop] + '=' + parametres[prop];
               }

            }
         }
      }
   }

   if (services[service].paramsSupplementaire) {
      for (prop in services[service].paramsSupplementaire) {
         if (services[service].paramsSupplementaire.hasOwnProperty(prop)) {

            postParams += '&' + prop + '=' + services[service].paramsSupplementaire[prop];

         }
      }
   }

   // Atention, pour l'inscription multiple, on a déjà valider les cours-groupe et construit la chaine de paramètres
   if (service==='traiterInscriptionMultiple') {
      if (!postParams) {postParams='';}
      postParams += req.chaineRequeteInscriptionMultiple;
   }
   // Atention, pour l'évaluation de l'enseignement, on a déjà construit la chaine de paramètres
   if (service==='enregistrerEvaluation') {
      if (!postParams) {postParams='';}
      postParams += req.reponseQuestionnaire;
   }




   request({
      method: 'POST',
      url: url,
      encoding: null,
      'Content-type': 'application/json',
      body: postParams,
      timeout: 30000,
      'auth': auth
   }, function(err, response, body) {
      if (err) {

         return callback(jsend.error("Impossible d'accéder à l'URL ou ETIMEDOUT"));

      } else {
         if (response.statusCode !== 200) {
            // Exemple : Le body va contenir le message d'erreur Oracle.
            var messErreur = body.toString();
            return callback(jsend.error("Erreur Oracle:" + messErreur));

         } else {
            // On gagnerait un peu si nous n'avions pas à convertir.
            var bodyAvecEncoding = util.convertBodyEncoding(body);
            var reponseService;

            if (receiveContentType === 'json') {

               try {
                  // JSON.parse lance une SyntaxError s'il y a une problème
                  reponseService = JSON.parse(bodyAvecEncoding);
               } catch (e) {
                  return callback(jsend.error("Erreur fatale dans le service"));
               }

               // Intercepter les erreurs
               if (reponseService.hasOwnProperty('err_fatal')) {

                  return callback(
                     jsend.error(
                        reponseService.message ? reponseService.message : "Erreur fatale dans le service"));

               } else if (reponseService.hasOwnProperty('err')) {
                  return callback(jsend.fail({
                     message: "Erreur du service",
                     reponseService: reponseService
                  }));
               } else {
                  // RETOUR au client
                  var retourSucces = jsend.success(reponseService);
                  // On ajoute l'heure du serveur, l'heure de Montreal
                  // pour, dans certain cas, éviter les problèmes de fuseau horaire
                  // ou de client ayant une mauvaise date du jour

                  retourSucces.data.heureMontreal = moment().format('YYYYMMDD HH:mm:ss');
                  return callback(retourSucces);
               }
            }

            if (receiveContentType === 'html') {
               return callback(jsend.success({
                  html: bodyAvecEncoding
               }));
            }

            if (receiveContentType === 'ical') {
               // Attention, nous recevons déjà un tableau de caractère UTF8
               // On le change en String
               return callback(jsend.success({'ical' : body.toString()}));
            }

            if (receiveContentType === 'pdf') {

               // On vérifie le mime type
               if (response.headers['content-type'] === 'application/pdf') {
                  return callback(jsend.success(body));
               } else {
                  return callback(jsend.fail(' Le fichier pdf est inaccessible pour le moment'));
               }
            }

         }
      }
   });
};

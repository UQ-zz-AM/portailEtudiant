
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


// Définition des routes qui sont accessibles seulement si l'étudiant est authentifié
var moment = require('moment');

var fs = require('fs');

var jsend = require('jsend');
var async = require('async');
var express = require('express');
var router = express.Router();


var config = require('../config/util').obtenirConfig();
var apiInstitutions = require('./api');
var journalLogger = require('../servicesTransversaux/journalisation/journalLogger');
var serviceAutoCompletion = require('../servicesTransversaux/autocompletionSigleCours/serviceAutoCompletion');
var convertirResultats = require('./convertirResultats');



// REGEX du sigle de cours
var regexSigleCoursValide = /^[a-z0-9\.]+$/i;
// REGEX du groupe
var regexSigleGroupeValide = /^[0-9]+$/i;
// Regex du trimestre
var regexTrimestre = new RegExp("^[0-9]{5}$");


// Fonction appelé lorsque le code permanent de la réponse du service ne correspond
// pas au code permanent de l'appel
var erreurIncoherenceService = function(req, res, service) {
   var message = ' Retour du service ' + service + ' incohérent ';
   console.log(' Erreur : ' + message);
   journalLogger.journalisationErreur(message, req);
   return res.json(jsend.error(message));
};


// Définition des routes générique
var definirRoute = function(laRoute, autreParams) {
   var routeAPI = '/' + laRoute + '/:identifiant';
   if (autreParams) {
      routeAPI = routeAPI + autreParams;
   }

   router.get(routeAPI, function(req, res) {
      apiInstitutions.obtenirServicesCommun(
         laRoute,
         req,
         function(reponse) {
            res.json(reponse);
         });
   });
};



// définir les routes protégés ici ( /apis/* )
definirRoute('periodesIns', '/:PC_IND_TOUS');
definirRoute('opus', '/:trimestre/:annee');
definirRoute('listeCoursEvaluable');
definirRoute('obtenirQuestionnaire', '/:Pn_id_enseignement');



// Route spécifique pour programmeIns, car on veut vérifier le retour
router.get('/programmeIns/:identifiant', function(req, res) {
   apiInstitutions.obtenirServicesCommun(
      'programmeIns',
      req,
      function(reponse) {
         if (reponse.status === 'success' && reponse.data.code_perm !== req.user.identifiant.toUpperCase()) {
            return erreurIncoherenceService(req, res, 'programmeIns');
         }
         res.json(reponse);
      });
});



// Route spécifique pour resumeRésultat, car on veut restructurer le JSON
router.get('/resumeResultat/:identifiant', function(req, res) {

   apiInstitutions.obtenirServicesCommun(
      'resumeResultat',
      req,
      function(reponse) {
         if (reponse.data) reponse.data = convertirResultats(reponse.data);
         res.json(reponse);
      });

});



// Route spécifique pour resultatActivite, car on veut restructurer le JSON
router.get('/resultatActivite/:identifiant/:Pc_trimestre/:Pc_sigle/:Pc_groupe', function(req, res) {

   apiInstitutions.obtenirServicesCommun(
      'resultatActivite',
      req,
      function(reponse) {
         if (reponse.data) reponse.data = convertirResultats(reponse.data);
         res.json(reponse);
      });

});



// CONSENTEMENT
// Route spécifique pour le refus de consentement
router.get('/refuser', function(req, res) {

   var codePermanent = req.user.identifiant;
   journalLogger.voir({
      "voirRefuserConsentement": {
         "codePermanent": codePermanent,
         "laDate": journalLogger.dateDuJour()
      }
   });
   res.json(jsend.success({
      "refuser": "consentement"
   }));

});



// Accepter le consentement.
router.get('/resume/:identifiant/accepter/:dateConsentement', function(req, res) {

   apiInstitutions.obtenirServicesCommun(
      'majConsentement',
      req,
      function(reponse) {
         //
         //  On ne prends pas ":dateConsentement", on prends
         //  plutôt l'heure du serveur, l'heure de Montreal
         var codePermanent = req.user.identifiant;
         journalLogger.voir({
            "voirAccepterConsentement": {
               "codePermanent": codePermanent,
               "laDate": journalLogger.dateDuJour()
            }
         });
         res.json(reponse);
      });

});



// RIF
// Route spécifique pour le rif
router.get('/rif/:identifiant', function(req, res) {

   //console.log('::::::::::::' + req.params.identifiant);
   apiInstitutions.obtenirServicesCommun(
      'rif',
      req,
      function(reponse) {

         if (reponse.status === 'success') {

            if (reponse.data.generale.code_permanent !== req.user.identifiant.toUpperCase()) {
               return erreurIncoherenceService(req, res, 'rif');
            }

            journalLogger.voir({
               "voirRif": {
                  "codePermanent": req.user.identifiant,
                  "laDate": journalLogger.dateDuJour()
               }
            });
         }

         res.json(reponse);
      });

});



// Route spécifique pour le rif des factures historiques
router.get('/rif/:identifiant/:p_session/:p_dateProduction', function(req, res) {

   apiInstitutions.obtenirServicesCommun(
      'factHisto',
      req,
      function(reponse) {

         if (reponse.status === 'success') {
            var codePermanent = req.user.identifiant;
            journalLogger.voir({
               "voirRifHistorique": {
                  "codePermanent": codePermanent,
                  "laDate": journalLogger.dateDuJour(),
                  "trimestre": req.params.p_session,
                  "dateProduction": req.params.p_dateProduction
               }
            });
         }

         res.json(reponse);
      });

});



router.get('/impots/:annee', function(req, res) {

   apiInstitutions.obtenirServicesCommun(
      'impots',
      req,
      function(reponse) {
         if (reponse.status === 'success') {

            // On va chercher le code permanent et l'année
            var codePermanent = req.user.identifiant;
            var lanneeImpots = req.params.annee;
            journalLogger.voir({
               "voirImpot": {
                  "codePermanent": codePermanent,
                  "annee": lanneeImpots,
                  "laDate": journalLogger.dateDuJour()
               }
            });

            res.type('application/pdf');
            res.end(reponse.data, 'binary');
            //res.download(reponse.data);
         } else {
            // C'est un fail ou une erreur : la 'reponse' est en jsend
            res.json(reponse);
         }

      });

});




// Utilitaire : obtenir un service avec retour en async
var obtServiceAsync = function(leService, req, callbackAsync) {

   apiInstitutions.obtenirServicesCommun(
      leService,
      req,
      function(reponse) {
         // valider reponse jsend
         if (reponse.status !== 'success') {
            callbackAsync(reponse);
         } else {
            callbackAsync(null, reponse.data);
         }
      });
};



//
// Orchestration du relevé de notes. On combine releve et creation des tags.
//     + resultat, selon le cas
//          ...
//  si err ou jsend fail faire comme à l'habitude.
//
//

router.get('/releve/:identifiant/:codeprogr/:resultat', function(req, res, next) {

   // On concatene toutes les réponses avec async.parallel
   async.parallel({
         releveNote: function(callback) {
            obtServiceAsync('releveNote', req, callback);
         },
         resumeResultat: function(callback) {
            if (req.params.resultat === 'N') {
               callback(null, null);
            } else {
               obtServiceAsync('resumeResultat', req, callback);
            }
         }
      },
      function(err, results) {

         if (err) return res.json(err);

         var html = results.releveNote.html;
         // Vérifier les erreurs du CGI.
         if ((html.indexOf('ERR-') !== -1) &&
            (html.indexOf('-ERR') !== -1)
         ) {
            var regexResultat = html.match(/ERR-(.*?)-ERR/m);
            var message = 'Erreur dans le CGI relev3Portail.pl. ' + regexResultat[1];
            journalLogger.journalisationAvertissement(message, req);
            res.json(jsend.error(message));
         } else {
            // On place le résultat dans
            // un object temporaire pour le passer
            // dans un convertisseur JSON.
            res.tempo = {
               releveHTML: html
            };

            // On convertit 'resultat' s'il y a lieu
            res.tempo.resultats = null;
            if (results.resumeResultat) {
               res.tempo.resultats = convertirResultats(results.resumeResultat);
            }

            next();
         }
      });
});



// On termine avec la conversion du relevé en JSON
router.get('/releve/:identifiant/:codeprogr/:resultat', function(req, res) {

   // Passer le relevé au script de conversion
   req.params.Pc_tag_releve = encodeURIComponent(res.tempo.releveHTML);

   apiInstitutions.obtenirServicesCommun(
      'releve2json',
      req,
      function(reponse) {

         // valider reponse jsend avant de passer au suivant.
         if (reponse.status !== 'success') {
            res.json(reponse);
         } else {

            if (reponse.data.code_perm !== req.user.identifiant.toUpperCase()) {
               return erreurIncoherenceService(req, res, 'releve2json');
            }

            // On ajoute 'resultat', s'il y a lieu
            reponse.data.resultats = res.tempo.resultats;

            res.json(reponse);
         }
      });
});



////////////////////////////////////////////////////////////////////////////////
// Orchestration de l'horaire. On combine horaire et calendrier et
// les périodes d'accès.
//
//  si err ou jsend fail faire comme à l'habitude.
//
//
router.get('/horaire/:identifiant', function(req, res) {

   // On concatene toutes les réponses avec async.parallel
   async.parallel({
         horaire: function(callback) {
            obtServiceAsync('horaire', req, callback);
         },
         calendrier: function(callback) {
            obtServiceAsync('calendrier', req, callback);
         },
         periodesIns: function(callback) {
            req.params.PC_IND_TOUS = 'O';
            obtServiceAsync('periodesIns', req, callback);
         }
      },
      function(err, results) {

         if (err) return res.json(err);

         // Vérifier si le retour correspond au bon code permanent
         if (results.horaire.code_perm !== req.user.identifiant.toUpperCase()) {
            return erreurIncoherenceService(req, res, 'horaire');
         }

         // On place le calendrier au même niveau que les trimestres de l'horaire
         results.horaire.calendrier = results.calendrier.calendrier;

         // On place les périodes d'inscription au même niveau que l'horaire
         results.horaire.periodesIns = results.periodesIns;
         res.json(jsend.success(results.horaire));
      });

});



////////////////////////////////////////////////////////////////////////////////
//
//   resume
//
// Information nécessaire à la construction du menu
// Orchestration de resume. On combine socio, consentement, rifSommaire et listeTrimestresCourants dans resume.
//
// Obtenir le résumé
router.get('/resume/:identifiant', function(req, res) {

   // On concatene toutes les réponses avec async.parallel
   async.parallel({
         socio: function(callback) {
            obtServiceAsync('socio', req, callback);
         },
         consentement: function(callback) {
            obtServiceAsync('obtConsentement', req, callback);
         },
         finance: function(callback) {
            obtServiceAsync('rifSommaire', req, callback);
         },
         trimestresCourants: function(callback) {
            obtServiceAsync('listeTrimestresCourants', req, callback);
         }
      },
      function(err, results) {

         if (err) return res.json(err);

         // Vérifier si le retour correspond au bon code permanent
         if (results.socio.code_perm !== req.user.identifiant.toUpperCase()) {
            return erreurIncoherenceService(req, res, 'socio');
         }

         if (results.finance.generale.code_permanent !== req.user.identifiant.toUpperCase()) {
            return erreurIncoherenceService(req, res, 'rifSommaire');
         }

         //   Le consentement est actuellement concaténé dans la structure finance
         //   TODO déplacer le consentement globalement ?
         results.finance.generale.dateConsentement = results.consentement.dateConsentement;
         delete results.consentement;

         // On enlève un étage inutile
         results.trimestresCourants = results.trimestresCourants.trimestre;
         res.json(jsend.success({
            'resume': results
         }));
      });

});



// ICS
// Route spécifique pour retourner le calendrier via un fichier ICS
router.get('/calendrierICS/:identifiant', function(req, res) {

   //console.log('::::::::::::' + req.params.identifiant);
   apiInstitutions.obtenirServicesCommun(
      'calendrierICS',
      req,
      function(reponse) {
         res.json(reponse);
      });

});



////////////////////////////////////////////////////////////////////////////////
//
//   Inscription
//
//
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// ValiderInscription
// Validation de l'inscription.
//  validerInscription (avecPeriode === 'O'  alors on retourne aussi periodeINS)
router.get('/validationIns/:identifiant/:programme/:trimestre/:avecPeriode', function(req, res, next) {

   // On concatene toutes les réponses avec async.parallel
   async.parallel({
         validerInscription: function(callback) {
            obtServiceAsync('validerInscription', req, callback);
         },
         periodesIns: function(callback) {
            if (req.params.avecPeriode === 'N') {
               callback(null, null);
            } else {
               obtServiceAsync('periodesIns', req, callback); // ?? definirRoute('periodesIns', '/:PC_IND_TOUS');
            }
         }
      },
      function(err, results) {

         if (err) {
            journalLogger.journalisationAvertissement(' Erreur appel validerInscription:' + err, req);
            return res.json(err);
         }
         res.json(jsend.success(results));

      });
});



////////////////////////////////////////////////////////////////////////////////
// Liste des groupes
// Route spécifique pour obtenir la liste des groupes pour un sigle.
//
router.get('/listeCoursGroupe/:identifiant/:programme/:trimestre/:sigle', function(req, res) {

   // Validation regex avant l'appel du service
   if (!regexSigleCoursValide.test(req.params.sigle)) {
      return res.json(jsend.fail({
         message: "Le sigle est invalide(regex)."
      }));
   }

   if (!regexTrimestre.test(req.params.trimestre))
      return res.json(jsend.fail({
         message: "Trimestre invalide"
      }));


   apiInstitutions.obtenirServicesCommun(
      'listeCoursGroupe',
      req,
      function(reponse) {
         res.json(reponse);
      });
});



////////////////////////////////////////////////////////////////////////////////
// Traite Inscription.
//
//  Simple
router.get('/traiteIns/:identifiant/:programme/:trimestre/:codeTrans/' +
   ':sigle/:groupe/:sigleAncien/:groupeAncien',
   function(req, res) {


      if (!regexSigleCoursValide.test(req.params.sigle)) {
         return res.json(jsend.fail({
            message: "Latransaction est invalide (sigle)."
         }));
      }

      if (!regexSigleGroupeValide.test(req.params.groupe)) {
         return res.json(jsend.fail({
            message: "La transaction est invalide (groupe)."
         }));
      }

      if (req.params.sigleAncien && req.params.sigleAncien !== ' ' && !regexSigleCoursValide.test(req.params.sigleAncien)) {
         return res.json(jsend.fail({
            message: "Latransaction est invalide (sigleAncien)."
         }));
      }

      if (req.params.groupeAncien && req.params.groupeAncien !== ' ' && !regexSigleGroupeValide.test(req.params.groupeAncien)) {
         return res.json(jsend.fail({
            message: "La transaction est invalide (groupeAncien)."
         }));
      }


      // Cette date et heure permet de faire le lien entre la requête et la réponse
      var dateEtHeure = journalLogger.dateDuJour();

      journalLogger.voir({
         "voirTraiterInscription": {
            "codePermanent": req.user.identifiant,
            "dateEtHeure": dateEtHeure,
            "parametres": {
               'programme': req.params.programme,
               'trimestre': req.params.trimestre,
               'codeTrans': req.params.codeTrans,
               'sigle': req.params.sigle,
               'groupe': req.params.groupe,
               'sigleAncien': req.params.sigleAncien,
               'groupeAncien': req.params.groupeAncien
            }
         }
      });


      apiInstitutions.obtenirServicesCommun(
         'traiterInscription',
         req,
         function(reponse) {

            journalLogger.voir({
               "voirTraiterInscriptionReponse": {
                  "codePermanent": req.user.identifiant,
                  "dateEtHeure": dateEtHeure,
                  "reponse": reponse
               }
            });

            res.json(reponse);
         });
   });



//  Multiple
router.get('/traiteInsLot/:identifiant/:programme/:trimestre/:codeTrans/:lot',
   function(req, res) {

      // Cette date et heure permet de faire le lien entre la requête et la réponse
      var dateEtHeure = journalLogger.dateDuJour();

      journalLogger.voir({
         "voirTraiterInscriptionMultiple": {
            "codePermanent": req.user.identifiant,
            "dateEtHeure": dateEtHeure,
            "parametres": {
               'programme': req.params.programme,
               'trimestre': req.params.trimestre,
               'codeTrans': req.params.codeTrans,
               'lot': req.params.lot
            }
         }
      });


      // On vérifie la validité des paramètres avant de procéder
      // On construit en même temps la chaine de la requête
      // Que l'on construit à partir de la chaine "MAT0341_30|MAT0343_40"
      var lot = req.params.lot;
      if (!lot) {
         return res.json(jsend.fail({
            message: "Le lot de transaction est invalide."
         }));
      }

      // On splitte avec la barre verticale
      var tableauCoursSigle = lot.split('|');
      if (!tableauCoursSigle || tableauCoursSigle.length === 0 || tableauCoursSigle.length > 5) {
         return res.json(jsend.fail({
            message: "Le lot de transaction est invalide."
         }));
      }

      req.chaineRequeteInscriptionMultiple = ''; // On va utiliser cette variable dans obtenirServicesCommun
      for (var i = 0; i < tableauCoursSigle.length; i++) {
         if (!tableauCoursSigle[i]) {
            return res.json(jsend.fail({
               message: "Le lot de transaction est invalide."
            }));
         }

         // On splitte avec le soulignement
         var unSigleGroupe = tableauCoursSigle[i].split('_');
         if (!unSigleGroupe || unSigleGroupe.length !== 2) {
            return res.json(jsend.fail({
               message: "Le lot de transaction est invalide."
            }));
         }


         var sigle = unSigleGroupe[0];
         if (!regexSigleCoursValide.test(sigle)) {
            return res.json(jsend.fail({
               message: "Le lot de transaction est invalide (sigle)."
            }));
         }


         var groupe = unSigleGroupe[1];
         if (!regexSigleGroupeValide.test(groupe)) {
            return res.json(jsend.fail({
               message: "Le lot de transaction est invalide (groupe)."
            }));
         }

         // On ajoute cours par cours
         req.chaineRequeteInscriptionMultiple =
            req.chaineRequeteInscriptionMultiple +
            '&PA_CODE_TRANS=ajouter' +
            '&PA_SIGLE=' + sigle +
            '&PA_GROUPE=' + groupe +
            '&PA_SIGLE_ANC=&PA_GROUPE_ANC=';

      }


      apiInstitutions.obtenirServicesCommun(
         'traiterInscriptionMultiple',
         req,
         function(reponse) {

            journalLogger.voir({
               "voirTraiterInscriptionMultipleReponse": {
                  "codePermanent": req.user.identifiant,
                  "dateEtHeure": dateEtHeure,
                  "reponse": reponse
               }
            });

            res.json(reponse);
         });
   });

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



/**
*
  Définition de la route pour l'autoCompletion du sigle de cours
  L'appel peut contenir de 1 à 6 caractère ou chiffres

  Exemple : https:/.../20161/INF22
            https:/.../20161/INF201
            https:/.../20161/INF
            https:/.../20161/IN
            https:/.../20161/I

**/

router.get('/autocompletion/:identifiant/:trimestre/:siglePartiel', function(req, res, next) {

   // On valide quelque peu
   var leTrimestre = req.params.trimestre;
   // Valider trimestre
   if (!leTrimestre) {
      return res.json(jsend.fail({
         message: "Trimestre invalide"
      }));
   }

   if (!regexTrimestre.test(leTrimestre))
      return res.json(jsend.fail({
         message: "Trimestre invalide"
      }));

   // Valider le sigle
   var leSiglePartiel = req.params.siglePartiel;
   // Valider le sigle
   if (!leSiglePartiel) {
      return res.json(jsend.fail({
         message: "Sigle invalide"
      }));
   }

   if (!regexSigleCoursValide.test(leSiglePartiel)) {
      return res.json(jsend.fail({
         message: "Sigle invalide"
      }));
   }

   leSiglePartiel = leSiglePartiel.toUpperCase();

   var retour = {};

   retour.heureMontreal = moment("20150301", "YYYYMMDD").format('YYYYMMDD HH:mm:ss');

   serviceAutoCompletion.obtenirListeSigles(leTrimestre, leSiglePartiel, function(listeSigles) {
      retour.listeSigle = listeSigles;
      return res.json(jsend.success(retour));
   });

});



// Évaluation enseignement : enregistrement des réponses
router.post('/enregistrerEvaluation/', function(req, res) {


   // On valide certains champs obligatoires
   if (typeof req.body === 'undefined' ||
      typeof req.body.Pn_id_enseignement === 'undefined' ||
      isNaN(req.body.Pn_id_enseignement) ||
      typeof req.body.evaluation === 'undefined' ||
      !Array.isArray(req.body.evaluation)) {

      return res.json(jsend.fail({
         message: "Réponse invalide"
      }));

   } else {

      // On boucle dans le tableau pour construire la requête
      req.reponseQuestionnaire = '&Pn_id_enseignement=' + req.body.Pn_id_enseignement;

      var retourErreur = false;  // On évite d'envoyer plus d'une res.json
      req.body.evaluation.forEach(function(uneReponse) {

         // validation minimale
         if (typeof uneReponse.id_ligne === 'undefined' ||
            isNaN(uneReponse.id_ligne) ||
            typeof uneReponse.reponse === 'undefined' ||
            typeof uneReponse.typeQuestion === 'undefined' ||
            (uneReponse.typeQuestion.indexOf('num') < 0 &&
             uneReponse.typeQuestion.indexOf('txt') < 0)) {

            if (!retourErreur) {
               retourErreur = true;
               return res.json(jsend.fail({
                  message: "Réponse invalide"
               }));
            }

         } else {

            if (typeof uneReponse.reponse === 'string') {
               uneReponse.reponse = uneReponse.reponse.replace(/%/g, '~}');
            }
            var laReponse = uneReponse.typeQuestion + ':' + encodeURIComponent(uneReponse.reponse);
            laReponse = laReponse.substr(0, 11999);

            // Une réponse de plus
            req.reponseQuestionnaire +=
               '&Pa_id_ligne=' + uneReponse.id_ligne +
               '&Pa_reponse=' + laReponse;
         }
      });

      if (!retourErreur) {
         if (req.body.evaluation.length === 0) {
            req.reponseQuestionnaire += '&Pa_id_ligne=&Pa_reponse=';
         }
         apiInstitutions.obtenirServicesCommun(
           'enregistrerEvaluation',
           req,
           function(reponse) {
              res.json(reponse);
           });
      }
   }
});


module.exports = router;

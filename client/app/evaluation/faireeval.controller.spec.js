/* jshint  unused:false, camelcase:false */
/* globals afterEach, testErreur, DossierModelMock, spyOn */

'use strict';

describe('Controller: FaireEvalCtrl', function() {

   var FaireEvalCtrl,
      scope,
      backendMock,
      codePermanent = 'identifiant',
      erreurGenerique = 'Une erreur est survenue, veuillez essayer plus tard.',
      routeParams = {'id':'20386','sigle':'GEO2093-10','nom':' Zarper,%20Steven','titre':'CARTOGRAPHIE%20THEMATIQUE','trimestre':'Hiver%202016'},
      id_enseignement = '20386',
      location, auth;

   var testQuestionnaire = function() {
      return {
         'status':'success',
         data:{'id_questionnaire': '18',
               'titre': 'FACULTÉ DES SCIENCES HUMAINES  Évaluation des cours magistraux',
               'liste_question': [
                  {
                     'id_ligne': '1',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'Le plan de cours (objectifs, contenu, méthode d\'enseignement, moyens d\'évaluation, bibliographie, etc.) a été expliqué clairement.'
                  },
                  {
                     'id_ligne': '2',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'Le contenu couvert dans la session correspond à ce qui est décrit dans le plan de cours.'
                  },
                  {
                     'id_ligne': '3',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'entente d\'évaluation sur les moyens et les critères d\'évaluation a été respectée.'
                  },
                  {
                     'id_ligne': '4',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'La charge de travail exigée dans le cours est conforme à la norme universitaire de deux (2) heures de travail personnel hors cours pour chaque heure de cours.'
                  },
                  {
                     'id_ligne': '5',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'enseignant-e est disponible en dehors des heures de cours selon les modalités convenues. (Ne répondez que si vous avez déjà tenté de contacter l\'enseignant-e).'
                  },
                  {
                     'id_ligne': '6',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'enseignant-e maîtrise la matière du cours.'
                  },
                  {
                     'id_ligne': '7',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'enseignant-e présente la matière du cours de façon claire et structurée.'
                  },
                  {
                     'id_ligne': '8',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'enseignant-e sait rendre compréhensibles les notions complexes.'
                  },
                  {
                     'id_ligne': '9',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'enseignant-e aide les étudiants-es à faire le lien entre les concepts et leurs applications.'
                  },
                  {
                     'id_ligne': '10',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'enseignant-e aide les étudiants-es à faire les liens entre les diverses parties de son cours.'
                  },
                  {
                     'id_ligne': '11',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'Les lectures recommandées complètent adéquatement le contenu du cours. (Ne répondez que si vous avez fait ces lectures).'
                  },
                  {
                     'id_ligne': '12',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'Les documents audiovisuels aident à mieux comprendre le contenu du cours.'
                  },
                  {
                     'id_ligne': '13',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'enseignant-e procède régulièrement à la synthèse de la matière.'
                  },
                  {
                     'id_ligne': '14',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'enseignant-e sait stimuler la réflexion critique sur la matière.'
                  },
                  {
                     'id_ligne': '15',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'enseignant-e sait susciter l\'intérêt des étudiants-es pour la matière.'
                  },
                  {
                     'id_ligne': '16',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'enseignant-e encourage les étudiants-es à poser des questions.'
                  },
                  {
                     'id_ligne': '17',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'enseignant-e répond de façon appropriée aux questions et commentaires des étudiants-es.'
                  },
                  {
                     'id_ligne': '18',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'L\'enseignant-e respecte les étudiants-es.'
                  },
                  {
                     'id_ligne': '19',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'Les exposés de l\'enseignant-e sont nécessaires à la rédaction des travaux et des examens.'
                  },
                  {
                     'id_ligne': '20',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'Les consignes pour les travaux sont claires.'
                  },
                  {
                     'id_ligne': '21',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'Les questions d\'examen sont claires.'
                  },
                  {
                     'id_ligne': '22',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'Les travaux sont pertinents relativement au contenu du cours.'
                  },
                  {
                     'id_ligne': '23',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'Les examens sont pertinents relativement au contenu du cours.'
                  },
                  {
                     'id_ligne': '24',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'Les commentaires de l\'enseignant-e sur les travaux ou les examens de l\'étudiant-e favorisent l\'apprentissage.'
                  },
                  {
                     'id_ligne': '25',
                     'categorie': 'REG',
                     'type_question': 'num',
                     'texte': 'De façon générale, la prestation de l\'enseignant-e favorise les apprentissages.'
                  },
                  {
                     'id_ligne': '26',
                     'categorie': 'REG',
                     'type_question': 'txt',
                     'texte': 'Indiquez ici tout commentaire que vous jugez utile sur la prestation de l\'enseignante ou de l\'enseignant et toute suggestion permettant d\'améliorer celle-ci.'
                  }
               ],
               'heureMontreal': '20160427 07:58:22',
               '$promise': {},
               '$resolved': true
         }
      };
   };


   var  testMessage = function() {
         return {
            'status': 'fail',
            data: {
               'message': ' Aucun résultat '
            }
         };
      },
      testErreur = function() {
         return {
            'status': 'error',
            'message': 'Erreur fatale dans le service.'
         };
      },
      testErreur2 = function() {
         return {
            'status': 'error',
            'nada': '.'
         };
      };


   /////////////////////////////////////////////////////////////////////////////
   /*
    * PRÉPARER les tests.
    */
   beforeEach(module('pelApp'));

   /* Initialiser le contrôleur avec httpBackend et rootScope
    * et ressoudre les dépendances à horaire(backendMock) et Auth (authMock).
    */

   beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $location, _Auth_) {
      scope = $rootScope.$new();
      backendMock = _$httpBackend_;
      location = $location;
      auth = _Auth_;
      FaireEvalCtrl = $controller('FaireEvalCtrl', {
         $scope: scope,
         $routeParams: routeParams
      });

   }));



   /////////////////////////////////////////////////////////////////////////////
   /*
    * Effectuer et évaluer les TESTS.
    */

   it('FaireEvalCtrl devrait être défini', function() {
      expect(FaireEvalCtrl).toBeDefined();
   });


   it('devrait retourner le questionnaire.', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement ).respond(testQuestionnaire());
      backendMock.flush();
      expect(scope.evaluation.sigle).toBe('GEO2093-10');
      expect(scope.choix.length).toBe(26);
      expect(scope.choixMobile.length).toBe(26);
   });


   it('devrait retourner un avertissement (fail).', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement ).respond(testMessage());
      backendMock.flush();
      expect(scope.avertissements[0]).toBe(' Aucun résultat ');
   });


   it('devrait retourner une erreur (error).', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement).respond(testErreur());
      backendMock.flush();
      expect(scope.err).toBe(erreurGenerique);
   });


   it('devrait retourner une erreur non trappée (error).', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement).respond(testErreur2());
      backendMock.flush();
      expect(scope.err).toBe(erreurGenerique);
   });


   it('devrait retourner une erreur de comm. http 500', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement).respond(500,{},{});
      backendMock.flush();
      expect(scope.err).toBe(erreurGenerique);
   });


   it('devrait formatter un élément (radio) sélectionné SANS réponse', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement).respond(testQuestionnaire());
      backendMock.flush();
      var question = scope.choix[0];
      var result = scope.formatterReponse(question, 3);
      expect(result).toBe('background-color:#0681AE;');
   });


   it('devrait evauler une question num avec une réponse', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement).respond(testQuestionnaire());
      backendMock.flush();
      var question = scope.choix[0];
      scope.evaluer(question, 3);
      expect(question.reponse).toBe(3);
      expect(question.classe[3]).toBe(true);
   });


   it('devrait formatter un élément (radio) sélectionné AVEC une réponse', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement).respond(testQuestionnaire());
      backendMock.flush();
      var question = scope.choix[0];
      scope.evaluer(question, 3);
      var result = scope.formatterReponse(question, 3);
      expect(result).toBe('background-color:#002E3E;');
   });


   it('devrait faire appel a suivant et precedent', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement).respond(testQuestionnaire());
      backendMock.flush();
      var current = scope.mobileStep;
      scope.suivant();
      expect(scope.mobileStep).toBe(current + 1);
      scope.precedent();
      expect(scope.mobileStep).toBe(current);
   });


   it('Devrait envoyer le questionnaire et recevoir une réponse(succès).', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement).respond(testQuestionnaire());
      backendMock.flush();
      backendMock.when('POST','/apis/enregistrerEvaluation', undefined).respond({'status':'success','data':{'Ok':'Ok'}});

      var question = scope.choix[0];
      scope.evaluer(question, 3);

      // Appel de transmettre
      scope.transmettre();

      spyOn(location, 'path');

      // Boutton confirmer
      scope.dlog.retour();
      // Appel pour le POST (enregistrer l'évaluation)
      backendMock.flush();

      expect(location.path).toHaveBeenCalledWith('/evaluation');
      expect(scope.dlog.content[0].messages[0]).toBe('Votre évaluation a été correctement transmise.');
   });

   it('Devrait nvoyer le questionnaire et recevoir une réponse (error).', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement).respond(testQuestionnaire());
      backendMock.flush();
      /* TODO à vérifier */
      backendMock.when('POST','/apis/enregistrerEvaluation', undefined).respond({'status':'error','message':'message ??'});

      var question = scope.choix[0];
      scope.evaluer(question, 3);

      // Appel de transmettre
      scope.transmettre();

      spyOn(location, 'path');

      // Boutton confirmer
      scope.dlog.retour();
      // Appel pour le POST (enregistrer l'évaluation)
      backendMock.flush();

      expect(location.path).toHaveBeenCalledWith('/evaluation');
      expect(scope.dlog.content[0].messages[0]).toBe('Désolé, votre évaluation n\'a pas été correctement transmise.');
   });


   it('Devrait envoyer le questionnaire et recevoir une réponse échec (comm err).', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement).respond(testQuestionnaire());
      backendMock.flush();
      /* TODO à vérifier */
      backendMock.when('POST','/apis/enregistrerEvaluation', undefined).respond(500,{},{});

      var question = scope.choix[0];
      scope.evaluer(question, 3);

      // Appel de transmettre
      scope.transmettre();
      // Si erreur on devrait finir par appeler logout.
      spyOn(auth, 'logout');

      // Boutton confirmer
      scope.dlog.retour();
      // Appel pour le POST (enregistrer l'évaluation)
      backendMock.flush();

      expect(auth.logout).toHaveBeenCalledWith({ url: '/difficulte' });
   });


   it('Devrait appeler le questionnaire et presser sur annuler.', function() {
      backendMock.when('GET','/apis/obtenirQuestionnaire/' + codePermanent + '/' + id_enseignement).respond(testQuestionnaire());
      backendMock.flush();

      var question = scope.choix[0];
      scope.evaluer(question, 3);

      // Appel de transmettre
      scope.transmettre();

      // Boutton annuler
      scope.dlog.hideMessages();
      expect(question.reponse).toBe(3);
   });


});

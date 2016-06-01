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

var util = require('./server/config/util');

module.exports = function(grunt) {
   'use strict';
   process.env.NODE_ENV = process.env.NODE_ENV || 'development';

   // Load grunt tasks automatically, when needed
   require('jit-grunt')(grunt, {
      express: 'grunt-express-server',
      useminPrepare: 'grunt-usemin',
      ngtemplates: 'grunt-angular-templates',
      cdnify: 'grunt-google-cdn',
      protractor: 'grunt-protractor-runner',
      injector: 'grunt-asset-injector',
      jasmine: 'grunt-contrib-jasmine'
   });

   require('time-grunt')(grunt);

   // Define the configuration for all the tasks
   grunt.initConfig({

      // Project settings
      pel: {
         // configurable paths
         client: require('./bower.json').appPath || 'client',
         dist: 'dist',
         resultTest: 'result-test'
      },
      express: {
         options: {
            port: process.env.PORT || 9000
         },
         dev: {
            options: {
               script: 'server/app.js',
               debug: true
            }
         },
         prod: {
            options: {
               script: 'dist/server/app.js'
            }
         }
      },
      open: {
         server: {
            url: 'http://localhost:<%= express.options.port %>'
         }
      },
      watch: {
         js: {
            files: ['<%= pel.client %>/{app,components}/**/*.js'],
            tasks: ['jshint:all'],
            options: {
               livereload: true
            }
         },

         injectJS: {
            files: [
               '<%= pel.client %>/{app,components,assets}/**/*.js',
               '!<%= pel.client %>/{app,components}/**/*.spec.js',
               '!<%= pel.client %>/{app,components}/**/*.mock.js',
               '!<%= pel.client %>/app/app.js'
            ],
            tasks: ['injector:scripts']
         },
         injectCss: {
            files: [
               '<%= pel.client %>/{app,components}/**/*.css'
            ],
            tasks: ['injector:css']
         },
         mochaTest: {
            files: ['server/**/*.spec.js'],
            tasks: ['mochaTest']
         },
         mocha_istanbul: {
            files: ['server/**/*.spec.js'],
            tasks: ['mocha_istanbul']
         },
         jsTest: {
            files: [
               '<%= pel.client %>/{app,components}/**/*.spec.js',
               '<%= pel.client %>/{app,components}/**/*.mock.js'
            ],
            tasks: ['newer:jshint:all', 'karma']
         },
         injectSass: {
            files: [
               '<%= pel.client %>/{app,components,assets}/**/*.{scss,sass}'
            ],
            tasks: ['injector:sass']
         },
         sass: {
            files: [
               '<%= pel.client %>/{app,components,assets}/**/*.{scss,sass}'
            ],
            tasks: ['sass', 'autoprefixer']
         },
         gruntfile: {
            files: ['Gruntfile.js']
         },
         livereload: {
            files: [
               '{.tmp,<%= pel.client %>}/{app,components,assets}/**/*.css',
               '{.tmp,<%= pel.client %>}/{app,components,assets}/**/*.html',
               '{.tmp,<%= pel.client %>}/{app,components,assets}/**/*.js',
               '!{.tmp,<%= pel.client %>}{app,components}/**/*.spec.js',
               '!{.tmp,<%= pel.client %>}/{app,components}/**/*.mock.js',
               '<%= pel.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
               ],
            options: {
               livereload: true
            }
         },
         express: {
            files: [
               'server/**/*.{js,json}'
            ],
            tasks: ['express:dev', 'wait'],
            options: {
               livereload: true,
               nospawn: true //Without this option specified express won't be reloaded
            }
         }
      },

      jshint: {
         options: {
            jshintrc: '<%= pel.client %>/.jshintrc',
            reporter: require('jshint-stylish'),
            force: true
         },
         server: {
            options: {
               jshintrc: 'server/.jshintrc'
            },
            src: [
               'server/**/*.js',
               '!server/**/*.spec.js'
            ]
         },
         all: [
            '<%= pel.client %>/{app,components}/**/*.js',
            '!<%= pel.client %>/{app,components}/**/*.spec.js',
            '!<%= pel.client %>/{app,components}/**/*.mock.js'
         ],
         client: {
            options: {
               jshintrc: '<%= pel.client %>/.jshintrc',
               reporter: require('jshint-junit-reporter'),
               reporterOutput: '<%= pel.resultTest %>/junit-jshint.xml',
               force: true
            },
            src: [
               '<%= pel.client %>/{app,components}/**/*.js',
               '!<%= pel.client %>/{app,components}/**/*.spec.js',
               '!<%= pel.client %>/{app,components}/**/*.mock.js'
            ]
         }
      },

      // Empties folders to start fresh
      clean: {
         dist: {
            files: [{
               dot: true,
               src: [
                  '.tmp',
                  'dist.zip',
                  '<%= pel.dist %>/*',
                  '!<%= pel.dist %>/.git*',
                  '!<%= pel.dist %>/.openshift',
                  '!<%= pel.dist %>/Procfile'
               ]
            }]
         },
         reportserver: {
            files: [{
               dot: true,
               src: [
                  '.tmp',
                  '<%= pel.resultTest %>/cover-server/*',
                  '<%= pel.resultTest %>/tests-server/*'
               ]
            }]
         },
         reportclient: {
            files: [{
               dot: true,
               src: [
                  '.tmp',
                  '<%= pel.resultTest %>/cover-client/*',
                  '<%= pel.resultTest %>/tests-client/*'
               ]
            }]
         },
         server: '.tmp',
         doc: 'documentation'
      },

      // Add vendor prefixed styles
      autoprefixer: {
         options: {
            browsers: ['last 1 version']
         },
         dist: {
            files: [{
               expand: true,
               cwd: '.tmp/',
               src: '{,*/}*.css',
               dest: '.tmp/'
            }]
         }
      },

      'node-inspector': {
         custom: {
            options: {
               'web-host': 'localhost'
            }
         }
      },

      nodemon: {
         debug: {
            script: 'server/app.js',
            options: {
               nodeArgs: ['--debug-brk'],
               env: {
                  PORT: process.env.PORT || 9000
               },
               callback: function(nodemon) {
                  nodemon.on('log', function(event) {
                     console.log(event.colour);
                  });

                  // opens browser on initial server start
                  nodemon.on('config:update', function() {
                     setTimeout(function() {
                        require('open')('http://localhost:8080/debug?port=5858');
                     }, 500);
                  });
               }
            }
         }
      },

      // Automatically inject Bower components into the app
      wiredep: {
         target: {
            src: ['<%= pel.client %>/index.html'],
            ignorePath: '<%= pel.client %>/',
            exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/]
         }
      },

      // Renames files for browser caching purposes
      rev: {
         dist: {
            files: {
               src: [
                  '<%= pel.dist %>/public/{,*/}*.js',
                  '<%= pel.dist %>/public/{,*/}*.css',
                  '<%= pel.dist %>/public/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                  '<%= pel.dist %>/public/assets/fonts/*'
               ]
            }
         }
      },

      useminPrepare: {
         html: ['<%= pel.client %>/index.html',
                '<%= pel.client %>/difficulte.html',
                '<%= pel.client %>/fureteur.html'],
         options: {
            dest: '<%= pel.dist %>/public'
         }
      },

      usemin: {
         html: ['<%= pel.dist %>/public/{,*/}*.html'],
         css: ['<%= pel.dist %>/public/{,*/}*.css'],
         js: ['<%= pel.dist %>/public/{,*/}*.js'],
         options: {
            assetsDirs: [
               '<%= pel.dist %>/public',
               '<%= pel.dist %>/public/assets/images'
            ],
            // This is so we update image references in our ng-templates
            patterns: {
               js: [
                  [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
               ]
            }
         }
      },

      imagemin: {
         dist: {
            files: [{
               expand: true,
               cwd: '<%= pel.client %>/assets/images',
               src: '{,*/}*.{png,jpg,jpeg,gif}',
               dest: '<%= pel.dist %>/public/assets/images'
            }]
         }
      },

      svgmin: {
         dist: {
            files: [{
               expand: true,
               cwd: '<%= pel.client %>/assets/images',
               src: '{,*/}*.svg',
               dest: '<%= pel.dist %>/public/assets/images'
            }]
         }
      },

      ngAnnotate: {
         dist: {
            files: [{
               expand: true,
               cwd: '.tmp/concat',
               src: '*/**.js',
               dest: '.tmp/concat'
            }]
         }
      },

      // Package all the html partials into a single javascript payload
      ngtemplates: {
         options: {
            // This should be the name of your apps angular module
            module: 'pelApp',
            htmlmin: {
               collapseBooleanAttributes: true,
               // Ça cause des problèmes lorsque les espaces
               // sont devant le tags.
               collapseWhitespace: false,
               removeAttributeQuotes: true,
               removeEmptyAttributes: true,
               removeRedundantAttributes: true,
               removeScriptTypeAttributes: true,
               removeStyleLinkTypeAttributes: true
            },
            usemin: 'app/app.js'
         },
         main: {
            cwd: '<%= pel.client %>',
            src: ['{app,components}/**/*.html'],
            dest: '.tmp/templates.js'
         },
         tmp: {
            cwd: '.tmp',
            src: ['{app,components}/**/*.html'],
            dest: '.tmp/tmp-templates.js'
         }
      },

      cdnify: {
         dist: {
            html: ['<%= pel.dist %>/*.html']
         }
      },

      copy: {
         dist: {
            files: [{
               expand: true,
               dot: true,
               cwd: '<%= pel.client %>',
               dest: '<%= pel.dist %>/public',
               src: [
                  '*.{ico,png,txt}',
                  '.htaccess',
                  'bower_components/**/*',
                  'assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                  'assets/fonts/*',
                  'index.html',
                  'difficulte.html',
                  'fureteur.html'
               ]
            }, {
               expand: true,
               cwd: '.tmp/images',
               dest: '<%= pel.dist %>/public/assets/images',
               src: ['generated/*']
            }, {
               expand: true,
               dest: '<%= pel.dist %>',
               src: [
                  'package.json',
                  'server/**/*'
               ]
            }]
         },
         styles: {
            expand: true,
            cwd: '<%= pel.client %>',
            dest: '.tmp/',
            src: ['{app,components}/**/*.css']
         }
      },

      concurrent: {
         server: [
            'sass'
         ],
         test: [
            'sass'
         ],
         debug: {
            tasks: [
               'nodemon',
               'node-inspector'
            ],
            options: {
               logConcurrentOutput: true
            }
         },
         dist: [
            'sass',
            'imagemin',
            'svgmin'
         ]
      },

      // Test settings
      karma: {
         unit: {
            configFile: 'karma.conf.js',
            singleRun: true
         }
      },

      mochaTest: {
         xunit: {
            options: {
               reporter: 'xunit',
               captureFile: '<%= pel.resultTest %>/tests-server/xunit.xml'
            },
            src: ['server/**/*.spec.js']
         }
      },

      mocha_istanbul: {
         coveralls: {
            src: 'server/**/*.spec.js',
            options: {
               reportFormats: ['cobertura', 'lcovonly', 'html'],
               mask: '*.spec.js',
               coverageFolder: '<%= pel.resultTest %>/cover-server'
            }
         }
      },

      protractor: {
         options: {
            configFile: 'protractor.conf.js'
         },
         chrome: {
            options: {
               args: {
                  browser: 'chrome'
               }
            }
         }
      },

      // Compiles Sass to CSS
      sass: {
         server: {
            options: {
               loadPath: [
                  '<%= pel.client %>/bower_components',
                  '<%= pel.client %>/app',
                  '<%= pel.client %>/components',
                  '<%= pel.client %>/assets'
               ],
               compass: false
            },
            files: {
               '.tmp/app/app.css': '<%= pel.client %>/app/app.scss'
            }
         }
      },

      injector: {
         options: {

         },
         // Inject application script files into index.html (doesn't include bower)
         scripts: {
            options: {
               transform: function(filePath) {
                  filePath = filePath.replace('/client/', '');
                  filePath = filePath.replace('/.tmp/', '');
                  return '<script src="' + filePath + '"></script>';
               },
               starttag: '<!-- injector:js -->',
               endtag: '<!-- endinjector -->'
            },
            files: {
               '<%= pel.client %>/index.html': [
                  ['{.tmp,<%= pel.client %>}/{app,components,assets}/**/*.js',
                     '!{.tmp,<%= pel.client %>}/app/app.js',
                     '!{.tmp,<%= pel.client %>}/{app,components}/**/*.spec.js',
                     '!{.tmp,<%= pel.client %>}/{app,components}/**/*.mock.js'
                  ]
               ]
            }
         },

         sass: {
            options: {
               transform: function(filePath) {
                  filePath = filePath.replace('/client/app/', '');
                  filePath = filePath.replace('/client/components/', '');
                  filePath = filePath.replace('/client/assets/', '');
                  return '@import \'' + filePath + '\';';
               },
               starttag: '// injector',
               endtag: '// endinjector'
            },
            files: {
               '<%= pel.client %>/app/app.scss': [
                  '<%= pel.client %>/{app,components,assets}/**/*.{scss,sass}',
                  '!<%= pel.client %>/app/app.{scss,sass}'
               ]
            }
         },

         // Inject component css into index.html
         css: {
            options: {
               transform: function(filePath) {
                  filePath = filePath.replace('/client/', '');
                  filePath = filePath.replace('/.tmp/', '');
                  return '<link rel="stylesheet" href="' + filePath + '">';
               },
               starttag: '<!-- injector:css -->',
               endtag: '<!-- endinjector -->'
            },
            files: {
               '<%= pel.client %>/index.html': [
                  '<%= pel.client %>/{app,components,assets}/**/*.css'
               ]
            }
         }
      },

      replace: {
         configClient: {
            options: {
               patterns: [{
                  json: function(done) {
                     // fonction asynchrone
                     // exécuté lors de l'appel replace:configClient
                     var pattern = grunt.file.readJSON('./configClient/environments/' + process.env.NODE_ENV + '.json');
                     done(pattern);
                  }
               }]
            },
            files: [{
               expand: true,
               flatten: true,
               src: ['./configClient/configClient.js'],
               dest: '<%= pel.client %>/app/'
            }]
         },
         patchMochaXunit: {
            files: [{
               expand: true,
               flatten: true,
               src: ['<%= pel.resultTest %>/tests-server/xunit.xml'],
               dest: '<%= pel.resultTest %>/tests-server/fix'
            }],
            options: {
               patterns: [{
                  match: /(.|[\n])*0m\n/,
                  replacement: ''
               },{
                  raison: ' Pour enlever les traces provoquées par le log de winston',
                  match: /(info.*\n)/g,
                  replacement: ''
               }]
            }
         }
      },

      exec: {
         zip_dist: 'zip --quiet -r dist dist',
         commentaire: 'on ajoute le quiet au zip car sinon le stdout plante quand il y a trop de fichiers sur linux'
      },

      jasmine: {
         coverage: {
            excludes: ['client/**/*.spec.js', 'client/components/**/*.spec.js'],
            src: [
               'client/app/**/*.js',
               'client/components/**/*.js',
               '!client/**/*.spec.js',
               '!client/components/**/*.spec.js'
            ],
            options: {
               specs: 'client/**/*.spec.js',
               vendor: ['client/bower_components/jquery/jquery.js',
                  'client/bower_components/angular/angular.js',
                  'client/bower_components/angular-mocks/angular-mocks.js',
                  'client/bower_components/angular-resource/angular-resource.js',
                  'client/bower_components/angular-cookies/angular-cookies.js',
                  'client/bower_components/angular-sanitize/angular-sanitize.js',
                  'client/bower_components/angular-route/angular-route.js',
                  'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                  'client/bower_components/moment/moment.js',

                  'client/bower_components/angular-moment/angular-moment.js',

                  'client/bower_components/fullcalendar/dist/fullcalendar.js',
                  'client/bower_components/fullcalendar/dist/lang/fr-ca.js',
                  'client/bower_components/angular-ui-calendar/src/calendar.js',

                  'client/bower_components/lodash/dist/lodash.compat.js',
                  'client/bower_components/angular-svg-png/angular-svg-png.js',
                  'client/bower_components/modernizr/modernizr.js'
               ],
               template: require('grunt-template-jasmine-istanbul'),
               templateOptions: {
                  coverage: '<%= pel.resultTest %>/cover-client/coverage.json',
                  report: [{
                     type: 'html',
                     options: {
                        dir: '<%= pel.resultTest %>/cover-client/html'
                     }
                  }, {
                     type: 'cobertura',
                     options: {
                        dir: '<%= pel.resultTest %>/cover-client/cobertura'
                     }
                  }, {
                     type: 'text-summary'
                  }]
               }
            }
         }
      },

      ngdocs: {
         options: {
            dest: 'documentation/client/',
            scripts: ['angular.js'],
            html5Mode: false
         },
         all: ['client/app/facturesEtImpots/rif/*.js']
      }


   });


   grunt.loadNpmTasks('grunt-ngdocs');

   grunt.registerTask('doc', ['clean:doc', 'ngdocs']);


   // ====================================================================
   // Début des tâches enregistrées

   grunt.registerTask('encrypte', function(motAencrypter, motMagique) {
      grunt.log.ok('-->' + motAencrypter + '<-->' + motMagique + '<--');
      grunt.log.ok('-->' + util.encrypte(motAencrypter, motMagique) + '<--');
   });

   // Used for delaying livereload until after server has restarted
   grunt.registerTask('wait', function() {
      grunt.log.ok('Waiting for server reload...');

      var done = this.async();

      setTimeout(function() {
         grunt.log.writeln('Done waiting!');
         done();
      }, 1500);
   });

   grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
      this.async();
   });

   grunt.registerTask('serve', function(target) {

      if (target === 'debug') {
         return grunt.task.run([
            'clean:server',
            'injector:sass',
            'concurrent:server',
            'injector',
            'wiredep',
            'autoprefixer',
            'replace:configClient',
            'concurrent:debug'
         ]);
      }

      grunt.task.run([
         'clean:server',
         'injector:sass',
         'concurrent:server',
         'injector',
         'wiredep',
         'autoprefixer',
         'replace:configClient',
         'express:dev',
         'wait',
         'open',
         'watch'
      ]);
   });

   grunt.registerTask('server', function() {
      grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
      grunt.task.run(['serve']);
   });

   grunt.registerTask('test', function(target) {
      if (target === 'server') {
         return grunt.task.run([
            'clean:reportserver',
            'mochaTest:xunit',
            'replace:patchMochaXunit',
            'cover:server',
            'jshint:server'
         ]);
      } else if (target === 'client') {
         return grunt.task.run([
            'clean:reportclient',
            'replace:configClient',
            'injector:sass',
            'concurrent:test',
            'injector',
            'autoprefixer',
            'karma',
            'cover:client',
            'jshint:client'
         ]);
      } else if (target === 'e2e') {
         return grunt.task.run([
            'clean',
            //'replace:configClient',
            'injector:sass',
            'concurrent:test',
            'injector',
            'wiredep',
            'autoprefixer',
            'express:dev',
            'protractor'
         ]);
      } else grunt.task.run([
         'test:server',
         'test:client'
      ]);
   });

   grunt.registerTask('build', function() {
      process.env.NODE_ENV = 'production';
      grunt.task.run([
         'clean:dist',
         'replace:configClient',
         'injector:sass',
         'concurrent:dist',
         'injector',
         'wiredep',
         'useminPrepare',
         'autoprefixer',
         'ngtemplates',
         'concat',
         'ngAnnotate',
         'copy:dist',
         'cdnify',
         'cssmin',
         'uglify',
         'rev',
         'usemin'
      ]);
   });

   grunt.registerTask('default', [
      'newer:jshint',
      'test',
      'build'
   ]);

   grunt.registerTask('cover:server', [
      'mocha_istanbul'
   ]);

   grunt.registerTask('cover:client', [
      'jasmine:coverage'
   ]);

};


module.exports = function (config) {
    'use strict';
    config.set({

        basePath: '',

        frameworks: ['jspm', 'jasmine'],

        jspm: {
            config: 'config.js',
            useBundles: true,
            loadFiles: [
                'src/**/*.js',
                'test/*.js'
            ],
            meta: {
                'jspm_packages/github/angular/bower-angular@1.5.3/angular.js': {
                    format: 'global',
                    exports: 'angular'
                },
                'jspm_packages/github/angular/bower-angular-mocks@1.5.3/angular-mocks.js': {
                    format: 'global',
                    deps:   'angular'
                }
            }
        },

        proxies: {
            '/src/': '/base/src/',
            '/test/': '/base/test/',
            '/jspm_packages/': '/base/jspm_packages/'
        },

        files: [
            'node_modules/babel-polyfill/dist/polyfill.js'
        ],

        preprocessors: {
            'src/**/*.js': ['babel', 'coverage'],
            'test/**/*.js': ['babel']
        },

        babelPreprocessor: {
            options: {
                sourceMap: 'inline',
                plugins: [
                    'transform-decorators-legacy'
                ]
            },
            filename: function (file) {
                return file.originalPath;
            },
            sourceFileName: function (file) {
                return file.originalPath;
            }
        },

        port: 9876,
        colors: true,
        autoWatch: true,
        singleRun: true,
        autoWatchBatchDelay: 50,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,

        browsers: ['PhantomJS']

    });
};

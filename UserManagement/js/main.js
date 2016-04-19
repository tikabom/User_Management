requirejs.config({
    paths: {
        jquery: 'lib/jquery-1.9.1.min',
        jqueryui: 'lib/jquery-ui',
        underscore: 'lib/underscore-min',
        backbone: 'lib/backbone-min',
        pages: '../pages'
    },
    
    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'jqueryui': {
        	deps: ['jquery'],
        	exports: '$'
        }
    }
});

require(['app'],function(App) {
    App.initialize();
});
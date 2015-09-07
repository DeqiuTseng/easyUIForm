require.config({
    paths: {

        'angular': '../lib/angularjs/angular',
        /*'jquery': '../lib/jquery-easyui-1.4.3/jquery.min',
        'jqueryEasyui': "../lib/jquery-easyui-1.4.3/jquery.easyui.min",
        'Highcharts': "../lib/Highcharts-4.1.8/js/highcharts",
        'HighchartsExporting': "../lib/Highcharts-4.1.8/js/modules/exporting"*/
    },
    shim: {
        /*'angular': {
            deps: ['jquery']
        },
        'Highcharts': {
            exports: 'Highcharts',
            deps: ['jquery']
        }, 'jqueryEasyui': {
            deps: ['jquery']
        }, 'HighchartsExporting': {
            deps: ['Highcharts']
        }*/
    }
});

require(['./app'], function () {
    'use strict';
    angular.bootstrap(document, ['hxApp']);//待所有小模块加载完毕，大模块再启动
});

/**
 * 引入css文件
 * @param cssArray css路径
 * @constructor
 */
window.HXAppAddCss = function (cssArray) {
    var styles = cssArray;
    function addStyle(path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    }
    for (var i = 0; i < styles.length; i++) {
        addStyle( styles[i]);
    }
};

window.HXAPPAddJS=function(path){
        if(!path || path.length === 0){
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
}

require.config({
    paths: {

        'angular': '../lib/angularjs/angular'/*,
        'jquery': '../lib/jquery-easyui-1.4.3/jquery.min',
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
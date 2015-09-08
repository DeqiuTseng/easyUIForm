define([
    'angular'/*,
     'jquery',
     'jqueryEasyui',
     'Highcharts',
     'HighchartsExporting'*/
], function () {
    'use strict';
    //先把hxApp的部件拿到，那么启动hxApp就能发挥整体功效啦
    var module = angular.module('hxApp', [])
        .config(['$sceProvider', '$compileProvider',
            function ($sceProvider, $compileProvider) {
                $sceProvider.enabled(false);
                $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|cdvfile|data):/);
                $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|cdvfile|data):/);
            }]).value('IpAndPort', {
            ip: '220.231.153.66',
            socketPort: '8885',
            javaServerPort: '80'
        });
    // 最外层的控制器
    module.controller('mainCtrl', ['$scope','$http', function ($scope,$http) {
       $scope.southContentURL = "modules/publicModule/south/southIndex.html";
        /*$scope.westContentURL = "modules/publicModule/west/westIndex.html";
        $scope.eastContentURL = "modules/publicModule/east/eastIndex.html";
        $scope.workContentURL = "modules/publicModule/center/centerIndex.html";*/

        //--------------------------弹面消息提示框--------------------------
        slide();
        function slide() {
            $.messager.show({
                title: '系统消息',
                msg: '登录系统时间:' + new Date() + '',
                timeout: 5000,
                showType: 'slide'
            });
        }

        //--------------------------工作区tab页----------------------------
        var index = 0;
        $scope.addPanel = function (tabName) {
            index++;
            $('#tabContent').tabs('add', {
                title: tabName,
                href: 'modules/publicModule/center/_tableContent.html',
                closable: true
            });
        }
        function removePanel() {
            var tab = $('#tt').tabs('getSelected');
            if (tab) {
                var index = $('#tt').tabs('getTabIndex', tab);
                $('#tabContent').tabs('close', index);
            }
        }

        //动态加载数据到gridData
        (function ($) {
            function pagerFilter(data) {
                if ($.isArray(data)) {	// is array
                    data = {
                        total: data.length,
                        rows: data
                    }
                }
                var dg = $(this);
                var state = dg.data('datagrid');
                var opts = dg.datagrid('options');
                if (!state.allRows) {
                    state.allRows = (data.rows);
                }
                var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
                var end = start + parseInt(opts.pageSize);
                data.rows = $.extend(true, [], state.allRows.slice(start, end));
                return data;
            }

            var loadDataMethod = $.fn.datagrid.methods.loadData;
            $.extend($.fn.datagrid.methods, {
                clientPaging: function (jq) {
                    return jq.each(function () {
                        var dg = $(this);
                        var state = dg.data('datagrid');
                        var opts = state.options;
                        opts.loadFilter = pagerFilter;
                        var onBeforeLoad = opts.onBeforeLoad;
                        opts.onBeforeLoad = function (param) {
                            state.allRows = null;
                            return onBeforeLoad.call(this, param);
                        }
                        dg.datagrid('getPager').pagination({
                            onSelectPage: function (pageNum, pageSize) {
                                opts.pageNumber = pageNum;
                                opts.pageSize = pageSize;
                                $(this).pagination('refresh', {
                                    pageNumber: pageNum,
                                    pageSize: pageSize
                                });
                                dg.datagrid('loadData', state.allRows);
                            }
                        });
                        $(this).datagrid('loadData', state.data);
                        if (opts.url) {
                            $(this).datagrid('reload');
                        }
                    });
                },
                loadData: function (jq, data) {
                    jq.each(function () {
                        $(this).data('datagrid').allRows = null;
                    });
                    return loadDataMethod.call($.fn.datagrid.methods, jq, data);
                },
                getAllRows: function (jq) {
                    return jq.data('datagrid').allRows;
                }
            })
        })(jQuery);

        var rows=[];
        function getData(success,fail) {
            var optionObj={
                "head":
                {
                    "RSID":"manageSystem"
                },
                "body":
                {
                    "note":
                    {
                        "db_tableName":"device",
                        "pkValue":"2",
                        "db_pageSize":"100",
                        "db_pageNum":"1",
                        "db_skipNum":"100",
                        "db_topNum":"100",
                        "db_columns":["deviceNum","deviceMac","deviceIp","deviceStatus","deviceOrgNo","deviceUser"],
                        "values":{}
                    }
                }
            }
            $http({
                method: 'POST',
                data: optionObj,
                url: "http://192.168.169.217:8007/ReviveSmartRS/Revive/RS/SelectModel",
                timeout: 25000                                //设置为25s后超时
            }).success(function (data) {
                rows=data.body.resultDatas;
                console.info(rows);
                success(data);
            }).error(function () {
                fail();
            });
            console.info(rows);
            return rows;
        }

        getData(function(){
            $(function () {
                $('#dg').datagrid({data:rows}).datagrid('clientPaging');
            });
            rows=[];
        },function(){});


        //--------------------------统计图展示----------------------------
        $(function () {
            $('#container').highcharts({
                title: {
                    text: 'Monthly Average Temperature',
                    x: -20 //center
                },
                subtitle: {
                    text: 'Source: WorldClimate.com',
                    x: -20
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    },
                    plotLines: [
                        {
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }
                    ]
                },
                tooltip: {
                    valueSuffix: '°C'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [
                    {
                        name: 'Tokyo',
                        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    },
                    {
                        name: 'New York',
                        data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                    },
                    {
                        name: 'Berlin',
                        data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                    },
                    {
                        name: 'London',
                        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                    }
                ]
            });
        });
    }]);
    return module;
});

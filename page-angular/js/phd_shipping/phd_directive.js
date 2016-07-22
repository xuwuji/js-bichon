//directive for phd filter, it contains selector, date-picker, check-box 
shipApp.directive('phdFilter', ['$timeout', '$http', function ($timeout, $http) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        scope: {
            defaults: '=',
            result: '=',
            apply: "&",
        },

        templateUrl: '/html/phd_filter.html',

        compile: function () {
            return {
                pre: function ($scope, iElement, iAttrs) {},

                post: function ($scope, iElement, iAttrs) {
                    var util = new arrayUtil();

                    //watch the compare selection,change the and1 behavior
                    $scope.$watch('result.compare', function (newV, oldV) {
                        var values = ['Year', 'Site', 'Device', 'Experience', 'None'];
                        if (newV == 'None') {
                            $scope.result.compareNotSelected = true;
                        } else {
                            $scope.result.compareNotSelected = false;
                            values = util.removeItem(values, $scope.result.compare);
                            $scope.defaults.and1 = values;
                        }
                    });

                    //watch the and1 selection, change the and2 behavior
                    $scope.$watch('result.and1', function (newV, oldV) {
                        var values = ['Year', 'Site', 'Device', 'Experience', 'None'];
                        values = util.removeItem(values, $scope.result.compare);
                        if (newV == 'None') {
                            $scope.result.and1NotSelected = true;
                        } else {
                            $scope.result.and1NotSelected = false;
                            $scope.defaults.and2 = util.removeItem(values, $scope.result.and1);
                        }
                    });
                }
            }
        },

    };
}]);


//directive for phd line chart
shipApp.directive('phdChart', ['$http', function ($http) {
    return {
        restrict: 'E',
        templateUrl: '/html/phd_chart.html',
        scope: {
            chartConfig: "<",
            modal: "=",
        },
        link: function ($scope, element, attrs) {

            $scope.showSQL = function (chartId) {
                $http.get('http://localhost:8080/OLAPService/config/pageConfig/5').then(function (response) {
                    //console.log(response.data[chartId]);
                    var config = response.data[chartId];
                    var re = new RegExp('\n', 'g');
                    console.log($scope.modal);
                    $scope.modal.sql = config.chart_sql_desc;
                    $scope.modal.chart_desc = config.chart_desc;
                    $scope.modal.sql_fomula = config.sql_fomula;
                    $scope.modal.sql_contact = config.sql_contact;
                    $scope.modal.title = config.chart_title;

                });
            }

            $scope.showDD = function (chartId) {

                $http.get('http://localhost:8080/OLAPService/config/pageConfig/5').then(function (response) {
                    var config = $scope.chartConfig;
                    //console.log(config);
                    var config = response.data[chartId];
                    $scope.modal.dd_id = config.chart_id;
                    $scope.modal.dd_title = config.chart_title;
                    //$scope.modal.ddReports = $scope.chartConfig;
                    $scope.modal.dd_formula = config.chart_formula;
                    //console.log($scope.ddReports);
                });
            }

            //qtip for sql and deep dive button
            $(".sqlbtn").qtip({
                content: {
                    text: 'Show SQL'
                },
                position: {
                    at: 'bottom center'
                },
                style: {
                    classes: 'qtip-bootstrap'
                }
            });

            $(".deepdivebtn").qtip({
                content: {
                    text: 'Deep Dive'
                },
                position: {
                    at: 'bottom center'
                },
                style: {
                    classes: 'qtip-bootstrap'
                }
            });




            function addChartDesc() {
                var container = $(this.chart.renderTo).find('.highcharts-container');
                var titleContainer = container.find('.highcharts-title');
                var titlePos = titleContainer.position();
                if (titlePos == null) {
                    return;
                }
                var bbox = titleContainer[0].getBBox();
                var top = parseInt(bbox.y);
                var left = parseInt(bbox.x - 5);
                var width = parseInt(bbox.width + 10);
                var height = parseInt(bbox.height + 5);
                var noteMaskDiv = $('<div style="z-index:20;position: absolute;top:' + top + 'px;left:' + left + 'px;width:' + width + 'px;height:' + height + 'px;background-color:white;opacity:0"></div>');

                var descDiv = $('<div>' + this.chartConfig.chart_desc + '</div>');

                var statusDiv = '';

                descDiv.append(statusDiv);
                container.append(noteMaskDiv);

                noteMaskDiv.qtip({
                    content: {
                        title: 'Noted:',
                        text: descDiv.html(),
                    },
                    position: {
                        target: 'mouse'
                    },
                    style: {
                        classes: 'qtip-bootstrap'
                    }
                });
            }

        },
    }
}]);

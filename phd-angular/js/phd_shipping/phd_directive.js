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

                    //watch the compare selection
                    $scope.$watch('result.compare', function (newV, oldV) {
                        var values = ['Year', 'Site', 'Device', 'Experience', 'None'];
                        if (newV == 'None') {
                            $scope.result.compareSelected = true;
                        } else {
                            $scope.result.compareSelected = false;
                            values = util.removeItem(values, $scope.result.compare);
                            $scope.defaults.and1 = values;
                        }
                    });

                    //watch the and1 selection
                    $scope.$watch('result.and1', function (newV, oldV) {
                        var values = ['Year', 'Site', 'Device', 'Experience', 'None'];
                        values = util.removeItem(values, $scope.result.compare);
                        if (newV == 'None') {
                            $scope.result.and1Selected = true;
                        } else {
                            $scope.result.and1Selected = false;
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

        },
    }
}]);

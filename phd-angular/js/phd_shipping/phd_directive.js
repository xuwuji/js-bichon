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
                    $scope.$watch('result.compare', function (newV, oldV) {
                        console.log('new:' + newV);
                        console.log('old:' + oldV);
                        if (newV == 'None') {
                            $scope.result.compareSelected = true;
                        } else if (newV == 'Year') {
                            $scope.result.compareSelected = false;
                            $scope.defaults.and = ['Site', 'None'];
                        } else if (newV == 'Site') {
                            $scope.result.compareSelected = false;
                            $scope.defaults.and = ['Year', 'None'];
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
            chartConfig: "=",
            modal: "=",
            ddReports: "="

        },
        link: function ($scope, element, attrs) {
            //console.log($scope.chartConfig);
            //console.log($scope.defautls);

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
                    //console.log(response.data[chartId]);
                    var config = response.data[chartId];
                    var re = new RegExp('\n', 'g');
                    //console.log($scope.modal.dd_id);
                    $scope.modal.dd_id = config.chart_id;
                    $scope.modal.dd_title = config.chart_title;
                    $scope.modal.ddReports = $scope.chartConfig;
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

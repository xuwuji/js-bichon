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
                            $scope.defaults.and=['Site','None'];
                        } else if (newV == 'Site') {
                            $scope.result.compareSelected = false;
                             $scope.defaults.and=['Year','None'];
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
            sqlModal: "=",

        },
        link: function ($scope, element, attrs) {
            $scope.showSQL = function (chartId) {
                $http.get('http://localhost:8080/OLAPService/config/pageConfig/5').then(function (response) {
                    //console.log(response.data[chartId]);
                    var config = response.data[chartId];
                    var re = new RegExp('\n', 'g');
                    $scope.sqlModal.sql = config.chart_sql_desc;
                    $scope.sqlModal.chart_desc = config.chart_desc;
                    $scope.sqlModal.sql_fomula = config.sql_fomula;
                    $scope.sqlModal.sql_contact = config.sql_contact;
                    $scope.sqlModal.title = config.chart_title;
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

        }
    };
}]);

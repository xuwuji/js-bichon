//directive for phd filter, it contains selector, date-picker, check-box 
shipApp.directive('phdFilter', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        scope: {
            query: '=',
            result: '='
        },

        templateUrl: '/html/phd_filter.html',

        compile: function () {

            return {
                pre: function () {},
                post: function (scope, iElement, iAttrs) {

                    $timeout(function () {
                        var selectElement = $('select', iElement);
                        var compareElement = angular.element(document.getElementById('compare'));
                        compareElement.prop('multiple', true);
                        //var compareElement = $('#compare', iElement);
                        //selectElement.prop('multiple', true);
                        //selectElement.selectpicker('refresh');
                    }, 0);
                }
            }
        },
        controller: ['$scope', function ($scope) {
            //$scope.result = result;
        }]
    };
}]);


//directive for phd line chart
shipApp.directive('phdChart', ['$http', function ($http) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        templateUrl: '/html/phd_chart.html',
        scope: {
            chartConfig: "=",
            sqlModal: "=",
        },
        link: function ($scope, element, attrs) {
            $scope.showSQL = function (chartId) {
                console.log(chartId);
                $http.get('http://localhost:8080/OLAPService/config/pageConfig/1').then(function (response) {
                    console.log(response.data[chartId]);
                    var config = response.data[chartId];
                    //alert(config.chart_sql_desc);
                    var re = new RegExp('\n', 'g');
                    // $scope.sqlModal.sql = config.chart_sql_desc.replace(re, '<br>');
                    $scope.sqlModal.sql = config.chart_sql_desc;
                    $scope.sqlModal.chart_desc = config.chart_desc;
                    $scope.sqlModal.sql_fomula = config.sql_fomula;
                    $scope.sqlModal.sql_contact = config.sql_contact;
                    $scope.sqlModal.title = config.chart_title;
                });


                //var config = $scope.pageConfig[chartId];
                //var sql = config.chart_sql; console.log(sql);

            }
        }
    }
            }]);
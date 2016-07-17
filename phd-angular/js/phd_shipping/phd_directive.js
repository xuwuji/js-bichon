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
                pre: function ($scope, iElement, iAttrs) {

                    $scope.datePicker.date = {
                        startDate: null,
                        endDate: null
                    };


                    $scope.result.siteSelection.push($scope.defaults.site);

                    function cb(start, end) {
                        $('#dateFilter').html(start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
                    }

                    $('#dateFilter').daterangepicker({
                        "startDate": moment(moment().subtract(29, 'days')),
                        "endDate": moment(),
                        ranges: {
                            'Today': [moment(), moment()],
                            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                        },
                        "applyClass": "btn-primary"
                    }, cb(moment().subtract(29, 'days'), moment()));

                },
                
                
                post: function ($scope, iElement, iAttrs) {
                }
            }
        },
        controller: ['$scope', function ($scope) {
            //$scope.apply = $scope.apply();
        }]
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

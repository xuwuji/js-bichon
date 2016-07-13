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
shipApp.directive('phdChart', [function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        templateUrl: '/html/phd_chart.html',
        scope: {

        }
    }

}]);

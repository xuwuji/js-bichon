//directive for deep dive detail
shipApp.directive('detail', ['$http', function ($http) {
    return {
        restrict: 'E',
        templateUrl: '/html/phd_deepdive_detail.html',
        replace: true,
        transclude: false,
        scope: {
            defaults: '=',
            ddApply: "&",
            modal: '=',
            pushCompare: "&",
            deleteCompare: "&",
            selectAnnId : "=",
            annotation: "="
        },
        compile: function () {
            return {
                pre: function ($scope, iElement, iAttrs) {},

                post: function ($scope, iElement, iAttrs) {
                    
                },
            }
        },

        link: function ($scope, element, attrs) {
            $scope.test = function () {
                alert('asdasd');
            }
        }
    }
}]);

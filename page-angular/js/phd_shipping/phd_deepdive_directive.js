//directive for deep dive detail
shipApp.directive('detail', ['$http', function ($http) {
    return {
        restrict: 'E',
        templateUrl: '/html/phd_deepdive_detail.html',
        replace: true,
        transclude: false,
        scope: {
            defaults: '=',
            result: '=',
            ddApply: "&",
            modal: '<',
        },
        compile: function () {
            return {
                pre: function ($scope, iElement, iAttrs) {},

                post: function ($scope, iElement, iAttrs) {
                    $scope.$watch('result.dmaChecked', function (newV, oldV) {
                        //console.log(newV);
                        //console.log(oldV);
                        if (newV == true) {
                            $('.dma').css({
                                "visibility": "visible"
                            });
                        }
                    });
                },
            }
        },

        link: function ($scope, element, attrs) {
        }
    }
}]);

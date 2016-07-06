//自定义属性
myApp.directive('hello',
    function () {
        return {
            //取值有：E(元素),在html中当作标签来使用
            //A(属性) 在html中的一个元素中的属性使用
            //C(类) class
            //M(注释)
            //其中默认值为A；
            restrict: 'E',
            template: '<div>hello  <span ng-transclude></span><div>',
            replace: true,
            //templateUrl: './index_template.html'
            transclude:true, //将原来的数据放入到 ng-transclude
        }
    });
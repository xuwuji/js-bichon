//中括号里写myApp依赖的模块    
var myApp = angular.module('myApp', []);

//myApp中controller共享的service
myApp.factory('cartFactory', function () {
    return {
        message: "cart",
        query: function () {
            alert(this.message);
        },
    }
});


myApp.factory('listFactory', function () {
    return {
        message: "list",
        query: function () {
            alert(this.message);
        },
    }
});



//自定义过滤器,去除重复纪录
myApp.filter('uniqueFilter', function () {
    //根据哪一个key作为去重的条件
    return function (list, keyname) {
        var output = [];
        var unique = [];
        angular.forEach(list, function (item) {
            var value = item[keyname];
            if (unique.indexOf(value) === -1) {
                unique.push(value);
                output.push(item);
            }
        });
        return output;
    };
});

//自定义过滤器,quantity>0
myApp.filter('quantityFilter', function () {
    //根据哪一个key作为去重的条件
    return function (list) {
        var output = [];
        angular.forEach(list, function (item) {
            if (item['quantity'] > 0) {
                output.push(item);
            }
        });
        return output;
    };
});




//将controller在module中进行注册
myApp.controller('firstController', ['$scope', '$filter', function ($scope, $filter) {

    $scope.name = 'abc';

    setInterval(function () {
        //应用改变到model上
        $scope.$apply(function () {
            $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss EEE', '+0800');
        });
    }, 100);

    //对model进行监听
    $scope.$watch('name', function (newV, oldV) {
        if (newV === 'abcd') {
            alert('a');
        }
    })
    }]);

myApp.controller('cartController', ['$scope', 'cartFactory', '$filter', function ($scope, cartFactory, $filter) {
    //alert(commonFactory.message);
    //commonFactory.query();
    $scope.message = $filter('uppercase')(cartFactory.message);

    //$scope.message = 'aa';

    $scope.cart = [{
        id: 1,
        name: 'iphone4',
        quantity: 3,
        price: 4000
        }, {
        id: 2,
        name: 'iphone5',
        quantity: 4,
        price: 5000
        }, {
        id: 3,
        name: 'iphone6',
        quantity: 5,
        price: 6000
        }];

    $scope.totalprice = function () {
        var total = 0;
        angular.forEach($scope.cart, function (item) {
            total += (item.price) * (item.quantity);
        });
        return total;
    }

    $scope.totalquantity = function () {
        var total = 0;
        angular.forEach($scope.cart, function (item) {
            total += item.quantity;
        });
        return total;
    };

    var findIndex = function (itemId) {
        var index = -1;
        angular.forEach($scope.cart, function (item, key) {
            if (item.id === itemId) {
                index = key;
                return;
            }
        });
        return index;
    };

    //带有ng-的都会进行脏检查，所以只要controller这里改了，model也会进行改变
    $scope.remove = function (itemId) {
        var index = findIndex(itemId);
        alert("are you sure?");
        $scope.cart.splice(index, 1);
    }

    $scope.reduce = function (itemId) {
        var index = findIndex(itemId);
        $scope.cart[index].quantity--;
    }

    $scope.add = function (itemId) {
        var index = findIndex(itemId);
        $scope.cart[index].quantity++;
    }

    $scope.removeAll = function () {
        $scope.cart = {};
    }

    $scope.$watch('cart', function () {
        angular.forEach($scope.cart, function (item, key) {
            if (item.quantity < 1) {
                $scope.remove(item.id);
            }
        });
    }, true);


    }]);


myApp.controller('listController', ['$scope', 'listFactory', '$filter', function ($scope, listFactory, $filter) {
    $scope.message = $filter('uppercase')(listFactory.message);

    $scope.list = [{
        id: 1,
        name: 'iphone4',
        quantity: 3,
        price: 4000
        }, {
        id: 2,
        name: 'iphone5',
        quantity: 4,
        price: 5000
        }, {
        id: 3,
        name: 'iphone6',
        quantity: 5,
        price: 6000
        }, {
        id: 3,
        name: 'iphone6',
        quantity: 5,
        price: 6000
        }, {
        id: 13,
        name: 'iphone6',
        quantity: 0,
        price: 6000
        }];

    $scope.orderType = 'id';
    $scope.order = '';

    $scope.changeOrder = function (type) {
        $scope.orderType = type;
        if ($scope.order === '-') {
            $scope.order = '';
        } else {
            $scope.order = '-';
        }
    };

}]);

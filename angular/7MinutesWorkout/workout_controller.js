myApp.controller('workoutController', ['$scope', '$interval', '$location', function ($scope, $interval, $location) {

    $scope.finishCount = 0;

    $scope.workout = new Workout();

    $scope.totalTime = getTotalTime(workout);

    //var workout = new Workout();

    var startExercise = function (exercise) {
        $scope.current = exercise;
        $scope.past = 0;
        $interval(function () {
                ++$scope.past;
            }, 1000, $scope.current.duration)
            //这里用到promise,当上一步执行完，开始执行下面
            .then(
                function () {
                    var next = nextExercise($scope.current);
                    if (next) {
                        startExercise(next);
                    } else {
                        $scope.finishCount++;
                        //重定向
                        $location.path('/finish');
                    }
                });
    };

    startExercise($scope.workout.exercises.shift());

    //get the nextExercise by current
    var nextExercise = function (current) {
        var next = null;
        if (current === restExercise) {
            next = $scope.workout.exercises.shift();
        } else {
            if ($scope.workout.exercises.length != 0) {
                //这里不需要用$scope.$apply，因为这个nextExercise方法是在$interval的then中被调用的，所以已经执行脏检查了
                $scope.finishCount++;
                next = restExercise;
            }
        }
        return next;
    };



    function getTotalTime(workout) {
        var total = 0;
        angular.forEach($scope.workout.exercises, function (item) {
            total += item.duration + workout.restBetweenExercise;
        });
        total -= $scope.workout.restBetweenExercise;
        return total;
    };


    $interval(function () {
        $scope.totalTime--;
    }, 1000, $scope.totalTime);


}]);

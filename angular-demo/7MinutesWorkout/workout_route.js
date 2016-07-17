 myApp.
 config(['$routeProvider', '$sceDelegateProvider', function ($routeProvider, $sceDelegateProvider) {
     $routeProvider.when('/start', {
         templateUrl: '7MinutesWorkout/partials/start.html'
     });
     $routeProvider.when('/workout', {
         templateUrl: '7MinutesWorkout/partials/workout.html',
         controller: 'workoutController'
     });
     $routeProvider.when('/finish', {
         templateUrl: '7MinutesWorkout/partials/finish.html'
     });
     $routeProvider.otherwise({
         redirectTo: '/start'
     });

     //$locationProvider.html5Mode(true);
     $sceDelegateProvider.resourceUrlWhitelist([
         // Allow same origin resource loads.
         'self',
         'http://*.youtube.com/**',
         'https://*.youtube.com/**', ]);
 }]);

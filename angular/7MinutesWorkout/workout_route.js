 myApp.
 config(['$routeProvider', '$sceDelegateProvider', function ($routeProvider, $sceDelegateProvider) {
     $routeProvider.when('/start', {
         templateUrl: 'partials/start.html'
     });
     $routeProvider.when('/workout', {
         templateUrl: 'partials/workout.html',
         controller: 'WorkoutController'
     });
     $routeProvider.when('/finish', {
         templateUrl: 'partials/finish.html'
     });
     $routeProvider.otherwise({
         redirectTo: '/'
     });

     //$locationProvider.html5Mode(true);
     $sceDelegateProvider.resourceUrlWhitelist([
         // Allow same origin resource loads.
         'self',
         'http://*.youtube.com/**',
         'https://*.youtube.com/**', ]);
 }]);

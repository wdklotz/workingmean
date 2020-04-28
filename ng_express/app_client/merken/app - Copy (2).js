angular.module('app', ['ngRoute','app.open'])

.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: './open/open.html',
    controller: 'OpenController'
  })
  .otherwise({
    redirectTo: '/open'
  })
});


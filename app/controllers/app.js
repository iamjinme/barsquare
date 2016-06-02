// Define the barsquare module
var barsquareApp = angular.module('barsquareApp', ['ngRoute']);
// Define the configuration of app
barsquareApp.config(['$locationProvider' ,'$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    // Define routes
    $routeProvider.
      when('/', {
        templateUrl: '/views/main.html'
      }).
      when('/other', {
        templateUrl: '/views/other.html'
      }).
      otherwise('/');
  }
]);
// Define the main controller on the barsquare module
barsquareApp.controller('MainController', function MainController($scope) {
  $scope.name = 'world';
});

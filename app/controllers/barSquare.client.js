// Define the barsquare module
var barsquareApp = angular.module('barsquareApp', ['ngRoute']);
// Define the configuration of app
barsquareApp.config(['$locationProvider' ,'$routeProvider',
  function config($locationProvider, $routeProvider) {
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
barsquareApp.controller('MainController', function MainController($scope, $http) {
  $scope.name = 'world';
  // when landing on the page, get all todos and show them
  $http.get('/api/todos')
    .success(function(data) {
      $scope.todos = data;
          console.log(data);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
  $scope.addClick = function() {
    console.log('Add click');
  }
});

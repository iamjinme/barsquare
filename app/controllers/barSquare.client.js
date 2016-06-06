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
  $scope.results = [];
  // Mini jQuery
  $ = function(element) {
    return angular.element(document.querySelector(element));
  }
  // More results
  $scope.moreResults = function() {
    console.log('more', this.results.length);
  }
  // Search near at "where"
  $scope.getSearch = function() {
    if (this.where) {
      $("#btn_search").addClass('loading');
      $http.get('/api/search/' + this.where)
        .success(function(data) {
          $scope.results.push(data);
          $("#btn_search").removeClass('loading');
        })
        .error(function(data) {
          console.log('Error: ' + data);
          $("#btn_search").removeClass('loading');
        });
    }
  };
  // More functions
});

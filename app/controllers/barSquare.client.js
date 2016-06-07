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
  $scope.more = true;
  // Mini jQuery
  $ = function(element) {
    return angular.element(document.querySelector(element));
  }
  var goBottom = function() {
    window.scrollTo(0,document.body.scrollHeight);
  }
  // More results
  $scope.moreResults = function() {
    var offset = this.results.length * 4;
    if (this.where) {
      $("#btn_more").addClass('loading');
      $http.get('/api/search/' + this.where + '?offset=' + offset)
        .success(function(data) {
          if (data.length) {
            $scope.results.push(data);
          } else {
            $scope.more = false;
          }
          $("#btn_more").removeClass('loading');
          window.setTimeout(goBottom, 500);
        })
        .error(function(data) {
          console.log('Error: ' + data);
          $("#btn_more").removeClass('loading');
        });
    }
  }
  // Search near at "where"
  $scope.getSearch = function() {
    $scope.more = true;
    $scope.results = [];
    if (this.where) {
      $("#btn_search").addClass('loading');
      $http.get('/api/search/' + this.where)
        .success(function(data) {
          if (data.length) {
            $scope.results.push(data);
          }
          $("#btn_search").removeClass('loading');
          window.setTimeout(goBottom, 500);
        })
        .error(function(data) {
          console.log('Error: ' + data);
          $("#btn_search").removeClass('loading');
        });
    }
  };
  // More functions
});

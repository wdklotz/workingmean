angular.module('myHello',[])
.controller('myController', 
            ['$scope',function($scope){
                $scope.myInput = "your name?";}
            ]);
// .config(function ($routeProvider) {
  // $routeProvider
  // .when('/', {
    // templateUrl: './index.html',
    // controller: 'myController'
  // });


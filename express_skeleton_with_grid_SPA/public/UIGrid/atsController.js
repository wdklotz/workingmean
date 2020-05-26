angular.module('ngApp')

.controller('atsController', ['$scope',function($scope) {
    $scope.notice = "controller('atsController',...";
    console.log($scope.notice);
    $scope.contacts = [
        { name: 'Shuvro', number: '1234' },
        { name: 'Ashif', number: '4321' },
        { name: 'Anik', number: '2314' }
    ];
}]);

angular.module('myHello',[]);

angular.module('myHello').controller('myController', 
            ['$scope',function($scope){$scope.myInput = "your name?";}]);

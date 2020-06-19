'use strict';
angular.module('ngApp')
.controller('atsController', ['$scope','$log','authResource','typeResource','shelfResource','U',function($scope, $log, authResource,typeResource,shelfResource,U) {
    const scope = $scope;
    const vm    = scope;
    scope.a_titles = [];
    scope.ar = 'rep';
    scope.tr = 'rep';
    scope.sr = 'rep';
    // Authors
    authResource.query([],function(value) {
        vm.authTable = value;  //<-- that's the table from db
        U.tbl_log('atsController#query#vm.authTable',vm.authTable);  // check
        vm.authTable.forEach(item => scope.a_titles.push(item.Author));
    });
    // Types
    scope.t_titles = [];
    typeResource.query([],function(value) {
        vm.typeTable = value;  //<-- that's the table from db
        vm.typeTable.forEach(item => scope.t_titles.push(item.Type));
    });
    // Shelfs
    scope.s_titles = [];
    shelfResource.query([],function(value) {
        vm.shelfTable = value;  //<-- that's the table from db
        vm.shelfTable.forEach(item => scope.s_titles.push(item.Shelf));
    });

    scope.ats_submit = function() {
        console.log(scope.author,scope.type,scope.shelf);
    };
}]); // atsController

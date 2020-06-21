'use strict';
angular.module('ngApp')
.controller('atsController', ['$scope','$log','authResource','typeResource','shelfResource','U',function($scope, $log, authResource,typeResource,shelfResource,U) {
    const scope = $scope;
    const vm    = scope;
    scope.ar = 'ren';
    scope.tr = 'ren';
    scope.sr = 'ren';
//     scope.titles = {auth:[],type:[],shelf:[]};

    // Authors
    scope.a_titles = [];
    authResource.query([]).$promise.then(function(value) {
        vm.authTable = value;  //<-- that's the table from db
//         U.tbl_log('atsController#query#vm.authTable',vm.authTable);  // check
        vm.authTable.forEach(item => scope.a_titles.push(item));
//         U.tbl_log('atsController#query#scope.a_titles',scope.a_titles);  // check
//         scope.a_titles = fillOptionsArray(vm.authTable, scope.ar);
    });

    scope.ats_replace = function() {
        console.log('replace ',scope.selected, 'with ', scope.replace);
    };
    scope.ats_add = function() {
        console.log('add ', scope.replace);
    };




/*
    // Authors
    scope.a_titles = [];
    authResource.query([]).$promise.then(function(value) {
        vm.authTable = value;  //<-- that's the table from db
//         U.tbl_log('atsController#query#vm.authTable',vm.authTable);  // check
        vm.authTable.forEach(item => scope.a_titles.push(item.Author));
        U.tbl_log('atsController#query#scope.a_titles',scope.a_titles);  // check
//         scope.a_titles = fillOptionsArray(vm.authTable, scope.ar);
    });
    // Types
    scope.t_titles = [];
    typeResource.query([]).$promise.then(function(value) {
        vm.typeTable = value;  //<-- that's the table from db
        vm.typeTable.forEach(item => scope.t_titles.push(item.Type));
    });
    // Shelfs
    scope.s_titles = [];
    shelfResource.query([]).$promise.then(function(value) {
        vm.shelfTable = value;  //<-- that's the table from db
        vm.shelfTable.forEach(item => scope.s_titles.push(item.Shelf));
    });

    scope.ats_submit = function() {
        console.log(scope.author,scope.type,scope.shelf);
    };

    function fillOptionsArray(table,radioBtn) {
        var titles = [];
        switch (radioBtn) {
            case 'add':
                break;
            case 'ren':
                table.forEach(item=>titles.push(item));
                break;
            }
        U.tbl_log('atsController#fillOptionsArray#titles',titles);  // check
        return titles;
    }
    */
}]); // atsController

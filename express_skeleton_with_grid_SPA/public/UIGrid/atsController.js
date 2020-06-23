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
        U.tbl_log('atsController#query#scope.a_titles',scope.a_titles);  // check
//         scope.a_titles = fillOptionsArray(vm.authTable, scope.ar);
    });
    // Types
    scope.t_titles = [];
    typeResource.query([]).$promise.then(function(value) {
        vm.typeTable = value;  //<-- that's the table from db
        vm.typeTable.forEach(item => scope.t_titles.push(item));
    });
    // Shelfs
    scope.s_titles = [];
    shelfResource.query([]).$promise.then(function(value) {
        vm.shelfTable = value;  //<-- that's the table from db
        vm.shelfTable.forEach(item => scope.s_titles.push(item));
    });

    scope.ats_replace = function(what) {
        switch (what) {
            case 'author': {
                if (scope.a_input === undefined || scope.a_input === "") break;
//                 console.log('replace ', scope.a_sel, 'with ', scope.a_input);
                var id = scope.a_sel.id;
                var i = 0;
                while (i<scope.a_titles.length) {
                    if(scope.a_titles[i].id === id) {
                        scope.a_titles[i].Author = scope.a_input;
                        scope.a_input=undefined;
                        break;
                    }
                    i++;
                }
//                 scope.a_titles.forEach( item => {
//                     if (item.id === id) {
//                         item.Author = scope.a_input;
//                         scope.a_input=undefined;
// //                         break;
//                         }
//                     }
//                 )
                break;
            }
        }
    };
    scope.ats_add = function(what) {
        switch (what) {
            case 'author': {
                console.log('add ', scope.a_input);
                break;
            }
        }
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

'use strict';
angular.module('ngApp')
.controller('atsController', ['$scope','$log','authResource','typeResource','shelfResource','U',function($scope, $log, authResource,typeResource,shelfResource,U) {
    const scope = $scope;
    const vm    = scope;
    scope.ar = 'ren';
    scope.tr = 'ren';
    scope.sr = 'ren';
    scope.r1 = {name: "add"};
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
    const go_author = function(what) {
        console.log(what," author");
    };

    // Types
    scope.t_titles = [];
    typeResource.query([]).$promise.then(function(value) {
        vm.typeTable = value;  //<-- that's the table from db
        vm.typeTable.forEach(item => scope.t_titles.push(item));
    });
    const go_type = function(what) {
        console.log(what," type");
    };

    // Shelfs
    scope.s_titles = [];
    shelfResource.query([]).$promise.then(function(value) {
        vm.shelfTable = value;  //<-- that's the table from db
        vm.shelfTable.forEach(item => scope.s_titles.push(item));
    });
    const go_shelf = function(what) {
        console.log(what," shelf");
    };

    const groute={'author':go_author,'type':go_type,'shelf':go_shelf};
    scope.ats_go = function(what) {
        const radio = scope.r1.name;
        groute[what](radio);

    };

    scope.cpy_select = function(what){
//         console.log(`${what} cpy_select clicked`);
        const radio = scope.r1.name;
        switch (what) {
            case 'author': {
                if (scope.a_sel === undefined || scope.a_sel === "") break;
                if (radio !== 'edit') break;
//                 console.log(scope.a_sel.Author);
                scope.a_input = scope.a_sel.Author;
                break;
            }
        }
    };
//     scope.ats_replace = function(what) {
//         switch (what) {
//             case 'author': {
//                 if (scope.a_input === undefined || scope.a_input === "") break;
//                 console.log('replace ', scope.a_sel, 'with ', scope.a_input);
//                 var id = scope.a_sel.id;
//                 var i = 0;
//                 while (i<scope.a_titles.length) {
//                     if(scope.a_titles[i].id === id) {
//                         scope.a_titles[i].Author = scope.a_input;
//                         scope.a_input=undefined;
//                         break;
//                     }
//                     i++;
//                 }
//                 scope.a_titles.forEach( item => {
//                     if (item.id === id) {
//                         item.Author = scope.a_input;
//                         scope.a_input=undefined;
// //                         break;
//                         }
//                     }
//                 )
//                 break;
//             }
//         }
//     };
}]); // atsController

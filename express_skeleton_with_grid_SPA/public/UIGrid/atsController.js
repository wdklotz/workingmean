'use strict';
angular.module('ngApp')
.controller('atsController', ['$scope','$log','authResource','typeResource','shelfResource','U',function($scope, $log, authResource,typeResource,shelfResource,U) {
    const scope = $scope;
    const vm    = this;
    scope.r1    = {name: "add"};
/*************************************************
* Authors
*************************************************/
    scope.a_titles = [];
    authResource.query([]).$promise.then(function(value) {
        vm.authTable = value;  //<-- that's the table from db
        //U.tbl_log('atsController#query#vm.authTable',vm.authTable);  // check
        vm.authTable.forEach(item => scope.a_titles.push(item));
        //U.tbl_log('atsController#query#scope.a_titles',scope.a_titles);  // check
    });
    const go_author = function(what) {
        //console.log(what," author");
        switch (what) {
            case ("edit"): {
                if (scope.a_input === undefined || scope.a_input === "") break;
                var id = scope.a_sel.id;
                for (var i=0; i<scope.a_titles.length; i++) {
                    if(scope.a_titles[i].id === id) {
                        var before = Object.assign(new Object(),scope.a_titles[i]);
                        scope.a_titles[i].Author = scope.a_input;
                        //console.log('rename ',JSON.stringify(before),' to ',JSON.stringify(scope.a_titles[i]));
                        scope.a_input=undefined;
                        break;
                    }
                }
                break;
            }
            case ("add"): {
                console.log('add ',`${scope.a_input}`,' to author');
                break;
            }
            case ("delete"): {
                console.log('delete for author not implementd');
                break;
            }
        }
    };
/*************************************************
* Types
*************************************************/
    scope.t_titles = [];
    typeResource.query([]).$promise.then(function(value) {
        vm.typeTable = value;  //<-- that's the table from db
        vm.typeTable.forEach(item => scope.t_titles.push(item));
    });
    const go_type = function(what) {
        console.log(what," type");
    };
/*************************************************
* Shelfs
*************************************************/
    scope.s_titles = [];
    shelfResource.query([]).$promise.then(function(value) {
        vm.shelfTable = value;  //<-- that's the table from db
        vm.shelfTable.forEach(item => scope.s_titles.push(item));
    });
    const go_shelf = function(what) {
        console.log(what," shelf");
    };
/*************************************************/
    scope.ats_go = function(what) {
        const go_route={'author':go_author,'type':go_type,'shelf':go_shelf};
        const radio = scope.r1.name;
        go_route[what](radio);
    };
    scope.cpy_select = function(what){
        //console.log(`${what} cpy_select clicked`);
        const radio = scope.r1.name;
        switch (what) {
            case 'author': {
                //console.log(scope.a_sel);
                if (scope.a_sel === undefined || scope.a_sel === "") break;
                if (radio !== 'edit') break;
                var id = scope.a_sel.id;
                var i = 0;
                for (var i=0; i<scope.a_titles.length; i++) {
                    if(scope.a_titles[i].id === id) {
                        scope.a_input = scope.a_titles[i].Author;
                    break;
                    }
                }
            break;
            }
        }
    };
}]); // atsController

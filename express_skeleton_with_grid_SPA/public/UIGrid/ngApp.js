(function() {
'use strict';

angular.module('ngApp',['ngRoute','ngTouch','ui.grid','ui.grid.pagination','ui.grid.resizeColumns','ui.grid.selection','ui.grid.cellNav','ngAnimate','ui.bootstrap','ngResource','ngSanitize','ui.select'])
.controller('ngAppController', ['$scope', '$http', 'uiGridConstants', 'docResource',function($scope, $http, uiGridConstants, docResource) {  

    const scope = $scope;
    scope.grid1Options = {
        enableRowSelection: true,
        enableSelectAll: true,
        multiSelect: true,
        selectionRowHeaderWidth: 35,
        useCustomPagination: false,
        useExternalPagination : false,
        enableFiltering: true,
        paginationPageSizes: [10, 15, 20, 30, 50, 100],
        paginationPageSize: 20,
        enableGridMenu: true,
        enableColumnResizing: true,
        columnDefs: [
            { name: 'id',       enableSorting: true, width: '5%' },
            { name: 'Document', enableSorting: true, width: '25%', cellTooltip: true },
            { name: 'Author',   enableSorting: true, width: '10%'  },
            { name: 'Type',     enableSorting: true, width: '10%'  },
            { name: 'Shelf',    enableSorting: true, width: '10%'  },
            { name: 'Keywords', enableSorting: true, cellTooltip: true},
            { name: 'Favorite', enableSorting: true, width: 63, displayName: 'FAV'},
            { name: 'Trash',    enableSorting: true, width: 65, displayName: 'TR'}
        ]};

    scope.grid1Options.onRegisterApi = function(gridApi){
        // set gridApi on scope but ignore rowSelectionChanged event
        scope.gridApi = gridApi;
        
        // gridApi.selection.on.rowSelectionChanged($scope,function(row){
        // const msg = 'row changed ';
        // console.log(msg,row);
        // console.log(gridApi.selection.getSelectedRows()); 
        // });
    };

    // call DB-API via docResource resource
    scope.grid1Options.data = docResource.query();
/*
    // call DB-API via $http
    $http.get('/api/lib/38').then(function (response) {
        scope.grid1Options.data = response.data;
        console.log('$http response: ',scope.grid1Options.data);
    }, function(errResponse) {
        console.error('Error while fetching document');
    });
*/
}])
.controller('authController',  ['$scope','authResource','Trafo','U', function ($scope,authResource,Trafo,U) {
    const vm = this;
    const scope = $scope;

    vm.disabled = false;
    vm.searchEnabled = true;
    vm.authorObj = {};
    vm.choice = {};
    vm.authTable;
    const docInEditForm = scope.docInEditForm;
    // U.tbl_log('authController#query#docInEditForm',docInEditForm);

    authResource.query([],function(value) {
        vm.authTable = value;  //<-- that's the table from db
        // U.tbl_log('authController#query#vm.authorObj',vm.authTable);
        vm.authorObj = Trafo.toSelect2(vm.authTable,'Author');  //<-- that's the object select2 wants to see
        // U.tbl_log('authController#query#vm.authorObj',vm.authorObj);
        
        /* <-- SELECT * FROM authorObj AS c WHERE c.id = docInEditForm.author --> */
        let AuthorChoice = scope.$parent.AuthorChoice = scope.$parent.setChoice(vm.authorObj,vm.choice,docInEditForm.author); 
        AuthorChoice();
        // U.tbl_log(vm.choice);
    });
/*
    // function setChoice() {
        // for(let [key,val] of Object.entries(vm.authorObj)) {
            // if(val.id === docInEditForm.author) {
                // vm.choice.selectedValue = vm.authorObj[key];
                console.log('vm.choice.selectedValue: ',vm.choice.selectedValue);
                // break;
            // }
        // }
    // }

    // scope.$parent.AuthorChoice = setChoice;    // the hack!!! but it works
*/    
    vm.onSelect = function($item) {
        scope.docInEditForm.author = $item.id;
        scope.docInEditForm.Author = $item.name;
        // U.tbl_log('authController#onSelect',scope.docInEditForm);
    };
}])
.controller('typeController',  ['$scope','typeResource','Trafo','U', function ($scope,typeResource,Trafo,U) {
    const vm = this;
    const scope = $scope;

    vm.disabled = false;
    vm.searchEnabled = true;
    vm.typeObj = {};
    vm.choice = {};
    vm.typeTable;
    const docInEditForm = scope.docInEditForm;

    typeResource.query([],function(value) {
        vm.typeTable = value;
        vm.typeObj = Trafo.toSelect2(vm.typeTable,'Type');
        let TypeChoice = scope.$parent.TypeChoice = scope.$parent.setChoice(vm.typeObj,vm.choice,docInEditForm.type); 
        TypeChoice();
    });

    vm.onSelect = function($item) {
        scope.docInEditForm.type = $item.id;
        scope.docInEditForm.Type = $item.name;
    };
}])
.controller('shelfController', ['$scope','shelfResource','Trafo','U', function ($scope,shelfResource,Trafo,U) {
    const vm = this;
    const scope = $scope;

    vm.disabled = false;
    vm.searchEnabled = true;
    vm.shelfObj = {};
    vm.choice = {};
    vm.shelfTable;
    const docInEditForm = scope.docInEditForm;

    shelfResource.query([],function(value) {
        vm.shelfTable = value;
        vm.shelfObj = Trafo.toSelect2(vm.shelfTable,'Shelf');
        let ShelfChoice = scope.$parent.ShelfChoice = scope.$parent.setChoice(vm.shelfObj,vm.choice,docInEditForm.shelf); 
        ShelfChoice();
    });

    vm.onSelect = function($item) {
        scope.docInEditForm.shelf = $item.id;
        scope.docInEditForm.Shelf = $item.name;
    };
}])
.factory('docResource',        ['$resource', function($resource) {
    return $resource('/api/lib/:id',
        {id:'@id'},
        {update: {method: 'PUT'}} // there is no HTTP PUT support available per default !!!
        );
}])
.factory('authResource',       ['$resource', function($resource) {
    return $resource('/api/authors/:id',{});
}])
.factory('typeResource',       ['$resource', function($resource) {
    return $resource('/api/types/:id',{});
}])
.factory('shelfResource',      ['$resource', function($resource) {
    return $resource('/api/shelfs/:id',{});
}])
.factory('Trafo',              [function() {
    const fn = function(items, label) {
        let out = [];
        for (let i=0; i < items.length; i++) {
           out[i] = {name: items[i][label], id:items[i].id};
       }
       return out;
    };
    return {
        toSelect2: fn
    };
}])
.factory('U',                  [function() {
// Utilities service
    function app_log() {
        if(true) {
            for(let i=0; i<arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    };
    function tbl_log(t,o){
        if(true) {
            console.log(t);
            console.table(o);
        }
    };
    function flow_log(name) {
        if(true) console.log("============================< "+name+" >");
    };
    return {
        app_log:  app_log,
        tbl_log:  tbl_log,
        flow_log: flow_log
    };
}])
.filter('propsFilter',         [function() {
// a NO-filter filter
  return function(items, props) {
    let out = [];
    // Let the output be the input untouched
    out = items;
    return out;
  };
}])
.directive("ngUploadChange",   [function() {
    return{
        scope:{
            ngUploadChange:"&"
            },
        link: function($scope, $element, $attrs) {
            // NOTE: $element.on() adds an ebvent listener, here 'change'
            $element.on("change",function(event) {
                $scope.$apply(function(){
                    // NOTE: ngUploadChange() is bound to uploadController filechanged($event) in HTML-template
                    $scope.ngUploadChange({$event: event})
                })
            })
            $scope.$on("$destroy",function() {
                // NOTE: jQuery: remove event handlers
                $element.off();
            });
        }
    }
}]);  
})();

/* NOTES
* for reduce see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
* for ui-bootstrap see: https://angular-ui.github.io/bootstrap/
* for uibModal see: https://github.com/angular-ui/bootstrap/tree/master/src/modal
* for <script type="text/ng-template> a.k.a. inlined template see :
*   https://docs.angularjs.org/api/ng/directive/script
* for AngularJS-native version of Select2 see: https://github.com/angular-ui/ui-select 
*   in relation: jQuery Select2: https://select2.org/
* for CommonJs and ES modules: https://flaviocopes.com/commonjs/
* for download pdf file with $http.get() see:
*   https://stackoverflow.com/questions/14215049/how-to-download-file-using-angularjs-and-calling-mvc-api
* and/or: 
*   https://gist.github.com/MarkLavrynenko/5b763e36b128170cdb77   
* for ui-uploader see:  https://github.com/angular-ui/ui-uploader
* for server-side filesystem actions see: https://nodejs.org/api/fs.html and https://dev.to/mrm8488/from-callbacks-to-fspromises-to-handle-the-file-system-in-nodejs-56p2
* for server-side MD5 creation see: https://www.npmjs.com/package/md5-file
* for multiple file input with ngUploadChange directive see:
*   https://stackoverflow.com/questions/20146713/ng-change-on-input-type-file/41557378
* for Anatomy of an HTTP Transaction see: https://nodejs.org/fr/docs/guides/anatomy-of-an-http-transaction/
*/

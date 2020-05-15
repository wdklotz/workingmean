'use strict';
(function() {
    
const myApp = angular.module('ng-app', [
'ngTouch', 'ui.grid', 'ui.grid.pagination','ui.grid.resizeColumns', 
'ui.grid.selection', 'ui.grid.cellNav', 'ngAnimate', 'ui.bootstrap',
'ngResource','ngSanitize', 'ui.select'
]);

myApp.controller('ng-app-ctrl', [
        '$scope', '$http', 'uiGridConstants', 'DocRes',
        function($scope, $http, uiGridConstants, DocRes) {  

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

    // call DB-API via DocRes resource
    scope.grid1Options.data = DocRes.query();
/*
    // call DB-API via $http
    $http.get('/api/lib/38').then(function (response) {
        scope.grid1Options.data = response.data;
        console.log('$http response: ',scope.grid1Options.data);
    }, function(errResponse) {
        console.error('Error while fetching document');
    });
*/
}]);

myApp.controller('btns-ctrl', ['$scope','$uibModal','$document', function ($scope,$uibModal,$document) {
    const scope = $scope;
    const vm = this;
    vm.animationsEnabled = true;
    vm.showHideDiv = false;
    
    vm.uploadClicked = function () {
        console.log("uploadClicked");  
        };
    vm.viewClicked = function () {
        console.log("viewClicked");  
        };
    vm.onEdit = function() {
        vm.showHideDiv = !vm.showHideDiv;
    };
    vm.testClicked = function (size) {
        vm.selectedRows = scope.gridApi.selection.getSelectedRows();
        console.log("testClicked: " + vm.selectedRows.length + ' docs selected');
        
        // instantiate modal controller
        const modalInstance = $uibModal.open( { 
            animation: vm.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalEditContent.html',
            controller: 'modal-edit-ctrl',
            controllerAs: '$modCtrl',
            size: size,
            resolve: {
                size: function() {
                  return size;
                    },
                selection: function() {
                    return vm.selectedRows;
                    }
                }
            });
        
        modalInstance.result.then(function (selectedItem) {
            vm.selected = selectedItem;
            // console.log(selectedItem);
            }, function () {
                // console.log('Modal dismissed at: ' + new Date());
            });
        };
    vm.deleteClicked = function () {
        console.log("deleteClicked");  
        };
    vm.favoriteClicked = function () {
        console.log("favoriteClicked");  
        };
    vm.trashClicked = function () {
        console.log("trashClicked");  
        };
}]);

myApp.controller('modal-edit-ctrl', ['$uibModalInstance','size','selection',function ($uibModalInstance,size,selection) {
    const vm = this;
    // console.log(size, selection);
    vm.selection = selection;
    
    // init selection with item[0]
    vm.selected = {
        item: vm.selection[0]
    };
    vm.ok = function () {
        $uibModalInstance.close(vm.selected.item);
    };
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

myApp.controller('doc-edit-ctrl', ['$scope','DocRes',function($scope,DocRes) {
    const vm = this;
    const scope = $scope;
    const idx = 0;
    let selection = scope.gridApi.selection;
    let docs = selection.getSelectedRows();
    vm.doc = docs[idx];
    scope.doc_selected = vm.doc;  // bind selected doc to $scope to give AuthCtrl, TypeCtrl, ShelfCtrl access to it
    vm.doc_submit = false;        // submit btn-toggle
    if (docs.length != 0) {
        console.log('EDIT: docId: ',vm.doc.id,' vm.doc: ',vm.doc);
        vm.favChecked   = (vm.doc.Favorite == 'T')? true:false;
        vm.trashChecked = (vm.doc.Trash == 'T')? true:false;
        selection.unSelectRow(docs[idx]);   // unselect first
    }

/*  // mock data
    const docs = [   
    {id: 24, 
        Document: 'ssc-138.pdf', 
        Author: 'Forest', 
        Type:'Article',
        Shelf:'Integrator',
        Keywords:'canonical, integrator, circular',
        F:'F',T:'F'},
    {id: 25, 
        Document: 'pramana_symplectic.pdf',
        Author: 'Rangarajan', 
        Type:'Article',
        Shelf:'Integrator',
        Keywords:'symplectic, integrator, runge-kutta, hamiltonian',
        F:'T',T:'F'},
    {id: 26, 
        Document: 'P_J_Channell_1990_Nonlinearity_3_001.pdf',
        Author: 'Diverse et.al', 
        Type:'Article',
        Shelf:'Accelerator',
        Keywords:'symplectic, integrator, runge-kutta, hamiltonian',
        F:'T',T:'F'},
    {id: 27, 
        Document: 'Generalized_Courant-Snyder...Quin.Davidson,Chung.Burby.pdf',
        Author: 'Choose...', 
        Type:'Article',
        Shelf:'Linear Theory',
        Keywords:'linear',
        F:'F',T:'F'}
    ];
*/    

    vm.formSubmit = function() {
    if (docs.length != 0) {
        vm.doc.Favorite = (vm.favChecked)? 'T':'F';
        vm.doc.Trash    = (vm.trashChecked)? 'T':'F';
        vm.doc.$update();
        vm.doc_submit = true;  // btn toggle
        }
    };

    vm.formCancel = function () {
        vm.doc = DocRes.get({id:vm.doc.id}); //reset view data from db
        vm.favChecked   = (vm.doc.Favorite == 'T')? true:false;
        vm.trashChecked = (vm.doc.Trash == 'T')? true:false;
    };
}]);

// ngResource services
myApp.factory('DocRes', ['$resource', function($resource) {
    return $resource('/api/lib/:id',
        {id:'@id'},
        {update: {method: 'PUT'}} // there is no HTTP PUT support available per default !!!
        );
}]);
myApp.factory('AuthorRes',['$resource',function($resource){
    return $resource('/api/authors/:id',{});
}]);
myApp.factory('TypeRes',['$resource', function($resource) {
    return $resource('/api/types/:id',{});
}]);
myApp.factory('ShelfRes',['$resource', function($resource) {
    return $resource('/api/shelfs/:id',{});
}]);

// a table transform service
myApp.factory('Trafo',[function(){
    const fwd = function(items, label) {
        let out = [];
        for (let i=0; i < items.length; i++) {
           out[i] = {name: items[i][label], id:items[i].id};
       }
       return out;
    };
    return {
        toSelect2: fwd
    };
}]);

// a nofilter filter
myApp.filter('propsFilter', function() {
  return function(items, props) {
    let out = [];
    // Let the output be the input untouched
    out = items;
    return out;
  };
});

myApp.controller('AuthCtrl',['$scope','AuthorRes','Trafo', function ($scope,AuthorRes,Trafo) {
    const vm = this;
    const scope = $scope;

    vm.disabled = false;
    vm.searchEnabled = true;
    vm.authorObj ={};
    vm.choice = {};

    AuthorRes.query().$promise.then(function(value) {
        vm.authorObj = Trafo.toSelect2(value,'Author');
        if (scope.doc_selected) {
            for(let [key,value] of Object.entries(vm.authorObj)) {
                if (value.name === scope.doc_selected.Author) {    
                    vm.choice.selectedValue = vm.authorObj[key];
                    console.log('vm.choice.selectedValue ',vm.choice.selectedValue);
                    break;
                    }
                } 
        } else {
            vm.choice.selectedValue = undefined;
        }
        // vm.choice.selected = vm.choice.selectedValue;
        // console.log('vm.choice.selected; ',vm.choice.selected);
    });
    
    vm.onSelect = function($item) {
        console.log('$item: ',$item);      
    };
}]);

myApp.controller('TypeCtrl',['$scope','TypeRes','Trafo', function ($scope,TypeRes,Trafo) {
    const vm = this;
    const scope = $scope;

    vm.disabled = false;
    vm.searchEnabled = true;
    vm.typeObj ={};
    vm.choice = {};

    TypeRes.query().$promise.then(function(value) {
        vm.typeObj = Trafo.toSelect2(value,'Type');
        if (scope.doc_selected) {            
            for(let [key,value] of Object.entries(vm.typeObj)) {
                if (value.name === scope.doc_selected.Type) {    
                    vm.choice.selectedValue = vm.typeObj[key];
                    break;
                    }
            } 
        } else {
            vm.choice.selectedValue = undefined;
        }
        // vm.choice.selected = vm.choice.selectedValue;
    });
}]);

myApp.controller('ShelfCtrl',['$scope','ShelfRes','Trafo', function ($scope,ShelfRes,Trafo) {
    const vm = this;
    const scope = $scope;

    vm.disabled = false;
    vm.searchEnabled = true;
    vm.shelfObj ={};
    vm.choice = {};

    ShelfRes.query().$promise.then(function(value) {
        vm.shelfObj = Trafo.toSelect2(value,'Shelf');
        if (scope.doc_selected) {            
            for(let [key,value] of Object.entries(vm.shelfObj)) {
                if (value.name === scope.doc_selected.Shelf) {    
                    vm.choice.selectedValue = vm.shelfObj[key];
                    break;
                    }
            }
        } else {            
            vm.choice.selectedValue = undefined;
        }
        vm.choice.selected = vm.choice.selectedValue;
    });
}]);

})();

/*
* for reduce see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
* for ui-bootstrap see: https://angular-ui.github.io/bootstrap/
* for uibModal see: https://github.com/angular-ui/bootstrap/tree/master/src/modal
* for <script type="text/ng-template> a.k.a. inlined template see :
*   https://docs.angularjs.org/api/ng/directive/script
* for AngularJS-native version of Select2 see: https://github.com/angular-ui/ui-select 
*   in relation: jQuery Select2: https://select2.org/
* for CommonJs and ES modules: https://flaviocopes.com/commonjs/
*/

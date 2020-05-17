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
myApp.controller('doc-edit-ctrl', ['$scope','DocRes','U',function($scope,DocRes,U) {
    const vm = this;
    const scope = $scope;
    
    function render() {
        console.log('render');
        U.tbl_log(vm.doc);
        scope.docInEditForm = vm.doc;
        vm.doc_submit = false;           // submit class btn-toggle
        vm.favChecked   = (vm.doc.Favorite == 'T')? true:false;
        vm.trashChecked = (vm.doc.Trash == 'T')? true:false;
    }
    function init(){
        let ndocs;
        // let selection;
            vm.selection = scope.gridApi.selection;
            ndocs = vm.selection.getSelectedCount();
            console.log('ndocs: ',ndocs)
            if (ndocs === 0) {
                vm.doc = {'Author':"",'Type':"",'Shelf':""};
                vm.btns_hidden = true; 
            } else {
                vm.docs = vm.selection.getSelectedRows();
                vm.doc = vm.docs[0];
                vm.doc_0 = Object.assign({},vm.doc);
                vm.btns_hidden = false;
                vm.selection.unSelectRow(vm.doc);   // unselect fifo        
            }
        render();
    }
    
    init();
    
    vm.formReset = function() {
        vm.selection.selectRow(vm.doc);
        vm.doc.Author   = vm.doc_0.Author;
        vm.doc.Type     = vm.doc_0.Type;
        vm.doc.Shelf    = vm.doc_0.Shelf;
        vm.doc.author   = vm.doc_0.author;
        vm.doc.type     = vm.doc_0.type;
        vm.doc.shelf    = vm.doc_0.shelf;
        vm.doc.Keywords = vm.doc_0.Keywords;
        vm.doc.Favorite = vm.doc_0.Favorite;
        vm.doc.Trash    = vm.doc_0.Trash;
        render();              // <-- render the grid
        scope.AuthorChoice();  // <-- update the select2 controllers 
        scope.TypeChoice();
        scope.ShelfChoice();
    };

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
        // update db with form-data
        U.flow_log('doc-edit-ctrl#formSubmit:');
        vm.doc.Favorite = (vm.favChecked)? 'T':'F';
        vm.doc.Trash    = (vm.trashChecked)? 'T':'F';
        console.log('vm.doc:');
        U.tbl_log(vm.doc);
        vm.doc.$update();
        vm.doc_submit = true;  // btn toggle
    };

}]);
myApp.controller('AuthCtrl',['$scope','AuthorRes','Trafo','U', function ($scope,AuthorRes,Trafo,U) {
    const vm = this;
    const scope = $scope;

    vm.disabled = false;
    vm.searchEnabled = true;
    vm.authorObj = {};
    vm.choice = {};
    vm.authTable;
    const docInEditForm = scope.docInEditForm;
    // console.log('AuthCtrl#docInEditForm: ');
    // U.tbl_log(docInEditForm);

    AuthorRes.query([],function(value) {
        vm.authTable = value;  //<-- that's the table from db
        // U.flow_log('AuthorRes#query:vm.authTable:');
        // U.tbl_log(vm.authTable);
        vm.authorObj = Trafo.toSelect2(vm.authTable,'Author');  //<-- that's the object select2 wants to see
        // console.log('vm.authorObj:');
        // U.tbl_log(vm.authorObj);
        setChoice();   // <-- select * from authorObj where id = docInEditForm.author
    });
    
    function setChoice() {
        for(let [key,val] of Object.entries(vm.authorObj)) {
            if(val.id === docInEditForm.author) {
                vm.choice.selectedValue = vm.authorObj[key];
                // console.log('vm.choice.selectedValue: ',vm.choice.selectedValue);
                break;
            }
        }
    }; 
    scope.$parent.AuthorChoice = setChoice;    // the hack!!! but it works
    
    vm.onSelect = function($item) {
        console.log('onSelect#$item: ',$item);  
        scope.docInEditForm.author = $item.id;
        scope.docInEditForm.Author = $item.name;
        console.log('onSelect#scope.docInEditForm:');
        U.tbl_log(scope.docInEditForm);
    };
}]);
myApp.controller('TypeCtrl',['$scope','TypeRes','Trafo','U', function ($scope,TypeRes,Trafo,U) {
    const vm = this;
    const scope = $scope;

    vm.disabled = false;
    vm.searchEnabled = true;
    vm.typeObj = {};
    vm.choice = {};
    vm.typeTable;
    const docInEditForm = scope.docInEditForm;

    TypeRes.query([],function(value) {
        vm.typeTable = value;
        vm.typeObj = Trafo.toSelect2(vm.typeTable,'Type');
        setChoice();
    });
    
    function setChoice() {
        for(let [key,val] of Object.entries(vm.typeObj)) {
            if(val.id === docInEditForm.type) {
                vm.choice.selectedValue = vm.typeObj[key];
                break;
            }
        }
    }; 
    scope.$parent.TypeChoice = setChoice;    // the hack!!! but it works
    
    vm.onSelect = function($item) {
        scope.docInEditForm.type = $item.id;
        scope.docInEditForm.Type = $item.name;
    };
}]);
myApp.controller('ShelfCtrl',['$scope','ShelfRes','Trafo','U', function ($scope,ShelfRes,Trafo,U) {
    const vm = this;
    const scope = $scope;

    vm.disabled = false;
    vm.searchEnabled = true;
    vm.shelfObj = {};
    vm.choice = {};
    vm.shelfTable;
    const docInEditForm = scope.docInEditForm;

    ShelfRes.query([],function(value) {
        vm.shelfTable = value;
        vm.shelfObj = Trafo.toSelect2(vm.shelfTable,'Shelf');
        setChoice();
    });
    
    function setChoice() {
        for(let [key,val] of Object.entries(vm.shelfObj)) {
            if(val.id === docInEditForm.shelf) {
                vm.choice.selectedValue = vm.shelfObj[key];
                break;
            }
        }
    }; 
    scope.$parent.ShelfChoice = setChoice;    // the hack!!! but it works
    
    vm.onSelect = function($item) {
        scope.docInEditForm.shelf = $item.id;
        scope.docInEditForm.Shelf = $item.name;
    };
}]);

myApp.factory('DocRes',     ['$resource', function($resource) {
    return $resource('/api/lib/:id',
        {id:'@id'},
        {update: {method: 'PUT'}} // there is no HTTP PUT support available per default !!!
        );
}]);
myApp.factory('AuthorRes',  ['$resource', function($resource) {
    return $resource('/api/authors/:id',{});
}]);
myApp.factory('TypeRes',    ['$resource', function($resource) {
    return $resource('/api/types/:id',{});
}]);
myApp.factory('ShelfRes',   ['$resource', function($resource) {
    return $resource('/api/shelfs/:id',{});
}]);
myApp.factory('Trafo',      [function() {
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
myApp.factory('U',          [function() {
// Utilities service
    function app_log() {
        if(true) {
            for(let i=0; i<arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    };
    function tbl_log(o){
        if(true) {
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
}]);

myApp.filter('propsFilter', [function() {
// a NO-filter filter
  return function(items, props) {
    let out = [];
    // Let the output be the input untouched
    out = items;
    return out;
  };
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

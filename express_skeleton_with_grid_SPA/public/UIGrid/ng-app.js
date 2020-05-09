var myApp = angular.module('ng-app', [
    'ngTouch', 'ui.grid', 'ui.grid.pagination','ui.grid.resizeColumns', 
    'ui.grid.selection', 'ui.grid.cellNav', 'ngAnimate', 'ui.bootstrap',
    'ngResource'
    ]);

myApp.controller('ng-app-ctrl', [
        '$scope', '$http', 'uiGridConstants', 'DocService',
        function($scope, $http, uiGridConstants, DocService) {  

    var scope = $scope;
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
            { name: 'Favorite', enableSorting: true, width: 63, displayName: 'fav'},
            { name: 'Trash',    enableSorting: true, width: 65, displayName: 'tr'}
        ]};

    scope.grid1Options.onRegisterApi = function(gridApi){
        // set gridApi on scope but ignore rowSelectionChanged event
        scope.gridApi = gridApi;
        // gridApi.selection.on.rowSelectionChanged($scope,function(row){
        // var msg = 'row changed ';
        // console.log(msg,row);
        // console.log(gridApi.selection.getSelectedRows()); 
        // });
    };

    // call DB-API via DocService
    scope.grid1Options.data = DocService.query();
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
    var scope = $scope;
    var vm = this;
    vm.animationsEnabled = true;
    
    vm.uploadClicked = function () {
        console.log("uploadClicked");  
        };
    vm.viewClicked = function () {
        console.log("viewClicked");  
        };
    vm.testClicked = function (size) {
        vm.selectedRows = scope.gridApi.selection.getSelectedRows();
        console.log("testClicked: " + vm.selectedRows.length + ' docs selected');
        
        // instantiate modal controller
        var modalInstance = $uibModal.open( { 
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
    var vm = this;
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

myApp.controller('doc-edit-ctrl', ['$scope','DocService',function($scope,DocService) {
    var vm = this;
    var scope = $scope;
    var docs = scope.gridApi.selection.getSelectedRows();
    console.log("editClicked: " + docs.length + ' docs selected');

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

    // cpy: shallow copy helper
    let cpy = function(obj) {
        return Object.assign({},obj);
    }

    const idx = 0;
    vm.doc = cpy(docs[idx]); //initial update from db (copy)

    vm.formSubmit = function () {
    docs[idx] = cpy(vm.doc);  //update db
    docs[idx].F = (docs[idx].F)? "T":"F";
    docs[idx].T = (docs[idx].T)? "T":"F";
    // console.log(docs[idx]);
    }
    vm.formCancel = function () {
    vm.doc = cpy(docs[idx]); //reset view data from db
    vm.doc.F = (vm.doc.F === 'T')? true:false
    vm.doc.T = (vm.doc.T === 'T')? true:false
    // console.log(docs[idx]);
    }
}]);

// RESTFUL data provider
myApp.factory('DocService',['$resource', function($resource) {
    return $resource('/api/lib/:id');
}]);
/*
* for reduce see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
* for ui-bootstrap see: https://angular-ui.github.io/bootstrap/
* for uibModal see: https://github.com/angular-ui/bootstrap/tree/master/src/modal
* for <script type="text/ng-template> a.k.a. inlined template see : https://docs.angularjs.org/api/ng/directive/script
*/

var myApp = angular.module('ng-app', [
    'ngTouch', 'ui.grid', 'ui.grid.pagination','ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.cellNav', 'ngAnimate', 'ui.bootstrap'
    ]);

myApp.controller('ng-app-ctrl', [
        '$scope', '$http', 'uiGridConstants', 
        function($scope, $http, uiGridConstants) {  

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
        //set gridApi on scope
        scope.gridApi = gridApi;

        /*  ignore rowSelectionChanged event
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
        var msg = 'row changed ';
        console.log(msg,row);
        console.log(gridApi.selection.getSelectedRows()); 
        });
        */
    };

// call DB-API
  $http.get('http://127.0.0.1:3000/api/lib').then(function (response) {
    // console.log('$http response: ',response);
    var data = response.data;
    // console.log("data: ",data);
    // console.log("data.length: ",data.length);
    scope.grid1data = data;
    scope.grid1Options.data = scope.grid1data;
    });
}]);

myApp.controller('btns-ctrl', ['$scope','$uibModal','$document', function ($scope,$uibModal,$document) {
    var scope = $scope;
    var $btnCtrl = this;
    $btnCtrl.animationsEnabled = true;
    
    $btnCtrl.uploadClicked = function () {
        console.log("uploadClicked");  
        };
    $btnCtrl.viewClicked = function () {
        console.log("viewClicked");  
        };
    $btnCtrl.editClicked = function (size) {
        $btnCtrl.selectedRows = scope.gridApi.selection.getSelectedRows();
        console.log("editClicked: " + $btnCtrl.selectedRows.length + ' rows selected');
        
        // instantiate modal controller
        var modalInstance = $uibModal.open( { 
            animation: $btnCtrl.animationsEnabled,
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
                    return $btnCtrl.selectedRows;
                    }
                }
            });
        
        modalInstance.result.then(function (selectedItem) {
            $btnCtrl.selected = selectedItem;
            console.log(selectedItem);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
    $btnCtrl.deleteClicked = function () {
        console.log("deleteClicked");  
        };
    $btnCtrl.favoriteClicked = function () {
        console.log("favoriteClicked");  
        };
    $btnCtrl.trashClicked = function () {
        console.log("trashClicked");  
        };
}]);

myApp.controller('modal-edit-ctrl', ['$uibModalInstance','size','selection',function ($uibModalInstance,size,selection) {
    var $modCtrl = this;
    console.log(size, selection);
    $modCtrl.selection = selection;
    
    // init selection with item[0]
    $modCtrl.selected = {
        item: $modCtrl.selection[0]
    };
    $modCtrl.ok = function () {
        $uibModalInstance.close($modCtrl.selected.item);
    };
    $modCtrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

myApp.controller('edit-doc-ctrl', [function() {
  var self = this;
  const docs = [   // mock data base
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
  
  // cpy: shallow copy helper
  let cpy = function(obj) {
      return Object.assign({},obj);
  }
  
  self.doc = cpy(docs[0]); //initial update from db (copy)
  
  self.formSubmit = function () {
    docs[0] = cpy(self.doc);  //update db
    docs[0].F = (docs[0].F)? "T":"F";
    docs[0].T = (docs[0].T)? "T":"F";
    console.log(docs[0]);
  }
  self.formCancel = function () {
    self.doc = cpy(docs[0]); //reset view data from db
    self.doc.F = (self.doc.F === 'T')? true:false
    self.doc.T = (self.doc.T === 'T')? true:false
    console.log(docs[0]);
  }
}]);

/*
* for reduce see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
* for ui-bootstrap see: https://angular-ui.github.io/bootstrap/
* for uibModal see: https://github.com/angular-ui/bootstrap/tree/master/src/modal
* for <script type="text/ng-template> a.k.a. inlined template see : https://docs.angularjs.org/api/ng/directive/script
*/

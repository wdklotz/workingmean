var myApp = angular.module('ng-app', [
    'ngTouch', 'ui.grid', 'ui.grid.pagination','ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.cellNav', 'ngAnimate', 
    'ui.bootstrap'
    ]);

myApp.controller('AppCtrl', [
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
      /*
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

myApp.controller('ButtonsCtrl', ['$scope','$uibModal','$document', function ($scope,$uibModal,$document) {
    var scope = $scope;
    var $btnCtrl = this;
    $btnCtrl.items = ['item1', 'item2', 'item3'];
    $btnCtrl.animationsEnabled = true;
    
    $btnCtrl.uploadClicked = function () {
        console.log("uploadClicked");  
        };
    $btnCtrl.viewClicked = function () {
        console.log("viewClicked");  
        };
    $btnCtrl.editClicked = function (size) {
        let selectedRows = scope.gridApi.selection.getSelectedRows();
        console.log("editClicked: " + selectedRows.length + ' rows selected');
        
        var modalInstance = $uibModal.open( { animation: $btnCtrl.animationsEnabled,  // instantiate modal instance ctrl
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalEditContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$modCtrl',
            size: size,
            resolve: {
                items: function () {
                  return $btnCtrl.items;
                  },
                size: function() {
                  return size;
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

myApp.controller('ModalInstanceCtrl', ['$uibModalInstance','items','size',function ($uibModalInstance, items, size) {
    var $modCtrl = this;
    console.log(items, size);
    $modCtrl.items = items;
    $modCtrl.selected = {
    item: $modCtrl.items[0]
    };
    $modCtrl.ok = function () {
        $uibModalInstance.close($modCtrl.selected.item);
    };
    $modCtrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

/*
* for reduce see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
* for ui-bootstrap see: https://angular-ui.github.io/bootstrap/
* for uibModal see: https://github.com/angular-ui/bootstrap/tree/master/src/modal
* for <script type="text/ng-template> a.k.a. inlined template see : https://docs.angularjs.org/api/ng/directive/script
*/

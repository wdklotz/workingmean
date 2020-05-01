var myApp = angular.module('ng-app', [
    'ngTouch', 'ui.grid', 'ui.grid.pagination','ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.cellNav', 'ngAnimate', 
    'ui.bootstrap']);

myApp.controller('ng-appCtrl', [
        '$scope', '$http', 'uiGridConstants', 
        function($scope, $http, uiGridConstants) {  
  var self = $scope;
  self.grid1Options = {
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

    self.grid1Options.onRegisterApi = function(gridApi){
      //set gridApi on scope
      self.gridApi = gridApi;
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
    self.grid1data = data;
    self.grid1Options.data = self.grid1data;
    });
}]);

myApp.controller('ButtonsCtrl', ['$scope','$uibModal','$document', function ($scope,$uibModal,$document) {
    /*
    * TODO......
    */
    var self = $scope;
    var $ctrl = this;
    $ctrl.items = ['item1', 'item2', 'item3'];
    $ctrl.animationsEnabled = true;
    
    $ctrl.uploadClicked = function () {
        console.log("uploadClicked");  
        };
    $ctrl.viewClicked = function () {
        console.log("viewClicked");  
        };
    $ctrl.editClicked = function (size, parentSelector) {
        let selectedRows = self.gridApi.selection.getSelectedRows();
        console.log("editClicked: " + selectedRows.length + ' rows selected');

        let parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined; 
        
        var modalInstance = $uibModal.open({
          animation: $ctrl.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          controllerAs: '$ctrl',
          size: size,
          appendTo: parentElem,
          resolve: {
            items: function () {
              return $ctrl.items;
            }
          }
        });
        
        modalInstance.result.then(function (selectedItem) {
          $ctrl.selected = selectedItem;
          console.log(selectedItem);
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
    };
    $ctrl.deleteClicked = function () {
        console.log("deleteClicked");  
        };
    $ctrl.favoriteClicked = function () {
        console.log("favoriteClicked");  
        };
    $ctrl.trashClicked = function () {
        console.log("trashClicked");  
        };
}]);

myApp.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
  var $ctrl = this;
  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };

  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected.item);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

/*
* for reduce see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
* for UI Bootstrap see: https://angular-ui.github.io/bootstrap/
*/

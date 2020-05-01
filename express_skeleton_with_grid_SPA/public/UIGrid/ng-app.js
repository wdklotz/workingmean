angular.module('ng-app', [
    'ngTouch', 'ui.grid', 'ui.grid.pagination','ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.cellNav', 'ngAnimate', 
    'ui.bootstrap'])

.controller('ng-appCtrl', [
        '$scope', '$http', 'uiGridConstants', 
        function($scope, $http, uiGridConstants) {  

  $scope.grid1Options = {
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

    $scope.grid1Options.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        var msg = 'row changed ';
        console.log(msg,row);
        console.log(gridApi.selection.getSelectedRows());
      });
    };

// call DB-API
  $http.get('http://127.0.0.1:3000/api/lib').then(function (response) {
    // console.log('$http response: ',response);
    var data = response.data;
    // console.log("data: ",data);
    // console.log("data.length: ",data.length);
    $scope.grid1data = data;
    $scope.grid1Options.data = $scope.grid1data;
    });
}])

.controller('ButtonsCtrl', function ($scope, $log) {
/*
* TODO......
*/
});

/*
* for reduce see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
* for UI Bootstrap see: https://angular-ui.github.io/bootstrap/
*/

angular.module('ng-app', ['ngTouch', 'ui.grid', 'ui.grid.pagination','ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.cellNav'])

.controller('ng-appCtrl', ['$scope', '$http', 'uiGridConstants', function($scope, $http, uiGridConstants) {  

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
      { name: 'Keywords', enableSorting: true, cellTooltip: true}
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
    console.log('$http response: ',response);
    var data = response.data;
    // console.log("data: ",data);
    // console.log("data.length: ",data.length);
    $scope.grid1data = data;
    $scope.grid1Options.data = $scope.grid1data;
    });
/*
  $scope.grid2Options = {
    paginationPageSizes: null,
    useCustomPagination: true,
    useExternalPagination : true,
    columnDefs: [
      { name: 'id',       enableSorting: true },
      { name: 'Document', enableSorting: true },
      { name: 'author',   enableSorting: true },
      { name: 'type',     enableSorting: true },
      { name: 'shelf',    enableSorting: true },
      { name: 'Keywords', enableSorting: true }

    ],
    onRegisterApi: function(gridApi) {
      gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
        $scope.grid2Options.data = getPage($scope.grid2data, pageNumber);
      });
    }
  };
*/
/* 
// call DB-API
  $http.get('http://127.0.0.1:3000/api/lib').then(function (response) {
    var data = response.data;
    $scope.grid2data = data;
    $scope.grid2Options.totalItems = 0;    //data.length;
    $scope.grid2Options.paginationPageSizes = calculatePageSizes(data);
    $scope.grid2Options.data = getPage($scope.grid2data, 1);
  });
*/
/*
  function calculatePageSizes(data) {
    var initials = [];
    return data.reduce(function(pageSizes, row) {
      var initial = row.Document.charAt(0);
      var index = initials.indexOf(initial);
      if(index < 0)
      {
        index = initials.length;
        initials.push(initial);
      }
      pageSizes[index] = (pageSizes[index] || 0) + 1;
      return pageSizes;
    }, []);
  }
*/
/*
  function getPage(data, pageNumber) {
    var initials = [];
    return data.reduce(function(pages, row) {
      var initial = row.Document.charAt(0);

      if(!pages[initial]) pages[initial] = [];
      pages[initial].push(row);

      if(initials.indexOf(initial) < 0)
      {
        initials.push(initial);
        initials.sort();
      }

      return pages;

    }, {})[initials[pageNumber - 1]] || [];
  }
*/
}]);


/*
* for reduce see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
*/
